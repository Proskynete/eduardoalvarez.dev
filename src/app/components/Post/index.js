import React, { Component } from 'react';

import './Post.scss';

class Post extends Component {
  constructor(props) {
    super(props);
    console.log(props.content)
  }

  render() {
    return (
      <section className="post col-12 col-md-8">
        <div className="post__header">
          <h2 className="post__header__author-name">Eduardo Alvarez</h2>
          <h4 className="post__header__date">{this.props.content.createDate}</h4>
          <h1 className="post__header__title">{this.props.content.title}</h1>
        </div>
        <div className="post__body">
          <p className="post__body__content">{this.props.content.shortDescription}</p>
        </div>
        <div className="post__footer text-right">
          <h3 className="post__footer__category">{this.props.content.category}</h3>
        </div>
      </section>
    );
  }
};

export default Post;
