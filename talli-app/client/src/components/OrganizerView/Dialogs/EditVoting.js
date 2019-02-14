import React from 'react';
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

    render() {
        return !this.state.open ? null : (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle> Open/Close Voting </DialogTitle>
                    {
                        this.props.event.automate &&
                        <DialogContent>Voting is automated.</DialogContent>

                    }
                    {
                        !this.props.event.automate &&
                        <DialogContent>Voting is not automated.</DialogContent>
                    }
                    <DialogActions>    
                        <Button onClick={this.handleClose} color="primary">Go Back</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}