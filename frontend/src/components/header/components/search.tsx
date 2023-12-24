import { useState } from "react";
import { navItems } from "../constants";

export default function Search() {
  const [show, setShow] = useState(true);
  const [search, setSearch] = useState("");

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <>
      {show ? (
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
        <label>
          <input
            className="rounded-md border-gray-300 dark:border-gray-700 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-100"
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
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
          ></path>
        </svg>
      </button>
    </>
  );
}
