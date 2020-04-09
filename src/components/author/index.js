import React from 'react';
import './index.scss';

const AuthorComponent = props => {
	const { alias, biography, avatar, name } = props;
	return (
		<section className="author">
			<img
				className="author__image"
				src={avatar}
				alt={`avatar de ${alias}`}
				title={`avatar de ${alias}`}
			/>
			<article className="author__description">
				<div className="author__description__header">
					<p className="author__description__header__name">{name}</p>
					<p className="author__description__header__alias">@{alias}</p>
				</div>
				<div className="author__description__body">
					<p className="author__description__body__biography">{biography}</p>
				</div>
			</article>
		</section>
	);
};

export default AuthorComponent;
