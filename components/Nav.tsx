import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuLinkInterface } from 'models/menu';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';

const navResources: MenuLinkInterface[] = [
	{
		link: '/',
		pathsAllowed: ['/'],
		title: 'Inicio',
		show: true,
	},
	{
		link: '/articulos',
		pathsAllowed: ['/articulos', '/articulos/[slug]'],
		title: 'Artículos',
		show: true,
	},
	{
		link: '/recursos',
		pathsAllowed: ['/recursos'],
		title: 'Recursos',
		show: false,
	},
	{
		link: '/autor',
		pathsAllowed: ['/autor'],
		title: 'Autor',
		show: true,
	},
	{
		link: '/cursos',
		pathsAllowed: ['/cursos'],
		title: 'Cursos',
		show: false,
	},
	{
		link: '/glosario',
		pathsAllowed: ['/glosario'],
		title: 'Glosario',
		show: false,
	},
	{
		link: '/podcats',
		pathsAllowed: ['/podcats'],
		title: 'Podcasts',
		show: false,
	},
];

interface PropsInterface {
	path: string;
}

const Nav = (props: PropsInterface) => {
	const [state, setState] = useState(false);
	const { path } = props;

	const handleRemoveActive = () => {
		document
			.querySelectorAll('.nav__inner__menu__content__inner__item__link')
			.forEach((_link) => {
				_link.classList.remove('active');
			});
	};

	return (
		<header className='nav' role='navigation'>
			<div className='nav__inner'>
				<section className='nav__inner__logo'>
					<Link href='/'>
						<a>
							<Image
								src='/images/logo/logo.png'
								alt='logo'
								className='nav__inner__logo__img'
								unsized={true}
							/>
						</a>
					</Link>
				</section>

				<section className='nav__inner__menu'>
					<div
						className={`nav__inner__menu__bar ${state && 'mobile'}`}
						role='presentation'
						onClick={() => setState(!state)}
					>
						<FontAwesomeIcon icon={state ? faTimes : faBars} />
					</div>
					<nav className={`nav__inner__menu__content ${state && 'mobile'}`}>
						<ul className='nav__inner__menu__content__inner'>
							{navResources.map(
								(resource) =>
									resource.show && (
										<li
											key={resource.link}
											className='nav__inner__menu__content__inner__item'
										>
											<Link href={resource.link} passHref>
												<p
													role='presentation'
													onClick={handleRemoveActive}
													className={`nav__inner__menu__content__inner__item__link ${
														state && 'mobile'
													} ${
														resource.pathsAllowed.includes(path) && 'active'
													}`}
												>
													{resource.title}
												</p>
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

export default memo(Nav);
