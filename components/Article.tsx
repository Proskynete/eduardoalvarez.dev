import {
	faFacebookF,
	faLinkedinIn,
	faTwitter,
	faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArticleContentInterface } from 'models/index.model';
import Link from 'next/link';
import { FC } from 'react';

import InfoArticle from './InfoArticle';

const Article: FC<ArticleContentInterface> = (props) => {
	const {
		frontmatter: { title, image_introduction, date, read_time, description },
		slug,
	} = props;

	return (
		<article className='article'>
			<div className='article__inner'>
				<div className='article__inner__section'>
					<img
						src={image_introduction}
						alt={`Imagen del artículo ${title}`}
						className='article__inner__section__hero'
					/>
				</div>

				<div className='article__inner__section'>
					<header className='article__inner__section__header'>
						<h1 className='article__inner__section__header__title'>{title}</h1>
						<InfoArticle date={date} readTime={read_time} horizontal={true} />
					</header>

					<div className='article__inner__section__body'>{description}</div>

					<div className='article__inner__section__footer'>
						<div className='article__inner__section__footer__section'>
							<Link href={`/blog/${encodeURIComponent(slug)}`}>
								<a className='article__inner__section__footer__section__link'>
									Seguir leyendo
								</a>
							</Link>
						</div>

						<div className='article__inner__section__footer__section'>
							<span className='article__inner__section__footer__section__share'>
								<a href='!#' target='_blank' rel='noreferrer noopener'>
									<FontAwesomeIcon icon={faFacebookF} />
								</a>
							</span>
							<span className='article__inner__section__footer__section__share'>
								<a href='!#' target='_blank' rel='noreferrer noopener'>
									<FontAwesomeIcon icon={faTwitter} />
								</a>
							</span>
							<span className='article__inner__section__footer__section__share'>
								<a href='!#' target='_blank' rel='noreferrer noopener'>
									<FontAwesomeIcon icon={faLinkedinIn} />
								</a>
							</span>
							<span className='article__inner__section__footer__section__share'>
								<a href='!#' target='_blank' rel='noreferrer noopener'>
									<FontAwesomeIcon icon={faWhatsapp} />
								</a>
							</span>
							<span className='article__inner__section__footer__section__share'>
								<a href='!#' target='_blank' rel='noreferrer noopener'>
									<FontAwesomeIcon icon={faCopy} />
								</a>
							</span>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};

export default Article;
