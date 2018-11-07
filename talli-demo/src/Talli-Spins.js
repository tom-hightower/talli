import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class TalliSpins extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            talli spins so you do not have to &trade;
          </p>
          <a
            className="App-link"
            href="https://github.com/Tom-Hightower/talli/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Talli on Github
          </a>
        </header>
      </div>
    );
  }
}

export default TalliSpins;
