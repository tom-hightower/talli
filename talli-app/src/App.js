import React, { Component } from 'react';
import NavBar from './components/NavBar';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './components/Theme';
import './App.css';

export default class App extends Component {
  state = {
    page:0,
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <NavBar />
        </div>
      </MuiThemeProvider>
    );
  }
}
