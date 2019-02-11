import React from 'react';
import QrReader from 'react-qr-reader';
import { TextField, Typography, Button } from '@material-ui/core';
import EntryConfirmation from './EntryConfirmation';
import '../component_style/Voter.css';
import firebase from '../../firebase';
var config = require('../../config.json');

/**
 * Join Event via QR Code or UID, unimplemented
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
    }

    requestConfirm = () => {
        var query = firebase.database().ref('event/');
        query.on('value', (snapshot) => {
            let org = snapshot.val();
            let orgID = org[this.state.eventID]['organizer']['id'];
            this.setState({ organizerID: orgID });
        });
        var query2 = firebase.database().ref('organizer/');
        query2.on('value', (snapshot) => {
            let organizer = snapshot.val();
            let event = organizer[this.state.organizerID]['event'][this.state.eventID];
            if (!event) {
                // TODO: Event not found
                this.setState({ eventName: 'ERROR' });
                return;
            }
            this.setState({ eventName: event['eventData']['name']});
        });
        this.confirmChild.current.handleOpen();
    }

    handleScan(data) {
        if (data && data.toLowerCase().includes((config.Global.hostURL + "/vote/").toLowerCase())) {
            var id = data.substring(data.indexOf("/vote/") + 6).replace(/\W/g,'');
            this.setState({ eventID: id });
            this.requestConfirm();
        }
    }

    handleText() {
        if (this.state.idFieldValue.length > 2) {
            this.setState({ eventID: this.state.idFieldValue });
            this.requestConfirm();
        }
    }

    handleJoinEvent() {
        //TODO: Join the event
        this.props.handler(this.props.voteViews.RANK, this.state.eventID, this.state.organizerID);
    }

    handleError(err) {}

    keyPress(e) {
        if(e.key === 'Enter') {
            this.handleText();
        }
    }

    render() {
        return(
            <div>
                <EntryConfirmation entryName={this.state.eventName} ref={this.confirmChild} handler={this.handleJoinEvent}/>
                <QrReader delay={300} onScan={this.handleScan} onError={this.handleError} style={{ width: '80%', margin: '20px auto 0px'}} />
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
                    <Button variant="contained" color="default" className="homeButton" onClick={this.handleText}>
                        Join
                    </Button>
                </div>
            </div>
        );
    }
}