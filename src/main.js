import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Provider } from 'react-redux';
import store from './store';

const Main = () => (
	<Provider store={store}>
		<App />
	</Provider>
);

ReactDOM.render(<Main />, document.getElementById('app'));
