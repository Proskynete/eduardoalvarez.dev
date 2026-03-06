import { navItems } from "../constants";

interface NavLinksProps {
  pathname: string;
}

export default function NavLinks({ pathname }: NavLinksProps) {
  return (
    <>
      <span className="text-text-muted font-mono text-xs select-none">~/</span>
      <nav aria-label="Main navigation" className="flex items-center gap-1 font-mono text-sm">
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const label = item.name.toLowerCase();

            return (
              <a
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group px-1 transition-colors duration-150 ${
                  isActive
                    ? "text-accent pointer-events-none cursor-default"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span
                  className={`select-none transition-opacity duration-150 ${
                    isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  [
                </span>
                ./{label}
                <span
                  className={`select-none transition-opacity duration-150 ${
                    isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  ]
                </span>
              </a>
            );
          })}
      </nav>
    </>
  );
}
