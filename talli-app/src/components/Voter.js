import React from 'react';
import { Typography } from '@material-ui/core';
import RankingContainer from './VoterView/RankingContainer';
import SubmitContainer from './VoterView/SubmitContainer';

/**
 * Voting view, unimplemented
 */
export default class Voter extends React.Component {
    render() {
        return(
            <div>
                <Typography variant='display1' align='center' gutterBottom>Voting View</Typography>
                <RankingContainer />
                <SubmitContainer />
            </div>
        );
    }
}