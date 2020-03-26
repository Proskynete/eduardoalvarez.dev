/* eslint-disable import/no-unresolved */
import React from 'react';
import LOGO from '@Images/full-logo-negative.png';
import scrollToTop from '@Helpers/scroll';
import './index.scss';

const handleGoToTheTop = () => {
	scrollToTop();
};

const Footer = () => (
	<footer className="footer">
		<div className="footer__inner">
			<div className="footer__inner__logo">
				<img src={LOGO} alt="Eduardo Alvarez. Formación en tecnología" />
			</div>
			<div className="footer__inner__description">
				<p className="footer__inner__description__copy">
					Copirights © 2017 - 2020
				</p>
				<p
					className="footer__inner__description__to_top"
					onClick={handleGoToTheTop}
				>
					Volver arriba
				</p>
			</div>
		</div>
	</footer>
);

export default Footer;
