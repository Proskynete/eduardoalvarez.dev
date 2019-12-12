import React from 'react';
import PropTypes from 'prop-types';

const LinkWeb = (props) => {
  const {
    link,
    title,
  } = props;

  return (
    <a
      className="container__content__link"
      target="_blank"
      rel="noopener noreferrer"
      href={link}
    >
      { title }
    </a>
  );
};

LinkWeb.propTypes = {
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default LinkWeb;
