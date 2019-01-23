import React from 'react';
import NewEvent from './OrganizerView/NewEventForm';
import EventList from './OrganizerView/EventList';
import AddEntry from './OrganizerView/AddEntryOrg';
import ViewEvent from './OrganizerView/ViewEvent';
import { GoogleLogout } from 'react-google-login';
import { navigate } from 'react-mini-router';
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
        this.setView = this.setView.bind(this);
    }

    ChangeView(page) {
        navigate(page);
    }

    setView(newView) {
        this.setState({ curView: newView });
    }

    logout(response) {
        // console.log(response);
        this.ChangeView('/');
    }

    render() {
        switch(this.state.curView) {
            case orgViews.CREATE:
                return( <NewEvent orgViews={orgViews} handler={this.setView}/> );
            case orgViews.ADD:
                return( <AddEntry orgViews={orgViews} handler={this.setView}/> );
            case orgViews.VIEW:
                return( <ViewEvent orgViews={orgViews} handler={this.setView}/> );
            default:
                return( 
                    <div className="main">
                        <GoogleLogout 
                            buttonText="Logout"
                            onLogoutSuccess={this.logout.bind(this)} />
                        <EventList orgViews={orgViews} handler={this.setView}/> 
                    </div>
                );
        }
    }
}