const firebase = require('firebase');
const config = require('./secret.config.json');

// Initialize Firebase
firebase.initializeApp(config.Firebase);

module.exports = firebase;
