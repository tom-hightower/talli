import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { Typography, TextField, InputAdornment, Button } from '@material-ui/core';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import CalendarIcon from '@material-ui/icons/DateRange';
import '../component_style/NewEventForm.css';

var blankEvent = {
    name: '',
    id: '',
    location: '',
    startDate: Date('0000-01-01T00:00:00'),
    endDate: Date('0000-01-01T00:00:00'),
    automate: false,
    startVote: Date('0000-01-01T00:00:00'),
    endVote: Date('0000-01-01T00:00:00'),
}

export default class NewEventForm extends React.Component {
    state = {
        automateTime: false,
        eventData: blankEvent
    }

    toggleTime = () => {
        this.setState({
            automateTime: !this.state.automateTime
        });
    }

    AddEntries() {
        this.props.handler(this.props.orgViews.ADD);
        /* unimplemented */
    }

    handleEventChange = name => event => {
        this.setState({
            eventData: { [name]: event.target.value, }
        });
    };

    handleDateChange = name => date => {
        this.setState({
            eventData: { [name]: date, }
        });
    }

    render() {
        /**
         * TODO: Cleanup this div and replace <input/>'s
         */
        return (
            <div className='newEventForm'>
                <Typography variant='h4' align='center' gutterBottom>Create a new event</Typography>
                <form className='eventForm' onSubmit={() => this.AddEntries()}>
                    <Typography variant='h6'>Event Details</Typography>
                    <TextField
                        required
                        label="Event Name"
                        margin="dense"
                        className="entryFormText"
                        value={this.state.eventData.name}
                        onChange={this.handleEventChange('name')}
                    />
                    <TextField
                        label="ID (auto if blank)"
                        margin="dense"
                        className="entryFormText"
                        value={this.state.eventData.id}
                        onChange={this.handleEventChange('id')}
                    />
                    <br />
                    <TextField
                        required
                        label="Location"
                        margin="dense"
                        className="entryFormText"
                        value={this.state.eventData.location}
                        onChange={this.handleEventChange('location')}
                    />
                    <br /> <br />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            margin="dense"
                            className="entryFormText"
                            label="Start Date"
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
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            margin="dense"
                            className="entryFormText"
                            label="End Date"
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
                    <Typography variant='h6'>
                        Automate Voting Time Period?&emsp;
                        <input type='checkbox' name='event_automate_time' id='event_automate_time' onClick={this.toggleTime} />
                    </Typography>
                    <Typography className="votePeriodText">Start Voting:</Typography>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            margin="dense"
                            className="entryFormText"
                            label="Date"
                            value={this.state.eventData.startVote}
                            onChange={this.handleDateChange('startVote')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TimePicker
                            margin="dense"
                            className="entryFormText"
                            label="Time"
                            value={this.state.eventData.startVote}
                            onChange={this.handleDateChange('startVote')}
                        />
                    </MuiPickersUtilsProvider>
                    <Typography className="votePeriodText">End Voting:</Typography>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            margin="dense"
                            className="entryFormText"
                            label="Date"
                            value={this.state.eventData.endVote}
                            onChange={this.handleDateChange('endVote')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TimePicker
                            margin="dense"
                            className="entryFormText"
                            label="Time"
                            value={this.state.eventData.endVote}
                            onChange={this.handleDateChange('endVote')}
                        />
                    </MuiPickersUtilsProvider>
                    <br /> <br />
                    <Button
                    variant="contained"
                    className="buttons"
                    type="submit"
                    >
                        Next
                    </Button>
                </form>
            </div>
        );
    }
}