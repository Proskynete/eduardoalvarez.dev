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
 * La campana lleva a la newsletter y es el único glifo que no sale de la
 * librería: `social` trae Correo, Discord, GitHub, Instagram, LinkedIn, Rss, X y
 * YouTube, pero no una campana. Sigue el mismo contrato que los demás iconos
 * funcionales del sistema — trazo de 1.6, `currentColor`, 19px por el contenedor
 * — para que no desentone mientras arrecife no la publique.
 */
function Campana() {
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
   * El orden es el del documento de marca: las plataformas donde escribo, luego
   * las formas de seguirme. `links` trae lo que queda fuera de la fila — npm y el
   * currículum, que no tienen glifo — y se quedan como enlaces de texto.
   */
  const redes = [
    { label: "GitHub", href: "https://github.com/Proskynete", icon: <social.GitHub /> },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/eduardoalvarezc/", icon: <social.LinkedIn /> },
    { label: "X", href: "https://twitter.com/proskynete", icon: <social.X /> },
    { label: "Instagram", href: "https://www.instagram.com/eduardoalvarez.dev", icon: <social.Instagram /> },
    { label: "RSS", href: "/rss.xml", icon: <social.Rss /> },
    { label: "Correo", href: "mailto:soy@eduardoalvarez.dev", icon: <social.Correo /> },
    { label: "Newsletter", href: "/newsletter", icon: <Campana /> },
  ];

  return (
    <Footer
      id="site-footer"
      className="mt-20"
      social={redes}
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
