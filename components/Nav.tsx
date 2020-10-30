import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuLinkInterface } from 'models/menu';
import Link from 'next/link';
import { useState } from 'react';

const navResources: MenuLinkInterface[] = [
	{
		link: '/',
		title: 'Inicio',
		show: true,
	},
	{
		link: '/articulos',
		title: 'Artículos',
		show: true,
	},
	{
		link: '/recursos',
		title: 'Recursos',
		show: false,
	},
	{
		link: '/autor',
		title: 'Autor',
		show: true,
	},
	{
		link: '/cursos',
		title: 'Cursos',
		show: false,
	},
	{
		link: '/glosario',
		title: 'Glosario',
		show: false,
	},
	{
		link: '/podcats',
		title: 'Podcasts',
		show: false,
	},
];

const Nav = () => {
	const [state, setState] = useState(false);

	return (
		<header className='nav' role='navigation'>
			<div className='nav__inner'>
				<section className='nav__inner__logo'>
					<Link href='/'>
						<a>
							<img
								src='/images/logo/logo.png'
								alt='logo'
								className='nav__inner__logo__img'
							/>
						</a>
					</Link>
				</section>

				<section className='nav__inner__menu'>
					<div
						className='nav__inner__menu__bar'
						role='presentation'
						onClick={() => setState(!state)}
					>
						<FontAwesomeIcon icon={state ? faTimes : faBars} />
					</div>
					<nav className={`nav__inner__menu__content ${state && 'active'}`}>
						<ul className='nav__inner__menu__content__inner'>
							{navResources.map(
								(resource) =>
									resource.show && (
										<li
											key={resource.link}
											className='nav__inner__menu__content__inner__item'
										>
											<Link href={resource.link}>
												<a className='nav__inner__menu__content__inner__item__link'>
													{resource.title}
												</a>
											</Link>
										</li>
									),
							)}
						</ul>
					</nav>
				</section>
			</div>
		</header>
	);
};

export default Nav;
