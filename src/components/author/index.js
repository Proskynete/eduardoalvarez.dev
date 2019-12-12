/* eslint-disable import/no-unresolved */
import React from 'react';
import content from '@Contents/author';
import './index.scss';

const Author = () => (
	<section className="author">
		<img
			className="author__image"
			src={content.img.src}
			alt={content.img.alt}
		/>
		<article className="author__description">
			{`${content.body.text} `}
			<i className={content.body.icon.class} />
		</article>
	</section>
);

export default Author;
