import { navItems } from "../constants";

interface NavLinksProps {
  pathname: string;
}

export default function NavLinks({ pathname }: NavLinksProps) {
  return (
    <nav aria-label="Main navigation" className="flex gap-6 items-center">
      {navItems
        .filter((item) => item.show)
        .map((item) => (
          <a
            key={item.name}
            className={`text-sm font-medium transition-colors duration-200 ${
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "text-accent cursor-default pointer-events-none"
                : "text-text-secondary hover:text-text-primary"
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
