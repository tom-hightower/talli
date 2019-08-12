# API Key Configuration

## Overview
The Talli application depends on a number of Google services for storing data, allowing Organizer login, and exporting results
to Google Sheets.  This configuration guide will help you create a file to be stored in `client\src\secret.config.json` that
contains all of the required API keys for this project.
<br/>
After following this guide, your `secret.config.json` should resemble the following template:
```
{
    "Firebase": {
        "apiKey": "000000000000000000000000000000000000000",
        "authDomain": "talli-00000.firebaseapp.com",
        "databaseURL": "https://talli-00000.firebaseio.com",
        "projectId": "talli-00000",
        "storageBucket": "talli-00000.appspot.com",
        "messagingSenderId": "000000000000"
    },
    "web": {
        "client_id": "000000000000000000000000000000000000000000000.apps.googleusercontent.com",
        "project_id": "talli-000000",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "00000000000000000000",
        "redirect_uris": [
            "http://localhost:3000/organizer",
            "https://tallivote.com/organizer"
        ],
        "javascript_origins": [
            "http://localhost:3000",
            "https://tallivote.com"
        ]
    },
    "SheetConfig": {
        "type": "service_account",
        "project_id": "talli-000000",
        "private_key_id": "0000000000000000000000000000000000000000",
        "private_key": "-----BEGIN PRIVATE KEY-----\n<Your key here>\n-----END PRIVATE KEY-----\n",
        "client_email": "talli-000@talli-000000.iam.gserviceaccount.com",
        "client_id": "000000000000000000000",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/talli-000%40talli-000000.iam.gserviceaccount.com"
    }
}
```
If the steps found in this guide no longer work as expected, it's likely that Google has changed the process slightly and an
[issue](https://github.com/tom-hightower/talli/issues) should be opened.

## Firebase

Firebase is used as Talli's backend, storing event data and attendee rankings.
<br/>
Steps to set up a Firebase project and generate API keys:
- Navigate to the [Firebase Console](https://console.firebase.google.com), logging in if necessary.
- Add a new project, and give it a name (eg `Talli`).
- Google Analytics is not required for this project, so you can safely choose "Not right now" and continue.
- After Firebase has finished creating your project, you can continue to the Project Overview dashboard.
- Click on "Database" on the left hand navigation menu, and choose to create a new Realtime Database (not Firestore).
- Start the database in "Test Mode" to get up and running quickly, read/write rules can later be limited to your host URL
- Click the Gear icon next to "Project Overview" in the upper left and choose "Project Settings"
- Near the bottom, click the `</>` icon to add a new webapp to your project
- Give it a name (eg `Talli`) and register the app. Leave Firebase Hosting unchecked
- Copy the generated configuration info (shown in `var firebaseConfig`) to the above `secret.config.json` template's `Firebase` key.


## Google Developer Console Setup

To set up the two Google API keys you'll need, you need to set up a new project in the Google Developer Console.
If you already have a project set up for talli, you can skip to the next heading to generate keys.
<br/>
Steps to set up a new project:
- Go to your [Developer Console](https://console.developers.google.com) and log in.
- Click the dropdown in the upper left next to the Google Apis logo and select "New Project".
- Give the new project a name (eg `Talli`) and if desired, a location, before confirming to create the project.

### OAuth for Organizer Login

Talli needs OAuth access to allow Organizers to log in to the Organizer Dashboard, giving them access to their
event management.
<br/>
Steps to generate an OAuth API Key:
- In your Developer Console project, navigate to APIs & Services -> Credentials through the navigation menu on the left.
- Choose the "OAuth consent screen" tab at the top
- Fill out the following:
  - Application name (eg `Talli`)
  - Logo (reccomended to use the Talli icon found at `res/talli_icon.png`)
  - Scopes for Google APIs: email, profile, openid
  - Authorized domains: Host URL (eg `tallivote.com`) and your Firebase Auth URL from above (eg `talli-0000a.firebaseapp.com`)
  - Application Homepage Link: Host URL (eg `https://tallivote.com`)
  - Application Privacy Policy link: [Host URL]/cookies (eg `https://tallivote.com/cookies`)
- Click save, and if not redirected, return to the Credentials tab.
- Click the blue "Create Credentials" dropdown and select "OAuth ClientID"
- Select "Web application" and create the key
- Give the key the following Authorized JavaScript origins:
  - `http://localhost` (for development)
  - `http://localhost:5000` (for development)
  - Firebase Auth URL (eg `https://talli-0000a.firebaseapp.com`)
  - Host URL (eg `https://tallivote.com`)
- Give the key the following Authorized redirect URLs:
  - Firebase auth handler (eg `https://talli-0000a.firebaseapp.com/__/auth/handler`)
  - `http://localhost:3000/organizer` (for development)
  - [Host URL]/organizer (eg `https://tallivote.com/organizer`)
- Your new Client ID should now appear under "OAuth 2.0 client IDs".  Click the far right download icon to download the
key config as a json.
- Open the downloaded json file and copy the contents of the `web` key to the corresponding key in the
`secret.config.json` template.

### Drive API for Spreadsheet Exporting

Talli needs access to Google Drive to enable spreadsheet export.
<br/>
Steps to generate a Drive API key:
- In your Developer Console project, navigate to APIs & Services -> Dashboard through the navigation menu on the left.
- Click "ENABLE APIS AND SERVICES" at the top, search for the Google Drive API, enable it, and confirm that you want to
create credentials.
- Make the following selections before choosing "What credentials do I need?":
  - Which API are you using? `Google Drive API`
  - Where will you be calling the API from? `Web Server`
  - What data will you be accessing? `Application Data`
- Name your service account (eg `Talli`).
- Give the account a "Project" role of `Editor` and a key type of `JSON`.
- Clicking "Continue" should download the JSON config file.
- Open the downloaded json file and copy the contents to the `SheetConfig` key in the `secret.config.json` template.
