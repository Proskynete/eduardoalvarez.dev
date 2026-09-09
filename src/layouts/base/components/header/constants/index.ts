import { podcastsEnabled } from "../../../../../settings/podcasts";

export interface NavItem {
  name: string;
  href: string;
  show: boolean;
  description?: string;
}

export const navItems: NavItem[] = [
  {
    name: "Artículos",
    href: "/articles",
    show: true,
    description: "Posts sobre ingeniería y liderazgo técnico",
  },
  {
    name: "Charlas",
    href: "/speaking",
    show: true,
    description: "Talks y workshops en conferencias",
  },
  {
    name: "Cursos",
    href: "https://cursos.eduardoalvarez.dev",
    show: true,
    description: "Cursos y formación técnica",
  },
  {
    name: "Sobre_mí",
    href: "/about",
    show: true,
    description: "Quién soy y qué hago",
  },
  {
    /**
     * The podcast follows `podcastsEnabled`, and there is no second switch to
     * forget: the same flag that takes this link out of the bar and the drawer
     * makes the routes stop existing. See `settings/podcasts.ts`.
     */
    name: "Podcast",
    href: "/podcasts",
    show: podcastsEnabled,
    description: "Episodios y charlas en audio",
  },
];
