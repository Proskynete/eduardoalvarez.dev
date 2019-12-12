/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';

import Author from '@Components/author';
import content from '@Contents/coffe';
import './index.scss';

const handleShowButtonBMAC = () => (
	<a
		className="coffee__inner__container__btn_bmc"
		target="_blank"
		rel="noopener noreferrer"
		href={content.buttonBMAC.link.href}
	>
		<img
			src={content.buttonBMAC.btn.img.link}
			alt={content.buttonBMAC.btn.img.alt}
		/>
		<span>{content.buttonBMAC.btn.text}</span>
	</a>
);

const Coffee = props => {
	const { children } = props;

	return (
		<section className="coffee">
			<div className="coffee__inner">
				{children ? (
					<div className="coffee__inner__container">
						<Author />
					</div>
				) : (
					''
				)}
				<div className="coffee__inner__container">
					<h1 className="coffee__inner__container__title">{content.title}</h1>
					<p className="coffee__inner__container__content">
						{`${content.body.text} `}
						<i className={content.body.icon.class} />
					</p>
					{handleShowButtonBMAC()}
				</div>
			</div>
		</section>
	);
};

Coffee.defaultProps = {
	children: '',
};

Coffee.propTypes = {
	children: PropTypes.node,
};

export default Coffee;
