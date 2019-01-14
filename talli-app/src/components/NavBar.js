import React from 'react';
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

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }   

    toggleDrawer = () => this.setState({open: !this.state.open});
    closeDrawer = () => this.setState({open: false});

    render(){
        const drawerList = (
            <div width="250">
                <ListItem button key='Home'>
                    <ListItemIcon><HomeIcon/></ListItemIcon>
                    <ListItemText primary='Home'></ListItemText>
                </ListItem>
                <ListItem button key='Vote'>
                    <ListItemIcon><VoteIcon/></ListItemIcon>
                    <ListItemText primary='Vote'></ListItemText>
                </ListItem>
                <ListItem button key='Organizer Login'>
                    <ListItemIcon><OrganizerIcon/></ListItemIcon>
                    <ListItemText primary='Organizer Login'></ListItemText>
                </ListItem>
                <Divider />
                <ListItem button key='Help'>
                    <ListItemIcon><HelpOutlineIcon/></ListItemIcon>
                    <ListItemText primary='Help'></ListItemText>
                </ListItem>
            </div>
          );

        return(
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
