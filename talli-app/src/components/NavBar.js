import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import './component_style/NavBar.css';
import logoSvg from '../logo.svg';

export default class NavBar extends React.Component {

    render(){
        return(
            <div className="root">
                <AppBar position="static" >
                    <Toolbar>
                        <IconButton className="menuButton" color="inherit" aria-label="Menu" >
                            <MenuIcon />
                        </IconButton>
                        <img src={logoSvg} className="navTitle" alt="talli" />
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
