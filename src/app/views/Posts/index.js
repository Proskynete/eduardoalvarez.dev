import React, { Component } from 'react';
import Post from '../../components/Post/';

import './Posts.scss';

class Posts extends Component {
  constructor(props) {
    super(props);
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
    if (this.state.posts.length > 0) {
      return (
        <div className="posts">
          <Post detalle={this.state.posts} />
        </div>
      );
    } else {
      return <p className="text-center">Cargando empleados...</p>
    }
  }
};

export default Posts;
