import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { Typography, TextField, InputAdornment, Button, FormControlLabel, Switch } from '@material-ui/core';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import CalendarIcon from '@material-ui/icons/DateRange';
import '../component_style/NewEventForm.css';
import '../component_style/Organizer.css';

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
        eventData: blankEvent
    }

    toggleTime = () => {
        this.setState({
            eventData: { automate: !this.state.eventData.automate, }
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
    }

    handleDateChange = name => date => {
        this.setState({
            eventData: { [name]: date, }
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
                <form className='eventForm' onSubmit={() => this.AddEntries()}>
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
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.eventData.automate}
                                onChange={() => this.toggleTime()}
                                value="automate"
                                color="primary"
                            />
                        }
                        label="Automate Voting Time Period?"
                        labelPlacement="start"
                    />
                    {this.state.eventData.automate &&
                        <div>
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
                    >
                        Next
                    </Button>
                </form>
            </div>
        );
    }
}