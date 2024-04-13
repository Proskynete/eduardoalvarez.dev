import { useRef, useState } from "react";

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
  const elementRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent) => {
    if (elementRef.current && !elementRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleFocus = () => {
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
  };

  const handleBlur = () => {
    document.removeEventListener("click", handleClick);
    document.removeEventListener("keydown", handleKeyDown);
  };

  return (
    <div ref={elementRef} className="flex relative h-full w-full xl:w-max" onFocus={handleFocus} onBlur={handleBlur}>
      <button
        id="dropdown-button"
        data-dropdown-toggle="dropdown"
        className="w-full xl:w-max flex items-center justify-center px-2 text-sm font-medium bg-transparent text-white transition ease-in-out duration-300"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <Icon.Menu width={20} />
      </button>

      {open && (
        <div
          id="dropdown"
          className={`absolute w-44 divide-y top-9 right-0 divide-gray-100 rounded-lg shadow bg-gray-700 block transition ease-in-out duration-300`}
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
                    <li key={title} className={`inline-flex w-full px-2 py-1 bg-gray-600 text-gray-400 cursor-default`}>
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
