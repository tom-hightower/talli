import React, { Component } from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import firebase from '../../../firebase';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class EditVoting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    openVoting = () => {
        const itemsRef = firebase.database().ref(
            `organizer/${this.props.googleId}/event/${this.props.event.id}/eventData/`
        );
        itemsRef.child('startVote').set(new Date().toISOString());
        itemsRef.child('endVote').set('none');
        this.handleClose();
    }

    closeVoting = () => {
        const itemsRef = firebase.database().ref(
            `organizer/${this.props.googleId}/event/${this.props.event.id}/eventData/`
        );
        itemsRef.child('endVote').set(new Date().toISOString());
        this.handleClose();
    }

    reopenVoting = () => {
        const itemsRef = firebase.database().ref(
            `organizer/${this.props.googleId}/event/${this.props.event.id}/eventData/`
        );
        itemsRef.child('startVote').set(new Date().toISOString());
        itemsRef.child('endVote').set('none');
        this.handleClose();
    }

    getVotingState() {
        if (this.props.event.startVote === 'none' || (this.props.event.startVote > new Date().toISOString())) { // not open yet
            return 'before';
        }
        if (this.props.event.endVote === 'none' || (this.props.event.endVote > new Date().toISOString())) { // open
            return 'open';
        }
        return 'closed';
    }

    addLeadingZeros(value) {
        let valueStr = String(value);
        while (valueStr.length < 2) {
            valueStr = `0${valueStr}`;
        }
        return valueStr;
    }

    parseDate(isoDate) {
        const dateString = `${isoDate.substring(5, 7)}/${isoDate.substring(8, 10)}/${isoDate.substring(0, 4)}`;
        return dateString;
    }

    parseTime(isoDate) {
        const date = new Date(isoDate);
        const timeString = `${date.getHours()}:${this.addLeadingZeros(date.getMinutes())} UTC-${date.toString().slice(29, 33)}`;
        return timeString;
    }

    renderOptions() {
        switch (this.getVotingState()) {
            case 'before':
                return (
                    <DialogContent>
                        The voting period has not been opened.<br /><br />
                        Automated voting period {this.props.event.automate ? 'is' : 'is not'} enabled. <br />
                        {this.props.event.automate ? (
                            <div>
                                Voting will open on {
                                    this.parseDate(this.props.event.startVote)
                                } at {
                                    this.parseTime(this.props.event.startVote)
                                }
                                <br />
                                <br />
                            </div>
                        ) : ('')}
                        <i>Note: Manually opening voting will override automated start time.</i>
                        <br /><br />
                        <Button variant="contained" onClick={this.openVoting}>Open Voting</Button>
                    </DialogContent>
                );
            case 'open':
                return (
                    <DialogContent>
                        The voting period is currently open.
                        <br />
                        <br />
                        Automated voting period {this.props.event.automate ? 'is' : 'is not'} enabled.
                        <br />
                        {this.props.event.automate ? (
                            <div>
                                Voting will close on {
                                    this.parseDate(this.props.event.endVote)
                                } at {
                                    this.parseTime(this.props.event.endVote)
                                }
                                <br />
                                <br />
                            </div>
                        ) : ('')}
                        <i>Note: Manually closing voting will override automated end time.</i>
                        <br />
                        <br />
                        <Button variant="contained" onClick={this.closeVoting}>Close Voting</Button>
                    </DialogContent>
                );
            default: // closed
                return (
                    <DialogContent>
                        The voting period has closed.
                        <br />
                        <br />
                        <Button variant="contained" onClick={this.reopenVoting}>Re-Open Voting</Button>
                    </DialogContent>
                );
        }
    }

    render() {
        return !this.state.open ? null : (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle> Open/Close Voting </DialogTitle>
                    {this.renderOptions()}
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Go Back</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
