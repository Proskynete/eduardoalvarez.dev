import { useState } from "react";
import { navItems } from "../constants";

export default function Search() {
  const [showInput, setShowInput] = useState(false);
  const [search, setSearch] = useState("");

  const handleClick = () => {
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
              className="hidden font-medium text-gray-900 dark:text-gray-100 sm:block"
              href={item.href}
            >
              {item.name}
            </a>
          ))
      ) : (
        <>
          <label htmlFor="search" className="sr-only">
            Buscar
          </label>
          <div className="relative w-full">
            <input
              type="text"
              id="search"
              className="focus:ring-primary-600 w-72 rounded-md px-4 focus:border-transparent focus:outline-none focus:ring-2 dark:bg-black"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 end-0 flex items-center pe-3"
              onClick={handleClose}
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
        </>
      )}

      <button aria-label="Buscador" onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 text-gray-900 dark:text-gray-100"
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
