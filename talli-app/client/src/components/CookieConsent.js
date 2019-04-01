import React, { Component } from 'react';
import { Button, Card, CardActions, CardContent, Slide } from '@material-ui/core';
import { setCookie, getCookie } from '../cookies';
import './component_style/CookieConsent.css';

/**
 * Cookie Consent informs users of the use of cookies.
 * It is rendered on the MainPage, and will not
 * allow users to vote as attendees until they accept the cookies.
 */
export default class CookieConsent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
    }

    handleClose = () => {
        const consentValue = getCookie('TalliConsent');
        if (consentValue === '') {
            setCookie('TalliConsent', true, 30);
        }
        this.setState({ open: false });
    }

    goToLink = () => {
        this.props.nav('/cookies');
    }

    render() {
        return (
            <div>
                <Slide direction="up" in={this.state.open} mountOnEnter unmountOnExit>
                    <Card className="cookieConsent" elevation={16}>
                        <CardContent id="cc_content">
                            This website uses&nbsp;
                            <span id="link" onClick={() => this.goToLink()}><u>cookies</u></span>
                            &nbsp;to ensure you get the best experience on our website.
                        </CardContent>
                        <CardActions id="cc_confirm">
                            <Button size="small" variant="contained" color="default" onClick={() => this.handleClose()}>
                                Got it!
                            </Button>
                        </CardActions>
                    </Card>
                </Slide>
            </div>
        );
    }
}
