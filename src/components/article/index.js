import React from 'react';
import { Link } from 'react-router-dom';
import { prettyFormat } from '@Helpers/date-format';
import { getFirstLetter, titleForSocialNetwork } from '@Helpers/letters.helper';
import { copyTextToClipboard } from '@Helpers/copy-to-clipboard.helper';
import './index.scss';

const Article = props => {
	const { slug, title, description, reading_time, create_at } = props;
	const urlToShare = `https://eduardoalvarez.cl/blog/${slug}`;
	return (
		<article className="article">
			<Link className="article__header" to={`/blog/${slug}`}>
				<h1 className="article__header__title">
					<span className="article__header__title__first">
						{getFirstLetter(title)}
					</span>
					{title}
				</h1>
				<p className="article__header__info">
					<span className="article__header__info__read">
						<i className="far fa-clock" />
						Lectura de {reading_time} minutos
					</span>
					<span className="article__header__info__published">
						<i className="far fa-calendar-alt" />
						{prettyFormat(create_at)}
					</span>
				</p>
			</Link>
			<div className="article__content">{description}</div>
			<div className="article__bottom">
				<Link className="article__bottom__read-more" to={`/blog/${slug}`}>
					Seguir leyendo
				</Link>
				<div className="article__bottom__share">
					<a
						className="article__bottom__share__link"
						title="Compartir en facebook"
						target="_blank"
						href={`https://www.facebook.com/sharer/sharer.php?u=${urlToShare}`}
						rel="noopener noreferrer"
					>
						<i className="fab fa-facebook-f" />
					</a>
					<a
						className="article__bottom__share__link"
						title="Compartir en twitter"
						rel="noopener noreferrer"
						target="_blank"
						href={`https://twitter.com/intent/tweet?text=${titleForSocialNetwork(
							title,
						)}&amp;url=${urlToShare}`}
					>
						<i className="fab fa-twitter" />
					</a>
					<a
						className="article__bottom__share__link"
						title="Compartir en linkedin"
						rel="noopener noreferrer"
						target="_blank"
						href={`https://www.linkedin.com/sharing/share-offsite/?url=${urlToShare}`}
					>
						<i className="fab fa-linkedin-in" />
					</a>
					<a
						className="article__bottom__share__link"
						title="Compartir por whatsapp"
						rel="noopener noreferrer"
						target="_blank"
						href={`https://api.whatsapp.com/send?text=${titleForSocialNetwork(
							title,
						)}${urlToShare}`}
					>
						<i className="fab fa-whatsapp" />
					</a>
					<a
						className="article__bottom__share__link"
						title="Compartir copiando link"
						href="#"
						onClick={e => copyTextToClipboard(e, urlToShare)}
					>
						<i className="far fa-copy" />
					</a>
				</div>
			</div>
		</article>
	);
};

export default Article;