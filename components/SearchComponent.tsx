import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Autocomplete from "downshift";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connectAutoComplete, Highlight } from "react-instantsearch-dom";

const SearchComponent = ({ refine, hits }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hitsRef = useRef<HTMLDivElement>(null);

  const handleClearSearch = () => {
    setQuery("");
    refine("");
  };

  const handleClickOutside = (event) => {
    if (
      inputRef.current &&
      hitsRef.current &&
      (!inputRef.current.contains(event.target) ||
        !hitsRef.current.contains(event.target))
    ) {
      handleClearSearch();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <Autocomplete
      itemToString={(item) => (item ? item.name : item)}
      onChange={(item) => router.push(item.link)}
    >
      {({ getInputProps, getItemProps, highlightedIndex }) => (
        <div className="search">
          <div className="search__input_container">
            <div className="search__input_container__icon_container">
              <FontAwesomeIcon
                icon={faSearch}
                className="search__input_container__icon_container__icon"
              />
            </div>

            <input
              ref={inputRef}
              type="text"
              className="form-control search__input_container__input"
              placeholder="Buscar..."
              {...getInputProps({
                onChange(e) {
                  setQuery(e.target.value);
                  refine(e.target.value);
                },
              })}
              value={query}
            />

            {query.length > 0 && (
              <div className="search__input_container__icon_container">
                <FontAwesomeIcon
                  icon={faTimes}
                  className="search__input_container__icon_container__times"
                  onClick={handleClearSearch}
                />
              </div>
            )}
          </div>

          {query.length > 0 && (
            <div className="search__hits">
              {hits.slice(0, 5).map((item: any, index: number) => (
                <div
                  ref={hitsRef}
                  key={item.objectID}
                  className={`search__hits__item ${
                    highlightedIndex === index && "search__hits__item--hover"
                  }`}
                  {...getItemProps({
                    item,
                    index,
                  })}
                >
                  <Highlight
                    attribute="title"
                    hit={item}
                    tagName="mark"
                    className="search__hits__item__title"
                  />

                  <Highlight
                    attribute="description"
                    hit={item}
                    tagName="mark"
                    className="search__hits__item__description"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Autocomplete>
  );
};

export const SearchComponentConnected = connectAutoComplete(SearchComponent);
