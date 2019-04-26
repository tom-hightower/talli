const express = require('express');
const bodyParser = require('body-parser');
const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');

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

    const sendEntries = (data) => {
        const { eventId, googleId, entries } = data;

        const query = firebase.database().ref(`organizer/${googleId}/event/${eventId}/eventData/sheetURL`);

        query.on('value', (snapshot) => {
            const url = snapshot.val();
            const id = url.split('/')[5];
            const doc = new GoogleSpreadsheet(id);
            const response = {};

            const tasks = [
                function auth(cb) {
                    console.log('auth');
                    doc.useServiceAccountAuth(creds, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        response.doc = doc;
                        return cb(null, doc);
                    });
                },
                function getSheetInfo(cb) {
                    console.log('get sheet info')
                    response.doc.getInfo((err, info) => {
                        if (err) {
                            return cb(err);
                        }
                        response.info = info;
                        return cb(null, info);
                    });
                },
                function getSheetRows(cb) {
                    console.log('get sheet rows')
                    response.info.worksheets[1].getRows((err, rows) => {
                        if (err) {
                            return cb(err);
                        }
                        response.rows = rows;
                        return cb(null, rows);
                    });
                },
                function addSheetRows(cb) {
                    console.log('add sheet rows')
                    const rows = response.rows;
                    const existing = [];
                    for (let i = 0; i < rows.length; i++) {
                        existing.push(rows[i].rank);
                    }
                    for (let entry in entries) {
                        if (!existing.includes(entries[entry].title)) {
                            const row = {
                                RANK: entries[entry].title,
                                FIRST: 0,
                                SECOND: 0,
                                THIRD: 0,
                                TOTAL: 0,
                            };
                            response.info.worksheets[1].addRow(row, (err, cbRow) => {
                                if (err) {
                                    return cb(err);
                                }
                                console.log('callback')
                                return cb(null, cbRow);
                            });
                        }
                    }
                },
                function applyFormulas(cb) {
                    console.log('apply formulas')
                    response.doc.getInfo((err, info) => {
                        if (err) {
                            return cb(err);
                        }
                        const sheet = info.worksheets[1];
                        sheet.getRows((err1, rows) => {
                            if (err1) {
                                return cb(err);
                            }
                            let curr;
                            for (let i = 1; i < rows.length; i++) {
                                curr = rows[i];
                                curr.first = `=countif('all votes'!B1:B999, "${curr.rank}")`;
                                curr.second = `=countif('all votes'!C1:C999, "${curr.rank}")`;
                                curr.third = `=countif('all votes'!D1:D999, "${curr.rank}")`;
                                curr.total = `=B2*B${i + 2}+C2*C${i + 2}+D2*D${i + 2}`;
                                curr.save();
                            }
                            response.rows = rows;
                        });
                    });
                }
            ];

            async.series(tasks, (err) => {
                if (err) {
                    sendError('Problem with executing asynchronously');
                    return;
                }
            });
        });
    };

    // gonna be fixing this in the next PR, but for now it should take entry titles
    const finalizeResults = (data) => {
        const organizerId = data.googleId;
        const eventId = data.eventId;
        const eventDataQuery = firebase.database().ref(`organizer/${organizerId}/event/${eventId}/eventData/`);
        eventDataQuery.child('endVote').set(new Date().toISOString());
        eventDataQuery.on('value', (snap) => {
            const eventData = snap.val();
            const sheetID = eventData.sheetURL.split('/')[5];

            const ballotQuery = firebase.database().ref(`event/${eventId}`);
            ballotQuery.on('value', (snapshot) => {
                const event = snapshot.val();
                const ballots = [];
                if (event.attendees) {
                    for (let ballot in event.attendees) {
                        if (event.attendees[ballot] && event.attendees[ballot].rankings && !event.attendees[ballot].submitted) {
                            ballots.push(event.attendees[ballot].rankings);
                        }
                    }
                }
                if (event.manual) {
                    for (let ballot in event.manual) {
                        if (event.manual[ballot]) {
                            ballots.push(event.manual[ballot]);
                        }
                    }
                }
                const doc = new GoogleSpreadsheet(sheetID);
                doc.useServiceAccountAuth(creds, (err) => {
                    if (err) {
                        sendError('Could not authenticate sheet');
                        return;
                    }
                    doc.getInfo((err2, info) => {
                        if (err2) {
                            sendError('Could not get information from weighted ranks sheet');
                            return;
                        }
                        const votesSheet = info.worksheets[0];
                        votesSheet.getRows((err3, rows) => {
                            if (err3) {
                                sendError('Could not get rows from all votes sheet');
                                return;
                            }
                            let row;
                            for (let i = 0; i < ballots.length; i++) {
                                
                                row = {};
                                for (let j = 1; j <= 10; j++) {
                                    if (ballots[i][j]) {
                                        row[numToStr[j]] = ballots[i][j]['title'];
                                    }
                                }
                                row['submission_num'] = rows.length + 1 + i;
                                
                                votesSheet.addRow(row, (err5) => {
                                    if (err5) {
                                        sendError('Could not add row to all votes sheet');
                                        return;
                                    }
                                    
                                });
                            }
                        });
                    });
                });
            });
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
                reject(err);
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
            return Promise.all(promises)
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

    const addWeights = (weights, sheet) => {
        return new Promise((resolve, reject) => {
            sheet.getRows((err, rows) => {
                if (err) {
                    reject(err);
                }
                rows[0].FIRST = weights[0];
                rows[0].SECOND = weights[1];
                rows[0].THIRD = weights[2];
                rows[0].save(() => {
                    resolve();
                });
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

    const addVote = (votes, sheets) => {
        return new Promise((resolve, reject) => {
            const sheet = sheets[0];
            sheet.getRows((err, rows) => {
                if (err) {
                    reject(err);
                }
                votes.submission_num = rows.length + 1;
                sheet.addRow(votes, (err2) => {
                    if (err2) {
                        reject(err2)
                    }
                    resolve();
                });
            });
        })
    }

    socket.on('send_entries', async (data) => {
        const { eventId, googleId, entries } = data;
        let id = await getSheetId(googleId, eventId);
        let sheets = await getSheets(id).catch(err => { sendErr(err); });
        await addEntries(entries, sheets[1]);
        await addFormulas(sheets[1]);
    });

    socket.on('send_weights', async (data) => {
        const { weights, eventId, googleId } = data;
        await updateDbWeights(googleId, eventId, weights);
        let id = await getSheetId(googleId, eventId);
        let sheets = await getSheets(id).catch(err => { sendErr(err); });
        await addWeights(weights, sheets[1]).catch(err => { sendErr(err); });
    });

    socket.on('send_url', async (data) => {
        // connectUrl(data);
        const { url, googleId, eventId } = data;
        if (url.length > 0) {
            let { doc, sheets } = await testURL(url).catch(err => { sendErr(err); });
            if (googleId && eventId) {
                await updateDbURL(googleId, eventId, url);
                if (sheets.length < 2) {
                    await readySheet(doc, sheets).catch(err => { sendErr(err); });
                }
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
        let sheets = await getSheets(id).catch(err => { sendErr(err); });
        await addVote(finalVotes, sheets).catch(err => { sendErr(err); });
    });

    socket.on('finalize_results', (data) => {
        finalizeResults(data);
    });
});

io.listen(config.Global.serverPort);
