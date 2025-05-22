import Autocomplete from "downshift";
import { type ChangeEvent, useRef, useState } from "react";
import { connectAutoComplete, Highlight } from "react-instantsearch-dom";

interface AlgoliaSearchProps {
  refine: (value: string) => void;
  hits: any[];
  onClose?: () => void;
}

const AlgoliaSearch = ({ refine, hits, onClose }: AlgoliaSearchProps) => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hitsRef = useRef<HTMLDivElement>(null);

  const handleClearSearch = () => {
    setSearch("");
    refine("");
    onClose && onClose();
  };

  return (
    <Autocomplete
      itemToString={(item) => (item ? item.name : item)}
      onChange={({ link }) => {
        window.location.href = link;
      }}
    >
      {({ getInputProps, getItemProps, highlightedIndex }) => (
        <div className="relative w-[300px]">
          <label htmlFor="search" className="sr-only">
            Buscar
          </label>
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              className="focus:ring-primary-600 rounded-md px-4 focus:border-transparent focus:outline-none focus:ring-2 bg-black w-full"
              placeholder="Buscar..."
              {...getInputProps({
                autoFocus: true,
                value: search,
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  setSearch(e.target.value);
                  refine(e.target.value);
                },
                onKeyDown: (event) => {
                  if (event.key === "Escape") {
                    handleClearSearch();
                  }
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 end-0 flex items-center pe-3"
              onClick={handleClearSearch}
            >
              <svg
                className="w-4 h-4 text-gray-400 hover:text-white"
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
            <div className="absolute max-w-full bg-gray-900 rounded-md border border-gray-700 shadow-lg mt-2 z-50">
              {hits.slice(0, 5).map((item: any, index: number) => (
                <div
                  ref={hitsRef}
                  key={item.objectID}
                  className={`text-gray-200 cursor-pointer p-2 hover:bg-gray-800 ${
                    highlightedIndex === index ? "bg-gray-100 dark:bg-gray-800" : ""
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
                    className="font-bold overflow-hidden block text-sm mb-1"
                  />

                  <Highlight
                    attribute="description"
                    hit={item}
                    tagName="mark"
                    className="text-sm font-light text-gray-400 mb-2 line-clamp-3"
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

export const SearchComponentConnected = connectAutoComplete(AlgoliaSearch) as any;
