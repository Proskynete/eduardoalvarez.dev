/* eslint-disable import/no-unresolved */
import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Loader } from '@Components';
import { printArticles } from '@Helpers/print-articles.helper';
import { getBlogDataAction } from '@Actions/';
import { changeMetadataValue } from '@Helpers/add_metadata.helper';
import './index.scss';

const BlogView = (props) => {
	const { blogContent, getBlogDataMethod } = props;

	useEffect(() => {
		getBlogDataMethod();
	}, []);

	return blogContent.length > 0 ? (
		<>
			{changeMetadataValue({
				title: 'Mis artículos publicados | eduardoalvarez.cl',
				description:
					'Vista donde se muestran todos los artículos publicados sobre programación web y buenas prácticas de desarrollo.',
				url: 'https://eduardoalvarez.cl/blog',
			})}
			<Header />
			<div className='container-fluid'>
				<div className='row justify-content-md-center'>
					<div className='col col-md-5'>
						<div className='container__blog'>{printArticles(blogContent)}</div>
					</div>
				</div>
			</div>
		</>
	) : (
		<Loader url='https://eduardoalvarez.cl/blog' />
	);
};

BlogView.propTypes = {
	blogContent: PropTypes.array.isRequired,
	getBlogDataMethod: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		blogContent: state.blogData.blogContent,
	}),
	(dispatch) => ({
		getBlogDataMethod: getBlogDataAction(dispatch),
	}),
)(memo(BlogView));
