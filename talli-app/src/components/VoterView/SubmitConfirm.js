import React from 'react';
import { Typography } from '@material-ui/core';
import '../component_style/Voter.css';

/**
 * Confirm that the attendee wants to submit, unimplemented
 */
export default class SubmitConfirm extends React.Component {

    render() {
        return(
            <div>
                <Typography variant='display1' align='center' gutterBottom>Confirm Submission</Typography>
            </div>
        );
    }
}