import React from 'react';
import { Helmet } from 'react-helmet';

const metadataValueDefault = {
	title: 'Eduardo Álvarez | Blog de formación y desarrollo web con JavaScript',
	description:
		'Blog de formación y desarrollo web con JavaScript utilizando diversas tecnologías como: React, Node.js, MongoDB, Html, Css, Sass',
	urlImage:
		'https://res.cloudinary.com/soy-eduardoalvarez/image/upload/v1587245039/user_view/eduardo_alvarez.jpg',
};

export const changeMetadataValue = ({ title, description, urlImage }) => {
	return (
		<Helmet>
			<meta
				name='description'
				content={`${title || metadataValueDefault.title}`}
			/>
			<meta
				name='image'
				content={`${urlImage || metadataValueDefault.urlImage}`}
			/>

			<meta
				property='og:description'
				content={`${description || metadataValueDefault.description}`}
			/>
			<meta
				property='og:site_name'
				content={`${title || metadataValueDefault.title}`}
			/>
			<meta
				property='og:image'
				content={`${urlImage || metadataValueDefault.urlImage}`}
			/>

			<meta
				name='twitter:title'
				content={`${title || metadataValueDefault.title}`}
			/>
			<meta
				name='twitter:description'
				content={`${description || metadataValueDefault.description}`}
			/>
			<meta
				property='twitter:image'
				content={`${urlImage || metadataValueDefault.urlImage}`}
			/>

			<title>{`${title || metadataValueDefault.title}`}</title>
		</Helmet>
	);
};
