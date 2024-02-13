import { useState } from "react";
import { navItems } from "../constants";
import algoliasearch from "algoliasearch";
import { InstantSearch } from "react-instantsearch-dom";
import { SearchComponentConnected } from "./algolia-search";

export default function Search({ algolia }) {
  const [showInput, setShowInput] = useState(false);

  const client = algoliasearch(
    algolia.ALGOLIA_APPLICATION_ID,
    algolia.ALGOLIA_ADMIN_API_KEY
  );

  const handleToggleShowInput = () => {
    setShowInput(!showInput);
  };

  const handleClose = () => {
    setShowInput(false);
  };

  return (
    <>
      {!showInput ? (
        navItems
          .filter((item) => item.show)
          .map((item) => (
            <a
              key={item.name}
              className="hidden font-medium sm:block text-gray-100  hover:text-gray-300 focus:outline-none focus:text-gray-300 transition ease-in-out duration-150"
              href={item.href}
            >
              {item.name}
            </a>
          ))
      ) : (
        <InstantSearch
          indexName={algolia.ALGOLIA_INDEX_NAME}
          searchClient={client}
        >
          <SearchComponentConnected onClose={handleClose} />
        </InstantSearch>
      )}

      <button
        aria-label="Buscador"
        onClick={handleToggleShowInput}
        className="hidden md:block "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 text-gray-100"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </>
  );
}
