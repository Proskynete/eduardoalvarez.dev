import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { customPaginated } from 'helpers/pagination.helper';
import { getPosts } from 'helpers/posts.helper';
import { scrollToTop } from 'helpers/scroll.helper';
import { postsSortered } from 'helpers/sorter.helper';
import { nextPagination, previousPagination } from 'lib/pagination';
import { BlogTemplatePropsInterface } from 'models/blogtemplate.model';
import {
	ArticleContentInterface,
	GetStaticPropsReturnInterface,
	HomePropsInterface,
} from 'models/index.model';
import { PaginateResponseInterface } from 'models/pagination.model';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { memo, SyntheticEvent, useEffect, useState } from 'react';

const Article = dynamic(() => import('components/Article'));
const Layout = dynamic(() => import('components/Layout'));

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
		limit: 8,
		elements: articles,
	});

	useEffect(() => {
		setPagination({ ...pagination, ...paginate });
		setArticlesFiltered(results);
	}, [router.query]);

	const handlePagination = (e: SyntheticEvent<HTMLParagraphElement>) => {
		const { type } = e.currentTarget.dataset;

		if (type === 'next') {
			nextPagination({
				path: '/articulos/',
				page: pagination.next,
				query: 'page',
			});
		} else if (type === 'previous') {
			previousPagination({
				router,
				path: '/articulos/',
				query: 'page',
				previous: pagination.previous,
			});
		}
		scrollToTop();
	};

	return (
		<Layout
			customTitle={title}
			description={description}
			image={image}
			slug='articulos'
		>
			<div className='articles-view'>
				<div className='row'>
					<div className='col-12'>
						<div className='row justify-content-md-center'>
							<div className='col-12 col-lg-7 col-xl-6'>
								<section className='articles'>
									{articlesFiltered &&
										articlesFiltered.map((article: ArticleContentInterface) => (
											<Article key={article.slug} {...article} />
										))}

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

export const getStaticProps = async (): Promise<GetStaticPropsReturnInterface> => {
	const siteConfig = await import(`data/config.json`);

	const posts: BlogTemplatePropsInterface[] = ((context) => getPosts(context))(
		require['context']('../../content/posts', true, /\.md$/),
	);
	const sortered = postsSortered<BlogTemplatePropsInterface>(posts);

	return {
		props: {
			articles: sortered,
			title: 'Artículos publicados',
			description: siteConfig.description,
			image: siteConfig.image,
		},
	};
};
