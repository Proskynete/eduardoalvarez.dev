import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { faComment, faTag, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDiffDates, onlyDate, prettyFormat } from "helpers/date.helper";
import { prettyReadingTime } from "helpers/reading-time.helper";
import { prettyTags } from "helpers/tags.helper";
import { InfoArticleIntereface } from "models/info-article.model";
import dynamic from "next/dynamic";
import { memo } from "react";

const DisqusCount = dynamic(() => import("components/DisqusCount"));

const InfoArticle = (props: InfoArticleIntereface) => {
  const { date, readTime, tags, horizontal, disqus } = props;

  return (
    <div className={`info${horizontal ? " horizontal" : ""}`}>
      <div className="info__content">
        <div className="info__content__icon">
          <FontAwesomeIcon
            icon={faCalendar}
            className="info__content__icon__svg"
          />
        </div>
        <span>
          Publicado
          <time
            dateTime={onlyDate(date.toString())}
            className="info__content__time"
          >
            {prettyFormat(date)}
          </time>
        </span>
      </div>

      {readTime && (
        <div className="info__content">
          <div className="info__content__icon">
            <FontAwesomeIcon
              icon={faClock}
              className="info__content__icon__svg"
            />
          </div>
          {prettyReadingTime(readTime)}
        </div>
      )}

      {tags && (
        <div className="info__content">
          <div className="info__content__icon">
            <FontAwesomeIcon
              icon={tags.length > 1 ? faTags : faTag}
              className="info__content__icon__svg"
            />
          </div>
          {prettyTags(tags)}
        </div>
      )}

      {disqus && (
        <div className="info__content">
          <div className="info__content__icon">
            <FontAwesomeIcon
              icon={faComment}
              className="info__content__icon__svg"
            />
          </div>
          <DisqusCount
            path={disqus.path}
            id={disqus.id}
            title={disqus.id}
            disqusShortName={disqus.disqusShortName}
          />
        </div>
      )}
    </div>
  );
};

export default memo(InfoArticle);
