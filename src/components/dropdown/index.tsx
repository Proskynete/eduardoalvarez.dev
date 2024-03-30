import { useState } from "react";

import { Icon } from "../../assets/icons";
import { clearString } from "../../utils/strings";

interface Options {
  name: string;
  url?: string;
  type?: "title" | "link" | "download";
  ariaTitle?: string;
  title?: string;
}

interface DropdownProps {
  options: Options[][];
}

export function Dropdown({ options }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full xl:w-max">
      <button
        id="dropdown-button"
        data-dropdown-toggle="dropdown"
        className="z-10 w-full xl:w-max flex items-center justify-center px-2 text-sm font-medium bg-transparent text-white transition ease-in-out duration-300"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <Icon.Menu width={20} />
      </button>

      {open && (
        <div
          id="dropdown"
          className={`absolute w-full xl:w-44 z-10 divide-y top-7 right-0 divide-gray-100 rounded-lg shadow bg-gray-700 block transition ease-in-out duration-300`}
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
            {options.map((group, index) => (
              <li key={index}>
                {group.map(({ url, type = "link", name, ariaTitle, title }) =>
                  type !== "title" ? (
                    <a
                      key={title}
                      href={url}
                      {...(type === "link" ? { target: "_blank" } : {})}
                      {...(type === "link" ? { rel: "noopener noreferrer" } : {})}
                      {...(type === "download" ? { download: clearString(title || "") } : {})}
                      className="text-gray-100 transition-colors duration-300"
                      title={ariaTitle}
                    >
                      <li className={`inline-flex w-full px-4 py-1 hover:bg-gray-600 hover:text-white cursor-pointer`}>
                        {name}
                      </li>
                    </a>
                  ) : (
                    <li key={title} className={`inline-flex w-full px-2 py-1 bg-gray-600 text-gray-400 cursor-pointer`}>
                      {name}
                    </li>
                  ),
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
