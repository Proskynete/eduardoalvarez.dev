import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getArticleBySlugAction } from '@Actions/';
import './index.scss';

const ArticleView = props => {
	const { slug } = useParams();
	const { blogContent, getArticleBySlugMethod } = props;

	useEffect(() => {
		getArticleBySlugMethod(slug);
	}, []);

	return <section className="article"></section>;
};

ArticleView.propTypes = {
	blogContent: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
		.isRequired,
	getArticleBySlugMethod: PropTypes.func.isRequired,
};

export default connect(
	state => ({
		blogContent: state.blogData.blogContent,
	}),
	dispatch => ({
		getArticleBySlugMethod: getArticleBySlugAction(dispatch),
	}),
)(ArticleView);
