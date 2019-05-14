import React, { Component } from 'react';
import { Typography, Button, ListItem, Grid } from '@material-ui/core';
import GoogleLogin from 'react-google-login';
import { navigate } from 'react-mini-router';
import './component_style/MainPage.css';
import firebase from '../firebase';
import { setCookie, getCookie } from '../cookies';
import HelpView from './Help';
import CookieConsent from './CookieConsent';
import CookieWarning from './CookieWarning';


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

    GetCookies(page) {
        const cookiesValue = getCookie('UserID');
        const consentValue = getCookie('TalliConsent');
        if (consentValue === '') {
            this.warningChild.current.handleOpen();
        } else {
            if (cookiesValue === '') {
                const userID = `${Math.random().toString(36).substr(2, 9)}`;
                setCookie('UserID', userID, 30);
                const itemsRef = firebase.database().ref('attendees');
                itemsRef.child(userID).set(userID);
            }
            navigate(page);
        }
    }

    onSuccess(response) {
        this.props.onSuccess(response);
        this.ChangeView('/organizer');
    }

    onFailure() {
        console.log('Login failed');
    }

    gaveConsent = () => {
        const consentValue = getCookie('TalliConsent');
        return (consentValue !== '');
    }

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
                            <Button variant="contained" color="secondary" className="buttons" onClick={() => this.GetCookies('/vote')}>Vote as an Event Attendee</Button>
                        </ListItem>

                        <ListItem>
                            <GoogleLogin
                                clientId="1061225539650-cp3lrdn3p1u49tsq320l648hcuvg8plb.apps.googleusercontent.com"
                                render={renderProps => (
                                    <Button variant="contained" color="primary" className="buttons" onClick={renderProps.onClick}>Login as an Event Organizer</Button>
                                )}
                                onSuccess={this.onSuccess.bind(this)}
                                onFailure={this.onFailure.bind(this)}
                            />
                            {/* Nick messing around with other login possibilities */}
                            {/* <Button variant="contained" color="primary" className="buttons" onClick={() => this.sendLoginRequest()}>Organizer Login</Button> */}
                        </ListItem>
                    </div>
                </Grid>
                <div className="links">
                    <Typography variant="body2" id="aboutLink" onClick={() => this.helpChild.current.handleOpen()}>
                        <u>About Talli</u>
                    </Typography>
                </div>
                {/* <a href={signInUrl}>Sign in w google new way</a> */}
                <br />
                {
                    !this.gaveConsent() && <CookieConsent nav={this.ChangeView} />
                }
            </div>
        );
    }
}
