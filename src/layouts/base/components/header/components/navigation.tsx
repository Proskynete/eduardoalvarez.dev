import { useEffect, useState } from "react";

import { navItems } from "../constants";

export default function Navigation() {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
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
  );
}
