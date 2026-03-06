import type { ImageMetadata } from "astro";

/**
 * Plataforma donde está disponible el podcast
 */
interface Platform {
  name: string;
  url: string;
  icon: "spotify" | "youtube" | "apple" | "google" | "anchor";
}

/**
 * Invitado del episodio de podcast
 */
interface Guest {
  name: string;
  role: string;
  company?: string;
  linkedin?: string;
  twitter?: string;
  image?: ImageMetadata;
}

/**
 * Tema o tópico discutido en el episodio
 */
interface Topic {
  name: string;
  color: "blue" | "green" | "purple" | "orange" | "pink" | "cyan";
}

/**
 * Episodio de podcast
 */
export interface PodcastEpisode {
  /** Número del episodio */
  episode: number;
  /** Slug para la URL */
  slug: string;
  /** Título del episodio */
  title: string;
  /** Descripción del episodio */
  description: string;
  /** Contenido completo del episodio (notas, transcripción, etc.) */
  content: string;
  /** Fecha de publicación (ISO format) */
  date: string;
  /** Duración en minutos */
  duration: number;
  /** URL del archivo de audio */
  audioUrl: string;
  /** Si se muestra o no */
  show: boolean;
  /** Imagen de portada del episodio */
  image?: ImageMetadata;
  /** Invitados del episodio */
  guests: Guest[];
  /** Temas tratados */
  topics: Topic[];
  /** Plataformas donde está disponible */
  platforms: Platform[];
}

/**
 * Colores para los tópicos/tags
 */
