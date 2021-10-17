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
    link: "/recursos",
    pathsAllowed: ["/recursos"],
    title: "Recursos",
    show: false,
  },
  {
    link: "/autor",
    pathsAllowed: ["/autor"],
    title: "Autor",
    show: true,
  },
  {
    link: "/cursos",
    pathsAllowed: ["/cursos"],
    title: "Cursos",
    show: false,
  },
  {
    link: "/glosario",
    pathsAllowed: ["/glosario"],
    title: "Glosario",
    show: false,
  },
  {
    link: "/podcats",
    pathsAllowed: ["/podcats"],
    title: "Podcasts",
    show: false,
  },
];

export { navResources };
