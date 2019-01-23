import React from 'react';
import { Typography } from '@material-ui/core';
import '../component_style/NewEventForm.css';

export default class NewEventForm extends React.Component {
    state = {
        automateTime: false
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

    render() {
        /**
         * TODO: Cleanup this div and replace <input/>'s
         */
        return (
             <div className='newEventForm'>
                <Typography variant='h4' align='center' gutterBottom>Create a new event</Typography>
                <form className='eventForm' onSubmit={() => this.AddEntries()}>
                    <Typography variant='h6'>Event Details</Typography>
                    <input type='text' name='event_name' id='event_name' placeholder='Event Name'/>
                    <br />
                    <input type='text' name='event_id' id='event_id' placeholder='ID (leave blank to autogenerate)'/>
                    <br />
                    <input type='text' name='event_loc' id='event_loc' placeholder='Location'/>
                    <div className='data_label'>Start Date:</div>
                    <input type='date' name='event_date_start' id='event_date_start'/>
                    <div className='data_label'>End Date:</div>
                    <input type='date' name='event_date_end' id='event_date_end'/>
                    <br /> <br />
                    <Typography variant='h6'>
                        Automate Voting Time Period?&emsp;
                        <input type='checkbox' name='event_automate_time' id='event_automate_time' onClick={this.toggleTime}/>
                    </Typography>
                    <div className='data_label'>Start Voting:</div>
                    <input type='datetime-local' name='event_vote_start' id='event_vote_start' disabled={!this.state.automateTime}/>
                    <div className='data_label'>End Voting:</div>
                    <input type='datetime-local' name='event_vote_end' id='event_vote_end' disabled={!this.state.automateTime}/>
                    <br /> <br />
                    <button className='buttons'>Next</button>
                </form>
            </div>
        );
    }
}