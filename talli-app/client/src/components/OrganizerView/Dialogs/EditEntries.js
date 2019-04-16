import React, { Component } from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import firebase from '../../../firebase';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class EditEntries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            title: '',
            id: '',
            presenters: '',
            entry_dates: '',
            info_url: '',
        };
    }

    handleOpen = (entryID) => {
        this.setState({
            open: true,
            title: this.props.event.entries[entryID].title,
            id: entryID,
            presenters: this.props.event.entries[entryID].presenters,
            entry_dates: this.props.event.entries[entryID].entry_dates,
            info_url: this.props.event.entries[entryID].info_url,
        });
    }

    handleDelete = () => {
        this.setState({ open: false });
        const itemsRef = firebase.database().ref(
            `organizer/${this.props.googleId}/event/${this.props.event.id}/entries/${this.state.id}`
        );
        itemsRef.remove();
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleSaveClose = () => {
        this.setState({ open: false });
        const itemsRef = firebase.database().ref(
            `organizer/${this.props.googleId}/event/${this.props.event.id}/entries/${this.state.id}`
        );
        itemsRef.child('title').set(this.state.title);
        itemsRef.child('presenters').set(this.state.presenters);
        itemsRef.child('entry_dates').set(this.state.entry_dates);
        itemsRef.child('info_url').set(this.state.info_url);
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
                        <TextField
                            label="Entry Info URL"
                            margin="dense"
                            className="entryFormText"
                            defaultValue={this.state.info_url}
                            onChange={this.handleChange('info_url')}
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
