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
    show: false,
  },
  {
    name: "Stack",
    href: "/stack",
    show: false,
  },
  {
    name: "Sobre mí",
    href: "/about",
    show: false,
  },
  {
    name: "Trabajemos",
    href: "/working-with-me",
    show: false,
  },
  {
    name: "Podcast",
    href: "/podcasts",
    show: false,
  },
];
