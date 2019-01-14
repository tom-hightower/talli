import React, { Component } from 'react';
import NavBar from './components/NavBar';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './components/Theme';
import RoutedApp from './routing/routing';
import './App.css';

/** 
 * 'App' serves as a colleciton point of lower components before they
 * are sent off to rendering in index.js
 * This gives us a place to inject routing and theming as well as place
 * components that stay constant throughout the experience, such as the
 * NavBar
*/
export default class App extends Component {

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <NavBar />
                    <RoutedApp />
                </div>
            </MuiThemeProvider>
        );
    }
}