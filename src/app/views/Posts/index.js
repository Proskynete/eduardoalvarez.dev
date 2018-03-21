import React, { Component } from 'react';
import Post from '../../components/Post/';

import './Posts.scss';

class Posts extends Component {
  constructor() {
    super();
    this.state = { posts: [] }
  }

  componentWillMount() {
    let url = "http://localhost:3000/node/api/blog/";
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        this.setState({
          posts: response.response.posts
        });
      });
  }

  render() {
    if (this.state.posts.length < 1) {
      return <p className="text-center"></p>
    } else {
      const postContent = this.state.posts.map((data) => <Post content={data} key={data._id} />);
      return <div className="posts">{postContent}</div>;
    }
  }
};

export default Posts;
