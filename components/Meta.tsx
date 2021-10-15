import data from 'data/config.json';
import { PropsInterface } from 'models/meta.model';
import Head from 'next/head';
import { memo } from 'react';

const Meta = (props: PropsInterface) => {
	const { customTitle, description, image, slug = '' } = props;

	return (
		<Head>
			<meta charSet='utf-8' />
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			<meta httpEquiv='x-ua-compatible' content='ie=edge' />

			<title>{customTitle} | eduardoalvarez.dev </title>

			<link
				rel='preload'
				href='/fonts/Hero/regular.ttf'
				as='font'
				crossOrigin=''
			/>
			<link
				rel='preload'
				href='/fonts/Hero/bold.ttf'
				as='font'
				crossOrigin=''
			/>
			<link
				rel='preload'
				href='/fonts/Hero/light.ttf'
				as='font'
				crossOrigin=''
			/>
			<link
				rel='preload'
				href='/fonts/Roboto/italic.ttf'
				as='font'
				crossOrigin=''
			/>
			<link
				rel='preload'
				href='/fonts/Roboto/light-italic.ttf'
				as='font'
				crossOrigin=''
			/>
			<link
				rel='preload'
				href='/fonts/Roboto/light.ttf'
				as='font'
				crossOrigin=''
			/>
			<link
				rel='preload'
				href='/fonts/Roboto/regular.ttf'
				as='font'
				crossOrigin=''
			/>

			<link rel='icon' href='/favicon/favicon.ico' />
			<meta name='description' content={description} />

			<link rel='manifest' href='/manifest.json' />
			<meta name='robots' content='index, follow' />

			<meta
				name='keywords'
				content='frontend, front-end, react, reactjs, mongo, mongodb, ts, typescript, js, javascript, nosql, express, node, nodejs, html, css'
			/>
			<meta name='author' content='Eduardo Álvarez Castañeda' />
			<meta name='copyright' content='Eduardo Álvarez Castañeda' />
			<meta name='application-name' content='Blog de Eduardo Álvarez' />
			<meta name='apple-mobile-web-app-capable' content='yes' />
			<meta name='apple-mobile-web-app-status-bar-style' content='default' />
			<meta
				name='apple-mobile-web-app-title'
				content='eduardoalvarez.dev | Frontend, HTML, CSS, Javascript, Typescript, React, Node, MongoDB'
			/>
			<meta name='format-detection' content='telephone=no' />
			<meta name='mobile-web-app-capable' content='yes' />
			<meta name='theme-color' content='#0A3F66' />
			<link
				rel='apple-touch-icon'
				sizes='192x192'
				href='/images/manifest/192x192.png'
			/>

			<meta name='image' content={image} />
			<link rel='canonical' href={data.url} />

			<meta property='og:description' content={description} />
			<meta property='og:site_name' content={customTitle} />
			<meta property='og:title' content={customTitle} />
			<meta property='og:image' content={image} />
			<meta property='og:url' content={`${data.url}${slug}`} />

			<meta name='twitter:card' content='summary' />
			<meta name='twitter:description' content={description} />
			<meta name='twitter:title' content={customTitle} />
			<meta property='twitter:image' content={image} />
			<meta name='twitter:url' content={`${data.url}/${slug}`} />
		</Head>
	);
};

export default memo(Meta);
