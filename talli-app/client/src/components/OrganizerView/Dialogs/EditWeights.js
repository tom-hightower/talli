import React, { Component } from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel } from '@material-ui/core';
import openSocket from 'socket.io-client';

const config = require('../../../config.json');

const socket = openSocket(
    (config.Global.devMode ?
        `http://localhost:${config.Global.serverPort}` :
        `${(config.Global.sslEnabled ? "https" : "http")}://${config.Global.hostURL}:${config.Global.serverPort}`
    )
);

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

// maybe for future, have it load current weights into text fields
export default class EditWeights extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            weights: [
                '', '', ''
            ]
        };
    }

    componentWillReceiveProps() {
        if (this.props.event.weights) {
            this.setState({
                open: this.state.open,
                weights: [
                    this.props.event.weights['first'],
                    this.props.event.weights['second'],
                    this.props.event.weights['third']
                ]
            });
        }
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleSave = () => {
        const weights = this.state.weights;
        if (weights[0] !== '' && weights[1] !== '' && weights[2] !== '') {
            socket.emit('send_weights', {
                weights: this.state.weights,
                eventId: this.props.event.id,
                googleId: this.props.googleId
            });
        }
        this.setState({ open: false });
    }

    handleWeightChange = index => event => {
        const curr = this.state.weights;
        curr[index] = event.target.value;
        this.setState({
            weights: curr
        });
    }

    render() {
        return !this.state.open ? null : (
            <div>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    onClose={this.handleClose}
                >
                    <DialogTitle> Edit Weights </DialogTitle>
                    <DialogContent>
                        {
                            this.state.weights.map((weight, index) => {
                                return (
                                    <div>
                                        <TextField
                                            label={`Rank ${(index + 1)}`}
                                            margin="dense"
                                            value={weight}
                                            onChange={this.handleWeightChange(index)}
                                        />
                                    </div>
                                );
                            })
                        }
                    </DialogContent>
                    <DialogActions>
                        {/* Not sure how to make the close button align to the left */}
                        <Button onClick={this.handleClose} color="default">Close</Button>
                        <Button onClick={this.handleSave} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
