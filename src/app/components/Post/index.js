import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

import './Post.scss';

class Post extends Component {
  constructor(props) {
    super(props);
    console.log(props.content)
  }

  render() {
    return (
      <section className="post col-12 col-md-7">
        <div className="post__header">
          <h2 className="post__header__author-name">{this.props.content.authorName}</h2>
          <h4 className="post__header__date">
            <Moment format="LL" locale="es">
              {this.props.content.createDate}
            </Moment>
          </h4>
        </div>
        <div className="post__body">
          <h1 className="post__body__title">{this.props.content.title}</h1>
          <p className="post__body__content">{this.props.content.shortDescription}</p>
        </div>
        <div className="post__footer text-right">
          <p className="post__footer__title">Categorías</p>
          <h3 className="post__footer__categories">{this.props.content.category}</h3>
        </div>
      </section>
    );
  }
};

export default Post;
