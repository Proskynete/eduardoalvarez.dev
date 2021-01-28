export const GA_TRACKING_ID = 'G-NSL19BY4VS';

export const pageview = (url: string) => {
	window.gtag &&
		window.gtag('config', GA_TRACKING_ID, {
			page_path: url,
		});
};

export const event = ({ action, category, label, value }) => {
	window.gtag &&
		window.gtag('event', action, {
			event_category: category,
			event_label: label,
			value: value,
		});
};
