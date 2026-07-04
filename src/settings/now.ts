export interface NowItem {
  category: string;
  label: string;
  description?: string;
}

export const lastUpdated = "2026-07-04";

export const nowItems: NowItem[] = [
  {
    category: "Trabajando en",
    label: "Technical Lead en CMPC",
    description:
      "Liderando la evolución del ecosistema frontend corporativo y la adopción de IA en los equipos de ingeniería, con un marco de Spec-Driven Development adoptado a nivel de empresa.",
  },
  {
    category: "Trabajando en",
    label: "CTO y CoFounder en AmiPet",
    description:
      "Construyendo amipet.app, una app para dueños de mascotas. Liderando la visión técnica y la estrategia de producto desde el inicio.",
  },
  {
    category: "Aprendiendo",
    label: "Patrones de arquitectura con LLMs",
    description:
      "Explorando cómo diseñar sistemas que integren modelos de lenguaje de forma robusta, escalable y mantenible.",
  },
  {
    category: "Aprendiendo",
    label: "Spec Driven Development",
    description:
      "Adoptando un flujo de desarrollo orientado a especificaciones para mejorar la alineación entre producto e ingeniería.",
  },
  {
    category: "Aprendiendo",
    label: "Management de equipos con IA",
    description:
      "Investigando cómo los líderes de ingeniería pueden apoyarse en herramientas de IA para tomar mejores decisiones y reducir fricción operacional.",
  },
  {
    category: "Leyendo",
    label: "El arte de pensar — Rolf Dobelli",
    description: "Un recorrido por los sesgos cognitivos más comunes y cómo evitarlos para tomar mejores decisiones.",
  },
  {
    category: "Leyendo",
    label: "Hábitos atómicos — James Clear",
    description: "Cómo los pequeños cambios de comportamiento generan resultados extraordinarios en el largo plazo.",
  },
  {
    category: "Leyendo",
    label: "Trust & Inspire — Stephen R. Covey",
    description: "Un nuevo modelo de liderazgo centrado en inspirar a las personas en lugar de controlarlas.",
  },
];
