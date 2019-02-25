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

const doc = new GoogleSpreadsheet('1k1r8EvCTuRBcamM71lYSw3OK7cBwehHXFLGe2kFRy50');


io.on('connection', function (socket) {

    let rankings;

    socket.on('send_votes', () => {
        // console.log(`Message: ${data}`);
        // for (vote in data.votes) {
        //     console.log(vote);
        // }
        console.log("votes sent!");
        console.log(rankings);
        // doc.useServiceAccountAuth(creds, (err) => {
        //     console.log(err);
        //     doc.addRow(1, data, (err2) => {
        //         if (err2) {
        //             console.log(err2);
        //         }
        //     });
        // });
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
