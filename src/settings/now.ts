export interface NowItem {
  category: string;
  label: string;
  description?: string;
}

export const lastUpdated = "2026-02-01";

export const nowItems: NowItem[] = [
  {
    category: "Trabajando en",
    label: "Platform Engineering",
    description:
      "Diseñando la estrategia de plataforma interna para reducir la carga cognitiva de los equipos de producto y acelerar los ciclos de entrega.",
  },
  {
    category: "Trabajando en",
    label: "Engineering Leadership",
    description:
      "Acompañando a managers y tech leads en su evolución hacia un liderazgo más estratégico — menos microgestión, más contexto y criterio.",
  },
  {
    category: "Aprendiendo",
    label: "AI-native development workflows",
    description:
      "Explorando cómo integrar agentes de IA en el ciclo de desarrollo de software sin perder calidad de código ni velocidad de equipo.",
  },
  {
    category: "Aprendiendo",
    label: "eBPF para observabilidad",
    description: "Profundizando en cómo eBPF permite visibilidad a nivel de kernel sin instrumentación en el código de aplicación.",
  },
  {
    category: "Escribiendo",
    label: "Serie sobre Technical Leadership",
    description:
      "Una serie de artículos sobre cómo hacer la transición de contribuidor individual a líder técnico sin perder la esencia de lo que te hizo bueno.",
  },
  {
    category: "Leyendo",
    label: "Staff Engineer — Will Larson",
    description: "Revisitando este libro con ojos de alguien que acompaña a otros en ese camino.",
  },
  {
    category: "Leyendo",
    label: "The Architecture of Trust — varias fuentes",
    description: "Recopilando ensayos y posts sobre cómo se construye confianza técnica dentro de organizaciones de ingeniería.",
  },
];
