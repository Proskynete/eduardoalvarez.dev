import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Description from './views/Description/';
import ContentPost from './views/ContentPost/';
import Posts from './views/Posts/';

import './index.scss';

const App = (props) => {
  const profile = {
    posts: (<Posts />),
    details: (<ContentPost />),
  };

  return (<div className="row">
    <div className="col-12 col-md-3">
      <Description />
    </div>
    <div className="col-12 col-md-9">
      {profile[props.profile]}
    </div>
  </div>);
};

const mapStateToProps = state => ({
  profile: state.profile.profile,
});

App.propTypes = {
  profile: PropTypes.string.isRequired,
};


export default connect(mapStateToProps)(App);
