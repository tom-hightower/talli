import React from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class EditEvent extends React.Component {
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
                    <DialogTitle> Edit Event </DialogTitle>
                    <DialogContent>
                        Event Name: {this.props.event.name}
                        <br/>
                        Event ID: {this.props.event.id}
                        <br/> 
                        Location: {this.props.event.location}
                        <br/>
                        Start Date: {this.props.event.startDate}
                        <br/>
                        End Date: {this.props.event.endDate}
                    </DialogContent>
                    <DialogActions>    
                        <Button onClick={this.handleClose} color="primary">Go Back</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}