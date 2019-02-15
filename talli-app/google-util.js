const { google } = require('googleapis');

const googleConfig = {
    clientId: '1061225539650-cp3lrdn3p1u49tsq320l648hcuvg8plb.apps.googleusercontent.com',
    clientSecret: 'TzsfVkSlrefcg66h7UBQdch4',
    redirect: 'http://localhost:3000/organizer'
};

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email'
];

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

function urlGoogle() {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

module.exports = urlGoogle;