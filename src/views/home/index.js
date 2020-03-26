/* eslint-disable react/no-danger */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { Header, Footer } from '@Components';
import { Link } from 'react-router-dom';
import './index.scss';

const Home = () => {
	return (
		<>
			<Header />
			<section className="home">
				<div className="home__inner">
					<div className="home__inner__description">
						<p className="home__inner__description__text">
							Soy Desarrollador web y actualmente{' '}
							<span className="home__inner__description__text__bold">
								Ssr developer
							</span>{' '}
							en{' '}
							<span className="home__inner__description__text__bold">
								Globant Chile
							</span>
							. Apasionado por las tecnologías web (JS lover).
						</p>
						<p className="home__inner__description__text">
							Busco poder enseñar todo el conocimiento que he adquirido en mi{' '}
							<Link className="home__inner__description__text__link" to="/blog">
								blog
							</Link>{' '}
							y también en mi canal de{' '}
							<a
								className="home__inner__description__text__link"
								href="https://www.youtube.com/channel/UCVrAjdQkLTKOdG0TUFFJomw"
								target="_blank"
								rel="noopener noreferrer"
							>
								youtube.
							</a>
						</p>
					</div>
				</div>
			</section>
			<Footer />
		</>
	);
};

export default Home;
