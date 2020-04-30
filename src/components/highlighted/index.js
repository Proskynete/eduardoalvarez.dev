import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const Highlighted = props => {
	const { content } = props;

	return <span className="highlighted">{content}</span>;
};

Highlighted.propTypes = {
	content: PropTypes.string.isRequired,
};

export default Highlighted;
