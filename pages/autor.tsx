import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import matter from 'gray-matter';
import { dataSerialized } from 'helpers/serializer.helper';
import { AuthorGSPInterface, AuthorPropsInterface } from 'models/author';
import { FrontMatterInterface } from 'models/blogtemplate.model';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown/with-html';

const Layout = dynamic(() => import('components/Layout'));
const Say = dynamic(() => import('components/Say'));
const TableOfSections = dynamic(() => import('components/TableOfSections'));

const BlogTemplate = (props: AuthorPropsInterface) => {
	const { markdownBody, github_post_url, frontmatter } = props;
	const { title, description, sections } = frontmatter;

	return (
		<Layout
			customTitle={title}
			description={description}
			image='/'
			slug={title}
		>
			<div className='author'>
				<div className='row'>
					<header className='author__header'>
						<div className='author__header__inner'>
							<div className='author__header__inner__text'>
								<p className='author__header__inner__text__title'>
									Quién es Eduardo?
								</p>
								<p className='author__header__inner__text__subtitle'>
									A human, not a machine
								</p>
								<div className='author__header__inner__text__image'>
									<img src='/images/isotipo/isotipo-white.png' alt={title} />
								</div>
							</div>
						</div>
					</header>
				</div>
				<article className='row justify-content-md-center'>
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
									<div className='article__body__content'>
										<ReactMarkdown source={markdownBody} escapeHtml={false} />
									</div>
									<Say
										variant='secondary'
										anchor='filosofia-de-vida'
										title='Mi filosofía de vida'
										content='Si no estás dispuesto a darlo todo, no tienes derecho a intentarlo.'
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='col-12'>
						<div className='errata'>
							¿Encontraste alguna errata? Ayudame a mejorar haciendo un{' '}
							<a
								href={github_post_url}
								target='_blank'
								rel='noreferrer noopener'
							>
								Pull Request.{' '}
								<FontAwesomeIcon
									icon={faGithub}
									className='info__content__icon__svg'
								/>
							</a>
						</div>
					</div>
				</article>
			</div>
		</Layout>
	);
};

export default memo(BlogTemplate);

export const getStaticProps = async (): Promise<AuthorGSPInterface> => {
	const fileName = 'about-me';
	const content = await import(`content/author/${fileName}.md`);
	const data = matter(content.default);

	return {
		props: {
			github_post_url: `https://github.com/Proskynete/blog/blob/master/content/author/about-me.md`,
			frontmatter: dataSerialized(data.data as FrontMatterInterface),
			markdownBody: data.content,
		},
	};
};
