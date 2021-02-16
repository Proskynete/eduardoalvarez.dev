import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import glob from 'glob';
import matter from 'gray-matter';
import { calculateReadingTime } from 'helpers/calculate-reading-time.helper';
import { highlightFormat } from 'helpers/highlight.helper';
import { dataSerialized } from 'helpers/serializer.helper';
import {
	BlogTemplatePropsInterface,
	FrontMatterInterface,
	GetStaticPathsResponseInterface,
	GetStaticPropsReturnInterface,
} from 'models/blogtemplate.model';
import { GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { memo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown/with-html';

const Layout = dynamic(() => import('components/Layout'));
const DisqusComponent = dynamic(() => import('components/DisqusComponent'), {
	ssr: false,
});
const InfoArticle = dynamic(() => import('components/InfoArticle'));
const Say = dynamic(() => import('components/Say'));
const TableOfSections = dynamic(() => import('components/TableOfSections'));

const BlogTemplate = (props: BlogTemplatePropsInterface) => {
	const {
		frontmatter,
		markdownBody,
		slug,
		github_post_url,
		disqusShortName,
	} = props;
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

	useEffect(() => {
		if (document.querySelectorAll('pre')) {
			setTimeout(() => {
				highlightFormat();
			}, 1);
			console.log('a');
		}
	}, []);

	return (
		<Layout
			customTitle={title}
			description={description}
			image={hero_image}
			slug={`articulos/${slug}`}
		>
			<article className='row justify-content-md-center'>
				<div className='col-12 col-md-10 col-lg-8'>
					<div className='article'>
						<header className='article__header'>
							<h1 className='article__header__title'>{title}</h1>
							<InfoArticle
								date={date}
								readTime={read_time}
								tags={tags}
								disqus={{
									path: `blog/${slug}`,
									title: title,
									id: title,
									disqusShortName: disqusShortName,
								}}
							/>

							<div className='article__header__hero'>
								<Image
									loading='lazy'
									src={hero_image}
									alt={`${title} - imagen`}
									height='673'
									width='1200'
									className='article__header__hero__image'
									layout='responsive'
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

								{image_introduction ? (
									<figure className='article__body__image'>
										<Image
											src={image_introduction}
											alt={`Imagen de introducción a ${title}`}
											height='322'
											width='615'
											className='article__header__hero__image'
										/>
									</figure>
								) : null}

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
							Pull Request.{' '}
							<FontAwesomeIcon
								icon={faGithub}
								className='info__content__icon__svg'
							/>
						</a>
					</div>
				</div>

				<div className='col-12 col-md-10 col-lg-7'>
					<DisqusComponent
						path={`blog/${slug}`}
						id={title}
						title={title}
						disqusShortName={disqusShortName}
					/>
				</div>
			</article>
		</Layout>
	);
};

export default memo(BlogTemplate);

export const getStaticProps = async (
	ctx: GetStaticPropsContext,
): Promise<GetStaticPropsReturnInterface> => {
	const { slug } = ctx.params;
	const content = await import(`../../content/posts/${slug}.md`);
	const data = matter(content.default);
	data.data['read_time'] = calculateReadingTime(data.content);

	return {
		props: {
			github_post_url: `https://github.com/Proskynete/blog/blob/master/content/posts/${slug}.md`,
			frontmatter: dataSerialized(data.data as FrontMatterInterface),
			markdownBody: data.content,
			disqusShortName: JSON.parse(
				JSON.stringify(process.env.DISQUS_SHORT_NAME),
			),
			slug: slug,
		},
	};
};

export const getStaticPaths = async (): Promise<GetStaticPathsResponseInterface> => {
	const blogs = glob.sync('content/posts/**/*.md');

	const blogSlugs = blogs.map((file: string) =>
		file.split('/')[2].replace(/ /g, '-').slice(0, -3).trim(),
	);

	const paths = blogSlugs.map((slug: string) => `/articulos/${slug}`);

	return {
		paths,
		fallback: false,
	};
};
