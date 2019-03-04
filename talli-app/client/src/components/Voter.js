import React from 'react';
import Ranking from './VoterView/RankingContainer';
import AddEntry from './VoterView/AddEntryVote';
import JoinEvent from './VoterView/JoinEvent';
import Submitted from './VoterView/Submitted';

const voteViews = {
    JOIN: 'JoinEvent',
    ADD: 'AddEntry',
    RANK: 'Ranking',
    SUBMITTED: 'Submitted',
}

/**
 * Voting view
 */
export default class Voter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curView: voteViews.JOIN,
            eventID: '',
            organizerID: '',
            entryToAdd: '',
            rankingItems: [],
        };
        this.changeView = this.changeView.bind(this);
        this.updateItems = this.updateItems.bind(this);
    }

    updateItems(itemList) {
        this.setState({ rankingItems: itemList });
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
                return (
                    <AddEntry
                        voteViews={voteViews}
                        eventID={this.state.eventID}
                        organizer={this.state.organizerID}
                        handler={this.changeView}
                        rankItems={this.state.rankingItems}
                    />);
            case voteViews.RANK:
                return (
                    <Ranking
                        voteViews={voteViews}
                        eventID={this.state.eventID}
                        organizer={this.state.organizerID}
                        entryToAdd={this.state.entryToAdd}
                        rankItems={this.state.rankingItems}
                        updateItemsHandler={this.updateItems}
                        handler={this.changeView}
                    />);
            case voteViews.SUBMITTED:
                return (
                    <Submitted
                        voteViews={voteViews}
                        handler={this.changeView}
                    />);
            default:
                return (
                    <JoinEvent
                        voteViews={voteViews}
                        updateItemsHandler={this.updateItems}
                        handler={this.changeView}
                    />);
        }
    }
}