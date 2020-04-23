const scrollToTop = () => {
	const current = document.documentElement.scrollTop || document.body.scrollTop;
	if (current > 0) {
		window.requestAnimationFrame(scrollToTop);
		window.scrollTo(0, current - current / 20);
	}
};

export const getScrollingAndAddClassToElement = ({
	moreThan,
	elementToAddClass,
	className,
}) => {
	setTimeout(() => {
		const element = document.querySelector(`${moreThan}`);
		window.addEventListener('scroll', function(e) {
			const scroll = this.scrollY;
			if (scroll > element.offsetTop + 70) {
				document
					.querySelector(`${elementToAddClass}`)
					.classList.add(`${className}`);
			} else {
				document
					.querySelector(`${elementToAddClass}`)
					.classList.remove(`${className}`);
			}
		});
	}, 5);
};

const scrollTo = element => {};

export default scrollToTop;
