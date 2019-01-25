import React from 'react';
import QrReader from 'react-qr-reader';
import { TextField, Typography, Button } from '@material-ui/core';
import EntryConfirmation from './EntryConfirmation';
import '../component_style/Voter.css';

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
        this.state = { eventID: '', idFieldValue: '' };
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleJoinEvent = this.handleJoinEvent.bind(this);
        this.keyPress = this.keyPress.bind(this);

        this.confirmChild = React.createRef();
    }

    //TODO: server request to return Event name for given state.eventID
    getNameFromID() {
        return(this.state.eventID);
    }

    requestConfirm = () => {
        this.confirmChild.current.handleOpen();
    }

    handleScan(data) {
        if (data && data.length > 4) {
            this.setState({ eventID: data });
            this.requestConfirm();
        }
    }

    handleText() {
        if (this.state.idFieldValue.length > 5) {
            this.setState({ eventID: this.state.idFieldValue });
            this.requestConfirm();
        }
    }

    handleJoinEvent() {
        //TODO: Join the event
        this.props.handler(this.props.voteViews.RANK);
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
                <EntryConfirmation entryName={this.getNameFromID()} ref={this.confirmChild} handler={this.handleJoinEvent}/>
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