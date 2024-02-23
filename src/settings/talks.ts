interface Organization {
  name: string;
  url: string;
}

interface Location {
  name: string;
  url: string;
}

export interface Talk {
  title: string;
  date: string[];
  image: string;
  location: Location;
  organizations: Organization[];
  repo?: string;
}

export const talks: Talk[] = [
  {
    title: "Conseguir Trabajo en Tecnología",
    date: ["2023-10-28T13:00:00.839Z", "2023-10-28T20:00:00.839Z"],
    image: "images/talleres/trabajo-en-tecnologia/final.webp",
    location: {
      name: "Hub Providencia, Los Jesuitas #881, Providencia. Chile",
      url: "https://maps.app.goo.gl/oYJzcnDYitngMXhFA",
    },
    organizations: [
      {
        name: "JSConf Chile",
        url: "https://jschile.org/",
      },
    ],
    repo: "https://github.com/JSConfCL/techschool/tree/main/ConseguirTrabajoTI",
  },
  {
    title: "React y Redux avanzado - parte 2",
    date: ["2019-03-16T13:00:00.839Z", "2019-03-16T20:00:00.839Z"],
    image: "images/talleres/react-redux/parte-2.webp",
    location: {
      name: "Av. Puma #1180, Santiago. Chile",
      url: "https://maps.app.goo.gl/XHwMNdveB5pUko6C6",
    },
    organizations: [
      {
        name: "Globant",
        url: "https://www.globant.com/",
      },
      {
        name: "Laboratoria",
        url: "https://www.laboratoria.la/",
      },
    ],
  },
  {
    title: "React y Redux avanzado - parte 1",
    date: ["2019-03-05T21:00:00.839Z", "2019-03-06T23:00:00.839Z"],
    image: "images/talleres/react-redux/parte-1.webp",
    location: {
      name: "Cerro el Plomo #5630, Las Condes. Chile",
      url: "https://maps.app.goo.gl/5d1ZAxr9T6z6XXyG8",
    },
    organizations: [
      {
        name: "Globant",
        url: "https://www.globant.com/",
      },
      {
        name: "Laboratoria",
        url: "https://www.laboratoria.la/",
      },
    ],
  },
];
