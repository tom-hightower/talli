import React, { Component } from 'react';
import { Button, Slide, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { navigate } from 'react-mini-router';
import firebase from '../../../firebase';
import { setCookie, getCookie } from '../../../cookies';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

/**
 * Cookie Consent informs users of the use of cookies.
 * It is rendered when the user tries to join an event,
 * and they will not be allowed to join without accepting
 */
export default class ConfirmCookies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleConfirm = () => {
        const consentValue = getCookie('TalliConsent');
        if (consentValue === '') {
            setCookie('TalliConsent', true, 30);
        }
        const userID = `${Math.random().toString(36).substr(2, 9)}`;
        setCookie('UserID', userID, 30);
        const itemsRef = firebase.database().ref('attendees');
        itemsRef.child(userID).set(userID);
        this.props.handleCookieConfirm(userID);
        this.setState({ open: false });
    }

    goToLink = (handle) => {
        navigate(handle);
    }

    render() {
        return (
            <div>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleClose}>
                    <DialogTitle>
                        Cookies Required
                    </DialogTitle>
                    <DialogContent>
                        Before you can vote, you <b>must consent</b> to the use of cookies.
                        This website uses&nbsp;
                        <span id="link" onClick={() => this.goToLink('/cookies')}><u>cookies</u></span>
                        &nbsp;to ensure you get the best experience on our website.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.goToLink('/')} color="primary">Reject</Button>
                        <Button color="primary" onClick={this.handleConfirm}>Confirm</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
