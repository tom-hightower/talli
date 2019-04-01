import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class RejoinClosed extends Component {
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

    render() {
        return (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle>
                        Alerts
                    </DialogTitle>
                    <DialogContent>
                        The event you were participating in, <b>{this.props.eventName}</b>, has closed.
                        Your vote has been automatically submitted.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Go Back</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
