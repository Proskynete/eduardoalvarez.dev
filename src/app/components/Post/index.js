import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showData } from '../../../actions/get_data';
import { onlyDate, agoFormat } from '../../../helpers/date-format';

import './Post.scss';

const handleSplitCategories = _categories => _categories.toString();

const Post = ({ content, showDataMethod }) => {
  const {
    _id,
    authorName,
    createDate,
    title,
    shortDescription,
    categories,
  } = content;

  return (<section className="post col-12 col-md-7" onClick={() => { showDataMethod(_id)} }>
    <div className="post__header">
      <h2 className="post__header__author-name">{authorName}</h2>
      <h4 className="post__header__date">
        <time dateTime={onlyDate(createDate)}>{agoFormat(createDate)}</time>
      </h4>
    </div>
    <div className="post__body">
      <h1 className="post__body__title">{title}</h1>
      <p className="post__body__content">{shortDescription}</p>
    </div>
    <div className="post__footer text-right">
      <p className="post__footer__title">Categorías</p>
      <h3 className="post__footer__categories">{ handleSplitCategories(categories) }</h3>
    </div>
  </section>);
};

Post.propTypes = {
  showDataMethod: PropTypes.func.isRequired,
  content: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default connect(
  state => ({
    state,
  }),
  dispatch => ({
    showDataMethod: showData(dispatch),
  }),
)(Post);
