import React from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import firebase from '../../../firebase.js';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class EditEntries extends React.Component {
    state = {
        open: false,
        title: '',
        id: '',
        presenters: '',
        entry_dates: ''
    };

    handleOpen = (entryID) => {
        this.setState({ 
            open: true, 
            title: this.props.event.entries[entryID]['title'],
            id: entryID,
            presenters: this.props.event.entries[entryID]['presenters'],
            entry_dates: this.props.event.entries[entryID]['entry_dates']
        });
    };

    handleDelete = () => {
        this.setState({ open: false });
        const itemsRef = firebase.database().ref('organizer/' + this.props.googleId +
                                                 '/event/' + this.props.event.id + 
                                                 '/entries/' + this.state.id);
        itemsRef.remove();
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleSaveClose = () => {
        this.setState({ open: false });
        const itemsRef = firebase.database().ref('organizer/' + this.props.googleId +
                                                 '/event/' + this.props.event.id + 
                                                 '/entries/' + this.state.id);
        itemsRef.child('title').set(this.state.title);
        itemsRef.child('presenters').set(this.state.presenters);
        itemsRef.child('entry_dates').set(this.state.entry_dates);
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    }

    render() {
        return !this.state.open ? null : (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle> View/Edit Entry </DialogTitle>
                    <DialogContent>
                        <TextField
                            required
                            label="Entry Title"
                            margin="dense"
                            className="entryFormText"
                            defaultValue={this.state.title}
                            onChange={this.handleChange('title')}
                        />
                        <TextField
                            disabled
                            label="ID (cannot be changed)"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.id}
                        />
                        <br />
                        <TextField
                            required
                            label="Presenters"
                            margin="dense"
                            className="entryFormText"
                            defaultValue={this.state.presenters}
                            onChange={this.handleChange('presenters')}
                        />
                        <TextField
                            required
                            label="Date(s) Attending"
                            margin="dense"
                            className="entryFormText"
                            defaultValue={this.state.entry_dates}
                            onChange={this.handleChange('entry_dates')}
                        />
                    </DialogContent>
                    <DialogActions>    
                        <Button onClick={this.handleDelete}>Delete</Button>
                        <Button onClick={this.handleClose}>Cancel</Button>
                        <Button onClick={this.handleSaveClose} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}