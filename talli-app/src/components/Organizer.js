import React from 'react';
import NewEvent from './OrganizerView/NewEventForm';
import EventList from './OrganizerView/EventList';
import AddEntry from './OrganizerView/AddEntryOrg';
import ViewEvent from './OrganizerView/ViewEvent';
import { GoogleLogout } from 'react-google-login';
import { navigate } from 'react-mini-router';
import { Button } from '@material-ui/core';
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
        this.state = { curView: orgViews.MAIN, curEventID: '' };
        this.setView = this.setView.bind(this);
        this.setEvent = this.setEvent.bind(this);
    }

    ChangeView(page) {
        navigate(page);
    }

    setView(newView) {
        this.setState({ curView: newView });
    }

    setEvent(eventID) {
        this.setState({ curEventID: eventID });
    }

    logout() {
        this.ChangeView('/');
        this.props.logout();
    }

    getCurrView() {
        switch(this.state.curView) {
            case orgViews.CREATE:
                return( <NewEvent orgViews={orgViews} handler={this.setView} setEvent={this.setEvent} /> );
            case orgViews.ADD:
                return( <AddEntry orgViews={orgViews} handler={this.setView} curEvent={this.state.curEventID} /> );
            case orgViews.VIEW:
                return( <ViewEvent orgViews={orgViews} handler={this.setView} curEvent={this.state.curEventID} /> );
            default:
                return( <EventList orgViews={orgViews} handler={this.setView} setEvent={this.setEvent} /> ); 
        }
    }

    render() {
        return (
            <div className="content">
                <GoogleLogout 
                    buttonText="Logout"
                    render={renderProps => (
                        <Button variant="contained" color="secondary" className="buttons" onClick={renderProps.onClick}>Logout</Button>
                    )}
                    onLogoutSuccess={this.logout.bind(this)} />
                <div>{this.getCurrView()}</div>
            </div>
        )
    }
}