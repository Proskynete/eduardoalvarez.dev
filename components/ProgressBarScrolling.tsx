import { useEffect, useState } from 'react';

interface ProgressBarScrollingInterface {
	target: any;
}

export const ProgressBarScrolling = (props: ProgressBarScrollingInterface) => {
	const { target } = props;
	const [state, setState] = useState(0);

	const scrollListener = () => {
		if (!target.current) return;

		const ele = target.current;
		const totalHeight = ele.clientHeight - ele.offsetTop - window.innerHeight;

		const windowScrollTop =
			window.pageYOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop ||
			0;

		if (windowScrollTop === 0) {
			return setState(0);
		}

		if (windowScrollTop > totalHeight) {
			return setState(100);
		}

		setState((windowScrollTop / totalHeight) * 100);
	};

	useEffect(() => {
		window.addEventListener('scroll', scrollListener);

		return () => window.removeEventListener('scroll', scrollListener);
	});

	return (
		<div className={`reading-progress-bar`} style={{ width: `${state}%` }} />
	);
};
