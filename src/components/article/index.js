import React from 'react';
import './index.scss';

const Article = props => {
	const { slug, title, description, reading_time, create_at } = props;
	return (
		<article className="article">
			<div className="article__header">
				<h1 className="article__header__title">{title}</h1>
				<p className="article__header__info">
					<span className="article__header__info__read">
						<i className="far fa-clock" /> Lectura de {reading_time} minutos.
					</span>
					<span className="article__header__info__published">
						<i className="far fa-calendar-alt" />
						{create_at}
					</span>
				</p>
			</div>
			<div className="article__content">{description}</div>
			<div className="article__bottom">
				<a className="article__bottom__read-more">Seguir leyendo</a>
				<div className="article__bottom__share">
					<i className="fab fa-facebook-f" />
					<i className="fab fa-twitter" />
					<i className="fab fa-linkedin-in" />
				</div>
			</div>
		</article>
	);
};

export default Article;
