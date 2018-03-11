import React, { Component } from 'react';
import { render } from 'react-dom';

import Description from './Description/';

class App extends Component {
  render () {
  	return(
  		<div className="container">
          <Description />
      </div>
  	);
  };
};

render(<App />, document.getElementById('app'));
