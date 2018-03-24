/* eslint-disable react/no-unused-prop-types, react/require-default-props, jsx-a11y/label-has-for,
 react/forbid-prop-types, react/no-array-index-key, no-underscore-dangle */
import React, { Component } from 'react';
import config from '../../../config/config';
import Post from '../../components/Post/';

import './Posts.scss';

class Posts extends Component {
  constructor() {
    super();
    this.state = { posts: [] };
  }

  componentWillMount() {
    fetch(config.links.api)
      .then(response => response.json())
      .then((response) => {
        this.setState({ posts: response.response.posts });
      });
  }

  render() {
    if (this.state.posts.length < 1) {
      return (<p className="text-center" />);
    }
    const postContent = this.state.posts.map(data => <Post content={data} key={data._id} />);
    return (<div className="posts">{postContent}</div>);
  }
}

export default Posts;
