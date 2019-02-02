import React from 'react';
import { Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import '../component_style/Organizer.css';
import firebase from '../../firebase.js'

/**
 * Event List, unimplemented
 * TODO: read existing events from database and render
 */
export default class EventList extends React.Component {
    AddEvent() {
        this.props.handler(this.props.orgViews.CREATE);
        /* unimplemented */
    }

    render() {
        return(
            <div>
                <Typography variant='h4' align='center' gutterBottom>Organizer View</Typography>
                <div className='organizerEvents'>
                    <div className='eventContainer' id='addEvent'>
                        <AddCircleIcon color='primary' id='addCircleIcon' onClick={() => this.AddEvent()}/>
                    </div>
                    <div className='eventContainer' id='openEvent'>
                    </div>
                </div>
            </div>
        );
    }
}
