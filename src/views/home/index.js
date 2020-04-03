import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createMarkup } from '@Helpers/print-html.helper';
import { Header, Footer } from '@Components';
import { getHomeDataAction } from '@Actions/';
import './index.scss';

const handlePrintContent = data => data.map(ele => JSON.parse(ele.content));

const Home = props => {
	const { content, getHomeDataMethod } = props;

	useEffect(() => {
		getHomeDataMethod();
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
								handlePrintContent(content),
							)}
						></p>
					</div>
				</div>
			</section>
			<Footer />
		</>
	);
};

Home.propTypes = {
	content: PropTypes.array.isRequired,
	getHomeDataMethod: PropTypes.func.isRequired,
};

export default connect(
	state => ({
		content: state.homeData.homeContent,
	}),
	dispatch => ({
		getHomeDataMethod: getHomeDataAction(dispatch),
	}),
)(Home);
