import type { PodcastEpisode } from "../settings/podcasts";
import { clearString } from "./strings";

/**
 * Lo que el índice de episodios necesita saber calcular.
 *
 * `formatDuration` estaba escrita dos veces, idéntica, en el listado y en la
 * página de episodio. Aquí vive una sola vez porque ahora hay una tercera
 * lectura —la duración total de la sección— y tres copias ya no son un
 * descuido, son una forma de que empiecen a divergir.
 */

/** `78` → `1h 18min`; `45` → `45 min`. */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins} min`;
};

/**
 * Los invitados en la meta de la fila.
 *
 * Se enumeran hasta dos y a partir de tres se resumen: con tres nombres la
 * línea deja de caber en una fila de móvil, y el índice existe para escanear,
 * no para dar el reparto completo — eso está en la página del episodio.
 *
 * Devuelve cadena vacía sin invitados, para que quien componga la meta pueda
 * descartar el segmento sin quedarse con un separador colgando.
 */
export const formatGuests = (guests: PodcastEpisode["guests"]): string => {
  const names = guests.map((guest) => guest.name);

  if (names.length === 0) return "";
  if (names.length === 1) return `con ${names[0]}`;
  if (names.length === 2) return `con ${names[0]} y ${names[1]}`;
  return `con ${names[0]} y ${names.length - 1} más`;
};

/** Los minutos de todos los episodios, para la línea de la cabecera. */
export const totalDuration = (episodes: PodcastEpisode[]): number =>
  episodes.reduce((total, episode) => total + episode.duration, 0);

export interface EpisodeYear {
  year: number;
  episodes: PodcastEpisode[];
}

/**
 * Los episodios por año, del más reciente al más antiguo, y dentro de cada año
 * también. Es el mismo agrupamiento que `/speaking` hace con las charlas: un
 * año es la unidad con la que se recuerda cuándo pasó algo.
 */
export const groupByYear = (episodes: PodcastEpisode[]): EpisodeYear[] => {
  const byYear = new Map<number, PodcastEpisode[]>();

  for (const episode of episodes) {
    const year = new Date(episode.date).getFullYear();
    byYear.set(year, [...(byYear.get(year) ?? []), episode]);
  }

  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, list]) => ({
      year,
      episodes: [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }));
};

/** Las iniciales del invitado, como las dibuja `AuthorCard`: `Ana Rodríguez` → `AR`. */
export const initials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export interface EpisodeHeading {
  id: string;
  label: string;
}

/**
 * El índice de las notas, sacado de los `<h2>` que produce `marked`.
 *
 * Las notas de un episodio traen su propia estructura —introducción, temas
 * discutidos, recursos— y hasta ahora se leía como un muro. Esto NO añade un
 * campo nuevo a los datos: lee lo que ya está escrito en el markdown y le pone
 * un ancla a cada encabezado para poder saltar.
 *
 * Devuelve el html con los `id` inyectados junto a la lista, porque las dos
 * cosas tienen que salir del mismo recorrido o los anclajes no coinciden.
 */
export const withHeadingAnchors = (html: string): { html: string; headings: EpisodeHeading[] } => {
  const headings: EpisodeHeading[] = [];

  const withIds = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (match, attrs: string, inner: string) => {
    if (attrs.includes("id=")) return match;

    const label = inner.replace(/<[^>]+>/g, "").trim();
    const id = clearString(label);
    if (!label || !id) return match;

    headings.push({ id, label });
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });

  return { html: withIds, headings };
};
