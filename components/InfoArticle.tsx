import {
  faBookOpenReader,
  faCalendarDays,
  faComment,
  faTag,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onlyDate, prettyFormat } from "helpers/date.helper";
import { prettyReadingTime } from "helpers/reading-time.helper";
import { prettyTags } from "helpers/tags.helper";
import { InfoArticleInterface } from "models/info-article.model";
import dynamic from "next/dynamic";
import { memo } from "react";

const DisqusCount = dynamic(() => import("components/DisqusCount"));

const InfoArticle = (props: InfoArticleInterface) => {
  const {
    date,
    readTime,
    tags,
    horizontal,
    disqus,
    withIcons = { comments: true, date: true, read: true, tags: true },
  } = props;

  return (
    <div className={`info${horizontal ? " horizontal" : ""}`}>
      <div className="info__content">
        {withIcons.date && (
          <div className="info__content__icon">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="info__content__icon__svg"
            />
          </div>
        )}
        <time
          dateTime={onlyDate(date.toString())}
          className="info__content__time"
        >
          {prettyFormat(date, "short")}
        </time>
      </div>

      {readTime && (
        <div className="info__content">
          {withIcons.read && (
            <div className="info__content__icon">
              <FontAwesomeIcon
                icon={faBookOpenReader}
                className="info__content__icon__svg"
              />
            </div>
          )}
          {prettyReadingTime(readTime)}
        </div>
      )}

      {tags && (
        <div className="info__content">
          {withIcons.tags && (
            <div className="info__content__icon">
              <FontAwesomeIcon
                icon={tags.length > 1 ? faTags : faTag}
                className="info__content__icon__svg"
              />
            </div>
          )}
          {prettyTags(tags)}
        </div>
      )}

      {disqus && (
        <div className="info__content">
          {withIcons.comments && (
            <div className="info__content__icon">
              <FontAwesomeIcon
                icon={faComment}
                className="info__content__icon__svg"
              />
            </div>
          )}
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
