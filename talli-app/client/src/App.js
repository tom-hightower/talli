import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './components/Theme';
import RoutedApp from './routing/routing';
import NavBar from './components/NavBar';
import firebase from './firebase';
import './App.css';

/**
 * 'App' serves as a colleciton point of lower components before they
 * are sent off to rendering in index.js
 * This gives us a place to inject routing and theming as well as place
 * components that stay constant throughout the experience, such as the
 * NavBar
*/
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            user: ''
        };
    }

    componentDidMount() {
        const user = sessionStorage.getItem('id') ? {
            googleId: sessionStorage.getItem('id'),
            email: sessionStorage.getItem('email'),
            name: sessionStorage.getItem('name')
        } : null;
        this.setState({
            loggedIn: user ? true : false,
            user
        });
    }

    onSuccess(response) {
        this.setState({
            loggedIn: true,
            user: {
                googleId: response.googleId,
                email: response.profileObj.email,
                name: response.profileObj.givenName
            }
        });
        sessionStorage.setItem('id', response.googleId);
        sessionStorage.setItem('email', response.profileObj.email);
        sessionStorage.setItem('name', response.profileObj.givenName);

        const organizer = {
            email: response.profileObj.email,
            name: response.profileObj.name
        };
        const ref = firebase.database().ref(`organizer/${response.profileObj.googleId}/organizerData`);
        ref.set(organizer);
    }

    logout() {
        this.setState({
            loggedIn: false,
            user: null
        });
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('name');
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <NavBar
                        loggedIn={this.state.loggedIn}
                        onSuccess={this.onSuccess.bind(this)}
                        logout={this.logout.bind(this)}
                    />
                    <RoutedApp
                        onSuccess={this.onSuccess.bind(this)}
                        logout={this.logout.bind(this)}
                        user={this.state.user}
                        history={true}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}
