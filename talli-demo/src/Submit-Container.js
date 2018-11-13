import React, { Component } from 'react';
import BellIcon from '@material-ui/icons/NotificationImportant';
import './Submit-Container.css';

class SubmitContainer extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.handleBellClick = this.handleBellClick.bind(this);
    this.state = { time: {}, seconds: 1000, submitted: false };
    this.timer = 0;
    this.countDown = this.countDown.bind(this);
  }

  handleBellClick(e) {
    e.preventDefault();
    this.resetTimer();
  }

  handleSubmitClick(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    this.props.callbackFromParent(this.state.submitted);
  }

  resetTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    } else {
      this.setState( { time: {}, seconds: 1000 });
    }
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }


  countDown() {
    // Remove one second, set state so a re-render happens
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    
    if (seconds === 0) { 
      clearInterval(this.timer);
    }
  }    
  
  render() {
    return(
      <div className='SubmitDiv'>
          <BellIcon class='BellIcon' onClick={this.handleBellClick} />
          <div className='SubmitText'>
            {/* this awful syntax is a quick'n'dirty way to
                make sure that minutes/seconds are always
                displayed as two digits
            */}
            Voting closes in {("0" + this.state.time.m).slice(-2)}:{("0" + this.state.time.s).slice(-2)}
        </div>
	<div className='buttonDiv'>
          <button className='buttonOut' onClick={this.handleSubmitClick}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default SubmitContainer;
