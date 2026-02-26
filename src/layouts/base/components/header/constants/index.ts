export interface NavItem {
  name: string;
  href: string;
  show: boolean;
}

export const navItems: NavItem[] = [
  {
    name: "Articles",
    href: "/articles",
    show: true,
  },
  {
    name: "Speaking",
    href: "/speaking",
    show: true,
  },
  {
    name: "Now",
    href: "/now",
    show: true,
  },
  {
    name: "Stack",
    href: "/stack",
    show: true,
  },
  {
    name: "About",
    href: "/about",
    show: true,
  },
  {
    name: "Working with Me",
    href: "/working-with-me",
    show: true,
  },
  {
    name: "Podcast",
    href: "/podcast",
    show: false,
  },
];
