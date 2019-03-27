const firebase = require('firebase');
const config = require('./secret.config.json');

// Initialize Firebase
const fireConfig = config.Firebase;

firebase.initializeApp(fireConfig);
module.exports = firebase;
