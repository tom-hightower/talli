import * as firebase from 'firebase'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAJdDmQLsBBoxMKV0GYrhYIpWfsSvptytw",
    authDomain: "talli-9582a.firebaseapp.com",
    databaseURL: "https://talli-9582a.firebaseio.com",
    projectId: "talli-9582a",
    storageBucket: "talli-9582a.appspot.com",
    messagingSenderId: "637663865216"
};
firebase.initializeApp(config);
export default firebase;