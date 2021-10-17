import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Autocomplete from "downshift";
import { useRouter } from "next/router";
import { connectAutoComplete, Highlight } from "react-instantsearch-dom";

const SearchComponent = ({ refine, hits }) => {
  const router = useRouter();

  return (
    <Autocomplete
      itemToString={(item) => (item ? item.name : item)}
      onChange={(item) => router.push(item.link)}
    >
      {({ getInputProps, getItemProps, highlightedIndex, isOpen }) => (
        <div className="search">
          <div className="search__input_container">
            <div className="search__input_container__icon_container">
              <FontAwesomeIcon
                icon={faSearch}
                className="search__input_container__icon_container__icon"
              />
            </div>

            <input
              type="text"
              className="form-control search__input_container__input"
              placeholder="Buscar..."
              {...getInputProps({
                onChange(e) {
                  refine(e.target.value);
                },
              })}
            />
          </div>

          {isOpen && (
            <div className="search__hits">
              {hits.slice(0, 5).map((item: any, index: number) => (
                <div
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
