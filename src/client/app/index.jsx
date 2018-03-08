import React, { Component } from 'react';
import { render } from 'react-dom';

import Header from './Header/';

class App extends Component {
  render () {
  	return(
  		<div className="container">
          <Header />
      </div>
  	);
  };
};

render(<App />, document.getElementById('app'));
