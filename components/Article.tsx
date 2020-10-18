import {
	faFacebookF,
	faLinkedinIn,
	faTwitter,
	faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { copyTextToClipboard } from 'helpers/copy-to-clipboard.helper';
import { titleForSocialNetwork } from 'helpers/letters.helper';
import { ArticleContentInterface } from 'models/index.model';
import Link from 'next/link';
import { memo, SyntheticEvent } from 'react';

import InfoArticle from './InfoArticle';

const Article = (props: ArticleContentInterface) => {
	const {
		frontmatter: { title, image_introduction, date, read_time, description },
		slug,
	} = props;

	const urlToShare = `https://eduardoalvarez.dev/blog/${slug}`;

	const handleCopyUrl = (event: SyntheticEvent) => {
		copyTextToClipboard(event, urlToShare);
	};

	return (
		<article className='article'>
			<div className='article__inner'>
				<div className='article__inner__section'>
					<div className='article__inner__section__image'>
						<img
							src={image_introduction}
							alt={`Imagen del artículo ${title}`}
							className='article__inner__section__image__hero'
						/>
					</div>
				</div>

				<div className='article__inner__section'>
					<div>
						<header className='article__inner__section__header'>
							<h1 className='article__inner__section__header__title'>
								{title}
							</h1>
							<InfoArticle date={date} readTime={read_time} horizontal={true} />
						</header>

						<div className='article__inner__section__body'>{description}</div>
					</div>

					<div className='article__inner__section__footer'>
						<div className='article__inner__section__footer__section'>
							<Link href={`/blog/${encodeURIComponent(slug)}`}>
								<a className='article__inner__section__footer__section__link'>
									Seguir leyendo
								</a>
							</Link>
						</div>

						<div className='article__inner__section__footer__section'>
							<span className='article__inner__section__footer__section__share'>
								<a
									href={`https://www.facebook.com/sharer/sharer.php?u=${urlToShare}`}
									title='Compartir en facebook'
									target='_blank'
									className='article__inner__section__footer__section__share__link'
									rel='noreferrer noopener'
								>
									<FontAwesomeIcon icon={faFacebookF} />
								</a>
							</span>
							<span className='article__inner__section__footer__section__share'>
								<a
									href={`https://twitter.com/intent/tweet?text=${titleForSocialNetwork(
										title,
									)}&url=${urlToShare}`}
									title='Compartir en twitter'
									target='_blank'
									className='article__inner__section__footer__section__share__link'
									rel='noreferrer noopener'
								>
									<FontAwesomeIcon icon={faTwitter} />
								</a>
							</span>
							<span className='article__inner__section__footer__section__share'>
								<a
									href={`https://www.linkedin.com/sharing/share-offsite/?url=${urlToShare}`}
									title='Compartir en linkedin'
									target='_blank'
									className='article__inner__section__footer__section__share__link'
									rel='noreferrer noopener'
								>
									<FontAwesomeIcon icon={faLinkedinIn} />
								</a>
							</span>
							<span className='article__inner__section__footer__section__share'>
								<a
									href={`https://api.whatsapp.com/send?text=${titleForSocialNetwork(
										title,
									)}${urlToShare}`}
									title='Compartir por whatsapp'
									className='article__inner__section__footer__section__share__link'
									target='_blank'
									rel='noreferrer noopener'
								>
									<FontAwesomeIcon icon={faWhatsapp} />
								</a>
							</span>
							<span className='article__inner__section__footer__section__share'>
								<div
									role='button'
									tabIndex={0}
									className='article__inner__section__footer__section__share__link'
									aria-hidden='true'
									title='Compartir copiando link'
									onClick={(e) => handleCopyUrl(e)}
								>
									<FontAwesomeIcon icon={faCopy} />
								</div>
							</span>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};

export default memo(Article);
