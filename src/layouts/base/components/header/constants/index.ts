export interface NavItem {
  name: string;
  href: string;
  show: boolean;
}

export const navItems: NavItem[] = [
  {
    name: "Artículos",
    href: "/articles",
    show: true,
  },
  {
    name: "Charlas",
    href: "/speaking",
    show: true,
  },
  {
    name: "Ahora",
    href: "/now",
    show: true,
  },
  {
    name: "Stack",
    href: "/stack",
    show: true,
  },
  {
    name: "Sobre mí",
    href: "/about",
    show: true,
  },
  {
    name: "Trabajemos",
    href: "/working-with-me",
    show: true,
  },
  {
    name: "Podcast",
    href: "/podcasts",
    show: true,
  },
];
