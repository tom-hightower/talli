const firebase = require('./client/src/firebase');

const express = require('express');
const bodyParser = require('body-parser');
const GoogleSpreadsheet = require('google-spreadsheet');
// const urlGoogle = require('./google-util');

const app = express();
const port = 5000;
// const authRoutes = require('./routes/auth-routes');

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
// might need to store their rankings in the DB on disconnect
io.on('connection', function (socket) {

    // probably wanna change this
    let rankings;

    socket.on('send_url', (data) => {
        if (data.url.length > 0) {
            let entries = data.entries;
            console.log(entries);
            let url = data.url;
            let googleId = data.googleId;
            let eventId = data.eventId;
            console.log(eventId);
            if (googleId && eventId) {
                const eventData = firebase.database().ref(`organizer/${googleId}/event/${eventId}/eventData`);
                eventData.child('sheetURL').set(url);
            }

            // best way to parse for id?
            let id = url.split('/')[5];
            let doc = new GoogleSpreadsheet(id);

            doc.useServiceAccountAuth(creds, (err) => {
                if (err) { console.log(err); }
                doc.getInfo((err, info) => {
                    if (err) console.log(err)
                    let sheet = info.worksheets[0];
                    sheet.setTitle('all votes');
                    sheet.setHeaderRow(['submission_num', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
                });
                doc.addWorksheet({
                    title: 'weighted rankings'
                }, (err, sheet) => {
                    if (err) console.log(err);
                    sheet.setHeaderRow(['RANK', 'FIRST', 'SECOND', 'THIRD'], (err) => {
                        if (err) console.log(err);
                        let row = {RANK: 'weights', FIRST: 1, SECOND: 1, THIRD: 1};
                        sheet.addRow(row, (err) => {
                            if (err) console.log(err);
                        });
                    });
                });
            });
        }
    });

    socket.on('send_weights', (data) => {
        let weights = data.weights;
        let eventId = data.eventId;
        let organizerId = data.googleId;

        let query = firebase.database().ref(`organizer/${organizerId}/event/${eventId}/eventData/sheetURL`);

        query.on('value', (snapshot) => {
            let url = snapshot.val();
            let id = url.split('/')[5];
            let doc = new GoogleSpreadsheet(id);

            doc.useServiceAccountAuth(creds, (err) => {
                if (err) console.log(err);
                doc.getInfo((err, info) => {
                    if (err) console.log(err);
                    let weights_sheet = info.worksheets[1];
                    weights_sheet.getRows((err, rows) => {
                        if (err) console.log(err);
                        rows[0].FIRST = weights[0];
                        rows[0].SECOND = weights[1];
                        rows[0].THIRD = weights[2];
                        rows[0].save();
                    });
                });
            });
        });

    })

    socket.on('send_votes', (data) => {
        
        let final_votes = {};
        let votes = data.votes;
        for (let i = 0; i < votes.length; i++) {
            final_votes[num_2_str[i + 1]] = votes[i].name;
        }
        
        let eventId = data.eventId;
        let organizerId = data.organizerId;
        let query = firebase.database().ref(`organizer/${organizerId}/event/${eventId}/eventData/sheetURL`);
        query.on('value', (snapshot) => {
            let url = snapshot.val();
            let id = url.split('/')[5];
            let doc = new GoogleSpreadsheet(id);

            // wrap these in promises? 
            doc.useServiceAccountAuth(creds, (err) => {
                console.log(err);
                doc.getRows(1, (err, rows) => {
                    if (err) console.log(err);
                    final_votes['submission_num'] = rows.length + 1;
                    doc.addRow(1, final_votes, (err2) => {
                        if (err2) {
                            console.log(err2);
                        }
                    });
                });
            });
            console.log("votes sent!");
            console.log(final_votes);
        })
    });

    socket.on('update_rankings', (data) => {
        rankings = data.votes;
        console.log(rankings);
    })

    // const url = urlGoogle();
    // io.emit('send_url', url);
});
io.listen(port);

// app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send('Hello World!'));
