/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header } from '@Components';
import { printArticles } from '@Helpers/print-articles.helper';
import { getBlogDataAction } from '@Actions/';
import { changeMetadataValue } from '@Helpers/add_metadata.helper';
import './index.scss';

const BlogView = props => {
	const { blogContent, getBlogDataMethod } = props;

	useEffect(() => {
		getBlogDataMethod();
	}, []);

	return (
		<>
			{changeMetadataValue({})}
			<Header />
			<div className="container-fluid">
				<div className="row justify-content-md-center">
					<div className="col col-md-5">
						<div className="container">
							<div className="container__blog">
								{printArticles(blogContent)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

BlogView.propTypes = {
	blogContent: PropTypes.array.isRequired,
	getBlogDataMethod: PropTypes.func.isRequired,
};

export default connect(
	state => ({
		blogContent: state.blogData.blogContent,
	}),
	dispatch => ({
		getBlogDataMethod: getBlogDataAction(dispatch),
	}),
)(BlogView);
