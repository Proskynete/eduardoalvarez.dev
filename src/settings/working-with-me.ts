import type { FAQItem } from "../interfaces";

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

export const faq: FAQItem[] = [
  {
    question: "¿Cuál es el tiempo mínimo de engagement para consulting?",
    answer:
      "Para consulting y advisory suelo partir con un sprint exploratorio de dos a cuatro semanas para entender el contexto, los stakeholders y los problemas reales. A partir de ahí defino el alcance del trabajo con el cliente. No acepto engagements que requieran respuestas definitivas en menos de dos semanas porque las decisiones de plataforma necesitan observar al equipo en acción.",
  },
  {
    question: "¿Trabajas con equipos remotos y fuera de Chile?",
    answer:
      "Sí, trabajo con equipos distribuidos en Latinoamérica, España y Estados Unidos. La mayoría de las sesiones son remotas sobre Google Meet o Zoom, con documentación asincrónica en Notion o Linear entre reuniones. Puedo viajar para workshops presenciales u offsite si el engagement lo justifica y los gastos están cubiertos por el cliente.",
  },
  {
    question: "¿Qué incluye un workshop privado?",
    answer:
      "Un workshop privado incluye sesiones de diagnóstico previas con los organizadores para entender la madurez del equipo, un bloque formativo de medio día o un día completo con material adaptado, ejercicios prácticos en vivo y una guía de próximos pasos. Los temas habituales son platform engineering, AI-native development y transición a roles de liderazgo técnico.",
  },
  {
    question: "¿Cómo se factura el trabajo?",
    answer:
      "Para mentoring 1:1 facturo por sesión o paquete mensual. Para advisory y consulting facturo por sprint o por retainer mensual, nunca por hora suelta porque distorsiona los incentivos. Workshops se facturan como fee cerrado por evento. Acepto transferencia internacional, Wise, y para clientes en Chile también emito factura electrónica. Los precios los conversamos por email según el alcance.",
  },
  {
    question: "¿Cuánto tardas en responder una consulta inicial?",
    answer:
      "Respondo todos los emails de trabajo dentro de 48 a 72 horas hábiles desde Chile, zona horaria America/Santiago. Si tu contexto requiere urgencia, avísame en el asunto del correo y priorizo la respuesta. No uso formularios de contacto ni calendarios automáticos para la primera conversación porque prefiero entender el problema antes de agendar tiempo en tu calendario.",
  },
];
