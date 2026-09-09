import { badgeVariants } from "@eduardoalvarez/arrecife";
import {
  AnchorIcon,
  ApplePodcastsLogoIcon,
  GooglePodcastsLogoIcon,
  type Icon as PhosphorIcon,
  SpotifyLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
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
/**
 * Los temas usaban la paleta de serie de Tailwind — `pink-400` sobre
 * `pink-500/20`, y así los seis — que no es del sistema y no cambia con el
 * tema. Medían 1.9:1, ilegibles.
 *
 * El sistema no tiene seis tintes decorativos: sus variantes de `Badge` son
 * semánticas (accent, warm, success, warning, error) y usarlas para decorar
 * haría que un tema llamado «Motivación» se pintara como un error. Todos van
 * a `neutral`, que es la respuesta del sistema para una etiqueta sin carga
 * semántica. El campo `color` de cada tema queda sin efecto por ahora.
 */
const NEUTRAL = badgeVariants({ variant: "neutral" });

export const topicColors: Record<Topic["color"], string> = {
  blue: NEUTRAL,
  green: NEUTRAL,
  purple: NEUTRAL,
  orange: NEUTRAL,
  pink: NEUTRAL,
  cyan: NEUTRAL,
};

/**
 * Iconos de plataformas.
 *
 * Eran cinco `<path>` pegados a mano —el logo de Spotify escrito entero, en una
 * sola línea de 700 caracteres— que nadie podía revisar y que dibujaban a un
 * trazo que no es el de nadie. Ahora son los de Phosphor, que es el set que la
 * librería adopta: llegan como componentes y se dibujan con `Icon`, a 1em y al
 * peso que el sistema fija.
 *
 * El mapa vive aquí y no en las páginas porque `Platform["icon"]` es un dato del
 * episodio: quien añade una plataforma escribe su nombre en este archivo y aquí
 * mismo está lo que se pinta.
 */
export const platformIcons: Record<Platform["icon"], PhosphorIcon> = {
  spotify: SpotifyLogoIcon,
  youtube: YoutubeLogoIcon,
  apple: ApplePodcastsLogoIcon,
  google: GooglePodcastsLogoIcon,
  anchor: AnchorIcon,
};

/**
 * Si la sección existe para el público.
 *
 * En `false` el podcast desaparece por las dos puertas: sale de la navegación
 * y sus rutas dejan de existir —`/podcasts` responde 404 y no se construye
 * ninguna página de episodio— así que tampoco se llega escribiendo la URL ni
 * desde un buscador que la hubiera indexado.
 *
 * Está apagada porque los episodios de abajo son datos de prueba: el audio
 * apunta a `soundhelix.com`, los enlaces de plataforma son `mock1`, y los
 * invitados son personas inventadas con cargo y empresa reales. Publicar eso
 * no es una sección a medias, es información falsa sobre gente que existe.
 *
 * Para encenderla: poner `true` cuando haya un episodio real, y devolver
 * `prerender = true` en `src/pages/podcasts/index.astro`, que mientras tanto
 * se sirve en tiempo de petición para poder responder 404.
 */
export const podcastsEnabled = false;

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
