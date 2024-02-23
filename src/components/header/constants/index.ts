export interface NavItem {
  name: string;
  href: string;
  show: boolean;
}
export const navItems: NavItem[] = [
  {
    name: "~/eduardoalvarez.dev",
    href: "/",
    show: true,
  },
  {
    name: "./artículos",
    href: "/articulos",
    show: true,
  },
  {
    name: "./charlas-talleres",
    href: "/charlas-talleres",
    show: true,
  },
  {
    name: "./podcast",
    href: "/podcast",
    show: false,
  },
  {
    name: "./cursos",
    href: "/cursos",
    show: false,
  },
  {
    name: "./libros",
    href: "/libros",
    show: false,
  },
];
