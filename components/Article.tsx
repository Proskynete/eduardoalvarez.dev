import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faTag, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { onlyDate, prettyFormat } from 'helpers/date.helper';
import { prettyReadingTime } from 'helpers/reading-time.helper';
import { prettyTags } from 'helpers/tags.helper';
import { ArticleContentInterface } from 'models/index.model';
import Link from 'next/link';
import { FC } from 'react';

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
						<div className='article__inner__section__header__info'>
							<div className='article__inner__section__header__info__content'>
								<FontAwesomeIcon icon={faCalendar} />
								<time
									dateTime={onlyDate(date)}
									className='article__header__info__content__time'
								>
									{prettyFormat(date)}
								</time>
							</div>

							<div className='article__inner__section__header__info__content'>
								<FontAwesomeIcon icon={faClock} />
								{prettyReadingTime(read_time)}
							</div>

							<div className='article__inner__section__header__info__content'>
								<FontAwesomeIcon icon={tags.length > 1 ? faTags : faTag} />
								{prettyTags(tags)}
							</div>
						</div>
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
