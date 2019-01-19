import React from 'react';
import { Typography } from '@material-ui/core';
import '../component_style/Organizer.css';

/**
 * Event View, unimplemented
 * TODO: read existing events from database and render
 */
export default class ViewEvent extends React.Component {

    render() {
        return(
            <div>
                <Typography variant='display1' align='center' gutterBottom>View Event Details</Typography>
            </div>
        );
    }
}