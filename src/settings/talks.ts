import DUOC_ORGANIZATION from "../assets/images/organizations/duoc.webp";
import GLOBANT_ORGANIZATION from "../assets/images/organizations/globant.webp";
import JS_ORGANIZATION from "../assets/images/organizations/js-chile.webp";
import LABORATORIA_ORGANIZATION from "../assets/images/organizations/laboratoria.webp";
import ASTRO_TALK from "../assets/images/talks/astro-pokemon/final.webp";
import REACT_REDUX_PART1_TALK from "../assets/images/talks/react-redux/parte-1.webp";
import REACT_REDUX_TALK from "../assets/images/talks/react-redux/parte-2.webp";
import TRABAJO_TALK from "../assets/images/talks/trabajo-en-tecnologia/final.webp";

interface Organization {
  name: string;
  logo: ImageMetadata;
  url: string;
}

interface Location {
  name: string;
  url: string;
}

interface Resources {
  label: string;
  url: string;
}

export interface Talk {
  title: string;
  description: string;
  show: boolean;
  date: string[];
  image?: ImageMetadata;
  location: Location;
  organizations: Organization[];
  options?: {
    repo?: string;
    resources?: Resources[];
    presentation?: string;
  };
}

export const talks: Talk[] = [
  {
    title: "Astro y Pokémon: Atrapando componentes web en la selva moderna del desarrollo",
    description:
      "Sumerjámonos en el emocionante mundo de Astro, el framework que está revolucionando el desarrollo web, con un taller interactivo de 2 horas. Aprenderemos a construir un sitio web ultra-rápido, consumiendo la API de Pokémon para crear una Pokédex. Descubre cómo Astro te permite integrar componentes de diferentes frameworks en un solo proyecto, optimizando el rendimiento sin sacrificar la flexibilidad. Perfecto para principiantes y no tan principiantes, este taller es tu portal a las últimas tendencias en tecnología web.",
    date: ["2024-04-06T13:00:00.839Z", "2024-04-06T20:00:00.839Z"],
    image: ASTRO_TALK,
    show: true,
    location: {
      name: "DUOC UC Sede Valparaíso. Chile",
      url: "https://maps.app.goo.gl/G7hdHkZdwcDKbHxb8",
    },
    organizations: [
      {
        name: "JavaScript Chile",
        logo: JS_ORGANIZATION,
        url: "https://jschile.org/",
      },
      {
        name: "Duoc UC",
        logo: DUOC_ORGANIZATION,
        url: "https://www.duoc.cl/",
      },
    ],
    options: {
      repo: "https://github.com/Proskynete/Astro-Pokemon-Taller",
      presentation:
        "https://www.canva.com/design/DAGBY3leSdU/I58oujde9CXFZ72gR0vBLw/view?utm_content=DAGBY3leSdU&utm_campaign=designshare&utm_medium=link&utm_source=editor",
      resources: [
        { label: "Configuración", url: "/resources/astro-pokemon/config.zip" },
        {
          label: "Imágenes",
          url: "/resources/astro-pokemon/images.zip",
        },
        { label: "Estilos", url: "/resources/astro-pokemon/styles.zip" },
      ],
    },
  },
  {
    title: "Conseguir trabajo en tecnología",
    description:
      "En este taller aprendimos a cómo buscar trabajo en tecnología, revisamos algunos tips para preparar nuestra primera entrevista de trabajo, creación y revisión de tu CV.",
    date: ["2023-10-28T13:00:00.839Z", "2023-10-28T20:00:00.839Z"],
    image: TRABAJO_TALK,
    show: true,
    location: {
      name: "Hub Providencia, Los Jesuitas #881, Providencia. Chile",
      url: "https://maps.app.goo.gl/oYJzcnDYitngMXhFA",
    },
    organizations: [
      {
        name: "JavaScript Chile",
        logo: JS_ORGANIZATION,
        url: "https://jschile.org/",
      },
    ],
    options: {
      repo: "https://github.com/Proskynete/Conseguir-Trabajo-TI",
    },
  },
  {
    title: "React y Redux avanzado - Parte 2",
    description:
      "Aprendimos como trabajar con Redux, configurar middlewares, y como manejar el estado de nuestra aplicación de forma eficiente.",
    date: ["2019-03-16T13:00:00.839Z", "2019-03-16T20:00:00.839Z"],
    image: REACT_REDUX_TALK,
    show: true,
    location: {
      name: "Av. Puma #1180, Santiago. Chile",
      url: "https://maps.app.goo.gl/XHwMNdveB5pUko6C6",
    },
    organizations: [
      {
        name: "Globant",
        logo: GLOBANT_ORGANIZATION,
        url: "https://www.globant.com/",
      },
      {
        name: "Laboratoria",
        logo: LABORATORIA_ORGANIZATION,
        url: "https://www.laboratoria.la/",
      },
    ],
    options: {
      repo: "https://github.com/Proskynete/workshop-laboratoria-globant",
    },
  },
  {
    title: "React y Redux avanzado - Parte 1",
    description:
      "Aprendimos como trabajar con React, revisamos todos los conceptos básicos y como trabajar con la librería optado las mejores prácticas y dejamos todo listo para la parte 2.",
    date: ["2019-03-05T21:00:00.839Z", "2019-03-06T23:00:00.839Z"],
    image: REACT_REDUX_PART1_TALK,
    show: true,
    location: {
      name: "Cerro el Plomo #5630, Las Condes. Chile",
      url: "https://maps.app.goo.gl/5d1ZAxr9T6z6XXyG8",
    },
    organizations: [
      {
        name: "Globant",
        logo: GLOBANT_ORGANIZATION,
        url: "https://www.globant.com/",
      },
      {
        name: "Laboratoria",
        logo: LABORATORIA_ORGANIZATION,
        url: "https://www.laboratoria.la/",
      },
    ],
    options: {
      repo: "https://github.com/Proskynete/workshop-laboratoria-globant",
    },
  },
];
