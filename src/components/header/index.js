/* eslint-disable import/no-unresolved */
import React from 'react';
import config from '@Config/config-content';
import ME from '@Images/me.jpg';
import './index.scss';

const handleShowIconSocials = () =>
	config.socials.map(social => (
		<a
			key={social.name}
			className="header__inner__socials__link"
			href={social.link}
			rel="noopener noreferrer"
			target="_blank"
		>
			<i className={social.icon} title={social.name} />
		</a>
	));

const Header = () => (
	<>
		<div className="header">
			<div className="header__inner">
				<p className="header__inner__title">
					Hola! Mi nombre es Eduardo Alvarez
				</p>
				<p className="header__inner__subtitle">
					soy desarrollador web y éste es mi sitio web. Bienvenidx!!
				</p>
				<div className="header__inner__socials">{handleShowIconSocials()}</div>
			</div>
		</div>
		<div className="header__me">
			<img src={ME} alt="Eduardo Esteban Álvarez Castañeda" />
		</div>
	</>
);

export default Header;
