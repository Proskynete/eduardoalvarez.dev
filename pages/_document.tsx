/* eslint-disable jsx-a11y/iframe-has-title */
import { GA_TRACKING_ID } from 'lib/gtag';
import { GTM_TRACKING_ID } from 'lib/gtm';
import Document, {
	DocumentContext,
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document';

interface DocumentInterface {
	isProduction: boolean;
}

class MyDocument extends Document<DocumentInterface> {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		const isProduction = process.env.NODE_ENV === 'production';

		return {
			...initialProps,
			isProduction,
		};
	}

	render() {
		const { isProduction } = this.props;

		return (
			<Html lang='es'>
				<Head>
					<meta charSet='utf-8' />
					<meta name='viewport' content='width=device-width, initial-scale=1' />
					<meta name='robots' content='index, follow' />
					<meta
						name='keywords'
						content='frontend, front-end, react, reactjs, mongo, mongodb, ts, typescript, js, javascript, nosql, express, node, nodejs, html, css'
					/>
					<meta name='author' content='Eduardo Álvarez Castañeda' />
					<meta name='copyright' content='Eduardo Álvarez Castañeda' />
					{isProduction && (
						<>
							{/* Global Site Tag (gtag.js) - Google Analytics */}
							<script
								async
								src={`https://googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
							/>
							<script
								dangerouslySetInnerHTML={{
									__html: `
										window.dataLayer = window.dataLayer || [];
										function gtag(){dataLayer.push(arguments);}
										gtag('js', new Date());
										gtag('config', '${GA_TRACKING_ID}');
									`,
								}}
							/>

							{/* Google Tag Manager */}
							<script
								dangerouslySetInnerHTML={{
									__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
									new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
									j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
									'https://googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
									})(window,document,'script','dataLayer','${GTM_TRACKING_ID}');`,
								}}
							/>
						</>
					)}
				</Head>
				<body>
					{isProduction && (
						<>
							{/* Google Tag Manager (noscript) */}
							<noscript>
								<iframe
									src={`https://googletagmanager.com/ns.html?id=${GTM_TRACKING_ID}`}
									height='0'
									width='0'
									style={{ display: 'none', visibility: 'hidden' }}
								></iframe>
							</noscript>
						</>
					)}
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
