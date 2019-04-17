import React from 'react';
import createReactClass from 'create-react-class';
import MainPage from '../components/MainPage';
import Voter from '../components/Voter';
import Organizer from '../components/Organizer';
import CookieInfo from '../components/CookieInfo';

const RouterMixin = require('react-mini-router').RouterMixin;

/**
 * RoutedApp handles routing between each of the main views as well
 * as error handling when a non-existant page is queried
 */
const RoutedApp = createReactClass({

    getInitialState() {
        return { loggedIn: this.props.loggedIn };
    },

    mixins: [RouterMixin],

    // TODO: Set up /vote/:text (voteWithID) to handle url-injected event IDs
    //      (currently displays the same as /vote)
    routes: {
        '/': 'home',
        '/vote': 'vote',
        '/vote/:text': 'voteWithID',
        '/vote/:event/:entry': 'joinWithEntry',
        '/organizer': 'organizer',
        '/cookies': 'cookies'
    },

    render() {
        return this.renderCurrentRoute();
    },

    home() {
        return (
            <MainPage
                loggedIn={this.props.loggedIn}
                onSuccess={this.onSuccess}
            />
        );
    },

    vote() {
        return <Voter />;
    },

    voteWithID(text) {
        return <Voter scanID={text} />;
    },

    joinWithEntry(event, entry) {
        return <Voter scanID={event} scanEntry={entry} />;
    },

    organizer() {
        return (
            <Organizer
                logout={this.logout}
                user={this.props.user}
            />
        );
    },

    cookies() {
        return <CookieInfo />;
    },

    notFound(path) {
        return <div className="not-found">Page Not Found: {path}</div>;
    },

    onSuccess(response) {
        this.props.onSuccess(response);
    },

    logout() {
        this.props.logout();
    }
});

export default RoutedApp;
