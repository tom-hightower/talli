import React from 'react';
import { Typography } from '@material-ui/core';
import '../component_style/Organizer.css';

/**
 * Entry Add/Remove, unimplemented
 * TODO: read existing events from database and render
 */
export default class AddEntryOrg extends React.Component {

    render() {
        return(
            <div>
                <Typography variant='display1' align='center' gutterBottom>Add Entries</Typography>
            </div>
        );
    }
}