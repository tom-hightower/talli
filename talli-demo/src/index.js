import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import TalliSpins from './Talli-Spins';
import SortContainer from './Sortable-Container';
import SubmitContainer from './Submit-Container';
import * as serviceWorker from './serviceWorker';

class DemoParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { submitted: false };
  }
  submittedCallback = (childSubmittedStatus) => {
    this.setState({ submitted: childSubmittedStatus });
  };

  render() {
    if (!this.state.submitted) {
      return (
        <div>
          <SortContainer />
          <SubmitContainer callbackFromParent={ this.submittedCallback }/>
        </div>
      );
    } else {
      return <></>;
    }
  }
}


ReactDOM.render(<App />, document.getElementById('header'));
ReactDOM.render(<DemoParent />, document.getElementById('root'));

serviceWorker.unregister();
