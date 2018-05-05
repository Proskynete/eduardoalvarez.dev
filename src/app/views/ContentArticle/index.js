import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { onlyDate, prettyFormat } from '../../../helpers/date-format';
import { showData } from '../../../actions/get_data';
import './index.scss';

const ContentArticle = ({ description, showDataMethod }) => {
  const {
    title,
    authorName,
    createDate,
    image,
    body,
  } = description;

  return (
    <section className="content col-12 col-md-8">
      <button
        className="content__button"
        onClick={() => { showDataMethod(); }}
        role="button"
        tabIndex="0"
      >
        <i className="fas fa-undo-alt" /> Volver a los artículos
      </button>
      <img src={image} alt={title} className="content__image" />
      <header className="content__header">
        <h1 className="content__header__title">{title}</h1>
        <div>
          <time className="content__header__date" dateTime={onlyDate(createDate)}>
            {prettyFormat(createDate)}
          </time>
        </div>
      </header>
      <article className="content__body">{body}</article>
      <footer className="content__footer">
        <h1 className="content__footer__author">{authorName}</h1>
        <p className="content__footer__know_more">Saber sobre el autor</p>
      </footer>
    </section>
  );
};

ContentArticle.propTypes = {
  showDataMethod: PropTypes.func.isRequired,
  description: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default connect(
  state => ({
    description: state.description.description,
  }),
  dispatch => ({
    showDataMethod: showData(dispatch),
  }),
)(ContentArticle);
