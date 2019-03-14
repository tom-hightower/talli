import React from 'react';
import { Button, Card, CardActions, CardContent, Slide } from '@material-ui/core';
import './component_style/CookieConsent.css';

/**
 * Cookie Consent informs users of the use of cookies.
 * It is rendered on the MainPage, and will not
 * allow users to vote as attendees until they accept the cookies.
 */
export default class CookieConsent extends React.Component {
    state = {
        open: true,
    };

    handleClose = () => {
        this.setState({ open: false });
        // should do something to indicate that consent has been given??
    };

    goToLink = () => {
        this.props.nav('/cookies');
    }

    render() {
        return (
            <div>
                <Slide direction="up" in={this.state.open} mountOnEnter unmountOnExit>
                    <Card className="cookieConsent">
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