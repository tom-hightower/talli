const express = require('express');
const path = require('path');

const client = express();

client.use(express.static(path.join(__dirname, 'build')));

client.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

client.listen(3000);
