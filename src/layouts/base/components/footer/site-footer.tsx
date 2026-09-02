import { Footer, social } from "@eduardoalvarez/arrecife";
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

/**
 * The bell links to the newsletter and is the one glyph that does not come from
 * the library: `social` carries Correo, Discord, GitHub, Instagram, LinkedIn,
 * Rss, X and YouTube, but no bell. It follows the same contract as the system's
 * other functional icons — 1.6 stroke, `currentColor`, sized by its container —
 * so it does not stand out until arrecife publishes one.
 */
function Bell() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 8.4a6 6 0 1 0-12 0c0 5.2-1.8 6.7-1.8 6.7h15.6S18 13.6 18 8.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.7 19a2 2 0 0 1-3.4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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
    { label: "Correo", href: "mailto:soy@eduardoalvarez.dev", icon: <social.Correo /> },
    { label: "Newsletter", href: "/newsletter", icon: <Bell /> },
  ];

  return (
    <Footer
      id="site-footer"
      className="mt-20"
      social={networks}
      brand={
        <span className="gap-step-sm flex items-center">
          <Isotipo sobre="oscuro" className="block h-6 w-auto flex-none light:hidden" />
          <Isotipo sobre="claro" className="hidden h-6 w-auto flex-none light:block" />
          <span className="text-ui font-display font-bold text-text-primary">Eduardo Álvarez</span>
        </span>
      }
    />
  );
}
