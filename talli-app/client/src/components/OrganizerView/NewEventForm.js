import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker, DatePicker } from 'material-ui-pickers';
import { Typography, TextField, InputAdornment, Button, FormControlLabel, Switch } from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/DateRange';
import '../component_style/NewEventForm.css';
import '../component_style/Organizer.css';
import firebase from '../../firebase.js';

export default class NewEventForm extends React.Component {
    state = {
        eventData: {
            name: '',
            id: '',
            location: '',
            startDate: new Date(),
            endDate: new Date(),
            automate: false,
            startVote: undefined,
            endVote: undefined,
        }
    }

    // Sends form data to Firebase and navigates to the next page
    AddEntries = (event) => {
        let item = this.state.eventData;
        if (!item.id) {
            item.id = Math.floor((Math.random() * 10000) + 1);
        }
        let googleId = this.props.user.googleId;

        const ref = firebase.database().ref('event')
        ref.once('value', (snapshot) => {
            var idExists = false;
            snapshot.forEach((childSnapshot) => {
                if(childSnapshot.key === item.id) {
                    idExists = true;
                }
            });
            while(idExists === true) {
                idExists = false;
                item.id = Math.floor((Math.random() * 10000) + 1);
                snapshot.forEach((childSnapshot) => {
                    if(childSnapshot.key === item.id) {
                        idExists = true;
                    }
                });
            }
            
            ref.child(item.id).set({'organizer': googleId});

            const itemsRef = firebase.database().ref('organizer/' + googleId + '/event/' + item.id);
            item.startDate = item.startDate.toLocaleString();
            item.endDate = item.endDate.toLocaleString();
            if (item.automate) {
                item.startVote = item.startVote.toLocaleString();
                item.endVote = item.endVote.toLocaleString();
            } else {
                item.startVote = 'none';
                item.endVote = 'none';
            }
            itemsRef.child('eventData').set(item);
            this.props.setEvent(item.id);
            this.props.handler(this.props.orgViews.ADD);
        });
    }

    toggleAutomation = () => {
        var oldData = this.state.eventData;
        oldData.automate = !this.state.eventData.automate;
        this.setState({
            eventData: oldData,
        });
    }

    handleEventChange = field => event => {
        var oldData = this.state.eventData;
        oldData[field] = event.target.value;
        this.setState({
            eventData: oldData,
        });
    }

    handleDateChange = field => date => {
        var oldData = this.state.eventData;
        oldData[field] = date;
        this.setState({
            eventData: oldData,
        });
    }

    cancelAddition = () => {
        this.props.handler(this.props.orgViews.MAIN);
    }

    render() {
        /**
         * TODO: Cleanup this div and replace <input/>'s
         */
        return (
            <div className='newEventForm'>
                <Typography variant='h4' align='center' gutterBottom>Create a new event</Typography>
                <form className='eventForm' onSubmit={this.AddEntries}>
                    <Typography variant='h6'>Event Details</Typography>
                    <TextField
                        required
                        label="Event Name"
                        margin="dense"
                        className="entryFormText"
                        value={this.state.eventData.name}
                        onChange={this.handleEventChange('name')}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="ID (auto if blank)"
                        margin="dense"
                        className="entryFormText"
                        value={this.state.eventData.id}
                        onChange={this.handleEventChange('id')}
                        InputLabelProps={{ shrink: true }}
                    />
                    <br />
                    <TextField
                        required
                        label="Location"
                        margin="dense"
                        className="entryFormText"
                        value={this.state.eventData.location}
                        onChange={this.handleEventChange('location')}
                        InputLabelProps={{ shrink: true }}
                    />
                    <br /> <br />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            required
                            label="Start Date"
                            margin="dense"
                            className="entryFormText"
                            value={this.state.eventData.startDate}
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
                            value={this.state.eventData.endDate}
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
                    <br /> <br />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.eventData.automate}
                                onChange={() => this.toggleAutomation()}
                                value={this.state.eventData.automate}
                                color="primary"
                            />
                        }
                        label="Automate Voting Time Period?"
                        labelPlacement="start"
                    />
                    {this.state.eventData.automate &&
                        <div>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Typography className="votePeriodText">Start Voting:</Typography>
                                <DateTimePicker
                                    margin="dense"
                                    className="entryFormText"
                                    value={this.state.eventData.startVote ? this.state.eventData.startVote : new Date()}
                                    onChange={this.handleDateChange('startVote')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Typography className="votePeriodText">End Voting:</Typography>
                                <DateTimePicker
                                    margin="dense"
                                    className="entryFormText"
                                    value={this.state.eventData.endVote ? this.state.eventData.endVote : new Date()}
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
                    }
                    <br /> <br />
                    <Button
                        variant="contained"
                        className="buttons"
                        type="button"
                        onClick={this.cancelAddition}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        className="buttons"
                        type="submit"
                        color="primary"
                    >
                        Next
                    </Button>
                </form>
            </div>
        );
    }
}