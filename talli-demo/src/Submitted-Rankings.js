import React, { Component } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import './Confirm-Submit.css';

class SubmittedRanks extends Component {
    
  render() {
    return(
      <div className="SubmissionPage">
        <div className="submissionText">
          Submission successful.
        </div>
        <div className="questionText">
          Thank you for your participation!
        </div>
        <div className="buttonContainer">
          <HomeIcon class="homeButton" />
        </div>
      </div>
    );
  }
}

export default SubmittedRanks;
