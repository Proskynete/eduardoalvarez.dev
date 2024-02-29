interface Organization {
  name: string;
  logo: string;
  url: string;
}

interface Location {
  name: string;
  url: string;
}

export interface Talk {
  title: string;
  description: string;
  date: string[];
  image: string;
  location: Location;
  organizations: Organization[];
  repo?: string;
}

export const talks: Talk[] = [
  {
    title: "Conseguir trabajo en tecnología",
    description:
      "En este taller aprendimos a cómo buscar trabajo en tecnología, revisamos algunos tips para preparar nuestra primera entrevista de trabajo, creación y revisión de tu CV.",
    date: ["2023-10-28T13:00:00.839Z", "2023-10-28T20:00:00.839Z"],
    image: "images/talleres/trabajo-en-tecnologia/final.webp",
    location: {
      name: "Hub Providencia, Los Jesuitas #881, Providencia. Chile",
      url: "https://maps.app.goo.gl/oYJzcnDYitngMXhFA",
    },
    organizations: [
      {
        name: "JavaScript Chile",
        logo: "images/organizations/js-chile.webp",
        url: "https://jschile.org/",
      },
    ],
    repo: "https://github.com/JSConfCL/techschool/tree/main/ConseguirTrabajoTI",
  },
  {
    title: "React y Redux avanzado - Parte 2",
    description:
      "Aprendimos como trabajar con Redux, configurar middlewares, y como manejar el estado de nuestra aplicación de forma eficiente.",
    date: ["2019-03-16T13:00:00.839Z", "2019-03-16T20:00:00.839Z"],
    image: "images/talleres/react-redux/parte-2.webp",
    location: {
      name: "Av. Puma #1180, Santiago. Chile",
      url: "https://maps.app.goo.gl/XHwMNdveB5pUko6C6",
    },
    organizations: [
      {
        name: "Globant",
        logo: "images/organizations/globant.webp",
        url: "https://www.globant.com/",
      },
      {
        name: "Laboratoria",
        logo: "images/organizations/laboratoria.webp",
        url: "https://www.laboratoria.la/",
      },
    ],
  },
  {
    title: "React y Redux avanzado - Parte 1",
    description:
      "Aprendimos como trabajar con React, revisamos todos los conceptos básicos y como trabajar con la librería optado las mejores prácticas y dejamos todo listo para la parte 2.",
    date: ["2019-03-05T21:00:00.839Z", "2019-03-06T23:00:00.839Z"],
    image: "images/talleres/react-redux/parte-1.webp",
    location: {
      name: "Cerro el Plomo #5630, Las Condes. Chile",
      url: "https://maps.app.goo.gl/5d1ZAxr9T6z6XXyG8",
    },
    organizations: [
      {
        name: "Globant",
        logo: "images/organizations/globant.webp",
        url: "https://www.globant.com/",
      },
      {
        name: "Laboratoria",
        logo: "images/organizations/laboratoria.webp",
        url: "https://www.laboratoria.la/",
      },
    ],
  },
];
