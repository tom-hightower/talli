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
        weights: {
            current: [
                1, 1, 1
            ],
            changed: [
                1, 1, 1
            ],
        }
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    }

    handleSave = () => {
        let newWeights = this.state.weights.changed;
        this.setState({ 
            open: false,
            weights: {
                current: newWeights,
                changed: newWeights
            } 
        }, () => {
            socket.emit('send_weights', {
                weights: this.state.weights.current,
                eventId: this.props.event.id,
                googleId: this.props.googleId
            });
        });
        
    };

    handleWeightChange = index => event => {
        let newWeights = this.state.weights.changed;
        newWeights[index] = event.target.value;
        this.setState({
            weights: {
                current: this.state.weights.current,
                changed: newWeights,
            }
        });
    }

    render() {
        return !this.state.open ? null : (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle> Edit Weights </DialogTitle>
                    <DialogContent>
                        {
                            this.state.weights.changed.map((weight, index) => {
                                return (
                                    <div>
                                        <TextField label={'Rank ' + (index + 1)} margin='dense' value={weight} onChange={this.handleWeightChange(index)} />
                                    </div>
                                )
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