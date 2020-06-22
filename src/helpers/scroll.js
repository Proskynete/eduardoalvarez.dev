import { easeInOutCubic } from '@Helpers/animations.helper';
import {
	clearString,
	replaceSpaceForUnderscore,
} from '@Helpers/letters.helper';

export const scrollToTop = () => {
	const current = document.documentElement.scrollTop || document.body.scrollTop;
	if (current > 0) {
		window.requestAnimationFrame(scrollToTop);
		window.scrollTo(0, current - current / 20);
	}
};

export const scrollToNextContent = (title) => {
	smoothScroll(title, 1000);
};

const smoothScroll = (id, duration) => {
	const target = document.querySelector(id);
	const targetPosition =
		target.getBoundingClientRect().top + window.scrollY - 30;
	const startPosition = window.pageYOffset;
	const distance = targetPosition - startPosition;
	let startTime = null;

	const animation = (currentTime) => {
		if (startTime === null) startTime = currentTime;
		const timeElapsed = currentTime - startTime;
		const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
		window.scrollTo(0, run);
		if (timeElapsed < duration) requestAnimationFrame(animation);
	};
	requestAnimationFrame(animation);
};

// ------------------------------------
// ------------------------------------
// ------------------------------------

export const addIDAttrToTitles = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const items = [];
			const titles = document.querySelectorAll(
				'.blog-article__body__content h1',
			);
			titles.forEach((title) => {
				title.setAttribute(
					'id',
					replaceSpaceForUnderscore(clearString(title.innerHTML)),
				);
				items.push({ link: title.getAttribute('id'), label: title.innerHTML });
			});
			return resolve(items);
		}, 250);
	});
};

export const toggleClassWhenScrolling = (listOfItems) => {
	const listOfPositionItems = [];

	listOfItems.forEach((item) => {
		const element = document.querySelector(`#${item.link}`);
		listOfPositionItems.push(
			element.getBoundingClientRect().top + window.scrollY - 35,
		);
	});

	listOfPositionItems.push(
		document.getElementsByTagName('body')[0].clientHeight,
	);

	return listOfPositionItems;
};

export const handleListenerScroll = () => {
	addIDAttrToTitles().then((res) => {
		const listOfItems = res;

		const listOfPositionItems = toggleClassWhenScrolling(listOfItems);
		const currentPosition = window.pageYOffset;

		listOfItems.forEach((element, i) => {
			const link = document.querySelector(`a[href='#${element.link}']`);

			if (
				currentPosition >= listOfPositionItems[i] &&
				currentPosition < listOfPositionItems[i + 1]
			) {
				link.classList.add('current');
			} else {
				link.classList.remove('current');
			}
		});
	});
};
