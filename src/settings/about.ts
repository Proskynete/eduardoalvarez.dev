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
      "Liderando la evolución del ecosistema frontend corporativo (Design System y MicroFrontends) y el marco de Spec-Driven Development adoptado a nivel de toda la empresa, impulsando la adopción de IA en la forma de trabajar de los equipos de ingeniería.",
    current: true,
  },
  {
    date: "2025 → hoy",
    role: "CTO & CoFounder",
    company: "AmiPet",
    description:
      "Co-fundando una plataforma en el espacio pet-tech. Definiendo arquitectura, stack y roadmap técnico desde cero, con foco en validar product-market fit.",
    current: true,
  },
  {
    date: "2024 → 2026",
    role: "Senior Consultant / Technical Lead",
    company: "Amaris Consulting",
    description:
      "Liderazgo de arquitectura frontend para plataformas enterprise. Diseño e implementación de la arquitectura de MicroFrontends y el Design System corporativo (base técnica de más de 10 proyectos), con CLI y templates internos que redujeron el time-to-market en un 95%.",
    current: false,
  },
  {
    date: "2023",
    role: "Front End Lead",
    company: "ETpay",
    description:
      "Dirección técnica frontend para plataforma data-driven. Design system, arquitectura de componentes y cultura de calidad en un equipo en crecimiento.",
    current: false,
  },
  {
    date: "2021 → 2022",
    role: "Technical Lead",
    company: "DEUNA",
    description:
      "Productos fintech en pagos y servicios financieros. Mejoras arquitectónicas y modernización de codebase en un ambiente ágil cross-functional.",
    current: false,
  },
  {
    date: "2021",
    role: "CTO",
    company: "Wited",
    description:
      "Transformación digital de plataforma educativa. Estrategia técnica, roadmap de modernización y rebuild frontend con foco en performance y escalabilidad.",
    current: false,
  },
  {
    date: "— 2021",
    role: "Software Engineer → Tech Lead",
    company: "Globant, Penta Financiero, Cardumen Latam y otros",
    description:
      "Trayectoria progresiva en startups y empresas digitales en Chile y Latinoamérica — fintech, ecommerce y plataformas digitales.",
    current: false,
  },
];
