import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';
import firebase from '../../../firebase';
import { getCookie } from '../../../cookies';

function Transition(props) {
    return (<Slide direction="up" {...props} />);
  }

export default class RejoinEvent extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        const cookie = getCookie('UserID');
        firebase.database().ref(`attendees/${cookie}/currentEvent`).set('');
        this.setState({ open: false });
    };

    handleConfirm = () => {
        this.setState({ open: false });
        this.props.handler();
    };

    render() {
        return (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle>
                        Current Event
                    </DialogTitle>
                    <DialogContent>
                        You are currently signed in to:
                        <br />
                        <b>{this.props.entryName}</b>
                        <br />
                        Would you like to rejoin?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>No</Button>
                        <Button onClick={this.handleConfirm} color="primary">Yes</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
