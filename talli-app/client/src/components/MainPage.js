import React, { Component } from 'react';
import { Typography, Button, ListItem, Grid } from '@material-ui/core';
import GoogleLogin from 'react-google-login';
import { navigate } from 'react-mini-router';
import firebase from '../firebase';
import { setCookie, getCookie } from '../cookies';
import HelpView from './Help';
import CookieConsent from './CookieConsent';
import CookieWarning from './CookieWarning';
import './component_style/MainPage.css';


/**
 * Main View, just contains buttons for navigating to organizer and voting
 * views.
 */
export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.helpChild = React.createRef();
        this.warningChild = React.createRef();
    }

    /**
     * Checks for UserID cookie, checks for cookie consent, and navigates
     * to the passed page.
     * If the TalliConsent cookie does not exist, a warning dialog is opened
     * If the UserID cookie does not exist, a new one is generated and saved
     * 
     * @param {String} page - the url extension to navigate to after cookies are checked
     */
    GetCookies(page) {
        const cookiesValue = getCookie('UserID');
        if (!this.gaveConsent()) {
            this.warningChild.current.handleOpen();
        } else {
            if (cookiesValue === '') {
                const userID = `${Math.random().toString(36).substr(2, 9)}`;
                setCookie('UserID', userID, 30);
                const itemsRef = firebase.database().ref('attendees');
                itemsRef.child(userID).set(userID);
            }
            this.ChangeView(page);
        }
    }

    onSuccess(response) {
        this.props.onSuccess(response);
        this.ChangeView('/organizer');
    }

    onFailure() {
        console.log('Login failed');
    }

    /**
     * Returns whether or not the user has given consent to use cookies by
     * checking for a TalliConsent cookie
     */
    gaveConsent = () => {
        const consentValue = getCookie('TalliConsent');
        return (consentValue !== '');
    }

    /**
     * Navigates to the specified page through the router
     * 
     * @param {String} page - the url extension to navigate to
     */
    ChangeView(page) {
        navigate(page);
    }

    render() {
        return (
            <div className="content">
                <br />
                <HelpView ref={this.helpChild} />
                <CookieWarning ref={this.warningChild} />
                <Typography variant="h4" align="center" gutterBottom>Welcome to Talli!</Typography>
                <Grid container justify="center">
                    <div className="buttons">
                        <ListItem>
                            <Button
                                variant="contained"
                                color="secondary"
                                className="buttons"
                                onClick={() => this.GetCookies('/vote')}
                            >
                                Vote as an Event Attendee
                            </Button>
                        </ListItem>

                        <ListItem>
                            <GoogleLogin
                                clientId="1061225539650-cp3lrdn3p1u49tsq320l648hcuvg8plb.apps.googleusercontent.com"
                                render={renderProps => (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="buttons"
                                        onClick={renderProps.onClick}
                                    >
                                        Login as an Event Organizer
                                    </Button>
                                )}
                                onSuccess={this.onSuccess.bind(this)}
                                onFailure={this.onFailure.bind(this)}
                            />
                        </ListItem>
                    </div>
                </Grid>
                <div className="links">
                    <Typography variant="body2" id="aboutLink" onClick={() => this.helpChild.current.handleOpen()}>
                        <u>About Talli</u>
                    </Typography>
                </div>
                <br />
                {
                    !this.gaveConsent() && <CookieConsent nav={this.ChangeView} />
                }
            </div>
        );
    }
}
