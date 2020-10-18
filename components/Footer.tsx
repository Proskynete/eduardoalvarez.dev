import { faAngleUp, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'data/config.json';
import { scrollToTop } from 'helpers/scroll.helper';
import React, { FC } from 'react';

import SocialNetworks from './SocialNetworks';
import Subscribe from './Subscribe';

const Footer: FC = () => {
	const currentYear: number = new Date().getFullYear();

	return (
		<section className='row'>
			<section className='col-12'>
				<Subscribe />
			</section>
			<SocialNetworks />
			<footer className='footer'>
				<div className='footer-button'>
					<button className='button outline' onClick={() => scrollToTop()}>
						<FontAwesomeIcon icon={faAngleUp} />
						<p className='footer-button-text'>Subir</p>
					</button>
					<div className='footer-legals'>
						<div className='footer-legals-links'>
							<span className='legal'>Términos</span>
							<span className='legal'>Políticas</span>
						</div>
						<p className='made-by'>
							Creado con <FontAwesomeIcon icon={faHeart} />
						</p>
					</div>
				</div>

				<div className='footer-info'>
					<div className='footer-mail'>
						<p className='footer-mail-title'>Contacto</p>
						<a
							href={`mailto:${config.email}`}
							target='_blank'
							rel='noopener noreferrer'
							className='footer-mail-link'
						>
							{config.email}
						</a>
					</div>

					<div className='copyright'>
						<img
							src='/images/logo/white.png'
							alt='logotipo'
							className='small'
						/>
						<img
							src='/images/logo/white2.png'
							alt='logotipo'
							className='medium'
						/>
						<p>Copyright &copy; 2017 - {currentYear}</p>
					</div>
				</div>
			</footer>
		</section>
	);
};

export default Footer;
