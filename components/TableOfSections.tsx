import {
	handleListenerScroll,
	scrollToNextContent,
} from 'helpers/scroll.helper';
import {
	SectionsInterface,
	TableOfSectionsPropsInterface,
} from 'models/sections.model';
import React, { FC, memo, SyntheticEvent, useCallback, useEffect } from 'react';

const handleGoTo = (event: SyntheticEvent<EventTarget>): void => {
	event.preventDefault();
	const targetElement: HTMLInputElement = event.target as HTMLInputElement;
	const title: string = targetElement.getAttribute('href');
	scrollToNextContent(title);
};

const TableOfSections: FC<TableOfSectionsPropsInterface> = (props) => {
	const { sections } = props;

	const handleListenerScrollFunction = useCallback(() => {
		handleListenerScroll(sections);
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', handleListenerScrollFunction, true);

		return () => {
			window.removeEventListener('scroll', handleListenerScrollFunction, true);
		};
	}, []);

	return (
		<aside id='section-navegation' className='table-of-content'>
			<div className='table-of-content__container'>
				<div className='table-of-content__container__inner'>
					<ul className='table-of-content__container__inner__content'>
						{sections.map((section: SectionsInterface) => (
							<li
								key={section.title}
								className='table-of-content__container__inner__content__item'
							>
								<a
									href={`#${section.anchor}`}
									className='table-of-content__container__inner__content__item__link'
									onClick={(e: SyntheticEvent<EventTarget>) => handleGoTo(e)}
								>
									{section.title}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</aside>
	);
};

export default memo(TableOfSections);
