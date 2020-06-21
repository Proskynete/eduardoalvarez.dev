import React from 'react';
import { Article } from '@Components';

export const printArticles = (data) => {
	return data.length < 1 ? (
		<div className='no-articles'>
			<p>Aún no hay articulos publicados.</p>
			<p>Próximamente habrá contenido de tu interés!</p>
		</div>
	) : (
		data.map((content) => {
			return <Article key={content._id} {...content} />;
		})
	);
};
