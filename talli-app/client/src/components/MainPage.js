import React from 'react';
import { Typography, Button, ListItem, Grid } from '@material-ui/core';
import GoogleLogin from 'react-google-login';
import { navigate } from 'react-mini-router';
import './component_style/MainPage.css';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

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
        // this.sendLoginRequest = this.sendLoginRequest.bind(this);
    }

    // sendLoginRequest() {
    //     socket.emit('login_request', 'message');
    // }
    
    render() {
        return (
            <div className="content">
                <br/>
                <Typography variant="h4" align="center" gutterBottom>Main Page</Typography>
                <Grid container justify="center">
                    <div className="buttons"> 
                        <ListItem>
                            <Button variant="contained" color="secondary" className="buttons" onClick={() => this.ChangeView('/vote')}>Event Voting</Button>
                        </ListItem>
                        
                        <ListItem>
                            {/* <Button variant="contained" color="primary" className="buttons" onClick={() => this.ChangeView('/organizer')}>Organizer Login</Button> */}
                            <GoogleLogin 
                                clientId="1061225539650-cp3lrdn3p1u49tsq320l648hcuvg8plb.apps.googleusercontent.com"
                                render={renderProps => (
                                    <Button variant="contained" color="primary" className="buttons" onClick={renderProps.onClick}>Organizer Login (Google)</Button>
                                )}
                                onSuccess={this.onSuccess.bind(this)}
                                onFailure={this.onFailure.bind(this)} />
                            {/* Nick messing around with other login possibilities */}
                            {/* <Button variant="contained" color="primary" className="buttons" onClick={() => this.sendLoginRequest()}>Organizer Login</Button> */}
                        </ListItem>
                    </div>
                </Grid>
                <br/>
                <p align="center">About Talli</p>
            </div>
        );
    }

    onSuccess(response) {
        // this.setState({loggedIn: true});
        // console.log(response);
        this.props.onSuccess(response);
        this.ChangeView('/organizer');
    }

    onFailure() {
        console.log("Login failed");
    }
}