import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { transformMarkdownToHtml } from '@Helpers/print-html.helper';
import { printArticles } from '@Helpers/print-articles.helper';
import { Header, Loader } from '@Components';
import { getHomeDataAction, getLastBlogDataAction } from '@Actions/';
import { changeMetadataValue } from '@Helpers/add_metadata.helper';
import './index.scss';

const HomeView = (props) => {
	const {
		homeContent,
		blogContent,
		getHomeDataMethod,
		getLastBlogDataMethod,
	} = props;

	useEffect(() => {
		getLastBlogDataMethod();
		getHomeDataMethod();
	}, []);

	return homeContent.length > 0 && blogContent.length > 0 ? (
		<>
			{changeMetadataValue({
				title:
					'Eduardo Álvarez | Blog de formación y desarrollo web con JavaScript',
				description:
					'Bienvenidxs a mi sitio web!. Acá encontrarás artículos y video tutoriales sobre programación web utilizando html, css y javascript. También podrás encontrar Artículos sobre React, Node y Flutter.',
				url: 'https://eduardoalvarez.cl/',
			})}
			<Header />
			<section className='home'>
				<div className='home__inner'>
					<div className='home__inner__description'>
						{homeContent.map((element) => (
							<div key={element._id} className='home__inner__description__text'>
								{transformMarkdownToHtml(element.content)}
							</div>
						))}
					</div>

					<div className='home__inner__blog'>
						<div className='home__inner__blog__header'>
							<h3 className='home__inner__blog__header__title'>
								Últimos posts
							</h3>
							<Link className='home__inner__blog__header__subtitle' to='/blog'>
								Leer todos
							</Link>
						</div>
						<div className='home__inner__blog__content'>
							{printArticles(blogContent)}
						</div>
					</div>
				</div>
			</section>
		</>
	) : (
		<Loader url='https://eduardoalvarez.cl/' />
	);
};

HomeView.propTypes = {
	homeContent: PropTypes.array.isRequired,
	blogContent: PropTypes.array.isRequired,
	getHomeDataMethod: PropTypes.func.isRequired,
	getLastBlogDataMethod: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		homeContent: state.homeData.homeContent,
		blogContent: state.blogData.blogContent,
	}),
	(dispatch) => ({
		getHomeDataMethod: getHomeDataAction(dispatch),
		getLastBlogDataMethod: getLastBlogDataAction(dispatch),
	}),
)(memo(HomeView));