export const topicColors: Record<Topic["color"], string> = {
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  green: "bg-green-500/20 text-green-400 border-green-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  pink: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

/**
 * Iconos de plataformas (SVG paths)
 */
export const platformIcons: Record<Platform["icon"], string> = {
  spotify:
    "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  apple:
    "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z",
  google:
    "M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018s3.132-7.018 7-7.018c1.89 0 3.47.697 4.682 1.829l-1.974 1.978v-.004c-.735-.702-1.667-1.062-2.708-1.062-2.31 0-4.187 1.956-4.187 4.273 0 2.315 1.877 4.277 4.187 4.277 2.096 0 3.522-1.202 3.816-2.852H12.14v-2.737h6.585c.088.47.135.96.135 1.474 0 4.01-2.677 6.86-6.72 6.86z",
  anchor:
    "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 4c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zm5 14h-3v-4c0-1.105-.895-2-2-2s-2 .895-2 2v4h-3v-4c0-2.761 2.239-5 5-5s5 2.239 5 5v4z",
};

/**
 * Datos mock de episodios de podcast
 */
export const podcasts: PodcastEpisode[] = [
  {
    episode: 5,
    slug: "ia-en-desarrollo-web",
    title: "El futuro de la inteligencia artificial en el desarrollo web",
    description:
      "Conversamos sobre cómo la IA está transformando la manera en que desarrollamos software. Exploramos herramientas como GitHub Copilot, ChatGPT y Claude, y discutimos cómo los desarrolladores pueden adaptarse a esta nueva era tecnológica sin perder su esencia creativa.",
    content: `## Introducción

En este episodio exploramos el impacto de la inteligencia artificial en el desarrollo de software moderno.

## Temas discutidos

### GitHub Copilot y asistentes de código
- Cómo funciona la autocompletación inteligente
- Casos de uso efectivos vs. cuándo desactivarlo

### ChatGPT y Claude para desarrollo
- Debugging asistido por IA
- Generación de tests unitarios
- Documentación automatizada

### El futuro del desarrollador
- ¿Seremos reemplazados por IA?
- Habilidades que seguirán siendo relevantes

## Recursos mencionados

- [GitHub Copilot](https://github.com/features/copilot)
- [Claude](https://claude.ai)

> "La IA no reemplazará a los desarrolladores, pero los desarrolladores que usen IA reemplazarán a los que no lo hagan." - María González`,
    date: "2024-12-15T10:00:00.000Z",
    duration: 78,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    show: true,
    guests: [
      {
        name: "María González",
        role: "Machine Learning Engineer",
        company: "Google",
        linkedin: "https://linkedin.com/in/mariagonzalez",
        twitter: "https://twitter.com/mariagonzalez",
      },
    ],
    topics: [
      { name: "Inteligencia Artificial", color: "purple" },
      { name: "Desarrollo Web", color: "blue" },
      { name: "Productividad", color: "green" },
    ],
    platforms: [
      { name: "Spotify", url: "https://spotify.com/episode/mock1", icon: "spotify" },
      { name: "YouTube", url: "https://youtube.com/watch?v=mock1", icon: "youtube" },
      { name: "Apple Podcasts", url: "https://podcasts.apple.com/mock1", icon: "apple" },
    ],
  },
  {
    episode: 4,
    slug: "de-junior-a-senior",
    title: "De junior a senior: El camino del desarrollador",
    description:
      "Un episodio especial donde hablamos sobre el crecimiento profesional en tecnología. Discutimos las habilidades técnicas y blandas necesarias para avanzar en tu carrera, cómo manejar el síndrome del impostor, y la importancia del networking en la industria tech.",
    content: `## Introducción

El camino de junior a senior no es lineal ni tiene un tiempo definido.

## Temas discutidos

### Habilidades técnicas vs. soft skills
- Por qué las soft skills son igual de importantes
- Comunicación efectiva con stakeholders

### El síndrome del impostor
- Por qué todos lo experimentamos
- Estrategias para manejarlo

### Networking efectivo
- Comunidades recomendadas
- Cómo aportar valor antes de pedir

## Consejos prácticos

1. **Documenta tu trabajo**: Mantén un registro de tus logros
2. **Busca proyectos desafiantes**: Sal de tu zona de confort
3. **Enseña a otros**: La mejor forma de aprender es enseñando

## Libros recomendados

- "The Staff Engineer's Path" por Tanya Reilly
- "Radical Candor" por Kim Scott`,
    date: "2024-11-20T10:00:00.000Z",
    duration: 92,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    show: true,
    guests: [
      {
        name: "Carlos Mendoza",
        role: "Engineering Manager",
        company: "Mercado Libre",
        linkedin: "https://linkedin.com/in/carlosmendoza",
      },
      {
        name: "Ana Rodríguez",
        role: "Staff Engineer",
        company: "Spotify",
        linkedin: "https://linkedin.com/in/anarodriguez",
        twitter: "https://twitter.com/anarodriguez",
      },
    ],
    topics: [
      { name: "Carrera Profesional", color: "orange" },
      { name: "Soft Skills", color: "pink" },
      { name: "Liderazgo", color: "cyan" },
    ],
    platforms: [
      { name: "Spotify", url: "https://spotify.com/episode/mock2", icon: "spotify" },
      { name: "YouTube", url: "https://youtube.com/watch?v=mock2", icon: "youtube" },
      { name: "Apple Podcasts", url: "https://podcasts.apple.com/mock2", icon: "apple" },
    ],
  },
  {
    episode: 3,
    slug: "microservicios-lecciones",
    title: "Arquitectura de microservicios: Lecciones aprendidas",
    description:
      "Analizamos casos reales de migración de monolitos a microservicios. Nuestro invitado comparte sus experiencias liderando transformaciones arquitectónicas en empresas de alto tráfico, los errores comunes y las mejores prácticas que ha descubierto en el camino.",
    content: `## Introducción

La arquitectura de microservicios promete escalabilidad y flexibilidad, pero viene con sus propios desafíos.

## Temas discutidos

### ¿Cuándo migrar a microservicios?
- Señales de que tu monolito necesita evolucionar
- El costo real de la migración

### Patrones de migración
- Strangler Fig Pattern
- Branch by Abstraction

### Errores comunes
- Crear microservicios demasiado pequeños
- Ignorar la complejidad operacional

## Herramientas recomendadas

- **Kubernetes**: Orquestación de contenedores
- **Istio**: Service mesh
- **Jaeger**: Distributed tracing`,
    date: "2024-10-05T10:00:00.000Z",
    duration: 65,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    show: true,
    guests: [
      {
        name: "Roberto Silva",
        role: "Principal Architect",
        company: "AWS",
        linkedin: "https://linkedin.com/in/robertosilva",
        twitter: "https://twitter.com/robertosilva",
      },
    ],
    topics: [
      { name: "Arquitectura", color: "blue" },
      { name: "Microservicios", color: "purple" },
      { name: "DevOps", color: "green" },
    ],
    platforms: [
      { name: "Spotify", url: "https://spotify.com/episode/mock3", icon: "spotify" },
      { name: "YouTube", url: "https://youtube.com/watch?v=mock3", icon: "youtube" },
      { name: "Google Podcasts", url: "https://podcasts.google.com/mock3", icon: "google" },
    ],
  },
  {
    episode: 2,
    slug: "react-vue-astro-2024",
    title: "React vs Vue vs Astro: ¿Cuál elegir en 2024?",
    description:
      "Una conversación técnica sobre los frameworks más populares del frontend. Comparamos rendimiento, experiencia de desarrollo, ecosistema y casos de uso ideales para cada uno. También discutimos cuándo es mejor usar un framework y cuándo vanilla JavaScript es suficiente.",
    content: `## Introducción

La elección del framework frontend puede definir el éxito de un proyecto.

## Comparativa técnica

### React
- **Pros**: Ecosistema maduro, gran comunidad
- **Contras**: Curva de aprendizaje, boilerplate

### Vue
- **Pros**: Fácil de aprender, documentación excelente
- **Contras**: Ecosistema más pequeño

### Astro
- **Pros**: Zero JS por defecto, island architecture
- **Contras**: Menos maduro, limitaciones con SPAs

## Conclusión

No hay un "mejor" framework universal. La elección depende de:
- Tipo de aplicación
- Experiencia del equipo
- Requisitos de rendimiento`,
    date: "2024-09-12T10:00:00.000Z",
    duration: 85,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    show: true,
    guests: [
      {
        name: "Laura Martínez",
        role: "Frontend Lead",
        company: "Vercel",
        linkedin: "https://linkedin.com/in/lauramartinez",
        twitter: "https://twitter.com/lauramartinez",
      },
    ],
    topics: [
      { name: "React", color: "cyan" },
      { name: "Vue", color: "green" },
      { name: "Astro", color: "orange" },
    ],
    platforms: [
      { name: "Spotify", url: "https://spotify.com/episode/mock4", icon: "spotify" },
      { name: "YouTube", url: "https://youtube.com/watch?v=mock4", icon: "youtube" },
      { name: "Apple Podcasts", url: "https://podcasts.apple.com/mock4", icon: "apple" },
    ],
  },
  {
    episode: 1,
    slug: "bienvenidos-mi-historia",
    title: "Bienvenidos al podcast: Mi historia en tecnología",
    description:
      "En este episodio inaugural, comparto mi trayectoria como desarrollador, desde mis primeros pasos programando hasta convertirme en un profesional de la industria. Hablo sobre los desafíos que enfrenté, las lecciones aprendidas y por qué decidí crear este podcast.",
    content: `## Bienvenidos

¡Hola! Soy Eduardo Álvarez y este es el primer episodio de mi podcast.

## Mi historia

### Los primeros pasos
Todo comenzó cuando tenía 15 años y descubrí HTML mientras intentaba personalizar mi perfil de MySpace.

### El camino profesional
- **2015**: Mi primer trabajo como desarrollador junior
- **2017**: Especialización en React y Node.js
- **2019**: Primer rol como tech lead

### Lecciones aprendidas
1. **Nunca dejes de aprender**: La tecnología evoluciona constantemente
2. **La comunidad es clave**: El networking me abrió muchas puertas
3. **Comparte tu conocimiento**: Enseñar es la mejor forma de aprender

## ¿Por qué este podcast?

Quiero crear un espacio donde podamos aprender de expertos de la industria y compartir experiencias reales.

¡Gracias por acompañarme en este viaje!`,
    date: "2024-08-01T10:00:00.000Z",
    duration: 45,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    show: true,
    guests: [],
    topics: [
      { name: "Historia Personal", color: "pink" },
      { name: "Motivación", color: "purple" },
    ],
    platforms: [
      { name: "Spotify", url: "https://spotify.com/episode/mock5", icon: "spotify" },
      { name: "YouTube", url: "https://youtube.com/watch?v=mock5", icon: "youtube" },
    ],
  },
];
