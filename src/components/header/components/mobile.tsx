import { useState } from "react";
import { navItems } from "../constants";

export default function Mobile() {
  const [navShow, setNavShow] = useState(false);

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) document.body.style.overflow = "auto";
      else document.body.style.overflow = "hidden";
      return !status;
    });
  };

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="sm:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-gray-100"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className={`fixed left-0 top-0 z-10 h-full w-full transform opacity-95 duration-300 ease-in-out bg-black  ${
          navShow ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute h-8 w-8 top-11 right-5 z-20 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-opacity-50"
          aria-label="Toggle Menu"
          onClick={onToggleNav}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="text-gray-100"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <nav className="relative flex flex-col justify-end content-end items-end w-full h-full pt-40 px-12 pb-12">
          <p className="text-2xl tracking-widest text-gray-100">Comandos</p>

          <ul className="mt-12 flex flex-col items-end">
            {navItems
              .filter((item) => item.show)
              .map((link) => (
                <li key={link.name} className="py-2">
                  <a
                    href={link.href}
                    className="tracking-widest text-gray-100 "
                  >
                    <p className="flex items-baseline text-gray-300">
                      cd
                      <span className="ml-4 text-gray-100">{link.name}</span>
                    </p>
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
