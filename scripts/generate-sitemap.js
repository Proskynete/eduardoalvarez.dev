const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');

(async () => {
	try {
		console.time('Sitmap creado en');
		console.log('Creando Sitemap...');
		const getDate = new Date().toISOString();
		const prettierConfig = await prettier.resolveConfig('../.pretierrc');

		const _pages = await globby([
			'pages/**/*.tsx',
			'pages/*.tsx',
			'!pages/_*.tsx',
			'!pages/api',
		]);

		const _articlesName = await globby(['content/posts/*.md']);

		const _getRoutePages = _pages.map((page) => {
			const path = page
				.replace('pages/', '')
				.replace('.tsx', '')
				.replace(/\/index/g, '');

			if (!path.includes('[slug]')) {
				return path === 'index' ? '' : path;
			}
		});

		const _getRouteArticles = _articlesName.map((article) => {
			return `articulos/${article
				.replace('content/posts/', '')
				.replace('.md', '')}`;
		});

		const getRoutePages = _getRoutePages.filter((r) => r !== undefined);
		const getRouteArticles = _getRouteArticles.filter((r) => r !== undefined);

		const routes = [...getRoutePages, ...getRouteArticles];

		const sitemap = `
			<?xml version="1.0" encoding="UTF-8"?>
			<urlset
				xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
				xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
			>
				${routes
					.map(
						(route) =>
							`<url>
							<loc>https://eduardoalvarez.dev/${route}</loc>
							<lastmod>${getDate}</lastmod>
						</url>`,
					)
					.join('')}
			</urlset>
		`;

		const formatted = prettier.format(sitemap, {
			...prettierConfig,
			parser: 'html',
		});

		fs.writeFileSync('public/sitemap.xml', formatted);
		console.timeEnd('Sitmap creado en');
	} catch (error) {
		console.log('Error al crear el SiteMap');
		console.error(error);
	}
})();
