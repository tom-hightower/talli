import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import OrganizerIcon from '@material-ui/icons/AssignmentInd';
import VoteIcon from '@material-ui/icons/HowToVote';
import { Drawer, ListItemIcon, ListItemText, ListItem, Divider } from '@material-ui/core';
import { navigate } from 'react-mini-router';

import './component_style/NavBar.css';
import logoSvg from '../logo.svg';
import { getCookie } from '../cookies';
import HelpView from './Help';
import CookieWarning from './CookieWarning';

/**
 * The NavBar contains the top AppBar as well as the navigation Drawer on
 * the left side, activated by the hamburger menu icon
 */
export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

        this.helpChild = React.createRef();
        this.warningChild = React.createRef();
    }

    toggleDrawer = () => this.setState({ open: !this.state.open });

    closeDrawer = () => this.setState({ open: false });

    onSuccess = (response) => {
        this.props.onSuccess(response);
        this.ChangeView('/organizer');
    }

    onFailure = () => {
        console.log('Failed to Login');
    }

    ChangeView(page) {
        const consentValue = getCookie('TalliConsent');
        if (page === '/vote' && consentValue === '') {
            this.warningChild.current.handleOpen();
        } else {
            navigate(page);
        }
    }

    logout(view) {
        this.ChangeView(view);
        this.props.logout();
    }

    // TODO: Add logout to hamburger menu

    render() {
        // List of buttons for the navigation drawer
        const loginStatus = !this.props.loggedIn ? (
            <GoogleLogin
                clientId="1061225539650-cp3lrdn3p1u49tsq320l648hcuvg8plb.apps.googleusercontent.com"
                render={renderProps => (
                    <ListItem button key="Organizer Login" onClick={renderProps.onClick}>
                        <ListItemIcon><OrganizerIcon /></ListItemIcon>
                        <ListItemText primary="Organizer Login" />
                    </ListItem>
                )}
                onSuccess={this.onSuccess.bind(this)}
                onFailure={this.onFailure.bind(this)}
            />
        ) : (
                <ListItem button key="Organizer Logout" onClick={() => this.logout('/')}>
                    <ListItemIcon><OrganizerIcon /></ListItemIcon>
                    <ListItemText primary="Organizer Logout" />
                </ListItem>
            );

        return (
            <div className="root">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className="menuButton" color="inherit" aria-label="Menu" onClick={this.toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <img src={logoSvg} className="navTitle" alt="talli" />
                    </Toolbar>
                </AppBar>
                <Drawer open={this.state.open} onClose={this.closeDrawer}>
                    <div tabIndex={0} role="button" onClick={this.closeDrawer}>
                        <div width="250">
                            <ListItem button key="Home" onClick={() => this.logout('/')}>
                                <ListItemIcon><HomeIcon /></ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItem>
                            <ListItem button key="Vote" onClick={() => this.logout('/vote')}>
                                <ListItemIcon><VoteIcon /></ListItemIcon>
                                <ListItemText primary="Vote" />
                            </ListItem>
                            {loginStatus}
                            <Divider />
                            <ListItem button key="Help" onClick={() => this.helpChild.current.handleOpen()}>
                                <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
                                <ListItemText primary="Help" />
                            </ListItem>
                            <ListItem button key="Cookies" onClick={() => this.ChangeView('/cookies')}>
                                <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
                                <ListItemText primary="Cookies" />
                            </ListItem>
                        </div>
                    </div>
                </Drawer>
                <HelpView ref={this.helpChild} />
                <CookieWarning ref={this.warningChild} />
            </div>
        );
    }
}
