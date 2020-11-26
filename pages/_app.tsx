import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/globals.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import * as gtag from 'lib/gtag';
import { GTMPageView } from 'lib/gtm';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

config.autoAddCss = false;

const MyApp = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();
	const isProduction = process.env.NODE_ENV === 'production';

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			gtag.pageview(url);
			GTMPageView(url);
		};
		router.events.on('routeChangeComplete', handleRouteChange);

		if (isProduction) {
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker
					.register('/sw.js')
					.then(() => console.log('service worker registered'))
					.catch((err) => console.log('service worker not registered', err));
			}
		}

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return <Component {...pageProps} />;
};

export default MyApp;
