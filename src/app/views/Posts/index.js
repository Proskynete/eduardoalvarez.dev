/* eslint-disable react/no-unused-prop-types, react/require-default-props, jsx-a11y/label-has-for,
 react/forbid-prop-types, react/no-array-index-key, no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Post from '../../components/Post/';
import { showData } from '../../../actions/get_data';

import './Posts.scss';

class Posts extends Component {
  componentWillMount() {
    this.props.showDataMethod();
  }

  render() {
    if (this.props.posts.length < 1) {
      return (<p className="text-center" />);
    }
    const postContent = this.props.posts.map(data => <Post content={data} key={data._id} />);
    return (<div className="posts">{postContent}</div>);
  }
}

Posts.propTypes = {
  showDataMethod: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
};

export default connect(
  state => ({
    posts: state.posts.posts,
  }),
  dispatch => ({
    showDataMethod: showData(dispatch),
  }),
)(Posts);
