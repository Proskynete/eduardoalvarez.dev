import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createMarkup } from '@Helpers/print-html.helper';
import { Article, Header, Footer } from '@Components';
import { getHomeDataAction, getBlogDataAction } from '@Actions/';
import './index.scss';

const handlePrintHomeContent = data => data.map(ele => JSON.parse(ele.content));

const handlePrintBlogContent = data =>
	data.length < 1 ? (
		<div className="no-articles">
			<p>Aún no hay articulos publicados.</p>
			<p>Próximamente habrá contenido de tu interés!</p>
		</div>
	) : (
		data.map(content => <Article data={content} />)
	);

const Home = props => {
	const {
		homeContent,
		blogContent,
		getBlogDataMethod,
		getHomeDataMethod,
	} = props;

	useEffect(() => {
		getHomeDataMethod();
		getBlogDataMethod();
	}, []);

	return (
		<>
			<Header />
			<section className="home">
				<div className="home__inner">
					<div className="home__inner__description">
						<p
							className="home__inner__description__text"
							dangerouslySetInnerHTML={createMarkup(
								handlePrintHomeContent(homeContent),
							)}
						></p>
					</div>

					<div className="home__inner__blog">
						<div className="home__inner__blog__header">
							<h3 className="home__inner__blog__header__title">
								Últimos posts
							</h3>
							<Link className="home__inner__blog__header__subtitle" to="/blog">
								Leer todos
							</Link>
						</div>
						<div className="home__inner__blog__content">
							{handlePrintBlogContent(blogContent)}
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</>
	);
};

Home.propTypes = {
	homeContent: PropTypes.array.isRequired,
	blogContent: PropTypes.array.isRequired,
	getBlogDataMethod: PropTypes.func.isRequired,
	getHomeDataMethod: PropTypes.func.isRequired,
};

export default connect(
	state => ({
		homeContent: state.homeData.homeContent,
		blogContent: state.blogData.blogContent,
	}),
	dispatch => ({
		getHomeDataMethod: getHomeDataAction(dispatch),
		getBlogDataMethod: getBlogDataAction(dispatch),
	}),
)(Home);
