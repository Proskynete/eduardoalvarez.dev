import DUOC_ORGANIZATION from "../assets/images/organizations/duoc.webp";
import GLOBANT_ORGANIZATION from "../assets/images/organizations/globant.webp";
import IEEE_UDP from "../assets/images/organizations/ieee_udp.webp";
import LABORATORIA_ORGANIZATION from "../assets/images/organizations/laboratoria.webp";
import TECH_SCHOOL from "../assets/images/organizations/tech-school.webp";
import ASTRO_TALK from "../assets/images/talks/astro-pokemon/final.webp";
import JS_TALK from "../assets/images/talks/javascript-lenguaje-de-la-web/final.webp";
import REACT_REDUX_PART1_TALK from "../assets/images/talks/react-redux/parte-1.webp";
import REACT_REDUX_TALK from "../assets/images/talks/react-redux/parte-2.webp";
import WORKSHOP_ASTRO from "../assets/images/talks/taller-astro-crea-tu-portafolio/final.webp";
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
    title: "Microfrontends sin dolor: cómo escalar React (y tu equipo) sin romperlo todo",
    description:
      "Cómo unificamos 12 aplicaciones separadas bajo una sola experiencia con microfrontends: React + Vite orquestados con single-spa, un design system compartido sobre shadcn/ui, librerías comunes y despliegue en GCP. Un marco de decisión honesto, a partir de lo que nos salió bien y lo que nos salió mal, sobre cuándo sí y cuándo no usar microfrontends.",
    date: ["2026-08-14T14:00:00.000Z", "2026-08-15T22:00:00.000Z"],
    show: true,
    location: {
      name: "CaribeConf — Barranquilla, Colombia",
      url: "https://sessionize.com/caribeconf-2026/",
    },
    organizations: [],
    options: {
      presentation:
        "https://www.canva.com/design/DAHRpQNMyOM/g_qS5cE8udiDqogqWHtyCg/view?utm_content=DAHRpQNMyOM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb33e9ca337",
    },
  },
  {
    title: "Taller de Astro: Crea tu portafolio",
    description:
      "Aprendimos Astro mientras creábamos un sitio web para mostrar nuestras redes sociales, habilidades y proyectos. El taller era para quienes querían aprender a crear un sitio web de forma rápida y sencilla, sin experiencia previa en desarrollo web.",
    date: ["2025-05-31T11:00:00.839Z", "2025-05-31T13:00:00.839Z"],
    show: true,
    location: {
      name: "Av. Esq. Blanca 501, Maipú, Chile",
      url: "https://maps.app.goo.gl/nG6GBow9wcA9sycd6",
    },
    image: WORKSHOP_ASTRO,
    organizations: [
      {
        name: "Tech School",
        logo: TECH_SCHOOL,
        url: "https://tsc.lat/",
      },
    ],
    options: {
      repo: "https://github.com/Proskynete/taller-my-social-networks",
      presentation:
        "https://www.canva.com/design/DAGo_GFAnWY/yLUjLoIICDPy_PTs5ZejAA/view?utm_content=DAGo_GFAnWY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hcf7946635d",
    },
  },
  {
    title: "JavaScript: ¡El lenguaje que le da vida a la web!",
    description:
      "En esta charla aprendimos los conceptos básicos de JavaScript y cómo ha evolucionado, entendimos qué es ECMA y cómo se relaciona con las versiones de JavaScript, y vimos cómo JavaScript trabaja con la asincronía y cómo cambió su sintaxis.",
    date: ["2024-05-21T11:30:00.839Z", "2024-05-21T13:00:00.839Z"],
    image: JS_TALK,
    show: true,
    location: {
      name: "Av. Ejército Libertador 233, Santiago, Chile.",
      url: "https://maps.app.goo.gl/CMo5webEuoPDF55G9",
    },
    organizations: [
      {
        name: "IEEE Student Branch UDP",
        logo: IEEE_UDP,
        url: "https://www.instagram.com/ieee.udp",
      },
    ],
    options: {
      presentation:
        "https://www.canva.com/design/DAGF74TdAiU/z7df9PVWj-3mi9JFE41pjw/view?utm_content=DAGF74TdAiU&utm_campaign=designshare&utm_medium=link",
    },
  },
  {
    title: "Astro y Pokémon: Atrapando componentes web en la selva moderna del desarrollo",
    description:
      "Taller de 2 horas donde construimos una Pokédex con Astro consumiendo la API de Pokémon. Vimos cómo mezclar componentes de distintos frameworks en un mismo proyecto. Servía si estabas empezando y también si ya programabas.",
    date: ["2024-04-06T13:00:00.839Z", "2024-04-06T20:00:00.839Z"],
    image: ASTRO_TALK,
    show: true,
    location: {
      name: "DUOC UC Sede Valparaíso. Chile",
      url: "https://maps.app.goo.gl/G7hdHkZdwcDKbHxb8",
    },
    organizations: [
      {
        name: "Tech School",
        logo: TECH_SCHOOL,
        url: "https://tsc.lat/",
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
        "https://www.canva.com/design/DAGBY3leSdU/I58oujde9CXFZ72gR0vBLw/view?utm_content=DAGBY3leSdU&utm_campaign=designshare&utm_medium=link",
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
      "En este taller aprendimos cómo buscar trabajo en tecnología, revisamos consejos para preparar la primera entrevista de trabajo y cómo crear y revisar el CV.",
    date: ["2023-10-28T13:00:00.839Z", "2023-10-28T20:00:00.839Z"],
    image: TRABAJO_TALK,
    show: true,
    location: {
      name: "Hub Providencia, Los Jesuitas #881, Providencia. Chile",
      url: "https://maps.app.goo.gl/oYJzcnDYitngMXhFA",
    },
    organizations: [
      {
        name: "Tech School",
        logo: TECH_SCHOOL,
        url: "https://tsc.lat/",
      },
    ],
    options: {
      repo: "https://github.com/Proskynete/Conseguir-Trabajo-TI",
    },
  },
  {
    title: "React y Redux avanzado - Parte 2",
    description:
      "Aprendimos cómo trabajar con Redux, configurar middlewares y cómo manejar el estado de nuestra aplicación de forma eficiente.",
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
      "Aprendimos cómo trabajar con React, revisamos los conceptos básicos y cómo trabajar con la librería adoptando buenas prácticas, y dejamos todo listo para la parte 2.",
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
