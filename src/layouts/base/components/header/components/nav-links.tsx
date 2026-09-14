import { NavItem } from "@eduardoalvarez/arrecife";

import { trackEvent } from "../../../../../utils/analytics";
import { navItems } from "../constants";

interface NavLinksProps {
  pathname: string;
}

/**
 * The items are the library's `NavItem`.
 *
 * It draws the `./` prefix itself and puts the brackets on the active one, which
 * is what this file used to do by hand with two spans and an opacity transition.
 * The library shows them on the current section only — the hover version was a
 * local invention — and marks it with a bioluz underline instead of a bottom
 * border.
 *
 * The fragment is deliberate: `Nav` renders the `<ul>` and the `~/` prompt, so
 * these have to arrive as bare `<li>`s and not wrapped in a nav of their own.
 */
export default function NavLinks({ pathname }: NavLinksProps) {
  return (
    <>
      {navItems
        .filter((item) => item.show)
        .map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <NavItem
              key={item.name}
              href={item.href}
              active={isActive}
              onClick={() => trackEvent("navigation_click", { link: item.name })}
              className={isActive ? "pointer-events-none cursor-default" : undefined}
            >
              {item.name.toLowerCase()}
            </NavItem>
          );
        })}
    </>
  );
}
