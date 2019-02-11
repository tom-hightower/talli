import React from 'react';
import Ranking from './VoterView/RankingContainer';
import SubmitRankings from './VoterView/SubmitContainer';
import AddEntry from './VoterView/AddEntryVote';
import JoinEvent from './VoterView/JoinEvent';
import SubmitConfirm from './VoterView/SubmitConfirm';
import Submitted from './VoterView/Submitted';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

const voteViews = {
    JOIN: 'JoinEvent',
    ADD: 'AddEntry',
    RANK: 'Ranking',
    CONFIRM: 'SubmitConfirm',
    SUBMITTED: 'Submitted',
}

/**
 * Voting view, unimplemented
 */
export default class Voter extends React.Component {
    // Todo: potentially move the state of the rankings to this file? 
    constructor(props) {
        super(props);
        this.state = { curView: voteViews.JOIN };
        this.changeView = this.changeView.bind(this);
        this.submitRankings = this.submitRankings.bind(this);
    }

    changeView(newView) {
        this.setState({ curView: newView });
    }

    submitRankings() {
        let rankings = {
            First: 'entry1',
            Second: 'entry2',
            Third: 'entry3'
        };
        socket.emit('add_data', rankings);
    }

    render() {
        switch(this.state.curView) {
            case voteViews.ADD:
                return ( <AddEntry voteViews={voteViews} handler={this.changeView} /> );
            case voteViews.RANK:
                return(
                    <div>
                        <Ranking voteViews={voteViews} handler={this.changeView}/>
                        <SubmitRankings voteViews={voteViews} handler={this.changeView} submitRankings={this.submitRankings} />
                    </div>
                );
            case voteViews.CONFIRM:
                return( <SubmitConfirm voteViews={voteViews} handler={this.changeView}/> );
            case voteViews.SUBMITTED:
                return( <Submitted voteViews={voteViews} handler={this.changeView}/> );
            default:
                return( <JoinEvent voteViews={voteViews} handler={this.changeView}/> );
        }
    }
}