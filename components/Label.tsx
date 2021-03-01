import React from 'react';

const Label = ({ text, variant, ...rest }) => {
	return (
		<div className={`label ${variant}`} {...rest}>
			{text}
		</div>
	);
};

export default Label;
