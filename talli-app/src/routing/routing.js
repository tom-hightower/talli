import React from 'react';
import createReactClass from 'create-react-class';
import MainPage from '../components/MainPage';
import Voter from '../components/Voter';
import Organizer from '../components/Organizer';
import HelpView from '../components/Help';
var RouterMixin = require('react-mini-router').RouterMixin;

var RoutedApp = createReactClass({

    mixins: [RouterMixin],

    routes: {
        '/': 'home',
        '/vote': 'vote',
        '/vote/:text': 'voteWithID',
        '/organizer': 'organizer',
        '/help': 'help'
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
        return <div>{text}</div>;
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