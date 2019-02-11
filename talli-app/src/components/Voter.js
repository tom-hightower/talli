import React from 'react';
import Ranking from './VoterView/RankingContainer';
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
        this.state = {
            curView: voteViews.JOIN,
            eventID: '',
            organizerID: '',
            entryToAdd: ''
        };
        this.changeView = this.changeView.bind(this);
    }

    changeView(newView, event = 'na', organizer = 'na', addedEntry = '') {
        if (event !== 'na' && organizer !== 'na') {
            this.setState({
                curView: newView,
                eventID: event,
                organizerID: organizer,
                entryToAdd: addedEntry
            });
        } else {
            this.setState({ curView: newView, entryToAdd: addedEntry });
        }
    }

    render() {
        switch (this.state.curView) {
            case voteViews.ADD:
                return (<AddEntry voteViews={voteViews} eventID={this.state.eventID} organizer={this.state.organizerID} handler={this.changeView} />);
            case voteViews.RANK:
                return (<Ranking voteViews={voteViews} eventID={this.state.eventID} organizer={this.state.organizerID} entryToAdd={this.state.entryToAdd} handler={this.changeView} />);
            case voteViews.CONFIRM:
                return (<SubmitConfirm voteViews={voteViews} handler={this.changeView} />);
            case voteViews.SUBMITTED:
                return (<Submitted voteViews={voteViews} handler={this.changeView} />);
            default:
                return (<JoinEvent voteViews={voteViews} handler={this.changeView} />);
        }
    }
}