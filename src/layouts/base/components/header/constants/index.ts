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
    name: "Ahora",
    href: "/now",
    show: true,
    description: "En qué estoy trabajando hoy",
  },
  {
    name: "Sobre_mí",
    href: "/about",
    show: true,
    description: "Quién soy y qué hago",
  },
  {
    name: "Hablemos",
    href: "/working-with-me",
    show: true,
    description: "Cómo podemos colaborar",
  },
  {
    name: "Podcast",
    href: "/podcasts",
    show: false,
    description: "Episodios y charlas en audio",
  },
];
