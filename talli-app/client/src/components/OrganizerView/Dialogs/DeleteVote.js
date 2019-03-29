import React from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class DeleteVote extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true, });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle> Delete Vote Instruction</DialogTitle>
                    <DialogContent>
                        <p>To delete a submission, right click on the row number in the left most column, and click "delete row" in spreadsheet.</ p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">go back</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}