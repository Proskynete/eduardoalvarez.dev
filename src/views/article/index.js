import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ArticleView = () => {
	let { slug } = useParams();

	return (
		<div>
			<h1>{slug}</h1>
		</div>
	);
};

export default ArticleView;
