import { navItems } from "../constants";

interface NavLinksProps {
  pathname: string;
}

export default function NavLinks({ pathname }: NavLinksProps) {
  return (
    <nav aria-label="Main navigation" className="flex gap-3 items-center">
      <span className="text-gray-100" aria-hidden="true">
        cd
      </span>
      {navItems
        .filter((item) => item.show)
        .map((item) => (
          <a
            key={item.name}
            className={`font-medium sm:block transition ease-in-out duration-300 ${
              pathname === item.href
                ? "text-gray-100 cursor-default pointer-events-none focus:outline-dashed"
                : "text-gray-300 hover:text-gray-100 focus:text-gray-100"
            }`}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            {item.name}
          </a>
        ))}
    </nav>
  );
}
