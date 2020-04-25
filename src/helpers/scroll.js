export const scrollToTop = () => {
	const current = document.documentElement.scrollTop || document.body.scrollTop;
	if (current > 0) {
		window.requestAnimationFrame(scrollToTop);
		window.scrollTo(0, current - current / 20);
	}
};

export const scrollToNextContent = title => {
	const id = title.getAttribute('href');
	smoothScroll(id, 1000);
};

const smoothScroll = (id, duration) => {
	const target = document.querySelector(id);
	const targetPosition = target.getBoundingClientRect().top + window.scrollY - 30;
	const startPosition = window.pageYOffset;
	const distance = targetPosition - startPosition;
	let startTime = null;

	const animation = (currentTime) => {
		if (startTime === null) startTime = currentTime;
		const timeElapsed = currentTime - startTime;
		const run = ease(timeElapsed, startPosition, distance, duration);
		window.scrollTo(0, run);
		if (timeElapsed < duration) requestAnimationFrame(animation);
	};

	const ease = function(t, b, c, d) {
		t /= d / 2;
		if (t < 1) return (c / 2) * t * t + b;
		t--;
		return (-c / 2) * (t * (t - 2) - 1) + b;
	};

	requestAnimationFrame(animation);
};
