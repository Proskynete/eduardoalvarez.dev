const fs = require('fs');
const globby = require('globby');
const matter = require('gray-matter');
const moment = require('moment');
const config = require('../data/config.json');

(async () => {
	const nameFiles = await globby(['content/posts/*.md']);

	try {
		const data = nameFiles.map((nameFile, index) => {
			const slug = nameFile
				.replace(/^.*[\\/]/, '')
				.split('.')
				.slice(0, -1)
				.join('.');

			const data = fs.readFileSync(nameFiles[index], 'utf8');
			const document = matter(data);

			return {
				frontmatter: JSON.parse(JSON.stringify(document.data)),
				markdownBody: document.content,
				slug,
			};
		});

		const rss = `
			<?xml version="1.0" encoding="UTF-8" ?>
			<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
				<channel>
					<title>${config.title}</title>
					<link>${config.url}</link>
					<description>${config.description}</description>
					<language>${config.languaje}</language>
					<lastBuildDate>${new Date(
						data[0].frontmatter.date,
					).toUTCString()}</lastBuildDate>
						<atom:link href="https://eduardoalvarez.dev/rss.xml" rel="self" type="application/rss+xml"/>
						${data
							.map(
								(post) => `
									<item>
										<title>${post.frontmatter.title}</title>
										<link>https://eduardoalvarez.dev/articulos/${post.slug}</link>
										<pubDate>${moment.utc(post.frontmatter.date)}</pubDate>
										<guid>https://eduardoalvarez.dev/articulos/${post.slug}</guid>
										<description>${post.frontmatter.description}</description>
									</item>
								`,
							)
							.join('')}
				</channel>
			</rss>
		`;

		fs.writeFileSync('public/rss.xml', rss);
	} catch (e) {
		console.error(e);
	}
})();
