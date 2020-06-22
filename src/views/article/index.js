import React, { useEffect, memo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { onlyDate, prettyFormat } from '@Helpers/date-format';
import { transformMarkdownToHtml } from '@Helpers/print-html.helper';
import { connect } from 'react-redux';
import { getArticleBySlugAction } from '@Actions/';
import { AuthorComponent, Line, TableOfContent } from '@Components/';
import { highlightFormat } from '@Helpers/highlight.helper.js';
import { changeMetadataValue } from '@Helpers/add_metadata.helper';
import { startInTop } from '@Helpers/start_in_top.helper';
import mapOptions from '@Helpers/options_to_render.helper';
import { printReadingTime } from '@Helpers/reading_time.helper';
import { addIDAttrToTitles, handleListenerScroll } from '@Helpers/scroll';
import './index.scss';

const ArticleView = (props) => {
	const { slug } = useParams();
	const { articleData, getArticleBySlugMethod } = props;
	const [items, setItems] = useState([]);

	useEffect(() => {
		addIDAttrToTitles().then((res) => {
			setItems(res);
		});

		startInTop();
		getArticleBySlugMethod(slug);
	}, []);

	highlightFormat();

	return articleData && Object.keys(articleData).length > 0 ? (
		<>
			{changeMetadataValue({
				title: articleData.title,
				description: articleData.description,
				urlImage: articleData.image_url,
			})}
			<article className='container-fluid'>
				<div className='row justify-content-md-center'>
					<div className='col col-md-8'>
						<div className='container'>
							<div className='blog-blog-article'>
								<header className='blog-article__header'>
									<h1>{articleData.title}</h1>
									<div className='blog-article__header__info'>
										<span className='blog-article__header__info__published'>
											<i className='far fa-calendar-alt' />
											Publicado el{' '}
											<time dateTime={onlyDate(articleData.create_at)}>
												{prettyFormat(articleData.create_at)}
											</time>
										</span>
										<span className='blog-article__header__info__read'>
											<i className='far fa-clock' />
											{printReadingTime(articleData.reading_time)}
										</span>

										<span className='blog-article__header__info__tags'>
											<i className='fas fa-tag' />
											{mapOptions[articleData.tags]}
										</span>
									</div>
								</header>
								<div className='blog-article__body'>
									<div className='blog-article__body__header'>
										<img
											className='blog-article__body__header__image'
											src={articleData.image_url}
											alt={articleData.title}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='container-fluid'>
						<div className='blog-article__body__content'>
							<div className='row'>
								<div
									className='col-12 offset-md-1 col-md-2 sticky-top'
									style={{ padding: '0', backgroundColor: '#ffffff' }}
								>
									<TableOfContent items={items} />
								</div>
								<div className='col-12 col-md-6'>
									<div className='blog-article__body__content__article'>
										{transformMarkdownToHtml(articleData.content)}
									</div>
									<Line />
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='row justify-content-md-center'>
					<div className='col col-md-8'>
						<div className='container'>
							<AuthorComponent {...articleData.create_by} />
						</div>
					</div>
				</div>
			</article>
		</>
	) : null;
};

ArticleView.propTypes = {
	articleData: PropTypes.object.isRequired,
	getArticleBySlugMethod: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		articleData: state.articleData.articleContent,
	}),
	(dispatch) => ({
		getArticleBySlugMethod: getArticleBySlugAction(dispatch),
	}),
)(memo(ArticleView));
