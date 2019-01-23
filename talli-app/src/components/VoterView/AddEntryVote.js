import React from 'react';
import { Typography, TextField } from '@material-ui/core';
import QrReader from 'react-qr-reader';
import '../component_style/Voter.css';

/**
 * Entry Add, unimplemented
 */
export default class AddEntryVote extends React.Component {
    constructor(props) {
        super(props);
        this.state = { entryID: '' };
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleAddEntry = this.handleAddEntry.bind(this);
    }

    handleScan(data) {
        if (data && data.length > 4) {
            this.setState({ entryID: data });
            this.handleAddEntry();
        }
    }

    handleText(event) {
        event.persist();
        if (event.target && event.target.value.length > 5) {
            this.setState({ entryID: event.target.value });
            this.handleAddEntry();
        }
    }

    handleAddEntry() {
        // Add the Entry and return to ranking
        this.props.handler(this.props.voteViews.RANK);
    }

    handleError(err) {}

    render() {
        return(
            <div>
                <QrReader delay={300} onScan={this.handleScan} onError={this.handleError} style={{ width: '80%', margin: '20px auto 0px'}} />
                <Typography variant='h5' align='center' className="QRText">Scan QR Code or enter Entry ID:</Typography>
                <div className="textField">
                    <TextField id="outlined-dense" label="Entry ID" margin="dense" variant="outlined" onChange={this.handleText}/>
                </div>
            </div>
        );
    }
}