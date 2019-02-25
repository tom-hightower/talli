import React from 'react';
import QrReader from 'react-qr-reader';
import { TextField, Typography, Button } from '@material-ui/core';
import EntryConfirmation from './Dialogs/EntryConfirmation';
import '../component_style/Voter.css';
import firebase from '../../firebase';
import { getCookie } from '../../cookies.js'
import BlockJoin from './Dialogs/BlockJoin';
import NotFound from './Dialogs/NotFound';
var config = require('../../config.json');

/**
 * Join Event via QR Code or UID
 */
export default class JoinEvent extends React.Component {
    constructor(props) {
        super(props);
        /** ::STATE INFO::
         *  eventID:        Event's UID, obtained either from QRcode or textfield
         *  idFieldValue:   The value currently in the textbox
         */
        this.state = { eventID: '', idFieldValue: '', eventName: '', organizerID: '' };
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleJoinEvent = this.handleJoinEvent.bind(this);
        this.keyPress = this.keyPress.bind(this);

        this.confirmChild = React.createRef();
        this.blockChild = React.createRef();
        this.notFoundChild = React.createRef();
    }

    requestConfirm = () => {
        firebase.database().ref('event/').once('value').then((snap) => {
            let orgID = snap.val()[this.state.eventID];
            this.setState({ organizerID: (orgID ? (orgID['organizer']['id'] ? orgID['organizer']['id'] : orgID['organizer']) : '') }, () => {
                if (this.state.organizerID && this.state.organizerID !== '') {
                    firebase.database().ref('/organizer/' + this.state.organizerID + '/event/' + this.state.eventID).once('value').then(snapshot => {
                        let event = snapshot.val();
                        if (!event) {
                            // Event not found
                            this.notFoundChild.current.handleOpen();
                            return;
                        }
                        this.setState({ eventName: event['eventData']['name'] }, () => {
                            // Checks whether the user has submitted for this event previously
                            var cookies = getCookie('UserID');
                            var check = false;
                            firebase.database().ref('cookies/' + cookies).once('value').then(snapshot => {
                                let allCookies = snapshot.val();
                                for (var c in allCookies) {
                                    if (c === this.state.eventID) {
                                        check = true;
                                        this.blockChild.current.handleOpen();
                                        return;
                                    }
                                }
                                if (!check) {
                                    this.confirmChild.current.handleOpen();
                                }
                            });
                        });
                    });
                } else {
                    // Event not found
                    this.notFoundChild.current.handleOpen();
                    return;
                }
            });
        });
    }

    handleScan(data) {
        if (data && data.toLowerCase().includes((config.Global.hostURL + "/vote/").toLowerCase())) {
            var id = data.substring(data.indexOf("/vote/") + 6).replace(/\W/g, '');
            this.setState({ eventID: id });
            this.requestConfirm();
        }
    }

    handleText() {
        this.setState({ eventID: this.state.idFieldValue });
        if (this.state.idFieldValue.length > 2) {
            this.requestConfirm();
        }
    }

    handleJoinEvent() {
        //TODO: Join the event
        this.props.handler(this.props.voteViews.RANK, this.state.eventID, this.state.organizerID);
    }

    handleError(err) { }

    keyPress(e) {
        if (e.key === 'Enter') {
            this.handleText();
        }
    }

    render() {
        return (
            <div>
                <NotFound ref={this.notFoundChild} idType={'Event'} id={this.state.eventID} />
                <EntryConfirmation entryName={this.state.eventName} ref={this.confirmChild} handler={this.handleJoinEvent} />
                <BlockJoin entryName={this.state.eventName} idType={'Event'} ref={this.blockChild} />
                <QrReader delay={300} onScan={this.handleScan} onError={this.handleError} style={{ width: '80%', margin: '20px auto 0px' }} />
                <Typography variant='h5' align='center' className="QRText">Scan QR Code or enter Event ID:</Typography>
                <div className="textField">
                    <TextField
                        id="outlined-dense"
                        label="Event ID"
                        margin="dense"
                        variant="outlined"
                        value={this.state.idFieldValue}
                        onKeyDown={this.keyPress}
                        onChange={e => this.setState({ idFieldValue: e.target.value })}
                    />
                </div>
                <div className="submitButtonContainer">
                    <Button variant="contained" color="primary" className="homeButton" onClick={this.handleText}>
                        Join
                    </Button>
                </div>
            </div>
        );
    }
}
