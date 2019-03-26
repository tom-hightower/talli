const firebase = require('../client/src/firebase');

const express = require('express');
const bodyParser = require('body-parser');
const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const http = require('http').Server(app);
const io = require('socket.io')(http);
const creds = require('./client_secret.json');

const num_2_str = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten"
};

process.on('uncaughtException', (err) => {
    if (err.message !== "Callback was already called.") {
        io.emit('error', {
            error: err.message
        });
    }
});

// might need to store their rankings in the DB on disconnect
io.on('connection', function (socket) {

    let rankings;

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
                    const sheet = info.worksheets[0];
                    sheet.setTitle('all votes');
                    sheet.setHeaderRow(['submission_num', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
                    if (info.worksheets.length < 2) {
                        doc.addWorksheet({
                            title: 'weighted rankings'
                        }, (err3, sheet2) => {
                            if (err3) {
                                sendError('Could not add new worksheet');
                                return;
                            }
                            sheet2.setHeaderRow(['RANK', 'FIRST', 'SECOND', 'THIRD', 'TOTAL'], (err4) => {
                                if (err4) {
                                    sendError('Could not set header row of weightes ranks sheet');
                                    return;
                                }
                                const row = { RANK: 'weights', FIRST: 1, SECOND: 1, THIRD: 1 };
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
            let url = snapshot.val();
            let id = url.split('/')[5];
            let doc = new GoogleSpreadsheet(id);

            let response = {};
            const tasks = [
                function auth(cb) {
                    doc.useServiceAccountAuth(creds, (err) => {
                        if (err) {
                            return cb(err);
                        } else {
                            response.doc = doc;
                            return cb(null, doc);
                        }
                    });
                },
                function getSheetInfo(cb) {
                    response.doc.getInfo((err, info) => {
                        if (err) {
                            return cb(err);
                        } else {
                            response.info = info;
                            return cb(null, info);
                        }
                    });
                },
                function getSheetRows(cb) {
                    response.info.worksheets[1].getRows((err, rows) => {
                        if (err) {
                            return cb(err);
                        } else {
                            response.rows = rows;
                            return cb(null, rows);
                        }
                    });
                },
                function addSheetRows(cb) {
                    let rows = response.rows;
                    const existing = [];
                    for (let i = 0; i < rows.length; i++) {
                        existing.push(rows[i].rank);
                    }
                    for (let entry in entries) {
                        if (!existing.includes(entries[entry].title)) {
                            let row = {
                                RANK: entries[entry].title,
                                FIRST: 0,
                                SECOND: 0,
                                THIRD: 0,
                                TOTAL: 0,
                            };
                            response.info.worksheets[1].addRow(row, (err, row) => {
                                if (err) {
                                    return cb(err);
                                } else {
                                    return cb(null, row);
                                }
                            });
                        }
                    }
                },
                function applyFormulas(cb) {
                    response.doc.getInfo((err, info) => {
                        if (err) {
                            return cb(err);
                        }
                        let sheet = info.worksheets[1];
                        sheet.getRows((err1, rows) => {
                            if (err1) {
                                return cb(err);
                            }
                            let curr;
                            for (let i = 1; i < rows.length; i++) {
                                curr = rows[i];
                                curr.first = `=countif('all votes'!B2:B1000, "${curr.rank}")`;
                                curr.second = `=countif('all votes'!C2:C1000, "${curr.rank}")`;
                                curr.third = `=countif('all votes'!D2:D1000, "${curr.rank}")`;
                                curr.total = `=B2*B${i + 2}+C2*C${i + 2}+D2*D${i + 2}`;
                                curr.save();
                            }
                            response.rows = rows;
                        })
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

        query.on('value', (snapshot) => {
            let url = snapshot.val();
            let id = url.split('/')[5];
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
        let final_votes = {};
        let top3 = [];

        for (let i = 0; i < votes.length; i++) {
            if (i < 3) {
                top3.push(votes[i].id);
            }
            final_votes[num_2_str[i + 1]] = votes[i].name;
        }

        const query = firebase.database().ref(`organizer/${organizerId}/event/${eventId}/eventData/sheetURL`);
        query.on('value', (snapshot) => {
            const url = snapshot.val();
            const id = url.split('/')[5];
            let doc = new GoogleSpreadsheet(id);

            doc.useServiceAccountAuth(creds, (err) => {
                if (err) {
                    sendError('Could not authenticate sheet');
                    return;
                }
                doc.getRows(1, (err2, rows) => {
                    if (err2) {
                        sendError('Could not get information from weighted ranks sheet');
                        return;
                    }
                    final_votes.submission_num = rows.length + 1;
                    doc.addRow(1, final_votes, (err3) => {
                        if (err3) {
                            sendError('Could not add row to votes sheet');
                            return;
                        }
                    });
                });
                doc.getInfo((err2, info) => {
                    if (err2) {
                        sendError('Could not get information from weighted ranks sheet');
                        return;
                    }
                    let weights_sheet = info.worksheets[1];
                    weights_sheet.getRows((err3, rows) => {
                        if (err3) {
                            sendError('Could not get rows from weights sheet');
                            return;
                        }
                        let curr;
                        for (let i = 0; i < rows.length; i++) {
                            curr = rows[i];
                            if (top3[0] === curr.rank) {
                                curr.total = `=B2*B${i + 2}+C2*C${i + 2}+D2*D${i + 2}`;
                                curr.save();
                            } else if (top3[1] === curr.rank) {
                                curr.total = `=B2*B${i + 2}+C2*C${i + 2}+D2*D${i + 2}`;
                                curr.save();
                            } else if (top3[2] === curr.rank) {
                                curr.total = `=B2*B${i + 2}+C2*C${i + 2}+D2*D${i + 2}`;
                                curr.save();
                            }
                        }
                    });
                });
            });
        });
    };

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
                        ballots.push(event.attendees[ballot].rankings);
                    }
                }
                if (event.ballots && event.ballots.manual) {
                    for (let ballot in event.ballots.manual) {
                        ballots.push(event.ballots.manual[ballot]);
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
                        let votes_sheet = info.worksheets[0];
                        votes_sheet.getRows((err3, rows) => {
                            if (err3) {
                                sendError('Could not get rows from all votes sheet');
                                return;
                            }
                            let curr = [];
                            for (let i = 0; i < rows.length; i++) {
                                if (ballots[i]) {
                                    curr = rows[i];
                                    for (let n = 1; n <= 10; n++) {
                                        curr[num_2_str[n]] = '';
                                    }
                                    curr["submission_num"] = i+1;
                                    for (let item in ballots[i]) {
                                        curr[num_2_str[ballots[i][item]]] = item;
                                    }
                                    curr.save();
                                }
                            }
                            for (let r = rows.length; r < ballots.length; r++) {
                                for (let n = 1; n <= 10; n++) {
                                    curr[num_2_str[n]] = '';
                                }
                                curr["submission_num"] = i+1;
                                for (let item in ballots[r]) {
                                    curr[num_2_str[ballots[r][item]]] = item;
                                }
                                votes_sheet.addRow(curr, (err5) => {
                                    if (err5) {
                                        sendError('Could not add row to all votes sheet');
                                        return;
                                    }
                                });
                            }
                            if (rows.length > ballots.length) {
                                for (let y = ballots.length; y < rows.length; y++) {
                                    rows[y].del();
                                }
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

    // currently weights don't save in the DB but they do in the spreadsheet
    socket.on('send_weights', (data) => {
        sendWeights(data);
    });

    socket.on('send_votes', (data) => {
        sendVotes(data);
    });

    socket.on('update_rankings', (data) => {
        rankings = data.votes;
    });

    socket.on('finalize_results', (data) => {
        finalizeResults(data);
    });
});

io.listen(port);
