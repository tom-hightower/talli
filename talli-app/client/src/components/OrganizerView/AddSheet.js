import React, { Component } from 'react';
import { TextField, Typography, Button } from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import ShowError from './Dialogs/ShowError';

import openSocket from 'socket.io-client';

import '../component_style/AddSheet.css';

const config = require('../../config.json');

const socket = openSocket(
    (config.Global.devMode ?
        `http://localhost:${config.Global.serverPort}` :
        `${(config.Global.sslEnabled ? "https" : "http")}://${config.Global.hostURL}:${config.Global.serverPort}`
    )
);

export default class NewEntryForm extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            sheetURL: "",
            urlConfirm: false,
        };
        this.errorChild = React.createRef();
    }

    componentDidMount() {
        socket.on('error', (data) => {
            console.log(data.error);
            this.handleError(data.error);
        });

        socket.on('url_confirm', () => {
            this.setState({
                sheetURL: this.state.sheetURL,
                urlConfirm: true,
            }, () => {
                this.props.handler(this.props.orgViews.VIEW);
            });
        });
    }

    handleError = (message) => {
        this.errorChild.current.handleOpen(message);
        if (message === "Could not get sheet information" || message === "Error with sheet authentication") {
            this.setState({
                sheetURL: this.state.sheetURL,
                urlConfirm: false,
            });
        }
    }

    handleSkip = () => {
        console.log('skipped');
        this.props.handler(this.props.orgViews.VIEW);
    }

    handleSubmit = (e) => {
        // url check and next page if successful
        e.preventDefault();
        socket.emit('send_url', {
            url: this.state.sheetURL,
            googleId: this.props.user.googleId,
            eventId: this.props.curEvent
        });
    }

    keyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleURLChange = (e) => {
        let newURL = e.target.value;
        this.setState({
            sheetURL: newURL,
            urlConfirm: this.state.urlConfirm
        });
    }

    render() {
        return (
            <div className="main">
                <div>
                    <ShowError ref={this.errorChild} />
                </div>
                <div className="addSheet">
                    <Typography variant="h4">Set Up Your Results</Typography>
                    <div className="instructions">
                        <Typography id="itemTitle" variant="h5">Google Sheet Export</Typography>
                        <div>1. Create a Google Sheet in your desired location</div>
                        <div>
                            2. Share the spreadsheet with editing rights with:
                        <br />
                            <div className="main">
                                <b>talli-455@talli-229017.iam.gserviceaccount.com</b>
                            </div>
                        </div>
                        <div>
                            3. Grab the spreadsheet&apos;s URL and paste it here:
                            <div className="main">
                                <div className="urlField">
                                    <TextField
                                        id="standard-dense"
                                        label="Spreadsheet URL"
                                        margin="dense"
                                        className="sheetURL"
                                        value={this.state.sheetURL}
                                        onKeyDown={this.keyPress}
                                        onChange={this.handleURLChange}
                                    />
                                    {
                                        this.state.urlConfirm &&
                                        <CheckCircle id="checkmark" color="primary" />
                                    }
                                    <br />
                                </div>
                                <Button variant="contained" size="small" color="default" onClick={this.handleSubmit}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button variant="contained" color="default" className="buttons" onClick={this.handleSkip}>Skip</Button>
                </div>
            </div>
            
        );
    }
}
