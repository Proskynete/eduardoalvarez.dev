interface Engagement {
  type: string;
  description: string;
  forWhom: string[];
  cta: {
    label: string;
    href: string;
  };
}

export const engagements: Engagement[] = [
  {
    type: "Advisory & Consulting",
    description:
      "Trabajo con líderes de ingeniería y CTOs en desafíos de plataforma, arquitectura y organización de equipos. Enfocado en decisiones técnicas con impacto organizacional real.",
    forWhom: [
      "Engineering Managers y CTOs que necesitan una perspectiva externa en decisiones de arquitectura",
      "Empresas en transición de startup a scale-up construyendo su primera plataforma interna",
      "Equipos que quieren reducir deuda técnica sin paralizar el desarrollo de producto",
    ],
    cta: {
      label: "Conversemos por email",
      href: "mailto:soy@eduardoalvarez.dev?subject=Advisory",
    },
  },
  {
    type: "Workshops & Formación",
    description:
      "Talleres prácticos y sesiones de formación para equipos de ingeniería sobre platform engineering, AI-native development, y engineering leadership.",
    forWhom: [
      "Equipos de ingeniería que quieren adoptar prácticas de plataforma con criterio",
      "Tech leads que quieren desarrollar habilidades de liderazgo más allá del código",
      "Organizaciones que quieren preparar a sus equipos para el desarrollo asistido por IA",
    ],
    cta: {
      label: "Ver agenda disponible",
      href: "mailto:soy@eduardoalvarez.dev?subject=Workshop",
    },
  },
  {
    type: "Mentoring 1:1",
    description:
      "Sesiones personales para ingenieros y tech leads que quieren crecer en su carrera con acompañamiento directo y feedback honesto.",
    forWhom: [
      "Senior engineers que quieren dar el salto a roles de liderazgo técnico",
      "Tech leads que se sienten solos en sus decisiones y quieren un espacio para pensar",
      "Engineering Managers en los primeros años del rol que buscan orientación práctica",
    ],
    cta: {
      label: "Agendar una sesión",
      href: "mailto:soy@eduardoalvarez.dev?subject=Mentoring",
    },
  },
];
