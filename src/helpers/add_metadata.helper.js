import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

export const changeMetadataValue = data => {
	const { title, description } = data;

	return (
		<Helmet>
			<meta name="description" content={`${description}`} />
			<meta property="og:description" content={`${description}`} />
			<meta property="og:site_name" content={title} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={`${description}`} />
			<title>{title}</title>
		</Helmet>
	);
};
