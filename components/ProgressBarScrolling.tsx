import { useEffect, useState } from 'react';

interface ProgressBarScrollingInterface {
	target: {
		current?: HTMLElement;
	};
}

export const ProgressBarScrolling = (props: ProgressBarScrollingInterface) => {
	const { target } = props;
	const [state, setState] = useState<number>(0);

	const scrollListener = () => {
		if (!target.current) return;

		const ele = target.current;
		const totalHeight: number =
			ele.clientHeight - ele.offsetTop - window.innerHeight + ele.offsetTop * 2;

		const windowScrollTop: number =
			window.pageYOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop ||
			0;

		if (windowScrollTop === 0) {
			return setState(0);
		}

		if (windowScrollTop >= totalHeight) {
			return setState(100);
		}

		setState((windowScrollTop / totalHeight) * 100);
	};

	useEffect(() => {
		window.addEventListener('scroll', scrollListener);

		return () => window.removeEventListener('scroll', scrollListener);
	});

	return (
		<div className='progress-bar-scrolling' style={{ width: `${state}%` }} />
	);
};
