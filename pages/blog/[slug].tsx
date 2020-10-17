import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faTag, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from 'components/Layout';
import TableOfSections from 'components/TableOfSections';
import glob from 'glob';
import matter from 'gray-matter';
import { onlyDate, prettyFormat } from 'helpers/date.helper';
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
			<article className='row justify-content-md-center'>
				<div className='col-12 col-md-8'>
					<div className='article'>
						<header className='article__header'>
							<h1 className='article__header__title'>{title}</h1>

							<div className='article__header__info'>
								<span className='article__header__info__content'>
									<FontAwesomeIcon
										icon={faCalendar}
										className='article__header__info__content__icon'
									/>
									Publicado el
									<time
										dateTime={onlyDate(date)}
										className='article__header__info__content__time'
									>
										{prettyFormat(date)}
									</time>
								</span>
								<span className='article__header__info__content'>
									<FontAwesomeIcon
										icon={faClock}
										className='article__header__info__content__icon'
									/>
									{prettyReadingTime(read_time)}
								</span>

								<span className='article__header__info__content'>
									<FontAwesomeIcon
										icon={tags.length > 1 ? faTags : faTag}
										className='article__header__info__content__icon'
									/>
									{prettyTags(tags)}
								</span>
							</div>

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
						<div className='row'>
							<div
								className='col-12 col-lg-2 offset-lg-1 sticky-top'
								style={{ padding: '0', backgroundColor: '#ffffff' }}
							>
								<TableOfSections sections={sections} />
							</div>

							<div className='col-12 col-lg-8'>
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

								<figure className='col-12'>
									<div className='intro-image'>
										<img
											src={image_introduction}
											className='introduction-image'
											alt={`Imagen de introducción - ${title}`}
										/>
									</div>
								</figure>

								<div className='col-12 col-md-6'>
									<div className='article__body__content__article'>
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
