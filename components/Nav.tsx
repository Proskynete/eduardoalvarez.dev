import { MenuLinkInterface } from 'models/menu';
import Link from 'next/link';

const navResources: MenuLinkInterface[] = [
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
	return (
		<nav className='nav'>
			<div className='nav__inner'>
				<section className='nav__inner__container'>
					<Link href='/'>
						<a>
							<img
								src='/images/logo/logo.png'
								alt='logo'
								className='nav__inner__container__logo'
							/>
						</a>
					</Link>
				</section>

				<section className='nav__inner__menu'>
					<ul className='nav__inner__menu__content'>
						{navResources.map(
							(resource) =>
								resource.show && (
									<li
										key={resource.link}
										className='nav__inner__menu__content__item'
									>
										<Link href={resource.link}>
											<a className='nav__inner__menu__content__item__link'>
												{resource.title}
											</a>
										</Link>
									</li>
								),
						)}
					</ul>
				</section>
			</div>
		</nav>
	);
};

export default Nav;
