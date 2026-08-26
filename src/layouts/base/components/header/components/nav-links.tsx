import { trackEvent } from "../../../../../utils/analytics";
import { navItems } from "../constants";

interface NavLinksProps {
  pathname: string;
}

export default function NavLinks({ pathname }: NavLinksProps) {
  return (
    <>
      <span className="text-text-muted font-mono text-xs select-none">~/</span>
      <nav aria-label="Navegación principal" className="flex items-center gap-1 font-mono text-sm">
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const label = item.name.toLowerCase();

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => trackEvent("navigation_click", { link: item.name })}
                aria-current={isActive ? "page" : undefined}
                className={`group border-b border-transparent px-1 pb-[3px] font-mono text-[12.5px] text-text-secondary transition-colors duration-200 hover:text-text-primary aria-[current=page]:border-accent aria-[current=page]:text-accent ${
                  isActive ? "pointer-events-none cursor-default" : ""
                }`}
              >
                {/* Los corchetes se quedan: son parte de la voz de la marca.
                    Aparecen en hover, y el activo suma el subrayado bioluz. */}
                <span
                  className={`select-none transition-opacity duration-150 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  [
                </span>
                ./{label}
                <span
                  className={`select-none transition-opacity duration-150 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
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
