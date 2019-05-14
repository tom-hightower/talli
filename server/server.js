const express = require('express');
const bodyParser = require('body-parser');
const GoogleSpreadsheet = require('google-spreadsheet');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const http = require('http').Server(app);
const io = require('socket.io')(http);
const secretConfig = require('../client/src/secret.config.json');
const config = require('../client/src/config.json');
const firebase = require('../client/src/firebase');


const creds = secretConfig.ClientSecret;

const numToStr = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten'
};

process.on('uncaughtException', (err) => {
    if (err.message !== 'Callback was already called.') {
        io.emit('error', {
            error: err.message
        });
    }
});

// might need to store their rankings in the DB on disconnect
io.on('connection', function (socket) {
    const sendError = (message) => {
        io.emit('error', {
            error: message
        });
    };

    const getSheetId = (googleId, eventId) => {
        return new Promise((resolve) => {
            const query = firebase.database().ref(`organizer/${googleId}/event/${eventId}/eventData/sheetURL`);
            query.on('value', (snapshot) => {
                const url = snapshot.val();
                const id = url.split('/')[5];
                resolve(id);
            });
        });
    }


    const getSheets = (sheetId) => {
        return new Promise((resolve, reject) => {
            const doc = new GoogleSpreadsheet(sheetId);
            doc.useServiceAccountAuth(creds, (err) => {
                if (err) {
                    reject(err);
                }
                doc.getInfo((err2, info) => {
                    if (err2) {
                        reject(err2);
                    }
                    resolve(info.worksheets);
                });
            });
        });
    }

    const getRows = (sheet) => {
        return new Promise((resolve, reject) => {
            sheet.getRows((err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }

    /**
     * Creates a row from each entry and adds it to google sheet.
     * Used an array of promises so that we don't apply the formulas
     * until each row has been added
     */
    const addEntries = (entries, worksheet) => {
        let promises = [];
        for (let i = 0; i < entries.length; i++) {
            const row = {
                RANK: entries[i].title,
                FIRST: 0,
                SECOND: 0,
                THIRD: 0,
                TOTAL: 0,
            };
            promises.push(new Promise((resolve, reject) => {
                worksheet.addRow(row, err => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            }));
        }
        return Promise.all(promises);
        
    }

    const addFormulas = (worksheet) => {
        let promises = [];
        worksheet.getRows((err, rows) => {
            if (err) {
                sendError(err);
                return;
            }
            let row;
            for (let i = 1; i < rows.length; i++) {
                row = rows[i];
                promises.push(new Promise((resolve) => {
                    row.first = `=countif('all votes'!B1:B999, "${row.rank}")`;
                    row.second = `=countif('all votes'!C1:C999, "${row.rank}")`;
                    row.third = `=countif('all votes'!D1:D999, "${row.rank}")`;
                    row.total = `=B2*B${i + 2}+C2*C${i + 2}+D2*D${i + 2}`;
                    row.save(() => {
                        resolve();
                    });
                }));
            }
            return Promise.all(promises);
        });
    }

    const updateDbWeights = (googleId, eventId, weights) => {
        return new Promise((resolve) => {
            const eventData = firebase.database().ref(`organizer/${googleId}/event/${eventId}/eventData`);
            eventData.child('weights').set({
                first: weights[0],
                second: weights[1],
                third: weights[2],
            }, () => {
                resolve();
            });
        });
    }

    const addWeights = (weights, rows) => {
        return new Promise((resolve) => {
            rows[0].FIRST = weights[0];
            rows[0].SECOND = weights[1];
            rows[0].THIRD = weights[2];
            rows[0].save(() => {
                resolve();
            });
        });
    }

    const updateDbURL = (googleId, eventId, url) => {
        return new Promise((resolve) => {
            const eventData = firebase.database().ref(`organizer/${googleId}/event/${eventId}/eventData`);
            eventData.child('sheetURL').set(url, () => {
                resolve();
            });
        });
    }

    const testURL = (url) => {
        return new Promise((resolve, reject) => {
            const id = url.split('/')[5];
            const doc1 = new GoogleSpreadsheet(id);

            doc1.useServiceAccountAuth(creds, (err) => {
                if (err) {
                    reject(err);
                }
                doc1.getInfo((err2, info) => {
                    if (err2) {
                        reject(err2);
                    }
                    io.emit('url_confirm');
                    resolve({
                        doc: doc1,
                        sheets: info.worksheets
                    });
                });
            });
        });
    }

    const readySheet = (doc, sheets) => {
        return new Promise((resolve, reject) => {
            const sheet1 = sheets[0];
            sheet1.setTitle('all votes');
            sheet1.setHeaderRow(['submission_num', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);

            doc.addWorksheet({
                title: 'weighted rankings'
            }, (err, sheet2) => {
                if (err) {
                    reject(err);
                }
                sheet2.setHeaderRow(['RANK', 'FIRST', 'SECOND', 'THIRD', 'TOTAL'], (err2) => {
                    if (err2) {
                        reject(err2);
                    }
                    const row = { RANK: 'weights', FIRST: 3, SECOND: 2, THIRD: 1 };
                    sheet2.addRow(row, (err3) => {
                        if (err3) {
                            reject(err3);
                        }
                        resolve();
                    });
                });
            });
        });
    }

    const addVote = (votes, sheet, rows) => {
        return new Promise((resolve, reject) => {
            votes.submission_num = rows.length + 1;
            sheet.addRow(votes, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    const getNewEntries = (entries, rows) => {
        const existing = [];
        let entries_arr = [];
        for (let entry in entries) {
            entries_arr.push(entries[entry]);
        }
        for (let i = 0; i < rows.length; i++) {
            existing.push(rows[i].rank);
        }
        entries_arr = entries_arr.filter(entry => !existing.includes(entry.title));
        return entries_arr;
    }

    const addRemaining = (rows, ballots, sheet) => {
        let promises = [];
        let row;
        for (let i = 0; i < ballots.length; i++) {
            row = {};
            for (let j = 1; j <= 10; j++) {
                if (ballots[i][j]) {
                    if (ballots[i][j]['title']) {
                        row[numToStr[j]] = ballots[i][j]['title'];
                    } else if (ballots[i][j]['name']) {
                        row[numToStr[j]] = ballots[i][j]['name'];
                    }
                }
            }
            row['submission_num'] = rows.length + 1 + i;
            promises.push(new Promise((resolve, reject) => {
                sheet.addRow(row, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            }));
        }
        return Promise.all(promises);
    }

    const getRemainingBallots = (googleId, eventId) => {
        return new Promise((resolve) => {
            const eventDataQuery = firebase.database().ref(`organizer/${googleId}/event/${eventId}/eventData/`);
            eventDataQuery.child('endVote').set(new Date().toISOString());
            eventDataQuery.on('value', (snap) => {
                const eventData = snap.val();
                const sheetId = eventData.sheetURL.split('/')[5];

                const ballotQuery = firebase.database().ref(`event/${eventId}`);
                ballotQuery.on('value', (snapshot) => {
                    const event = snapshot.val();
                    const ballots = [];
                    // get ballots that haven't been submitted
                    if (event.attendees) {
                        for (let ballot in event.attendees) {
                            if (event.attendees[ballot] && event.attendees[ballot].rankings && !event.attendees[ballot].submitted) {
                                ballots.push(event.attendees[ballot].rankings);
                            }
                        }
                    }
                    // get manually submitted ballots
                    if (event.manual) {
                        for (let ballot in event.manual) {
                            if (event.manual[ballot]) {
                                ballots.push(event.manual[ballot]);
                            }
                        }
                    }
                    resolve({
                        ballots,
                        sheetId,
                    });
                });
            });
        });
    }

    socket.on('send_entries', async (data) => {
        const { eventId, googleId, entries } = data;
        let id = await getSheetId(googleId, eventId);
        let sheets = await getSheets(id).catch(err => { sendError(err); });
        await addEntries(entries, sheets[1]);
        await addFormulas(sheets[1]);
    });

    socket.on('send_weights', async (data) => {
        const { weights, eventId, googleId } = data;
        await updateDbWeights(googleId, eventId, weights);
        let id = await getSheetId(googleId, eventId);
        let sheets = await getSheets(id).catch(err => { sendError(err); });
        let rows = await getRows(sheets[1]).catch(err => { sendError(err); });
        await addWeights(weights, rows);
    });

    socket.on('send_url', async (data) => {
        const { url, googleId, eventId } = data;
        if (url.length > 0) {
            let { doc, sheets } = await testURL(url).catch(err => { sendError(err); });
            if (googleId && eventId) {
                await updateDbURL(googleId, eventId, url);
            }
            if (sheets.length < 2) {
                await readySheet(doc, sheets).catch(err => { sendError(err); });
            }
        }
    });

    socket.on('send_votes', async (data) => {
        const { eventId, googleId, votes } = data;
        const finalVotes = {};
        for (let i = 0; i < votes.length && i < 10; i++) {
            finalVotes[numToStr[i + 1]] = votes[i].name;
        }

        let id = await getSheetId(googleId, eventId);
        let sheets = await getSheets(id).catch(err => { sendError(err); });
        let rows = await getRows(sheets[0]).catch(err => { sendError(err); });
        await addVote(finalVotes, sheets[0], rows).catch(err => { sendError(err); });
    });

    /**
     * Gets ballots that were never submitted and that were manually submitted
     * and adds them to the google sheet
     */
    socket.on('finalize_results', async (data) => {
        const { googleId, eventId } = data;
        let { ballots, sheetId } = await getRemainingBallots(googleId, eventId);
        let sheets = await getSheets(sheetId).catch(err => { sendError(err); });
        let rows = await getRows(sheets[0]).catch(err => { sendError(err); });
        await addRemaining(rows, ballots, sheets[0]);
    });

    socket.on('update_entries', async (data) => {
        const { eventId, googleId, entries } = data;
        let id = await getSheetId(googleId, eventId);
        let sheets = await getSheets(id).catch(err => { sendError(err); });
        let rows = await getRows(sheets[1]).catch(err => { sendError(err); });
        let newEntries = getNewEntries(entries, rows);
        await addEntries(newEntries, sheets[1]);
        await addFormulas(sheets[1]);
    });
});

io.listen(config.Global.serverPort);
