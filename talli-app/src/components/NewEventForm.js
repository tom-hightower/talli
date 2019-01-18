import React from 'react';
import { Typography } from '@material-ui/core';
import './component_style/NewEventForm.css';

export default class NewEventForm extends React.Component {
    render() {
        return (
             <div className='newEventForm'>
                <Typography variant='display1' align='center' gutterBottom>Create a new event</Typography>
                <form className='eventForm'>
                    <Typography variant='title'>Event Details</Typography>
                    <input type='text' name='event_name' id='event_name' placeholder='Event Name'/>
                    <input type='text' name='event_id' id='event_id' placeholder='ID (leave blank to autogenerate)'/>
                    <input type='text' name='event_loc' id='event_loc' placeholder='Location'/>
                    <div className='data_label'>Start Date:</div>
                    <input type='date' name='event_date_start' id='event_date_start'/>
                    <div className='data_label'>End Date:</div>
                    <input type='date' name='event_date_end' id='event_date_end'/>
                    <Typography variant='title'>Automate Voting Time Period?</Typography>
                    <input type='checkbox' name='event_automate_time' id='event_automate_time'/>
                    <div className='data_label'>Start Voting:</div>
                    <input type='datetime-local' name='event_vote_start' id='event_vote_start'/>
                    <div className='data_label'>End Voting:</div>
                    <input type='datetime-local' name='event_vote_end' id='event_vote_end'/>
                    <input type="submit" value="Next"/>
                </form>
            </div>
        );
    }
}