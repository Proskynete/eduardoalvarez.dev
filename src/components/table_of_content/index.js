import React, { useState, useEffect, memo } from 'react';
import {
	clearString,
	replaceSpaceForUnderscore,
} from '@Helpers/letters.helper';
import {
	scrollToNextContent,
	toggleClassWhenScrolling,
	handleListenerScroll,
} from '@Helpers/scroll';
import './index.scss';

const addIDAttrToTitles = (setItems, setShow) => {
	setTimeout(() => {
		const titles = document.querySelectorAll('.blog-article__body__content h1');
		const items = [];
		titles.forEach((title) => {
			title.setAttribute(
				'id',
				replaceSpaceForUnderscore(clearString(title.innerHTML)),
			);
			items.push({ link: title.getAttribute('id'), label: title.innerHTML });
		});
		setItems(items);
		setShow(true);
	}, 250);
};

const handleGoTo = (e) => {
	e.preventDefault();
	const targetElement = e.target || e.srcElement;
	const title = targetElement.getAttribute('href');
	scrollToNextContent(title);
};

const handlePrintItems = (items) =>
	items.map((item) => (
		<li
			key={item.link}
			className='table_of_content__container__inner__content__item'
		>
			<a
				href={`#${item.link}`}
				className='table_of_content__container__inner__content__item__link'
				onClick={handleGoTo}
			>
				{item.label}
			</a>
		</li>
	));

const TableOfContent = () => {
	const [items, setItems] = useState([]);
	const [show, setShow] = useState(false);

	const listOfPositionItems = toggleClassWhenScrolling(items);

	useEffect(() => {
		addIDAttrToTitles(setItems, setShow);

		window.addEventListener('scroll', () => {
			handleListenerScroll(items, listOfPositionItems);
		});

		return () => {
			window.removeEventListener('scroll', () => {
				handleListenerScroll;
			});
		};
	}, [show]);

	return (
		<aside className='table_of_content'>
			<div className='table_of_content__container'>
				<div className='table_of_content__container__inner'>
					<ul className='table_of_content__container__inner__content'>
						{handlePrintItems(items)}
					</ul>
				</div>
			</div>
		</aside>
	);
};

export default memo(TableOfContent);
