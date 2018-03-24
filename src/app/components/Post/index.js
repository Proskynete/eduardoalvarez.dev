import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import 'moment-timezone';

import './Post.scss';

const Post = ({ content }) => {
  const {
    authorName,
    createDate,
    title,
    shortDescription,
    category,
  } = content;

  return (<section className="post col-12 col-md-7">
    <div className="post__header">
      <h2 className="post__header__author-name">{authorName}</h2>
      <h4 className="post__header__date">
        <Moment format="LL" locale="es">
          {createDate}
        </Moment>
      </h4>
    </div>
    <div className="post__body">
      <h1 className="post__body__title">{title}</h1>
      <p className="post__body__content">{shortDescription}</p>
    </div>
    <div className="post__footer text-right">
      <p className="post__footer__title">Categorías</p>
      <h3 className="post__footer__categories">{category}</h3>
    </div>
  </section>);
};

Post.propTypes = {
  content: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Post;
