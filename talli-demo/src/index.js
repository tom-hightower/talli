import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import TalliSpins from './Talli-Spins';
import SortContainer from './Sortable-Container';
import SubmitContainer from './Submit-Container';
import ConfirmSubmit from './Confirm-Submit';
import SubmittedRanks from './Submitted-Rankings';
import * as serviceWorker from './serviceWorker';

class DemoParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { submitted: false, confirmationButton: 'none' };
  }
  submittedCallback = (childSubmittedStatus) => {
    this.setState({ submitted: childSubmittedStatus });
  };

  confirmButtonCallback = (childButtonStatus) => {
    this.setState({ confirmationButton: childButtonStatus });
  };

  render() {
    if ((!this.state.submitted && this.state.confirmationButton === 'none') || this.state.confirmationButton === 'goback') {
      if (this.state.confirmationButton === 'goback') {
        this.setState({ submitted: false, confirmationButton: 'none' });
      }
      return (
        <div>
          <SortContainer />
          <SubmitContainer callbackFromParent={ this.submittedCallback } />
        </div>
      );
    } else if (this.state.confirmationButton === 'none') {
      return <ConfirmSubmit callbackFromParent={ this.confirmButtonCallback } />;
    } else if (this.state.confirmationButton === 'confirm') {
      return <SubmittedRanks />;
    }
  }
}


ReactDOM.render(<App />, document.getElementById('header'));
ReactDOM.render(<DemoParent />, document.getElementById('root'));

serviceWorker.unregister();
