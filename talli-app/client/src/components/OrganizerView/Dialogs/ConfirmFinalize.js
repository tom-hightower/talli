import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class ConfirmFinalize extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
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
                        Finalize Results
                    </DialogTitle>
                    <DialogContent>
                        Finalizing results will send all ballots (including manually entered and unsubmitted ballots) to the
                        linked google sheet as well as close the event voting if it is currently open.
                        If you only wanted to sync submitted entries, please cancel this dialog and choose the "Sync Entries"
                        option.
                        <br />
                        Are you sure you want to finalize results?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Go Back</Button>
                        <Button onClick={this.handleConfirm} color="primary">Confirm</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}