import React from 'react';
import { Helmet } from 'react-helmet';

const defaultValues = {
	image:
		'https://res.cloudinary.com/soy-eduardoalvarez/image/upload/v1587245039/user_view/eduardo_alvarez.jpg',
};

export const changeMetadataValue = (props) => {
	const { title, description, image, url } = props;

	return (
		<Helmet>
			<meta name='description' content={description} />
			<meta name='image' content={image || defaultValues.image} />
			<link rel='canonical' href={url} />
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:site_name' content={title} />
			<meta property='og:image' content={image || defaultValues.image} />
			<meta property='og:url' content={url} />
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={description} />
			<meta property='twitter:image' content={image || defaultValues.image} />
			<meta name='twitter:url' content={url} />
			<title>{title}</title>
		</Helmet>
	);
};
