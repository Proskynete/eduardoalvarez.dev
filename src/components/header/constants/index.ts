export interface NavItem {
  name: string;
  href: string;
  show: boolean;
}
export const navItems: NavItem[] = [
  {
    name: "/artículos",
    href: "/articulos",
    show: true,
  },
  {
    name: "Podcast",
    href: "/podcast",
    show: false,
  },
  {
    name: "/cursos",
    href: "/cursos",
    show: false,
  },
  {
    name: "Libros",
    href: "/libros",
    show: false,
  },
];
