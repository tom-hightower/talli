import React from 'react';
import { Typography } from '@material-ui/core';
import '../component_style/Organizer.css';
import firebase from '../../firebase.js'

/**
 * Event View, unimplemented
 * TODO: read existing events from database and render
 */
export default class ViewEvent extends React.Component {

    render() {
        return(
            <div>
                <Typography variant='h4' align='center' gutterBottom>View Event Details</Typography>
            </div>
        );
    }
}