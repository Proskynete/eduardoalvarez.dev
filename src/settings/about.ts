interface Experience {
  date: string;
  role: string;
  company: string;
  description: string;
  current: boolean;
}

export const experience: Experience[] = [
  {
    date: "2026 → hoy",
    role: "Technical Lead",
    company: "CMPC",
    description:
      "Lidero la evolución del frontend de la empresa (Design System y Microfrontends) y el marco de Spec-Driven Development que adoptó toda la compañía para trabajar con IA.",
    current: true,
  },
  {
    date: "2025 → 2026",
    role: "CTO & CoFounder",
    company: "AmiPet",
    description:
      "Co-fundé una plataforma para dueños de mascotas. Definí la arquitectura, el stack y el roadmap técnico desde cero.",
    current: false,
  },
  {
    date: "2024 → 2026",
    role: "Senior Consultant / Technical Lead",
    company: "Amaris Consulting",
    description:
      "Lideré la arquitectura frontend de plataformas para grandes empresas. Diseñé e implementé la arquitectura de Microfrontends y el Design System corporativo, la base técnica de más de 10 proyectos, con una CLI y plantillas internas que redujeron en un 95 % el tiempo para lanzar un proyecto nuevo.",
    current: false,
  },
  {
    date: "2023",
    role: "Front End Lead",
    company: "ETpay",
    description:
      "Dirigí el frontend de una plataforma basada en datos: Design System, arquitectura de componentes y una cultura de calidad en un equipo que estaba creciendo.",
    current: false,
  },
  {
    date: "2021 → 2022",
    role: "Technical Lead",
    company: "DEUNA",
    description:
      "Productos de pagos y servicios financieros. Mejoré la arquitectura y modernicé el código junto a equipos de producto, diseño y desarrollo.",
    current: false,
  },
  {
    date: "2021",
    role: "CTO",
    company: "Wited",
    description:
      "Modernicé una plataforma educativa: estrategia técnica, plan de modernización y reescritura del frontend para que fuera más rápido.",
    current: false,
  },
  {
    date: "— 2021",
    role: "Software Engineer → Tech Lead",
    company: "Globant, Penta Financiero, Cardumen Latam y otros",
    description:
      "Crecí de desarrollador a líder técnico en startups y empresas digitales de Chile y Latinoamérica: pagos, comercio electrónico y plataformas digitales.",
    current: false,
  },
];
