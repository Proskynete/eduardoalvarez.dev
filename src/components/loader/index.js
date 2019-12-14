/* eslint-disable import/no-unresolved */
import React from 'react';
import randomText from '@Helpers/random-text';
import './index.scss';

const randomLoaderTexts = [
	{
		text: 'El servidor esta un poco lento...',
	},
	{
		text: 'Estoy haciendo todo lo "humanamente" posible',
	},
	{
		text: 'No eres tu, soy yo...',
	},
];

const Loader = () => (
	<div className="loader">
		<div className="loader__inner">
			<div className="loader__inner__spinner">
				<i className="fab fa-react fa-spin" />
			</div>
			<p className="loader__inner__text">{randomText(randomLoaderTexts)}</p>
		</div>
	</div>
);

export default Loader;
