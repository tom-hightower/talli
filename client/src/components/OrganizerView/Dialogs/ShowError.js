import React, { Component } from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class ShowError extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: '',
        };
    }

    handleOpen = (message) => {
        this.setState({
            open: true,
            message,
        });
    }

    handleClose = () => {
        this.setState({
            open: false,
            message: '',
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
                    <DialogTitle> Error </DialogTitle>
                    <DialogContent>
                        Error message received:
                        <br />
                        <br />
                        <b>{this.state.message}</b>
                        <br />
                        <br />
                        Make sure that:
                        <br />
                        <br />
                        1. The URL you posted is correct
                        <br />
                        2. The spreadsheet is shared with the correct email, giving it editing permissions.
                        <br />
                        <br />
                        Re-read the spreadsheet setup instructions for more details.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="default">Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
