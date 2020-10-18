import { ArticleContentInterface } from 'models/index.model';
import Link from 'next/link';
import { FC } from 'react';

import InfoArticle from './InfoArticle';

const Article: FC<ArticleContentInterface> = (props) => {
	const {
		frontmatter: {
			title,
			image_introduction,
			date,
			read_time,
			tags,
			description,
		},
		slug,
	} = props;

	return (
		<article className='article'>
			<div className='article__inner'>
				<div className='article__inner__section'>
					<img
						src={image_introduction}
						alt={`Imagen del artículo ${title}`}
						className='article__inner__section__hero'
					/>
				</div>

				<div className='article__inner__section'>
					<header className='article__inner__section__header'>
						<h1 className='article__inner__section__header__title'>{title}</h1>
						<InfoArticle date={date} readTime={read_time} horizontal={true} />
					</header>

					<div className='article__inner__section__body'>{description}</div>

					<div className='article__inner__section__footer'>
						<Link href={`/blog/${slug}`}>
							<a>Leer más</a>
						</Link>
					</div>
				</div>
			</div>
		</article>
	);
};

export default Article;
