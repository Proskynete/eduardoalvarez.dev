import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Description from './views/Description/';
import ContentArticle from './views/ContentArticle/';
import Articles from './views/Articles/';

import './index.scss';

const App = (props) => {
  const profile = {
    articles: (<Articles />),
    details: (<ContentArticle />),
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
