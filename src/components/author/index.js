import React from 'react';
import './index.scss';

const AuthorComponent = props => {
	const { alias, biography, avatar, name } = props;
	return (
		<section className="author">
			<div className="author__inner">
				<div className="author__inner__image">
					<img
						className="author__inner__image__img"
						src={avatar}
						alt={`avatar de ${alias}`}
						title={`avatar de ${alias}`}
					/>
				</div>

				<div className="author__inner__description">
					<div className="author__inner__description__header">
						<p className="author__inner__description__header__name">
							Escrito por {name}
						</p>
						<p className="author__inner__description__header__alias">{alias}</p>
					</div>
					<p className="author__inner__description__biography">{biography}</p>
				</div>
			</div>
		</section>
	);
};

export default AuthorComponent;
