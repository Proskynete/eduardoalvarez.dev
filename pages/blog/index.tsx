import Layout from 'components/Layout';
import fs from 'fs';
import matter from 'gray-matter';
import { generateRss } from 'helpers/rss.helper';
import { dataSerialized } from 'helpers/serializer.helper';
import { FrontMatterInterface } from 'models/blogtemplate.model';
import { memo } from 'react';

interface ArticleContentInterface {
	markdownBody: string;
	frontmatter: FrontMatterInterface;
	slug: string;
}

interface BlogViewInterface {
	title: string;
	description: string;
	articles: Array<ArticleContentInterface>;
}

const Index = (props: BlogViewInterface) => {
	return (
		<Layout
			customTitle='Articulos publicados'
			description='una pequeña descripcion'
			image='/images/introduccion-a-jamstack/introduccion_a_jamstack.png'
			slug='blog/'
		>
			Blog content
			<section>
				{props.articles.map((article, i) => {
					return (
						<div key={i}>
							<p>{article.frontmatter.title}</p>
						</div>
					);
				})}
			</section>
		</Layout>
	);
};

export default memo(Index);

export async function getStaticProps() {
	const siteConfig = await import(`data/config.json`);

	const posts = ((context) => {
		const nameFiles = context.keys();
		const contentFile = nameFiles.map(context);

		const data = nameFiles.map((nameFile: string, index: number) => {
			const slug = nameFile
				.replace(/^.*[\\/]/, '')
				.split('.')
				.slice(0, -1)
				.join('.');

			const content = contentFile[index];
			const document = matter(content.default);

			return {
				frontmatter: dataSerialized(document.data as FrontMatterInterface),
				markdownBody: document.content,
				slug,
			};
		});
		return data;
	})(require['context']('../../posts', true, /\.md$/));

	const rrs = generateRss(posts);

	fs.writeFileSync('public/rss.xml', rrs);

	return {
		props: {
			articles: posts,
			title: siteConfig.default.title,
			description: siteConfig.default.description,
		},
	};
}
