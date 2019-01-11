import React, { Component } from 'react';
import NavBar from './components/NavBar';
import Typography from '@material-ui/core/Typography';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './components/theme';
import './App.css';

export default class App extends Component {
  state = {
    page:'',
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <NavBar />
          <Typography variant='display1' align='center' gutterBottom>test</Typography>
        </div>
      </MuiThemeProvider>
    );
  }
}
