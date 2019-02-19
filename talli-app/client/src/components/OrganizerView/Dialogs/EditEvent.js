import React from 'react';
import { Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputAdornment, FormControlLabel, Switch } from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/DateRange';
import { MuiPickersUtilsProvider, DatePicker, DateTimePicker } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import firebase from '../../../firebase';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class EditEvent extends React.Component {
    state = {
        open: false,
        name: '',
        location: '',
        startDate: '',
        endDate: '',
        automate: false,
        startVote: '',
        endVote: '',
    };

    handleOpen = () => {
        this.setState({
            open: true,
            name: this.props.event.name,
            location: this.props.event.location,
            startDate: this.props.event.startDate,
            endDate: this.props.event.endDate,
            automate: this.props.event.automate,
            startVote: this.props.event.startVote,
            endVote: this.props.event.endVote,
        });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSaveClose = () => {
        this.setState({ open: false });
        const itemsRef = firebase.database().ref(
            `organizer/${this.props.googleId}/event/${this.props.event.id}/eventData/`
        );
        const item = this.state;
        itemsRef.child('name').set(item.name);
        itemsRef.child('location').set(item.location);
        itemsRef.child('automate').set(item.automate);
        if (item.startDate !== this.props.event.startDate) {
            itemsRef.child('startDate').set(item.startDate.toISOString());
        }
        if (item.endDate !== this.props.event.endDate) {
            itemsRef.child('endDate').set(item.endDate.toISOString());
        }
        if (item.automate) {
            if (item.startVote !== this.props.event.startVote) {
                itemsRef.child('startVote').set(item.startVote.toISOString());
            }
            if (item.endVote !== this.props.event.endVote) {
                itemsRef.child('endVote').set(item.endVote.toISOString());
            }
        } else {
            itemsRef.child('startVote').set('none');
            itemsRef.child('endVote').set('none');
        }
    }

    handleChange = field => event => {
        this.setState({
            [field]: event.target.value,
        });
    }

    handleDateChange = field => date => {
        this.setState({
            [field]: date,
        });
    }

    toggleAutomation = () => {
        this.setState(prevState => ({
            automate: !prevState.automate,
        }));
    }

    render() {
        return !this.state.open ? null : (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle> Edit Event </DialogTitle>
                    <DialogContent>
                        <TextField
                            required
                            label="Event Name"
                            margin="dense"
                            className="entryFormText"
                            defaultValue={this.state.name}
                            onChange={this.handleChange('name')}
                        />
                        <TextField
                            disabled
                            label="ID (cannot be changed)"
                            margin="dense"
                            className="entryFormText"
                            value={this.props.event.id}
                        />
                        <br />
                        <TextField
                            required
                            label="Location"
                            margin="dense"
                            className="entryFormText"
                            defaultValue={this.state.location}
                            onChange={this.handleChange('location')}
                        />
                        <br />
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                required
                                label="Start Date"
                                margin="dense"
                                className="entryFormText"
                                value={this.state.startDate}
                                onChange={this.handleDateChange('startDate')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <DatePicker
                                required
                                label="End Date"
                                margin="dense"
                                className="entryFormText"
                                value={this.state.endDate}
                                onChange={this.handleDateChange('endDate')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <br />
                        <FormControlLabel
                            control={(
                                <Switch
                                    checked={this.state.automate}
                                    onChange={() => this.toggleAutomation()}
                                    value={this.state.automate}
                                    color="primary"
                                />
                            )}
                            label="Automate Voting Time Period?"
                            labelPlacement="start"
                        />
                        {this.state.automate && (
                            <div>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        margin="dense"
                                        className="entryFormText"
                                        label="Start Voting"
                                        value={this.state.startVote ? this.state.startVote : new Date()}
                                        onChange={this.handleDateChange('startVote')}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <DateTimePicker
                                        margin="dense"
                                        className="entryFormText"
                                        label="End Voting"
                                        value={this.state.endVote ? this.state.endVote : new Date()}
                                        onChange={this.handleDateChange('endVote')}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Go Back</Button>
                        <Button onClick={this.handleSaveClose} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}