import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LOGO from '@Images/logo.png';
import './index.scss';

const Nav = () => {
	const [showMenu, setShowMenu] = useState(false);
	const barIcon = 'fa-bars';
	const closeIcon = 'fa-times';

	return (
		<nav className="nav">
			<section className="nav__container">
				<div className="nav__container__logo">
					<Link className="nav__container__logo__link" to="/">
						<img
							src={LOGO}
							alt="logo"
							className="nav__container__logo__link__img"
						/>
					</Link>
				</div>

				<div className="nav__container__icon">
					<div
						className="nav__container__icon__container"
						onClick={() => setShowMenu(!showMenu)}
					>
						<i className={`fas ${showMenu ? closeIcon : barIcon}`} />
					</div>
				</div>
			</section>

			<section className={`nav__menu ${showMenu ? 'active' : ''}`}>
				<ul className="nav__menu__content">
					<li className="nav__menu__content__item">
						<Link className="nav__menu__content__item__link" to="/blog">
							Blog
						</Link>
					</li>
					<li className="nav__menu__content__item">
						<Link className="nav__menu__content__item__link" to="/about">
							Sobre mi
						</Link>
					</li>
				</ul>
			</section>
		</nav>
	);
};

export default Nav;
