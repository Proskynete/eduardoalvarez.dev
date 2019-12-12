/* eslint-disable import/no-unresolved */
import React from 'react';
import config from '@Config/config';
import content from '@Contents/footer';
import './index.scss';

const Footer = () => (
	<footer className="footer">
		<p className="footer__block">{content.body.text}</p>
		<p className="footer__block">
			{config.createdWith.map(icon => (
				<i key={icon} className={icon} />
			))}
		</p>
	</footer>
);

export default Footer;
