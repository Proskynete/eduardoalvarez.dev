import React, { useState, useEffect } from 'react';
import {
	clearString,
	replaceSpaceForUnderscore,
} from '@Helpers/letters.helper';
import { scrollToNextContent, toggleClassWhenScrolling } from '@Helpers/scroll';
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
	}, 1000);
};

const handleGoTo = e => {
	e.preventDefault();
	const targetElement = e.target || e.srcElement;
	const title = targetElement.getAttribute('href');
	scrollToNextContent(title);
};

const handlePrintItems = items =>
	items.map(item => (
		<li key={item.link} className="table_of_content__inner__container__item">
			<a
				href={`#${item.link}`}
				className="table_of_content__inner__container__item__link"
				onClick={handleGoTo}
			>
				{item.label}
			</a>
		</li>
	));

const TableOfContent = () => {
	const [items, setItems] = useState([]);

	useEffect(() => {
		addIdAttrToTitles(setItems);
	}, []);

	toggleClassWhenScrolling(items);

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
