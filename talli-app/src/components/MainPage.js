import React from 'react';
import { Typography, Button, ListItem, Grid } from '@material-ui/core';
import GoogleLogin from 'react-google-login';
import { navigate } from 'react-mini-router';
import './component_style/MainPage.css';
import firebase from '../firebase.js';
import {setCookie, getCookie} from '../cookies.js'

/**
 * Main View, just contains buttons for navigating to organizer and voting
 * views.
 * TODO: Clean up the button styling a bit
 */
export default class MainPage extends React.Component {
    ChangeView(page) {
        navigate(page);
    }

    GetCookies(page) {
        var cookies_value = getCookie('UserID');
        if (cookies_value == "") {
            var userID = "" + Math.random().toString(36).substr(2, 9);
            setCookie("UserID", userID, 30);
            const itemsRef = firebase.database().ref('cookies');
            itemsRef.child(userID).set(userID);
        }
        navigate(page);
    }

    render() {
        return(
            <div className="content">
                <br/>
                <Typography variant="h4" align="center">Welcome to Talli!</Typography>
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
                                onFailure={this.onFailure.bind(this)} />
                        </ListItem>
                    </div>
                </Grid>
                <br/>
                <p align="center">About Talli</p>
            </div>
        );
    }

    onSuccess(response) {
        this.props.onSuccess(response);
        this.ChangeView('/organizer');
    }

    onFailure() {
        console.log("Login failed");
    }
}