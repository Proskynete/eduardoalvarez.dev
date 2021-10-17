import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InstantSearch } from "react-instantsearch-dom";
import { memo, useState } from "react";
import { navResources } from "data/routes";
import { SearchComponentConnected } from "./SearchComponent";
import algoliasearch from "algoliasearch";
import Link from "next/link";
import { IAlgolia } from "models/index.model";

interface PropsInterface {
  path: string;
  algolia?: IAlgolia;
}

const Nav = (props: PropsInterface) => {
  const [state, setState] = useState(false);
  const { path, algolia } = props;

  const client = algolia
    ? algoliasearch(algolia.app_id, algolia.api_key)
    : undefined;

  const handleRemoveActive = () => {
    document
      .querySelectorAll(".nav__inner__menu__content__inner__item__link")
      .forEach((_link) => {
        _link.classList.remove("active");
      });
  };

  return (
    <header className="nav" role="navigation">
      <div className="nav__inner">
        <section className="nav__inner__logo">
          <Link href="/">
            <a>
              <img
                data-sizes="auto"
                data-src="/images/logo/logo.png"
                alt="logo"
                className="nav__inner__logo__img lazyload"
              />
            </a>
          </Link>
        </section>

        <section className="nav__inner__menu">
          <div
            className={`nav__inner__menu__bar ${state ? "mobile" : ""}`}
            role="presentation"
            onClick={() => setState(!state)}
          >
            <FontAwesomeIcon icon={state ? faTimes : faBars} />
          </div>
          <nav className={`nav__inner__menu__content ${state ? "mobile" : ""}`}>
            <ul className="nav__inner__menu__content__inner">
              {algolia && client && (
                <div>
                  <InstantSearch
                    indexName={algolia.index_name}
                    searchClient={client}
                  >
                    <SearchComponentConnected />
                  </InstantSearch>
                </div>
              )}

              {navResources.map((resource) =>
                resource.show ? (
                  <li
                    key={resource.link}
                    className="nav__inner__menu__content__inner__item"
                  >
                    <Link href={resource.link} passHref>
                      <p
                        role="presentation"
                        onClick={handleRemoveActive}
                        className={`nav__inner__menu__content__inner__item__link ${
                          state ? "mobile" : ""
                        } ${
                          resource.pathsAllowed.includes(path) ? "active" : ""
                        }`}
                      >
                        {resource.title}
                      </p>
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </nav>
        </section>
      </div>
    </header>
  );
};

export default memo(Nav);
