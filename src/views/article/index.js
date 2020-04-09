import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { prettyFormat } from '@Helpers/date-format';
import { createMarkup } from '@Helpers/print-html.helper';
import { connect } from 'react-redux';
import { getArticleBySlugAction } from '@Actions/';
import { AuthorComponent } from '@Components/';
import './index.scss';

const ArticleView = props => {
	const { slug } = useParams();
	const { blogContent, getArticleBySlugMethod } = props;

	useEffect(() => {
		getArticleBySlugMethod(slug);
	}, []);

	return (
		<div className="container-fluid">
			<div className="row justify-content-md-center">
				<div className="col col-md-8">
					<div className="container">
						<div className="blog-blog-article">
							<div className="blog-article__header">
								<h1>{blogContent.title}</h1>
								<div className="blog-article__header__info">
									<span className="blog-article__header__info__published">
										<i className="far fa-calendar-alt" />
										Publicado el {prettyFormat(blogContent.create_at)}
									</span>
									<span className="blog-article__header__info__read">
										<i className="far fa-clock" />
										Lectura de {blogContent.reading_time} minutos
									</span>

									<span className="blog-article__header__info__tags">
										<i className="fas fa-tag" />
										{blogContent.tags}
									</span>
								</div>
							</div>
							<div className="blog-article__body">
								<div className="blog-article__body__header">
									<img
										className="blog-article__body__header__image"
										src={blogContent.image_url}
										alt={blogContent.title}
									/>
								</div>
								<div
									className="blog-article__body__content"
									dangerouslySetInnerHTML={createMarkup(
										JSON.parse(blogContent.content || null),
									)}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col col-md-8">
					<div className="container">
						<AuthorComponent {...blogContent.create_by} />
					</div>
				</div>
			</div>
		</div>
	);
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
