import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import App from './app/index';
import reducers from './reducers/';

const eduardoalvarez = applyMiddleware(thunk)(createStore);

const Main = () =>
    (<Provider store={eduardoalvarez(reducers)}>
        <div className="container-fluid">
            <App />
        </div>
    </Provider>);

ReactDOM.render(<Main />, document.getElementById('app'));
