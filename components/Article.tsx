import { ArticleContentInterface } from "models/index.model";
import Link from "next/link";
import { memo } from "react";

import InfoArticle from "./InfoArticle";

const Article = (props: ArticleContentInterface) => {
  const {
    frontmatter: { title, date, description },
    slug,
  } = props;

  return (
    <article className="article">
      <div className="article__inner">
        <div className="article__inner__section">
          <div>
            <header className="article__inner__section__header">
              <Link href={`/articulos/${encodeURIComponent(slug)}`}>
                <a className="article__inner__section__header__title">
                  {title}
                </a>
              </Link>
            </header>

            <div className="article__inner__section__body">{description}</div>

            <InfoArticle
              date={date}
              horizontal
              tags={props.frontmatter.tags}
              withIcons={{
                date: true,
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(Article);
