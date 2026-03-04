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
    description: "Desarrollando estándares de desarrollo de software con IA.",
    current: true,
  },
  {
    date: "2025 → hoy",
    role: "CTO & CoFounder",
    company: "Amipet",
    description:
      "Co-fundando una plataforma en el espacio pet-tech. Definiendo arquitectura, stack y roadmap técnico desde cero, con foco en validar product-market fit.",
    current: true,
  },
  {
    date: "2024",
    role: "Experienced consultant → Senior consultant",
    company: "Amaris Consulting",
    description:
      "Liderazgo de arquitectura frontend para plataformas enterprise. Diseño e implementación de arquitectura microfrontend con React, TypeScript y Single-SPA, reduciendo time-to-market en ~35%.",
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
    date: "2022",
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
