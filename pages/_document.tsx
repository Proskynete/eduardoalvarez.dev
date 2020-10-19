/* eslint-disable jsx-a11y/iframe-has-title */
import { GA_TRACKING_ID, GTM_TRACKING_ID } from 'lib/gtag';
import Document, {
	DocumentContext,
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);

		return initialProps;
	}

	render() {
		return (
			<Html lang='es'>
				<Head>
					{/* Global Site Tag (gtag.js) - Google Analytics */}
					<script
						async
						src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
						}}
					/>

					{/* Google Tag Manager */}
					<script
						dangerouslySetInnerHTML={{
							__html: `
							(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
							new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
							j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
							'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
							})(window,document,'script','dataLayer','${GTM_TRACKING_ID}');`,
						}}
					/>
					{/* End Google Tag Manager */}
				</Head>
				<body>
					{/* Google Tag Manager (noscript) */}
					<noscript>
						<iframe
							src={`https://www.googletagmanager.com/ns.html?id=${GTM_TRACKING_ID}`}
							height='0'
							width='0'
							style={{ display: 'none', visibility: 'hidden' }}
						></iframe>
					</noscript>
					{/* End Google Tag Manager (noscript) */}
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
