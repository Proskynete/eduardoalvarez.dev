import Layout from 'components/Layout';
import fs from 'fs';
import matter from 'gray-matter';
import { generateRss } from 'helpers/rss.helper';
import { dataSerialized } from 'helpers/serializer.helper';
import { FrontMatterInterface } from 'models/blogtemplate.model';
import { PropsInterface, ReturnInterface } from 'models/index.model';
import { FC, memo } from 'react';

const Index: FC<PropsInterface> = (props) => {
	const { title, description, image, articles } = props;

	console.log(articles);

	return (
		<Layout customTitle={title} description={description} image={image}>
			<h1>Welcome</h1>
		</Layout>
	);
};

export default memo(Index);

export const getStaticProps = async (): Promise<ReturnInterface> => {
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
	})(require['context']('../posts', true, /\.md$/));

	const rrs = generateRss(posts);

	fs.writeFileSync('public/rss.xml', rrs);

	return {
		props: {
			articles: posts,
			title: siteConfig.title,
			description: siteConfig.description,
			image: siteConfig.image,
		},
	};
};
