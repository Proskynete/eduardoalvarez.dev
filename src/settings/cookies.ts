/**
 * Every cookie and every browser-storage key this site sets, by category. The
 * single source for the preferences panel (`components/analytics/
 * cookie-preferences.tsx`) and for a privacy page, if one is ever added.
 *
 * Inventoried from the code and from a production run. When something new
 * writes to cookies, localStorage, sessionStorage or the cache, it goes here.
 *
 * Not listed because they store nothing on the visitor's device: Vercel Web
 * Analytics and Speed Insights (cookieless, aggregated), Sentry's error and
 * performance reports (no cookies), the newsletter (server side only).
 */
export type CookieCategory = "necessary" | "preferences" | "statistics";

export interface CookieItem {
  /** The cookie or storage key, as it appears in the browser's dev tools. */
  name: string;
  provider: string;
  /** Where it lives. */
  storage: "cookie" | "localStorage" | "sessionStorage" | "Cache Storage";
  purpose: string;
  duration: string;
}

export interface CookieCategoryInfo {
  id: CookieCategory;
  title: string;
  description: string;
  items: CookieItem[];
}

export const cookieCategories: CookieCategoryInfo[] = [
  {
    id: "necessary",
    title: "Necesarias",
    description:
      "Hacen que el sitio funcione: recordar tu decisión sobre cookies, la búsqueda, los comentarios, el modo sin conexión y avisarme cuando algo se rompe. No sirven para seguirte.",
    items: [
      {
        name: "cookie-consent",
        provider: "eduardoalvarez.dev",
        storage: "localStorage",
        purpose: "Guarda tu decisión sobre las cookies",
        duration: "Hasta que la cambies",
      },
      {
        name: "algolia-client-js-*",
        provider: "Algolia",
        storage: "localStorage",
        purpose: "Recuerda qué servidores del buscador responden; solo aparece al buscar",
        duration: "Persistente",
      },
      {
        name: "giscus-session",
        provider: "giscus",
        storage: "localStorage",
        purpose: "Mantiene tu sesión de GitHub en los comentarios; solo si inicias sesión para comentar",
        duration: "Hasta que cierres sesión",
      },
      {
        name: "sentryReplaySession",
        provider: "Sentry",
        storage: "sessionStorage",
        purpose: "Identifica la visita para adjuntar una grabación con el texto oculto, solo si ocurre un error",
        duration: "Sesión",
      },
      {
        name: "pwa-splash-shown",
        provider: "eduardoalvarez.dev",
        storage: "sessionStorage",
        purpose: "Muestra la pantalla de inicio de la app instalada una sola vez",
        duration: "Sesión",
      },
      {
        name: "workbox-precache-*, pages, images",
        provider: "eduardoalvarez.dev",
        storage: "Cache Storage",
        purpose: "Guarda el sitio para que cargue rápido y funcione sin conexión",
        duration: "Hasta la siguiente versión del sitio",
      },
    ],
  },
  {
    id: "preferences",
    title: "Preferencias",
    description: "Recuerdan lo que eliges para la próxima visita. Hoy, solo el modo claro u oscuro.",
    items: [
      {
        name: "arrecife-theme",
        provider: "eduardoalvarez.dev",
        storage: "localStorage",
        purpose: "Recuerda si elegiste el modo claro u oscuro",
        duration: "Hasta que lo borres",
      },
    ],
  },
  {
    id: "statistics",
    title: "Estadísticas",
    description:
      "Google Analytics me dice qué se lee y cómo llega la gente hasta aquí, siempre en conjunto y sin saber quién eres. Aparte, cuento las visitas de forma anónima y sin cookies con Vercel Web Analytics, así que apagar esto no me deja a ciegas.",
    items: [
      {
        name: "_ga",
        provider: "Google",
        storage: "cookie",
        purpose: "Distingue visitantes",
        duration: "2 años",
      },
      {
        name: "_ga_<contenedor>",
        provider: "Google",
        storage: "cookie",
        purpose: "Mantiene el estado de la sesión",
        duration: "2 años",
      },
    ],
  },
];
