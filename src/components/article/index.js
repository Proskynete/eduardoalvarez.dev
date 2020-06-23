import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { onlyDate, prettyFormat } from '@Helpers/date-format';
import { getFirstLetter, titleForSocialNetwork } from '@Helpers/letters.helper';
import { copyTextToClipboard } from '@Helpers/copy-to-clipboard.helper';
import { notificationAction } from '@Actions/';
import { printReadingTime } from '@Helpers/reading_time.helper';
import './index.scss';

const Article = (props) => {
	const {
		slug,
		title,
		description,
		reading_time,
		create_at,
		notificationMethod,
	} = props;

	const urlToShare = `https://eduardoalvarez.cl/blog/${slug}`;

	const handleCopyUrl = (e) => {
		copyTextToClipboard(e, urlToShare);
		notificationMethod({
			show: true,
			text: 'Enlace copiado',
			type: 'success',
		});
	};

	return (
		<article className='article'>
			<Link className='article__header' to={`/blog/${slug}`}>
				<h1 className='article__header__title'>
					<span className='article__header__title__first'>
						{getFirstLetter(title)}
					</span>
					{title}
				</h1>
			</Link>
			<p className='article__header__info'>
				<span className='article__header__info__read'>
					<i className='far fa-clock' />
					{printReadingTime(reading_time)}
				</span>
				<span className='article__header__info__published'>
					<i className='far fa-calendar-alt' />
					<time dateTime={onlyDate(create_at)}>{prettyFormat(create_at)}</time>
				</span>
			</p>
			<div className='article__content'>{description}</div>
			<div className='article__bottom'>
				<Link className='article__bottom__read-more' to={`/blog/${slug}`}>
					Seguir leyendo
				</Link>
				<div className='article__bottom__share'>
					<a
						className='article__bottom__share__link'
						title='Compartir en facebook'
						target='_blank'
						href={`https://www.facebook.com/sharer/sharer.php?u=${urlToShare}`}
						rel='noopener noreferrer'
					>
						<i className='fab fa-facebook-f' />
					</a>
					<a
						className='article__bottom__share__link'
						title='Compartir en twitter'
						target='_blank'
						href={`https://twitter.com/intent/tweet?text=${titleForSocialNetwork(
							title,
						)}&url=${urlToShare}`}
						rel='noopener noreferrer'
					>
						<i className='fab fa-twitter' />
					</a>
					<a
						className='article__bottom__share__link'
						title='Compartir en linkedin'
						target='_blank'
						href={`https://www.linkedin.com/sharing/share-offsite/?url=${urlToShare}`}
						rel='noopener noreferrer'
					>
						<i className='fab fa-linkedin-in' />
					</a>
					<a
						className='article__bottom__share__link'
						title='Compartir por whatsapp'
						target='_blank'
						href={`https://api.whatsapp.com/send?text=${titleForSocialNetwork(
							title,
						)}${urlToShare}`}
						rel='noopener noreferrer'
					>
						<i className='fab fa-whatsapp' />
					</a>
					<a
						role='button'
						className='article__bottom__share__link'
						title='Compartir copiando link'
						onClick={handleCopyUrl}
					>
						<i className='far fa-copy' />
					</a>
				</div>
			</div>
		</article>
	);
};

Article.propTypes = {
	slug: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	reading_time: PropTypes.string.isRequired,
	create_at: PropTypes.string.isRequired,
	notificationMethod: PropTypes.func.isRequired,
};

export default connect(
	(state) => state,
	(dispatch) => ({
		notificationMethod: notificationAction(dispatch),
	}),
)(Article);
