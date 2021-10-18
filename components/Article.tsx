import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AlertContext } from "context/alertContext";
import { copyTextToClipboard } from "helpers/copy-to-clipboard.helper";
import { titleForSocialNetwork } from "helpers/letters.helper";
import { CONSTANTS, event } from "lib/gtag";
import { ArticleContentInterface } from "models/index.model";
import Link from "next/link";
import { memo, SyntheticEvent } from "react";
import { useContext } from "react";

import InfoArticle from "./InfoArticle";

const Article = (props: ArticleContentInterface) => {
  const { setAlert } = useContext(AlertContext);
  const {
    frontmatter: { title, thumbnail_image, date, read_time, description },
    slug,
  } = props;

  const urlToShare = `https://eduardoalvarez.dev/articulos/${slug}`;

  const handleCopyUrl = (event: SyntheticEvent) => {
    copyTextToClipboard(event, urlToShare);
    handleShareIconsButton(event, "custom-link");
    setAlert({ show: true, title: "Link copiado", variant: "success" });
  };

  const handleShareIconsButton = (e: SyntheticEvent, socialMedia: string) => {
    e.preventDefault();

    event({
      action: "SHARE_ARTICLE_LINK",
      category: CONSTANTS.BUTTON_ACTION.CATEGORY,
      label: `Track article share button - ${socialMedia}`,
      value: `Artículo compartido por: ${socialMedia}`,
    });
  };

  return (
    <article className="article">
      <div className="article__inner">
        <div className="article__inner__section">
          <div className="article__inner__section__image">
            <Link href={`/articulos/${encodeURIComponent(slug)}`}>
              <a>
                <img
                  decoding="async"
                  data-sizes="auto"
                  data-src={thumbnail_image}
                  alt={`Imagen del artículo ${title}`}
                  loading="lazy"
                  className="article__inner__section__image__thumbnail lazyload"
                />
              </a>
            </Link>
          </div>
        </div>

        <div className="article__inner__section">
          <div>
            <header className="article__inner__section__header">
              <Link href={`/articulos/${encodeURIComponent(slug)}`}>
                <a className="article__inner__section__header__title">
                  {title}
                </a>
              </Link>
              <InfoArticle date={date} readTime={read_time} horizontal={true} />
            </header>

            <div className="article__inner__section__body">{description}</div>
          </div>

          <div className="article__inner__section__footer">
            <div className="article__inner__section__footer__section">
              <Link href={`/articulos/${encodeURIComponent(slug)}`}>
                <a className="article__inner__section__footer__section__link">
                  Seguir leyendo
                </a>
              </Link>
            </div>

            <div className="article__inner__section__footer__section">
              <span className="article__inner__section__footer__section__share">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${urlToShare}`}
                  title="Compartir en facebook"
                  target="_blank"
                  className="article__inner__section__footer__section__share__link"
                  rel="noreferrer noopener"
                  onClick={(e) => handleShareIconsButton(e, "facebook")}
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
              </span>
              <span className="article__inner__section__footer__section__share">
                <a
                  href={`https://twitter.com/intent/tweet?text=${titleForSocialNetwork(
                    title
                  )}&url=${urlToShare}`}
                  title="Compartir en twitter"
                  target="_blank"
                  className="article__inner__section__footer__section__share__link"
                  rel="noreferrer noopener"
                  onClick={(e) => handleShareIconsButton(e, "twitter")}
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </span>
              <span className="article__inner__section__footer__section__share">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${urlToShare}`}
                  title="Compartir en linkedin"
                  target="_blank"
                  className="article__inner__section__footer__section__share__link"
                  rel="noreferrer noopener"
                  onClick={(e) => handleShareIconsButton(e, "linkedin")}
                >
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              </span>
              <span className="article__inner__section__footer__section__share">
                <a
                  href={`https://api.whatsapp.com/send?text=${titleForSocialNetwork(
                    title
                  )}${urlToShare}`}
                  title="Compartir por whatsapp"
                  className="article__inner__section__footer__section__share__link"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={(e) => handleShareIconsButton(e, "whatsapp")}
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
              </span>
              <span className="article__inner__section__footer__section__share">
                <div
                  role="button"
                  tabIndex={-1}
                  className="article__inner__section__footer__section__share__link"
                  aria-hidden="true"
                  title="Compartir copiando link"
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
