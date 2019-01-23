import React from 'react';
import QrReader from 'react-qr-reader';
import { TextField, Typography } from '@material-ui/core';
import '../component_style/Voter.css';

/**
 * Join Event via QR Code or UID, unimplemented
 */
export default class JoinEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { eventID: '' };
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleJoinEvent = this.handleJoinEvent.bind(this);
    }

    handleScan(data) {
        if (data && data.length > 4) {
            this.setState({ eventID: data });
            this.handleJoinEvent();
        }
    }

    handleText(event) {
        event.persist();
        if (event.target && event.target.value.length > 5) {
            this.setState({ eventID: event.target.value });
            this.handleJoinEvent();
        }
    }

    handleJoinEvent() {
        // Join the event
        this.props.handler(this.props.voteViews.RANK);
    }

    handleError(err) {}

    render() {
        return(
            <div>
                <QrReader delay={300} onScan={this.handleScan} onError={this.handleError} style={{ width: '80%', margin: '20px auto 0px'}} />
                <Typography variant='h5' align='center' className="QRText">Scan QR Code or enter Event ID:</Typography>
                <div className="textField">
                    <TextField id="outlined-dense" label="Event ID" margin="dense" variant="outlined" onChange={this.handleText}/>
                </div>
            </div>
        );
    }
}