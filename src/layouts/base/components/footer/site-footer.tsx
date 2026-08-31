import { Footer, FooterLink } from "@eduardoalvarez/arrecife";
import { Isotipo } from "@eduardoalvarez/arrecife/brand";

export interface SiteFooterLink {
  name: string;
  href: string;
}

/**
 * The footer, composed in React rather than in the .astro file.
 *
 * `brand` is a prop, and in Astro a `.astro` component cannot be handed to a
 * React one: any markup written in an .astro file becomes an Astro template
 * result, and React throws `Objects are not valid as a React child`. Even a lone
 * React element fails, because the .astro syntax is not JSX. Only `children`
 * crosses, through the default slot.
 *
 * Moving the composition into a .tsx sidesteps that entirely — here the JSX is
 * real JSX — and the .astro file is left with data to pass. Nothing hydrates:
 * Astro renders this to static HTML, so the client bundle is untouched.
 *
 * The fin is the library's Isotipo, both variants with CSS picking, because
 * `sobre` resolves at render time and this site switches theme at runtime.
 */
export default function SiteFooter({ links }: { links: readonly SiteFooterLink[] }) {
  return (
    <Footer
      id="site-footer"
      className="mt-20"
      brand={
        <span className="gap-step-sm flex items-center">
          <Isotipo sobre="oscuro" className="block h-6 w-auto flex-none light:hidden" />
          <Isotipo sobre="claro" className="hidden h-6 w-auto flex-none light:block" />
          <span className="text-ui font-display font-bold text-text-primary">Eduardo Álvarez</span>
        </span>
      }
    >
      {links.map(({ name, href }) => {
        const external = href.startsWith("http");
        return (
          <FooterLink
            key={href}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {name}
          </FooterLink>
        );
      })}
    </Footer>
  );
}
