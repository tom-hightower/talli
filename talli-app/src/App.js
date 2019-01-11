import React, { Component } from 'react';
import NavBar from './components/NavBar';
import Typography from '@material-ui/core/Typography';
import './App.css';

export default class App extends Component {
  state = {
    page:'',
  };

  render() {
    return (
      <div>
        <NavBar />
        <Typography variant='display1' align='center' gutterBottom>test</Typography>
      </div>
    );
  }
}
