import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faTag, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { onlyDate, prettyFormat } from 'helpers/date.helper';
import { prettyReadingTime } from 'helpers/reading-time.helper';
import { prettyTags } from 'helpers/tags.helper';
import { InfoArticleIntereface } from 'models/info-article.model';

const InfoArticle = (props: InfoArticleIntereface) => {
	const { date, readTime, tags, horizontal } = props;

	return (
		<div className={`info${horizontal ? ' horizontal' : ''}`}>
			<div className='info__content'>
				<div className='info__content__icon'>
					<FontAwesomeIcon
						icon={faCalendar}
						className='info__content__icon__svg'
					/>
				</div>
				Publicado el
				<time dateTime={onlyDate(date)} className='info__content__time'>
					{prettyFormat(date)}
				</time>
			</div>

			{readTime && (
				<div className='info__content'>
					<div className='info__content__icon'>
						<FontAwesomeIcon
							icon={faClock}
							className='info__content__icon__svg'
						/>
					</div>
					{prettyReadingTime(readTime)}
				</div>
			)}

			{tags && (
				<div className='info__content'>
					<div className='info__content__icon'>
						<FontAwesomeIcon
							icon={tags.length > 1 ? faTags : faTag}
							className='info__content__icon__svg'
						/>
					</div>
					{prettyTags(tags)}
				</div>
			)}
		</div>
	);
};

export default InfoArticle;
