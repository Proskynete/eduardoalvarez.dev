import React, { useState } from 'react';
import {
	clearString,
	replaceSpaceForUnderscore,
} from '@Helpers/letters.helper';
import './index.scss';

const addIdAttrToTitles = setItems => {
	setTimeout(() => {
		const titles = document.querySelectorAll('.blog-article__body__content h1');
		const items = [];
		titles.forEach(title => {
			title.setAttribute(
				'id',
				replaceSpaceForUnderscore(clearString(title.innerHTML)),
			);
			items.push({ link: title.getAttribute('id'), label: title.innerHTML });
		});
		setItems(items);
	}, 1);
};

const handlePrintItems = items =>
	items.map(item => (
		<li key={item.link} className="table_of_content__inner__container__item">
			<a
				href={`#${item.link}`}
				className="table_of_content__inner__container__item__link"
			>
				{item.label}
			</a>
		</li>
	));

const TableOfContent = () => {
	const [items, setItems] = useState([]);

	addIdAttrToTitles(setItems);

	return (
		<aside className="table_of_content">
			<div className="table_of_content__inner">
				<ul className="table_of_content__inner__container">
					{handlePrintItems(items)}
				</ul>
			</div>
		</aside>
	);
};

export default TableOfContent;
