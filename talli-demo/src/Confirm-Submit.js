import React, { Component } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import './Confirm-Submit.css';

class ConfirmSubmit extends Component {
  constructor(props) {
    super(props);
    this.state = { buttonClicked: 'none' };
    this.handleGoBack = this.handleGoBack.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleGoBack(e) {
    e.preventDefault();
    this.setState({ buttonClicked: 'goback' });
    this.props.callbackFromParent(this.state.buttonClicked);
  }

  handleConfirm(e) {
    e.preventDefault();
    this.setState({ buttonClicked: 'confirm' });
    this.props.callbackFromParent(this.state.buttonClicked);
  }
    
  render() {
    return(
      <div className="SubmissionPage">
        <div className="submissionText">
          You may only submit your rankings once.
        </div>
        <div className="questionText">
          Would you like to continue?
        </div>
        <div className="buttonContainer">
          <CloseIcon class="goBackButton" onClick={this.handleGoBack}/>
          <CheckIcon class="confirmButton" onClick={this.handleConfirm}/>
        </div>
      </div>
    );
  }
}

export default ConfirmSubmit;
