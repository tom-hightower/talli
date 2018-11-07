import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TalliSpins from './Talli-Spins';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<TalliSpins />, document.getElementById('talli-spins'));

serviceWorker.unregister();
