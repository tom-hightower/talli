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

    const connectUrl = (data) => {
        if (data.url.length > 0) {
            const { url, googleId, eventId } = data;
            if (googleId && eventId) {
                const eventData = firebase.database().ref(`organizer/${googleId}/event/${eventId}/eventData`);
                eventData.child('sheetURL').set(url);
            }

            // best way to parse for id?
            const id = url.split('/')[5];
            const doc = new GoogleSpreadsheet(id);

            doc.useServiceAccountAuth(creds, (err) => {
                if (err) {
                    sendError('Error with sheet authentication');
                    return;
                }
                doc.getInfo((err2, info) => {
                    if (err2) {
                        sendError('Could not get sheet information');
                        return;
                    }
                    io.emit('url_confirm');
                    if (info.worksheets.length < 2) {
                        const sheet = info.worksheets[0];
                        sheet.setTitle('all votes');
                        sheet.setHeaderRow(['submission_num', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);

                        doc.addWorksheet({
                            title: 'weighted rankings'
                        }, (err3, sheet2) => {
                            if (err3) {
                                sendError('Could not add new worksheet');
                                return;
                            }
                            sheet2.setHeaderRow(['RANK', 'FIRST', 'SECOND', 'THIRD', 'TOTAL'], (err4) => {
                                if (err4) {
                                    sendError('Could not set header row of weighted ranks sheet');
                                    return;
                                }
                                const row = { RANK: 'weights', FIRST: 3, SECOND: 2, THIRD: 1 };
                                sheet2.addRow(row, (err5) => {
                                    if (err5) {
                                        sendError('Could not add row to weighted ranks sheet');
                                        return;
                                    }
                                });
                            });
                        });
                    }
                });
            });
        }
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
                    doc.useServiceAccountAuth(creds, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        response.doc = doc;
                        return cb(null, doc);
                    });
                },
                function getSheetInfo(cb) {
                    response.doc.getInfo((err, info) => {
                        if (err) {
                            return cb(err);
                        }
                        response.info = info;
                        return cb(null, info);
                    });
                },
                function getSheetRows(cb) {
                    response.info.worksheets[1].getRows((err, rows) => {
                        if (err) {
                            return cb(err);
                        }
                        response.rows = rows;
                        return cb(null, rows);
                    });
                },
                function addSheetRows(cb) {
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
                                return cb(null, cbRow);
                            });
                        }
                    }
                },
                function applyFormulas(cb) {
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

    const sendWeights = (data) => {
        const { weights, eventId, googleId } = data;
        const query = firebase.database().ref(`organizer/${googleId}/event/${eventId}/eventData/sheetURL`);

        const eventData = firebase.database().ref(`organizer/${googleId}/event/${eventId}/eventData`);
        eventData.child('weights').set({
            first: weights[0],
            second: weights[1],
            third: weights[2],
        });

        query.on('value', (snapshot) => {
            const url = snapshot.val();
            const id = url.split('/')[5];
            const doc = new GoogleSpreadsheet(id);

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
                    const weightsSheet = info.worksheets[1];
                    weightsSheet.getRows((err3, rows) => {
                        if (err3) {
                            sendError('Could not get rows from weighted ranks sheet');
                            return;
                        }
                        rows[0].FIRST = weights[0];
                        rows[0].SECOND = weights[1];
                        rows[0].THIRD = weights[2];
                        rows[0].save();
                    });
                });
            });
        });
    };

    const sendVotes = (data) => {
        const { votes, eventId, organizerId } = data;
        const finalVotes = {};
        const top3 = [];

        for (let i = 0; i < votes.length; i++) {
            if (i < 3) {
                top3.push(votes[i].id);
            }
            finalVotes[numToStr[i + 1]] = votes[i].name;
        }

        const query = firebase.database().ref(`organizer/${organizerId}/event/${eventId}/eventData/sheetURL`);
        query.on('value', (snapshot) => {
            const url = snapshot.val();
            const id = url.split('/')[5];
            const doc = new GoogleSpreadsheet(id);

            doc.useServiceAccountAuth(creds, (err) => {
                if (err) {
                    sendError('Could not authenticate sheet');
                    return;
                }
                doc.getInfo((err2, info) => {
                    if (err2) {
                        sendError('Could not get info about sheets document');
                        return;
                    }
                    const sheet = info.worksheets[0];
                    sheet.getRows((err3, rows) => {
                        if (err3) {
                            sendError('Could not access votes sheet');
                            return;
                        }
                        finalVotes.submission_num = rows.length + 1;
                        sheet.addRow(finalVotes, (err4) => {
                            if (err4) {
                                sendError('Could not add rows to votes sheet');
                                return;
                            }
                        });
                    });
                });
                // doc.getRows(1, (err2, rows) => {
                //     if (err2) {
                //         sendError('Could not get information from weighted ranks sheet');
                //         return;
                //     }
                //     final_votes.submission_num = rows.length + 1;
                //     doc.addRow(1, final_votes, (err3) => {
                //         if (err3) {
                //             sendError('Could not add row to votes sheet');
                //             return;
                //         }
                //     });
                // });
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

    socket.on('send_url', (data) => {
        connectUrl(data);
    });

    socket.on('send_entries', (data) => {
        sendEntries(data);
    });

    socket.on('send_weights', (data) => {
        sendWeights(data);
    });

    socket.on('send_votes', (data) => {
        sendVotes(data);
    });

    socket.on('finalize_results', (data) => {
        finalizeResults(data);
    });
});

io.listen(config.Global.serverPort);
