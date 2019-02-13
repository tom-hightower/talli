import React from 'react';
import { Typography, Button, ListItem, Grid } from '@material-ui/core';
import GoogleLogin from 'react-google-login';
import { navigate } from 'react-mini-router';
import './component_style/MainPage.css';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

// tried not to hardcode this but oh well
let signInUrl = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&response_type=code&client_id=1061225539650-cp3lrdn3p1u49tsq320l648hcuvg8plb.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fgoogle-auth";

socket.on('send_url', url => {
    signInUrl = url;
    // console.log('google sign in: ', url);
})

/**
 * Main View, just contains buttons for navigating to organizer and voting
 * views.
 * TODO: Clean up the button styling a bit
 */
export default class MainPage extends React.Component {
    ChangeView(page) {
        navigate(page);
    }

    constructor(props) {
        super(props);
        this.state = {
            url: signInUrl
        };
        // this.sendLoginRequest = this.sendLoginRequest.bind(this);
    }

    render() {
        return (
            <div className="content">
                <br/>
                <Typography variant="h4" align="center" gutterBottom>Main Page</Typography>
                <Grid container justify="center">
                    <div className="buttons"> 
                        <ListItem>
                            <Button variant="contained" color="secondary" className="buttons" onClick={() => this.ChangeView('/vote')}>Vote as an Event Attendee</Button>
                        </ListItem>
                        
                        <ListItem>
                            {/* <Button variant="contained" color="primary" className="buttons" onClick={() => this.ChangeView('/organizer')}>Organizer Login</Button> */}
                            <GoogleLogin 
                                clientId="1061225539650-cp3lrdn3p1u49tsq320l648hcuvg8plb.apps.googleusercontent.com"
                                render={renderProps => (
                                    <Button variant="contained" color="primary" className="buttons" onClick={renderProps.onClick}>Login as an Event Organizer</Button>
                                )}
                                onSuccess={this.onSuccess.bind(this)}
                                onFailure={this.onFailure.bind(this)} />
                            {/* Nick messing around with other login possibilities */}
                            {/* <Button variant="contained" color="primary" className="buttons" onClick={() => this.sendLoginRequest()}>Organizer Login</Button> */}
                        </ListItem>
                    </div>
                </Grid>
                {/* <a href={signInUrl}>Sign in w google new way</a> */}
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