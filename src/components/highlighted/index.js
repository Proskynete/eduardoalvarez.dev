import React from 'react';
import PropTypes from 'prop-types';

const Highlighted = (props) => {
  const {
    content,
  } = props;

  return (
    <span className="container__content__highlighted">
      { content }
    </span>
  );
};

Highlighted.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Highlighted;
