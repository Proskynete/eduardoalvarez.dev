import Layout from 'components/Layout';
import matter from 'gray-matter';
import { AuthorGSPInterface, AuthorPropsInterface } from 'models/author';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown/with-html';

const BlogTemplate = (props: AuthorPropsInterface) => {
	const { markdownBody, github_post_url } = props;

	return (
		<Layout
			customTitle='Autor'
			description='¿Quién es Eduardo Álvarez y que fue lo que lo motivó a querer comprar sus conocimiento con los demas?'
			image='/'
			slug='autor'
		>
			<article className='row justify-content-md-center'>
				<div className='col-12'>
					<div className='article__body'>
						<div className='row justify-content-center justify-content-lg-start'>
							<div className='col-12 col-md-10 col-lg-7'>
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
			</article>
		</Layout>
	);
};

export default memo(BlogTemplate);

export const getStaticProps = async (): Promise<AuthorGSPInterface> => {
	const content = await import('content/author/about-me.md');
	const data = matter(content.default);

	return {
		props: {
			github_post_url: `https://github.com/Proskynete/blog/blob/master/content/author/about-me.md`,
			markdownBody: data.content,
		},
	};
};
