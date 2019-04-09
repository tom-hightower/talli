import React, { Component } from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

// maybe for future, have it load current weights into text fields
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
                        You may want to double check the URL you posted for correctness and format.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="default">Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
