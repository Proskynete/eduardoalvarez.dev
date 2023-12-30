import Autocomplete from "downshift";
import { useRef, useState } from "react";
import { connectAutoComplete, Highlight } from "react-instantsearch-dom";

const AlgoliaSearch = ({ refine, hits }) => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hitsRef = useRef<HTMLDivElement>(null);

  return (
    <Autocomplete
      itemToString={(item) => (item ? item.name : item)}
      onChange={(item) => console.log(item)}
    >
      {({ getInputProps, getItemProps, highlightedIndex }) => (
        <div>
          <label htmlFor="search" className="sr-only">
            Buscar
          </label>
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              id="search"
              className="focus:ring-primary-600 w-72 rounded-md px-4 focus:border-transparent focus:outline-none focus:ring-2 dark:bg-black"
              placeholder="Buscar..."
              value={search}
              {...getInputProps({
                onChange(e) {
                  setSearch(e.target.value);
                  refine(e.target.value);
                },
              })}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 end-0 flex items-center pe-3"
            >
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 11-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 111.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {search.length > 0 && (
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

export const SearchComponentConnected = connectAutoComplete(AlgoliaSearch);
