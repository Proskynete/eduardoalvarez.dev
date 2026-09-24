export interface NowItem {
  category: string;
  label: string;
  description?: string;
}

export const lastUpdated = "2026-09-23";

export const nowItems: NowItem[] = [
  {
    category: "Trabajando en",
    label: "Technical Lead en CMPC",
    description:
      "Lidero la evolución del frontend de la empresa (Design System y Microfrontends) y el marco de Spec-Driven Development que adoptó toda la compañía para trabajar con IA.",
  },
  {
    category: "Aprendiendo",
    label: "Patrones de arquitectura con LLMs",
    description:
      "Estoy aprendiendo a diseñar aplicaciones que usan modelos de lenguaje sin que se vuelvan difíciles de mantener.",
  },
  {
    category: "Aprendiendo",
    label: "Spec-Driven Development",
    description:
      "Sigo aprendiendo a usarlo mejor con mi equipo: primero acordamos qué hay que construir y después programamos con agentes.",
  },
  {
    category: "Aprendiendo",
    label: "Liderar equipos con IA",
    description:
      "Estoy aprendiendo a usar la IA para tomar mejores decisiones con mi equipo y quitarnos trabajo repetitivo.",
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
