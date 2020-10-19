export const GA_TRACKING_ID = 'UA-180766853-1';
export const GTM_TRACKING_ID = 'GTM-WSK62BX';

export const pageview = (url: string) => {
	window.gtag('config', GA_TRACKING_ID, {
		page_path: url,
	});
};

export const event = ({ action, category, label, value }) => {
	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};
