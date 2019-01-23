import React from 'react';
import GoogleLogin from 'react-google-login';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import OrganizerIcon from '@material-ui/icons/AssignmentInd';
import VoteIcon from '@material-ui/icons/HowToVote';
import { Drawer, ListItemIcon, ListItemText, ListItem, Divider } from '@material-ui/core';

import './component_style/NavBar.css';
import logoSvg from '../logo.svg';
import { navigate } from 'react-mini-router';

/**
 * The NavBar contains the top AppBar as well as the navigation Drawer on
 * the left side, activated by the hamburger menu icon 
 */
export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    toggleDrawer = () => this.setState({ open: !this.state.open });
    closeDrawer = () => this.setState({open: false});
    ChangeView(page) { navigate(page); }


    // TODO: update state in App.js
    onSuccess = (response) => {
        console.log(response);
        this.ChangeView('/organizer');
    }

    onFailure = () => {
        console.log("Failed to Login");
    }

    render() {
        // List of buttons for the navigation drawer
        const drawerList = (
            <div width="250">
                <ListItem button key='Home' onClick={() => this.ChangeView('/')}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary='Home' />
                </ListItem>
                <ListItem button key='Vote' onClick={() => this.ChangeView('/vote')}>
                    <ListItemIcon><VoteIcon /></ListItemIcon>
                    <ListItemText primary='Vote' />
                </ListItem>
                {/* TODO: Make it so if they are already logged in, nothing happens when they click */}
                <GoogleLogin 
                    clientId="1061225539650-cp3lrdn3p1u49tsq320l648hcuvg8plb.apps.googleusercontent.com"
                    render={renderProps => (
                        <ListItem button key='Organizer Login' onClick={renderProps.onClick}>
                            <ListItemIcon><OrganizerIcon /></ListItemIcon>
                            <ListItemText primary='Organizer Login' />
                        </ListItem>
                    )}
                    onSuccess={this.onSuccess.bind(this)}
                    onFailure={this.onFailure.bind(this)} />
                <Divider />
                <ListItem button key='Help' onClick={() => this.ChangeView('/help')}>
                    <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
                    <ListItemText primary='Help' />
                </ListItem>
            </div>
        );

        return (
            <div className="root">
                <AppBar position="static" >
                    <Toolbar>
                        <IconButton className="menuButton" color="inherit" aria-label="Menu" onClick={this.toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <img src={logoSvg} className="navTitle" alt="talli" />
                    </Toolbar>
                </AppBar>
                <Drawer open={this.state.open} onClose={this.closeDrawer}>
                    <div tabIndex={0} role="button" onClick={this.closeDrawer}>
                        {drawerList}
                    </div>
                </Drawer>
            </div>
        );
    }
}
