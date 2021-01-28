/* eslint-disable @typescript-eslint/ban-ts-comment */
export const GTM_TRACKING_ID = 'GTM-MHQBDWK';

export const GTMPageView = (url: string) => {
	interface PageEventProps {
		event: string;
		page: string;
	}

	const pageEvent: PageEventProps = {
		event: 'pageview',
		page: url,
	};

	//@ts-ignore
	window && window.dataLayer && window.dataLayer.push(pageEvent);
	return pageEvent;
};
