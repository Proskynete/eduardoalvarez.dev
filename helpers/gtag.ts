import ReactGA from 'react-ga';

interface LogEventInterface {
	category: string;
	action: string;
}

interface LogExeptionInterface {
	description: string;
	fatal: boolean;
}

export const initGA = (): void => {
	ReactGA.initialize(`${process.env.GA_TRACKING_ID}`);
};

export const LogPageView = (): void => {
	ReactGA.set({
		page: window.location.pathname,
	});
	ReactGA.pageview(window.location.pathname);
};

export const LogEvent = ({
	category = '',
	action = '',
}: LogEventInterface): void => {
	if (category && action) ReactGA.event({ category, action });
};

export const logExeption = ({
	description = '',
	fatal = false,
}: LogExeptionInterface): void => {
	if (description) ReactGA.exception({ description, fatal });
};
