import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showDescription } from '../actions/show_description';

import './index.scss';

import Description from './views/Description/';
import Posts from './views/Posts/';
import ContentPost from './views/ContentPost/';


class App extends Component {
  componentWillMount() {
    this.props.showDescription();
  }

  render() {
    return (<div className="row">
      <div className="col-12 col-md-3">
        <Description />
      </div>
      <div className="col-12 col-md-9">
        {this.props.profile === 'listPosts' ? <Posts /> : <ContentPost /> }
      </div>
    </div>);
  }
}

const mapStateToProps = state => ({
  profile: state.profile.profile,
});

App.propTypes = {
  showDescription: PropTypes.func.isRequired,
  profile: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, { showDescription })(App);
