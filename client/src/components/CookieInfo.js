import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { navigate } from 'react-mini-router';
import CookieConsent from './CookieConsent';
import { getCookie } from '../cookies';
import './component_style/CookieConsent.css';

/**
 * Cookies information page.
 * TO DO: make sure consent banner still shows if necessary.
 */
export default class CookieInfo extends Component {
    gaveConsent = () => {
        const consentValue = getCookie('TalliConsent');
        return (consentValue !== "");
    }

    ChangeView(page) {
        navigate(page);
    }

    render() {
        return (
            <div className="cookieInfo">
                <Typography variant="h4" gutterBottom>Cookies</Typography>
                <Typography variant="h5">What are cookies?</Typography>
                <Typography variant="body2">
                    A cookie is a small text file that a website saves on your computer or mobile device when you visit the site.
                    It enables the website to remember your actions and preferences (such as login, language, font size and other display preferences)
                    over a period of time, so you don’t have to keep re-entering them whenever you come back to the site or browse from one page to another.
                </Typography>
                <br />
                <Typography variant="h5">How do we use cookies?</Typography>
                <Typography variant="body2">
                    On this website, we use cookies to identify unique event attendees. This helps keep voting on our platform accurate and fair
                    by allowing each visitor only one ballot submission per event. Upon join an event for the first time with our application,
                    a unique ID is generated for your browser and stored to identify you without needing to collect any additional information
                    like name or email address. In current and future sessions, we will use that cookie to identify you to allow you to return to an
                    in-progress ballot and to prevent you from submitting a ballot for an event more than once.
                </Typography>
                <br />
                <Typography variant="h5">How to control cookies</Typography>
                <Typography variant="body2">
                    You can control and/or delete cookies as you wish – for details, see aboutcookies.org.
                    You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
                    If you do this, however, you will not be allowed to vote using our platform and will need to contact an event organizer for an
                    alternate mode of voting.
                    <br />
                    <br />
                    If you consent to the usage of cookies by this site, please select &quot;Got It!&quot; on the banner below if you have not already.
                    Please note that you <b>cannot</b> use the voting features on this application without consenting to cookie usage.
                </Typography>
                {
                    !this.gaveConsent() && <CookieConsent nav={this.ChangeView} />
                }
            </div>
        );
    }
}
