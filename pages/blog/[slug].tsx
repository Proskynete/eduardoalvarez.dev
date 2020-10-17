import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faTag, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from 'components/Layout';
import TableOfSections from 'components/TableOfSections';
import glob from 'glob';
import matter from 'gray-matter';
import { prettyFormat } from 'helpers/date.helper';
import { prettyReadingTime } from 'helpers/reading-time.helper';
import { dataSerialized } from 'helpers/serializer.helper';
import { prettyTags } from 'helpers/tags.helper';
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
	const { frontmatter, markdownBody, slug } = props;
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
			<article className='container-fluid'>
				<div className='row justify-content-md-center'>
					<div className='col col-md-8'>
						<div className='container'>
							<div className='blog-blog-article'>
								<header className='blog-article__header'>
									<h1>{title}</h1>
									<div className='blog-article__header__info'>
										<span className='blog-article__header__info__published'>
											<FontAwesomeIcon icon={faCalendar} />
											Publicado el{' '}
											<time dateTime={prettyFormat(date)}>
												{prettyFormat(date)}
											</time>
										</span>
										<span className='blog-article__header__info__read'>
											<FontAwesomeIcon icon={faClock} />
											{prettyReadingTime(read_time)}
										</span>

										<span className='blog-article__header__info__tags'>
											<FontAwesomeIcon
												icon={tags.length > 1 ? faTags : faTag}
											/>
											{prettyTags(tags)}
										</span>
									</div>
								</header>
								<div className='blog-article__body'>
									<div className='blog-article__body__header'>
										<img
											className='blog-article__body__header__image'
											src={hero_image}
											alt='Imagen representativa del artículo'
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='container-fluid'>
						<div className='blog-article__body__content'>
							<div className='row'>
								<div
									className='col-12 offset-md-1 col-md-2 sticky-top'
									style={{ padding: '0', backgroundColor: '#ffffff' }}
								>
									<TableOfSections sections={sections} />
								</div>

								<aside id={introduction.anchor} className='intro'>
									<div className='isotipo-container'>
										<img src='/images/isotipo/isotipo-blue.png' alt='isotipo' />
									</div>

									<div className='intro-container'>
										<p className='intro-title'>{introduction.title}</p>
										<ReactMarkdown
											source={introduction.content}
											className='article-content'
										/>
									</div>
								</aside>

								<div className='col-12 col-md-6'>
									<div className='blog-article__body__content__article'>
										<ReactMarkdown source={markdownBody} escapeHtml={false} />
									</div>
								</div>
							</div>
						</div>
					</div>
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
