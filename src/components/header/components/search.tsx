import { useEffect, useState } from "react";
import { navItems } from "../constants";
import algoliasearch from "algoliasearch";
import { InstantSearch } from "react-instantsearch-dom";
import { SearchComponentConnected } from "./algolia-search";

export default function Search({ algolia }) {
  const [showInput, setShowInput] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

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
        <div className="hidden sm:flex gap-3">
          <p className="text-gray-100">cd</p>
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <a
                key={item.name}
                className={`font-medium sm:block transition ease-in-out duration-300 ${
                  pathname === item.href
                    ? "text-gray-100 cursor-default pointer-events-none"
                    : "text-gray-300 hover:text-gray-100 focus:outline-none focus:text-gray-100"
                }`}
                href={item.href}
              >
                {item.name}
              </a>
            ))}
        </div>
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
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 text-gray-300 hover:text-gray-100 transition-colors duration-300"
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
