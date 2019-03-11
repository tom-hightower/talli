import React from 'react';
import { Button, Slide, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import '../../component_style/Voter.css';
import { getCookie } from '../../../cookies.js'
import firebase from '../../../firebase.js';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

/**
 * Confirm that the attendee wants to submit, unimplemented
 */
export default class SubmitConfirm extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    SubmitRankings() {
        // TODO: Handle Ranking submission and flagging UID as submitted here
        // Ranked entries are contained in this.props.items
        const cookie = getCookie('UserID');
        const itemsRef = firebase.database().ref(`attendees/${cookie}`);
        itemsRef.child("currentEvent").set('');
        itemsRef.child(`pastEvents/${this.props.eventID}/`).set(this.props.eventID);
        this.props.handler();
    }

    render() {
        return (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle>
                        Confirm Submission
                    </DialogTitle>
                    <DialogContent>
                        You may only submit your rankings for this event <b>once.</b>
                        <br /><br />
                        Would you like to continue?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Go Back</Button>
                        <Button onClick={() => this.SubmitRankings()} color="primary">Confirm</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
