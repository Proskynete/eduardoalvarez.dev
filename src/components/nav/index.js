import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LOGO from '@Images/logo.png';
import './index.scss';

const Nav = () => {
	const [showMenu, setShowMenu] = useState(false);
	const barIcon = 'fa-bars';
	const closeIcon = 'fa-times';

	return (
		<nav className='nav'>
			<div className='nav__inner'>
				<section className='nav__inner__container'>
					<div className='nav__inner__container__logo'>
						<Link
							className='nav__inner__container__logo__link'
							to='/'
							onClick={() => setShowMenu(false)}
						>
							<img
								src={LOGO}
								alt='logo'
								className='nav__inner__container__logo__link__img'
							/>
						</Link>
					</div>

					<div className='nav__inner__container__icon'>
						<div
							className='nav__inner__container__icon__container'
							onClick={() => setShowMenu(!showMenu)}
						>
							<i className={`fas ${showMenu ? closeIcon : barIcon}`} />
						</div>
					</div>
				</section>

				<section className={`nav__inner__menu ${showMenu ? 'active' : ''}`}>
					<ul className='nav__inner__menu__content'>
						<li className='nav__inner__menu__content__item'>
							<Link
								className='nav__inner__menu__content__item__link'
								to='/blog'
								onClick={() => setShowMenu(false)}
							>
								Blog
							</Link>
						</li>
						<li className='nav__inner__menu__content__item'>
							<Link
								className='nav__inner__menu__content__item__link'
								to='/about_me'
								onClick={() => setShowMenu(false)}
							>
								Sobre mi
							</Link>
						</li>
					</ul>
				</section>
			</div>
		</nav>
	);
};

export default Nav;
