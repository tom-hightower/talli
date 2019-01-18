import React from 'react';
import createReactClass from 'create-react-class';
import MainPage from '../components/MainPage';
import Voter from '../components/Voter';
import Organizer from '../components/Organizer';
import HelpView from '../components/Help';
var RouterMixin = require('react-mini-router').RouterMixin;

/**
 * RoutedApp handles routing between each of the main views as well
 * as error handling when a non-existant page is queried
 */
var RoutedApp = createReactClass({

    mixins: [RouterMixin],

    // TODO: Set up /vote/:text (voteWithID) to handle url-injected event IDs
    //      (currently displays the same as /vote)
    routes: {
        '/': 'home',
        '/vote': 'vote',
        '/vote/:text': 'voteWithID',
        '/organizer': 'organizer',
        '/help': 'help',
    },

    render: function () {
        return this.renderCurrentRoute();
    },

    home: function () {
        return <MainPage />;
    },

    vote: function () {
        return <Voter />;
    },

    voteWithID: function (text) {
        return <Voter />;
    },

    organizer: function () {
        return <Organizer />;
    },

    help: function () {
        return <HelpView />;
    },

    notFound: function (path) {
        return <div class="not-found">Page Not Found: {path}</div>;
    },
});

export default RoutedApp;