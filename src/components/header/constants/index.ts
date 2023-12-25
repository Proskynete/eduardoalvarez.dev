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
    name: "Podcast",
    href: "/podcast",
    show: false,
  },
  {
    name: "Libros",
    href: "/libros",
    show: false,
  },
];
