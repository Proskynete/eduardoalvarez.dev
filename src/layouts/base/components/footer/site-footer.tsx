import { Footer, FooterLink, social } from "@eduardoalvarez/arrecife";
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
 * Las redes van a la fila de iconos; lo demás se queda como enlace de texto.
 *
 * La librería trae glifo para GitHub, LinkedIn, X, Instagram, Discord, YouTube,
 * RSS y correo. No trae para npm ni para el currículum, así que esos dos siguen
 * en texto en vez de inventarles un icono fuera del sistema.
 */
const ICONO: Record<string, keyof typeof social> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  instagram: "Instagram",
  discord: "Discord",
  x: "X",
};

export default function SiteFooter({ links }: { links: readonly SiteFooterLink[] }) {
  const conIcono = links.filter((l) => ICONO[l.name]);
  const soloTexto = links.filter((l) => !ICONO[l.name] && l.name !== "rss");

  const redes = [
    ...conIcono.map(({ name, href }) => {
      const Glifo = social[ICONO[name]];
      return { label: name, href, icon: <Glifo /> };
    }),
    { label: "RSS", href: "/rss.xml", icon: <social.Rss /> },
    { label: "Correo", href: "mailto:soy@eduardoalvarez.dev", icon: <social.Correo /> },
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
    >
      {soloTexto.map(({ name, href }) => (
        <FooterLink key={href} href={href} target="_blank" rel="noopener noreferrer">
          ./{name}
        </FooterLink>
      ))}
    </Footer>
  );
}
