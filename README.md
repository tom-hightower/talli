# Talli - The Portable Voting System

***
## Running the Application
Before you run the application, see the Configuration section below to ensure that your `config.json` and `secret.config.json` files are properly set up.

### Run app in development mode (client and server concurrently)
`npm run dev`

### Install necessary modules (typically after pulling from master)
`npm run update` on Mac/Linux
otherwise `npm i` followed by `npm run client-install` followed by `npm run server-install`

### Create client prod build
`npm run build`<br/>
Run this before trying to run prod

### Run production build
`npm run prod`

***
## Configuration

The configuration for Talli is stored in two files.

### Global Configuration: `client\src\config.json`
| field     | type | description   |
| --------- |:----:|:-------------|
| `hostURL` | string | The host url (ie `tallivote.com`) that the application will be running on.  Make sure that if you are running the application on a subdomain or subdirectory you put the root of the application in this field (ie `subdomain.tallivote.com` or `tallivote.com/subdirectory`) |
| `sslEnabled` | bool | Tells the application if you're running securely (via ssl/https).  Make sure this matches your server configuration, and note that it must be anabled for QR scanning to function. |
| `serverPort` | string | The port that the node.js backend of the application is running on |
| `devMode` | bool | Enables dev mode if true, which tells the client to communicate with the server on localhost instead of the hostURL |

### API Key Configuration: `client\src\secret.config.json`
This file contains private API keys, client secrets, and authorization urls.  It is reccomended to leave this file untracked to prevent making private keys public.  The structure is as follows:
```json
{
    "Firebase": {
        "apiKey": "000000000000000000000000000000000000000",
        "authDomain": "talli-00000.firebaseapp.com",
        "databaseURL": "https://talli-00000.firebaseio.com",
        "projectId": "talli-00000",
        "storageBucket": "talli-00000.appspot.com",
        "messagingSenderId": "000000000000"
    },
    "ClientSecret": {
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
The keys and other information needed for this file can be obtained from your Firebase and Google API consoles.

## Releases

A list of released versions with notes and links to the frozen source code is available at Talli's [releases page](https://github.com/tom-hightower/talli/releases "Releases").
