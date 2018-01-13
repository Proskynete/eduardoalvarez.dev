import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  	render () {
    	return(
    		<p> Hello React project a</p>
    	)
  	};
};

render(<App />, document.getElementById('app'));