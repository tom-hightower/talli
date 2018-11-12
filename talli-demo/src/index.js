import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import TalliSpins from './Talli-Spins';
import SortContainer from './Sortable-Container';
import SubmitContainer from './Submit-Container';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
//ReactDOM.render(<TalliSpins />, document.getElementById('talli-spins'));
ReactDOM.render(<SortContainer />, document.getElementById('sortable-container'));
ReactDOM.render(<SubmitContainer />, document.getElementById('submit-container'));

serviceWorker.unregister();
