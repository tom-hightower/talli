import React from 'react';
import Ranking from './VoterView/RankingContainer';
import SubmitRankings from './VoterView/SubmitContainer';
import AddEntry from './VoterView/AddEntryVote';
import JoinEvent from './VoterView/JoinEvent';
import SubmitConfirm from './VoterView/SubmitConfirm';
import Submitted from './VoterView/Submitted';

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
    constructor(props) {
        super(props);
        this.state = { curView: voteViews.JOIN };
        this.changeView = this.changeView.bind(this);
    }

    changeView(newView) {
        this.setState({ curView: newView });
    }

    render() {
        switch(this.state.curView) {
            case voteViews.ADD:
                return ( <AddEntry voteViews={voteViews} handler={this.changeView} /> );
            case voteViews.RANK:
                return(
                    <div>
                        <Ranking voteViews={voteViews} handler={this.changeView}/>
                        <SubmitRankings voteViews={voteViews} handler={this.changeView}/>
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