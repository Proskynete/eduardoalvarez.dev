import React, { Component } from 'react';
import { render } from 'react-dom';

import './index.scss';

import Description from './views/Description/';
import Posts from './views/Posts/';

class App extends Component {
  render () {
  	return (
      <div className="row">
        <div className="col-12 col-md-3">
          <Description />
        </div>
        <div className="col-12 col-md-9">
          <Posts />
        </div>
      </div>
  	);
  };
};

render(<App />, document.getElementById('app'));
