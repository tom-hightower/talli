import React from 'react';
import NewEvent from './NewEventForm';
import EventList from './EventList';
import AddEntry from './AddEntry';
import ViewEvent from './ViewEvent';
import './component_style/Organizer.css';

const orgViews = {
    MAIN: 'EventList',
    CREATE: 'NewEvent',
    ADD: 'AddEntry',
    VIEW: 'ViewEvent',
}

/**
 * Organizer/Event Management view, unimplemented
 */
export default class Organizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { curView: orgViews.MAIN };
        this.changeView = this.changeView.bind(this);
    }

    changeView(newView) {
        this.setState({ curView: newView });
    }

    render() {
        switch(this.state.curView) {
            case orgViews.CREATE:
                return( <NewEvent orgViews={orgViews} handler={this.changeView}/> );
            case orgViews.ADD:
                return( <AddEntry orgViews={orgViews} handler={this.changeView}/> );
            case orgViews.VIEW:
                return ( <ViewEvent orgViews={orgViews} handler={this.changeView}/> );
            default:
                return( <EventList orgViews={orgViews} handler={this.changeView}/> );
        }
    }
}