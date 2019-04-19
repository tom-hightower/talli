import React, { Component } from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@material-ui/core';


function Transition(props) {
    return <Slide direction='up' {...props} />;
}

// maybe for future, have it load current weights into text fields
export default class SheetDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    render() {
        return !this.state.open ? null : (
            <div>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    onClose={this.handleClose}
                >
                    <DialogTitle> Google Sheet Setup </DialogTitle>
                    <DialogContent>
                        <Typography color="error">Follow these steps in order</Typography>
                        <br />
                        <Typography>1. Create a new Google Sheet in a desired location in your drive</Typography>
                        <Typography>2. Share the spreadsheet with editing rights with:</Typography>
                        <Typography align="center"><b>talli-455@talli-229017.iam.gserviceaccount.com</b></Typography>
                        <Typography>3. Copy and paste the entire URL of the spreadsheet into the text field</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="default">Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
