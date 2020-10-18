import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/globals.scss';
require('dotenv').config();

import { config } from '@fortawesome/fontawesome-svg-core';
import type { AppProps } from 'next/app';

config.autoAddCss = false;

declare global {
	interface Window {
		GA_INITIALIZED: any;
	}
}

const MyApp = ({ Component, pageProps }: AppProps) => {
	return <Component {...pageProps} />;
};

export default MyApp;
