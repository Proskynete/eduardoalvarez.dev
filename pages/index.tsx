import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Article from 'components/Article';
import Layout from 'components/Layout';
import fs from 'fs';
import matter from 'gray-matter';
import {
	customPaginated,
	PaginateResponseInterface,
} from 'helpers/pagination.helper';
import { generateRss } from 'helpers/rss.helper';
import { dataSerialized } from 'helpers/serializer.helper';
import { nextPagination, previousPagination } from 'lib/pagination';
import {
	BlogTemplatePropsInterface,
	FrontMatterInterface,
} from 'models/blogtemplate.model';
import {
	ArticleContentInterface,
	GetStaticPropsReturnInterface,
	HomePropsInterface,
} from 'models/index.model';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo, SyntheticEvent, useEffect, useState } from 'react';

const Index = (props: HomePropsInterface) => {
	const { title, description, image, articles } = props;
	const [pagination, setPagination] = useState<PaginateResponseInterface>();
	const [articlesFiltered, setArticlesFiltered] = useState<
		Array<ArticleContentInterface | BlogTemplatePropsInterface>
	>();
	const router = useRouter();
	const { page } = router.query;

	const { paginate, results } = customPaginated({
		page: +page || 1,
		limit: 3,
		elements: articles,
	});

	useEffect(() => {
		setPagination({ ...pagination, ...paginate });
		setArticlesFiltered(results);
	}, [router.query]);

	const handlePagination = (e: SyntheticEvent<HTMLParagraphElement>) => {
		const { type } = e.currentTarget.dataset;

		if (type === 'next') {
			nextPagination({ path: '', page: pagination.next, query: 'page' });
		} else if (type === 'previous') {
			previousPagination({
				router,
				path: '',
				query: 'page',
				previous: pagination.previous,
			});
		}
	};

	return (
		<Layout customTitle={title} description={description} image={image}>
			<div className='home'>
				<div className='row'>
					<div className='col-12'>
						<div className='home__presentation'>
							<div className='home__presentation__image'>
								<img
									src='https://res.cloudinary.com/soy-eduardoalvarez/image/upload/v1587245039/user_view/eduardo_alvarez.jpg'
									alt='Imagen de Eduardo Álvarez'
									className='home__presentation__image__img'
								/>
							</div>
							<div className='home__presentation__description'>
								<p className='home__presentation__description__title'>
									Hola! Mi nombre es Eduardo Álvarez
								</p>
								<p className='home__presentation__description__text'>
									... Y soy un apasionado por las tecnologías web (JS Lover).
									Busco compartir todo lo que he aprendido en estos años
									mediante artículos, tutoriales y cursos.
								</p>

								<Link href='/autor'>
									<a className='home__presentation__description__link'>
										Conoce más sobre mi
									</a>
								</Link>
							</div>
						</div>
						<div className='row justify-content-md-center'>
							<div className='col-12 col-lg-7 col-xl-6'>
								<section className='articles'>
									<div className='articles__header'>
										<p className='articles__header__title'>Últimos artículos</p>
									</div>
									{articlesFiltered &&
										articlesFiltered.map((article: ArticleContentInterface) => {
											return <Article key={article.slug} {...article} />;
										})}
									<div className='articles__footer'>
										{pagination?.previous !== 0 && (
											<p
												className='articles__footer__navigation'
												data-type='previous'
												role='presentation'
												onClick={handlePagination}
											>
												<FontAwesomeIcon
													icon={faChevronLeft}
													className='articles__footer__navigation__arrow'
												/>
												<span className='articles__footer__navigation__text'>
													<span>Artículos</span>Más Recientes
												</span>
											</p>
										)}
										{pagination?.next !== 0 && (
											<p
												className='articles__footer__navigation'
												data-type='next'
												role='presentation'
												onClick={handlePagination}
											>
												<span className='articles__footer__navigation__text'>
													<span>Artículos</span>Anteriores
												</span>
												<FontAwesomeIcon
													icon={faChevronRight}
													className='articles__footer__navigation__arrow'
												/>
											</p>
										)}
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
