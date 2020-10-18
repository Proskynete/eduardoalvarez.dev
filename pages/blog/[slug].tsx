import DisqusComponent from 'components/DisqusComponent';
import InfoArticle from 'components/InfoArticle';
import Layout from 'components/Layout';
import Say from 'components/Say';
import TableOfSections from 'components/TableOfSections';
import glob from 'glob';
import matter from 'gray-matter';
import { dataSerialized } from 'helpers/serializer.helper';
import {
	FrontMatterInterface,
	PathsResponseInterface,
	PropsInterface,
	ReturnInterface,
} from 'models/blogtemplate.model';
import { GetStaticPropsContext } from 'next';
import { FC, memo } from 'react';
import ReactMarkdown from 'react-markdown/with-html';

const BlogTemplate: FC<PropsInterface> = (props) => {
	const { frontmatter, markdownBody, slug, github_post_url } = props;
	const {
		date,
		description,
		hero_image,
		read_time,
		tags,
		sections,
		title,
		introduction,
		image_introduction,
	} = frontmatter;

	return (
		<Layout
			customTitle={title}
			description={description}
			image={hero_image}
			slug={`blog/${slug}`}
		>
			<article className='row justify-content-md-center'>
				<div className='col-12 col-md-10 col-lg-8'>
					<div className='article'>
						<header className='article__header'>
							<h1 className='article__header__title'>{title}</h1>
							<InfoArticle date={date} readTime={read_time} tags={tags} />

							<div className='article__header__hero'>
								<img
									src={hero_image}
									className='article__header__hero__image'
									alt={`${title} - imagen`}
								/>
							</div>
						</header>
					</div>
				</div>

				<div className='col-12'>
					<div className='article__body'>
						<div className='row justify-content-center justify-content-lg-start'>
							<div
								className='col-12 col-lg-2 offset-lg-1 sticky-top'
								style={{ padding: '0', backgroundColor: '#fff' }}
							>
								<TableOfSections sections={sections} />
							</div>

							<div className='col-12 col-md-10 col-lg-7'>
								<Say
									variant='primary'
									anchor={introduction.anchor}
									title={introduction.title}
									content={introduction.content}
								/>

								<figure className='article__body__image'>
									<img
										src={image_introduction}
										alt={`Imagen de introducción a ${title}`}
									/>
								</figure>

								<div className='article__body__content'>
									<ReactMarkdown source={markdownBody} escapeHtml={false} />
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='col-12'>
					<div className='errata'>
						¿Encontraste alguna errata? Ayudame a mejorar haciendo un{' '}
						<a href={github_post_url} target='_blank' rel='noreferrer noopener'>
							Pull Request.
						</a>
					</div>
				</div>

				<div className='col-12'>
					<DisqusComponent path={`blog/${slug}`} id={title} title={title} />
				</div>
			</article>
		</Layout>
	);
};

export default memo(BlogTemplate);

export const getStaticProps = async (
	ctx: GetStaticPropsContext,
): Promise<ReturnInterface> => {
	const { slug } = ctx.params;
	const content = await import(`../../posts/${slug}.md`);
	const data = matter(content.default);

	return {
		props: {
			github_post_url: `https://github.com/Proskynete/blog/blob/master/posts/${slug}.md`,
			frontmatter: dataSerialized(data.data as FrontMatterInterface),
			markdownBody: data.content,
			slug: slug,
		},
	};
};

export const getStaticPaths = async (): Promise<PathsResponseInterface> => {
	const blogs = glob.sync('posts/**/*.md');

	const blogSlugs = blogs.map((file: string) =>
		file.split('/')[1].replace(/ /g, '-').slice(0, -3).trim(),
	);

	const paths = blogSlugs.map((slug: string) => `/blog/${slug}`);

	return {
		paths,
		fallback: false,
	};
};
