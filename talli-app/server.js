const express = require('express');
const bodyParser = require('body-parser');
const GoogleSpreadsheet = require('google-spreadsheet');
const urlGoogle = require('./google-util');

const app = express();
const port = 5000;
// const authRoutes = require('./routes/auth-routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const http = require('http').Server(app);
const io = require('socket.io')(http);
const creds = require('./client_secret.json');

// TODO: get spreadsheet ID from organizer's url 
let doc;

io.on('connection', function (socket) {

    let rankings;

    socket.on('send_url', (data) => {
        if (data.url.length > 0) {
            let id = data.url.split('/')[5];
            // is this the best way to parse url for ID?
            console.log(id);
            doc = new GoogleSpreadsheet(id);
            doc.useServiceAccountAuth(creds, (err) => {
                if (err) { console.log(err); }
                doc.getInfo((err, info) => {
                    if (err) { console.log(err); }
                    let sheet = info.worksheets[0];
                    sheet.setTitle('nicks title');
                    sheet.setHeaderRow(['submission_num', 'first', 'second', 'third']);
                });
            })
        }
    })

    socket.on('send_votes', () => {
        // can probably retreive their column names and use them as the keys in this object
        let final_votes = {
            First: rankings.length >= 1 ? rankings[0].name : "",
            Second: rankings.length >= 2 ? rankings[1].name : "",
            Third: rankings.length >= 3 ? rankings[2].name : ""
        };
        console.log("votes sent!");
        console.log(final_votes);
        doc.useServiceAccountAuth(creds, (err) => {
            console.log(err);
            doc.addRow(1, final_votes, (err2) => {
                if (err2) {
                    console.log(err2);
                }
            });
        });
    });

    socket.on('update_rankings', (data) => {
        rankings = data.votes;
        console.log(rankings);
    })

    const url = urlGoogle();
    io.emit('send_url', url);
});
io.listen(port);

// app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send('Hello World!'));
