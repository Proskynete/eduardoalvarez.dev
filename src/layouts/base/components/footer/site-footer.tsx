import { Footer, social } from "@eduardoalvarez/arrecife";
import { Isotype } from "@eduardoalvarez/arrecife/brand";

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
 * The fin is the library's Isotype, both variants with CSS picking, because
 * `sobre` resolves at render time and this site switches theme at runtime.
 */

export default function SiteFooter() {
  /**
   * The order is the brand document's: the platforms I publish on, then the ways
   * to follow. `links` carries what stays out of the row — npm and the CV, which
   * have no glyph — and those remain text links.
   */
  const networks = [
    { label: "GitHub", href: "https://github.com/Proskynete", icon: <social.GitHub /> },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/eduardoalvarezc/", icon: <social.LinkedIn /> },
    { label: "X", href: "https://twitter.com/proskynete", icon: <social.X /> },
    { label: "Instagram", href: "https://www.instagram.com/eduardoalvarez.dev", icon: <social.Instagram /> },
    { label: "RSS", href: "/rss.xml", icon: <social.Rss /> },
    { label: "Correo", href: "mailto:soy@eduardoalvarez.dev", icon: <social.Email /> },
    { label: "Newsletter", href: "/newsletter", icon: <social.Newsletter /> },
  ];

  return (
    <Footer
      id="site-footer"
      className="mt-20"
      social={networks}
      brand={
        <span className="gap-step-sm flex items-center">
          <Isotype background="dark" className="block h-6 w-auto flex-none light:hidden" />
          <Isotype background="light" className="hidden h-6 w-auto flex-none light:block" />
          <span className="text-ui font-display font-bold text-text-primary">Eduardo Álvarez</span>
        </span>
      }
    />
  );
}
