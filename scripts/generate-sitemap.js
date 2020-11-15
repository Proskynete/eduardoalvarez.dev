const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');

(async () => {
	const getDate = new Date().toISOString();
	const prettierConfig = await prettier.resolveConfig('./.prettierrc');

	const pages = await globby([
		'pages/**/*.tsx',
		'pages/*.tsx',
		'!pages/_*.tsx',
		'!pages/api',
	]);

	const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
    ${pages
			.map((page) => {
				let route;
				const path = page
					.replace('pages/', '')
					.replace('.tsx', '')
					.replace(/\/index/g, '');

				if (!path.includes('[slug]')) {
					route = path === 'index' ? '' : path;
				} else {
					if (path.split('/')[1] === '[slug]') {
						// route = ...
					}
				}

				return `
          <url>
            <loc>https://eduardoalvarez.dev/${route}</loc>
            <lastmod>${getDate}</lastmod>
          </url>
        `;
			})
			.join('')}
    </urlset>
  `;

	const formatted = prettier.format(sitemap, {
		...prettierConfig,
		parser: 'html',
	});

	fs.writeFileSync('public/sitemap.xml', formatted);
})();
