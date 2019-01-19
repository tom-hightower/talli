import React from 'react';
import { Typography } from '@material-ui/core';
import '../component_style/Voter.css';

/**
 * Rankings have been submitted, unimplemented
 */
export default class RanksSubmitted extends React.Component {

    render() {
        return(
            <div>
                <Typography variant='display1' align='center' gutterBottom>Rankings Submitted Confirmations</Typography>
            </div>
        );
    }
}