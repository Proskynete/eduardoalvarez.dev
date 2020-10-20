import Article from 'components/Article';
import Layout from 'components/Layout';
import fs from 'fs';
import matter from 'gray-matter';
import { customPaginated } from 'helpers/pagination.helper';
import { generateRss } from 'helpers/rss.helper';
import { dataSerialized } from 'helpers/serializer.helper';
import {
	BlogTemplatePropsInterface,
	FrontMatterInterface,
} from 'models/blogtemplate.model';
import {
	ArticleContentInterface,
	GetStaticPropsReturnInterface,
	HomePropsInterface,
} from 'models/index.model';
import { memo, useEffect, useState } from 'react';

const Index = (props: HomePropsInterface) => {
	const { title, description, image, articles } = props;
	const [articlesFiltered, setArticlesFiltered] = useState<
		Array<ArticleContentInterface | BlogTemplatePropsInterface>
	>();

	useEffect(() => {
		const { results } = customPaginated({
			elements: articles,
			limit: 3,
			page: 1,
		});

		setArticlesFiltered(results);
	}, []);

	return (
		<Layout customTitle={title} description={description} image={image}>
			<div className='home'>
				<div className='row'>
					<div className='col-12'>
						<h1>Welcome</h1>

						<div className='row justify-content-md-center'>
							<div className='col-12 col-lg-6'>
								<section className='articles'>
									<div className='articles__header'>
										<p className='articles__header__title'>Últimos Artículos</p>
									</div>
									{articlesFiltered &&
										articlesFiltered.map((article: ArticleContentInterface) => {
											return <Article key={article.slug} {...article} />;
										})}
									<div className='articles__footer'>
										<p>Artículos mas recientes</p>
										<p>Artículos anteriores</p>
									</div>
								</section>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default memo(Index);

export const getStaticProps = async (): Promise<
	GetStaticPropsReturnInterface
> => {
	const siteConfig = await import(`data/config.json`);

	const posts: Array<BlogTemplatePropsInterface> = ((context) => {
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

	const postsSortered = posts.sort((a, b) => {
		const _a = new Date(a.frontmatter.date);
		const _b = new Date(b.frontmatter.date);

		return _a > _b ? -1 : _a < _b ? 1 : 0;
	});

	const rrs = generateRss(postsSortered);

	fs.writeFileSync('public/rss.xml', rrs);

	return {
		props: {
			articles: postsSortered,
			title: siteConfig.title,
			description: siteConfig.description,
			image: siteConfig.image,
		},
	};
};
