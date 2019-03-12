import React from 'react';
// import firebase from '../../../firebase.js';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:5000');

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class EditWeights extends React.Component {
    state = {
        open: false,
        weights: [
            1, 1, 1
        ],
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
        // send weights to DB
        socket.emit('send_weights', {
            weights: this.state.weights,
            eventId: this.props.event.id,
            googleId: this.props.googleId
        });
    };

    handleWeightChange = index => event => {
        console.log(event.target.value);
        let newWeights = this.state.weights;
        newWeights[index] = event.target.value;
        this.setState({
            weights: newWeights,
        });
    }

    render() {
        return !this.state.open ? null : (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle> Edit Weights </DialogTitle>
                    <DialogContent>
                        {
                            this.state.weights.map((weight, index) => {
                                return (
                                    <div>
                                        <TextField label={'Rank ' + (index + 1)} margin='dense' value={weight} onChange={this.handleWeightChange(index)} />
                                    </div>
                                )
                            })
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}