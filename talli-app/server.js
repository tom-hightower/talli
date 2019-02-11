const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
// const authRoutes = require('./routes/auth-routes');
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const http = require('http').Server(app);
const io = require('socket.io')(http);

var doc = new GoogleSpreadsheet('1k1r8EvCTuRBcamM71lYSw3OK7cBwehHXFLGe2kFRy50');


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
    
    socket.on('add_data', (data) => {
        console.log('message: ' + data);
        doc.useServiceAccountAuth(creds, (err) => {
            doc.addRow(1, data, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    });
});
io.listen(port);

// app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => {
//     console.log(`Talli - listening on port ${port}!`)
// })