import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

const Nav = () => (
	<div className="nav">
		<nav className="nav__content">
			<li className="nav__content__item">
				<Link className="nav__content__item__link" to="/">
					Home
				</Link>
			</li>
			<li className="nav__content__item">
				<Link className="nav__content__item__link" to="/quien-soy">
					Quien soy
				</Link>
			</li>

			<li className="nav__content__item">
				<Link className="nav__content__item__link" to="/blog">
					Blog
				</Link>
			</li>
		</nav>
	</div>
);

export default Nav;
