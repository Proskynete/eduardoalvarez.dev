import { MenuLinkInterface } from "models/menu";

const navResources: MenuLinkInterface[] = [
  {
    link: "/",
    pathsAllowed: ["/"],
    title: "Inicio",
    show: true,
  },
  {
    link: "/articulos",
    pathsAllowed: ["/articulos", "/articulos/[slug]"],
    title: "Artículos",
    show: true,
  },
  {
    link: "/autor",
    pathsAllowed: ["/autor"],
    title: "Acerca de",
    show: true,
  },
  {
    link: "/cursos",
    pathsAllowed: ["/cursos"],
    title: "Cursos",
    show: false,
  },
  {
    link: "/podcasts",
    pathsAllowed: ["/podcasts"],
    title: "Podcasts",
    show: true,
  },
];

export { navResources };
