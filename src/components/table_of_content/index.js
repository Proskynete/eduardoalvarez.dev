import React, { memo, useEffect } from 'react';
import { scrollToNextContent, handleListenerScroll } from '@Helpers/scroll';
import './index.scss';

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

const TableOfContent = (props) => {
	const { items } = props;

	useEffect(() => {
		window.addEventListener('scroll', handleListenerScroll, true);

		return () => {
			window.removeEventListener('scroll', handleListenerScroll, true);
		};
	}, []);

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
