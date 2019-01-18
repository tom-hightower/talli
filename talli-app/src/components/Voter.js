import React from 'react';
import { Typography } from '@material-ui/core';
import Ranking from './VoterView/RankingContainer';
import SubmitRankings from './VoterView/SubmitContainer';

const voteViews = {
    JOIN: '',
    ADD: '',
    RANK: 'Ranking',
    CONFIRM: '',
    SUBMIT: '',
}

/**
 * Voting view, unimplemented
 */
export default class Voter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { curView: voteViews.JOIN };
        this.changeView = this.changeView.bind(this);
    }

    changeView(newView) {
        this.setState({ curView: newView });
    }

    render() {
        return(
            <div>
                <Typography variant='display1' align='center' gutterBottom>Voting View</Typography>
                <Ranking />
                <SubmitRankings />
            </div>
        );
    }
}