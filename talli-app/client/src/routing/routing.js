import React from 'react';
import createReactClass from 'create-react-class';
import MainPage from '../components/MainPage';
import Voter from '../components/Voter';
import Organizer from '../components/Organizer';
import CookieInfo from '../components/CookieInfo';

var RouterMixin = require('react-mini-router').RouterMixin;

/**
 * RoutedApp handles routing between each of the main views as well
 * as error handling when a non-existant page is queried
 */
var RoutedApp = createReactClass({

    getInitialState: function() {
        return {loggedIn: this.props.loggedIn};
    },

    mixins: [RouterMixin],

    // TODO: Set up /vote/:text (voteWithID) to handle url-injected event IDs
    //      (currently displays the same as /vote)
    routes: {
        '/': 'home',
        '/vote': 'vote',
        '/vote/:text': 'voteWithID',
        '/organizer': 'organizer',
        '/cookies': 'cookies'
    },

    render: function () {
        return this.renderCurrentRoute();
    },

    home: function () {
        return (
            <MainPage 
                loggedIn={this.props.loggedIn}
                onSuccess={this.onSuccess} />
        );
    },

    vote: function () {
        return <Voter />;
    },

    voteWithID: function (text) {
        return <Voter scanID={text} />;
    },

    organizer: function () {
        return (
            <Organizer
                logout={this.logout}
                user={this.props.user} />
        );
    },

    cookies: function () {
        return <CookieInfo />;
    },

    notFound: function (path) {
        return <div className="not-found">Page Not Found: {path}</div>;
    },

    onSuccess: function(response) {
        this.props.onSuccess(response);
    },

    logout: function() {
        this.props.logout();
    }
});

export default RoutedApp;