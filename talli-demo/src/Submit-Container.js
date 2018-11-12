import React, { Component } from 'react';
import BellIcon from '@material-ui/icons/NotificationImportant';
import './Submit-Container.css';

class SubmitContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState(state => ({
	isToggleOn: !state.isToggleOn
    }));
  }
  
  render() {
    return(
      <div class='SubmitDiv'>
        <BellIcon class='BellIcon' />
        <div class='SubmitText'>
          Voting closes at 00:00
        </div>
	<div class='buttonDiv'>
          <button class='buttonOut' onClick={this.handleClick}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default SubmitContainer;
