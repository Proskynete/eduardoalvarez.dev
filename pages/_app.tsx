import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'styles/globals.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import type { AppProps } from 'next/app';

config.autoAddCss = false;

const MyApp = ({ Component, pageProps }: AppProps) => {
	return <Component {...pageProps} />;
};

export default MyApp;
