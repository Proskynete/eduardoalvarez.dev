export interface NavItem {
  name: string;
  href: string;
  show: boolean;
}
export const navItems: NavItem[] = [
  {
    name: "./portafolio/",
    href: "/",
    show: true,
  },
  {
    name: "./artículos/",
    href: "/articulos",
    show: true,
  },
  {
    name: "./podcast/",
    href: "/podcast",
    show: false,
  },
  {
    name: "./cursos/",
    href: "/cursos",
    show: false,
  },
  {
    name: "./libros/",
    href: "/libros",
    show: false,
  },
];
