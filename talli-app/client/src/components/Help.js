import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

/**
 * Help view
 */
export default class HelpView extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return(
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle>
                        Help/About
                    </DialogTitle>
                    <DialogContent>
                        <b>Help:</b>
                        Choose to vote as an event attendee or login to the event organizer dashboard to begin.
                        <br />
                        <b>About:</b>
                        Talli is a portable voting platform for events that let attendees vote on entries.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}