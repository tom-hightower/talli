import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import OrganizerIcon from '@material-ui/icons/AssignmentInd'
import { Drawer, ListItemIcon, ListItemText, ListItem, List, Divider } from '@material-ui/core';

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
              <List>
                {['Home', 'Organizer Login',].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <HomeIcon /> : <OrganizerIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {['Help',].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <HelpOutlineIcon /> : <HelpOutlineIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
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
