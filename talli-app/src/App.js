import React, { Component } from 'react';
import NavBar from './components/NavBar';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './components/Theme';
import RoutedApp from './routing/routing';
import './App.css';

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