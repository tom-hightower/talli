import React from 'react';
import firebase from '../../../firebase.js';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class EditVoting extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    openVoting = () => {
        const itemsRef = firebase.database().ref('organizer/' + this.props.googleId +
                                                 '/event/' + this.props.event.id + 
                                                 '/eventData/');
        itemsRef.child('startVote').set(new Date().toLocaleString());
        this.handleClose();
    }

    closeVoting = () => {
        const itemsRef = firebase.database().ref('organizer/' + this.props.googleId +
                                                 '/event/' + this.props.event.id + 
                                                 '/eventData/');
        itemsRef.child('endVote').set(new Date().toLocaleString());
        this.handleClose();
    }

    reopenVoting = () => {
        const itemsRef = firebase.database().ref('organizer/' + this.props.googleId +
                                                 '/event/' + this.props.event.id + 
                                                 '/eventData/');
        itemsRef.child('startVote').set(new Date().toLocaleString());
        itemsRef.child('endVote').set('none');
        this.handleClose();
    }

    getVotingState() {
        if (this.props.event.startVote === 'none' || (this.props.event.startVote > new Date().toLocaleString())) { // not open yet
            return 'before';
        } else if (this.props.event.endVote === 'none' || (this.props.event.endVote > new Date().toLocaleString())) { // open
            return 'open';
        } else {
            return 'closed';
        }
    }

    renderOptions() {
        switch(this.getVotingState()) {
            case 'before':
                return (
                    <DialogContent>
                        The voting period has not been opened.<br/><br/>
                        <i>Note: Manually opening voting will override automated start time.</i><br/><br/>
                        <Button variant="contained" onClick={this.openVoting}>Open Voting</Button> 
                    </DialogContent>
                );
            case 'open':
                return (
                    <DialogContent>
                        The voting period is currently open.<br/><br/>
                        <i>Note: Manually closing voting will override automated end time.</i><br/><br/>
                        <Button variant="contained" onClick={this.closeVoting}>Close Voting</Button> 
                    </DialogContent>
                );
            default: // closed
                return (
                    <DialogContent>
                        The voting period has closed.<br/><br/>
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