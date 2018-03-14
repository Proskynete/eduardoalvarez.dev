import React, { Component } from 'react';
import { render } from 'react-dom';

import './index.scss';

import Description from './Description/';

class App extends Component {
  render () {
  	return(
      <div className="row">
        <div className="col-12 col-md-3">
          <Description />
        </div>
        <div className="col-12 col-md-9" />
      </div>
  	);
  };
};

render(<App />, document.getElementById('app'));
