import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';

const Main = () => <div className="container-fluid">
    <App />
</div>

ReactDOM.render(<Main />, document.getElementById('app'));
