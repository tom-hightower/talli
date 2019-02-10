import React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import QrReader from 'react-qr-reader';
import EntryConfirmation from './EntryConfirmation';
import '../component_style/Voter.css';
var config = require('../../config.json');

/**
 * Entry Add, unimplemented
 */
export default class AddEntryVote extends React.Component {
    constructor(props) {
        super(props);
        /** ::STATE INFO::
         *  entryID:        Entry's UID, obtained either from QRcode or textfield
         *  idFieldValue:   The value currently in the textbox
         */
        this.state = { entryID: '', idFieldValue: '' };
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleAddEntry = this.handleAddEntry.bind(this);
        this.keyPress = this.keyPress.bind(this);

        this.confirmChild = React.createRef();
    }

    //TODO: server request to return Entry name for given state.entryID
    getNameFromID() {
        return(this.state.entryID);
    }

    requestConfirm = () => {
        this.confirmChild.current.handleOpen();
    }

    handleScan(data) {
        if (data && data.toLowerCase().includes(config.Global.entryQRPrefix)) {
            var id = data.substring(data.indexOf(config.Global.entryQRPrefix) + 7).replace(/\W/g,'');
            this.setState({ entryID: id });
            this.requestConfirm();
        }
    }

    handleText() {
        if (this.state.idFieldValue.length > 5) {
            this.setState({ entryID: this.state.idFieldValue });
            this.requestConfirm();
        }
    }

    handleAddEntry() {
        //TODO: Add the Entry and return to ranking
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
                <EntryConfirmation entryName={this.getNameFromID()} ref={this.confirmChild} handler={this.handleAddEntry}/>
                <QrReader delay={300} onScan={this.handleScan} onError={this.handleError} style={{ width: '80%', margin: '20px auto 0px'}} />
                <Typography variant='h5' align='center' className="QRText">Scan QR Code or enter Entry ID:</Typography>
                <div className="textField">
                    <TextField 
                        id="outlined-dense" 
                        label="Entry ID" 
                        margin="dense" 
                        variant="outlined" 
                        value={this.state.idFieldValue} 
                        onKeyPress={this.keyPress}
                        onChange={e => this.setState({ idFieldValue: e.target.value })}
                    />
                </div>
                <div className="submitButtonContainer">
                    <Button variant="contained" color="default" className="homeButton" onClick={this.handleText}>
                        Add
                    </Button>
                </div>
            </div>
        );
    }
}