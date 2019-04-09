import React, { Component } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import QrReader from 'react-qr-reader';
import EntryConfirmation from './Dialogs/EntryConfirmation';
import firebase from '../../firebase';
import '../component_style/Voter.css';
import NotFound from './Dialogs/NotFound';
import BlockJoin from './Dialogs/BlockJoin';

const config = require('../../config.json');

/**
 * Entry Add
 */
export default class AddEntryVote extends Component {
    constructor(props) {
        super(props);
        /** ::STATE INFO::
         *  entryID:        Entry's UID, obtained either from QRcode or textfield
         *  idFieldValue:   The value currently in the textbox
         */
        this.state = {
            entryID: '',
            idFieldValue: '',
            entryTitle: ''
        };
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleAddEntry = this.handleAddEntry.bind(this);
        this.keyPress = this.keyPress.bind(this);

        this.confirmChild = React.createRef();
        this.notFoundChild = React.createRef();
        this.blockChild = React.createRef();
    }

    requestConfirm = () => {
        const itemMatch = this.props.rankItems.filter(item => item.id === this.state.entryID);
        if (itemMatch.length > 0) {
            this.setState({ entryTitle: itemMatch[0].name }, () => {
                this.blockChild.current.handleOpen();
            });
            return;
        }
        firebase.database().ref('organizer/').once('value').then((snapshot) => {
            const organizer = snapshot.val();
            const event = organizer[this.props.organizer].event[this.props.eventID];
            const entry = event.entries[this.state.entryID];
            if (!entry) {
                this.notFoundChild.current.handleOpen();
                return;
            }
            this.setState({ entryTitle: entry.title }, () => {
                this.confirmChild.current.handleOpen();
            });
        });
    }

    handleScan(data) {
        if (data
            && data.toLowerCase().includes((`${config.Global.hostURL}/vote/`).toLowerCase())
            && data.indexOf('/', data.indexOf('/vote/') + 6) !== -1
        ) {
            const entrySlash = data.indexOf('/', data.indexOf('/vote/') + 6);
            const id = data.substring(entrySlash).replace(/\W/g, '');
            this.setState({ entryID: id });
            this.requestConfirm();
        }
    }

    handleText() {
        if (this.state.idFieldValue.length > 2) {
            this.setState({ entryID: this.state.idFieldValue }, () => {
                this.requestConfirm();
            });
        }
    }

    handleAddEntry() {
        this.props.handler(this.props.voteViews.RANK, 'na', 'na', this.state.entryID);
    }

    handleGoBack = () => {
        this.props.handler(this.props.voteViews.RANK);
    }

    handleError(err) {
        console.log(err);
    }

    keyPress(e) {
        if (e.key === 'Enter') {
            this.handleText();
        }
    }

    render() {
        return (
            <div>
                <NotFound ref={this.notFoundChild} idType="Entry" id={this.state.entryID} />
                <EntryConfirmation entryName={this.state.entryTitle} ref={this.confirmChild} handler={this.handleAddEntry} />
                <BlockJoin entryName={this.state.entryTitle} idType="Entry" ref={this.blockChild} />
                <QrReader delay={300} onScan={this.handleScan} onError={this.handleError} style={{ width: '80%', margin: '20px auto 0px' }} />
                <Typography variant="h5" align="center" className="QRText">Scan QR Code or enter Entry ID:</Typography>
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
                    <Button variant="contained" color="default" className="goBackButton" onClick={this.handleGoBack}>
                        Back
                    </Button>
                    <Button variant="contained" color="primary" className="confirmButton" onClick={this.handleText}>
                        Add
                    </Button>
                </div>
            </div>
        );
    }
}
