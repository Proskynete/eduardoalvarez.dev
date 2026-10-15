/**
 * Sends a GA4 event. The single entry point for custom events on the site.
 *
 * GA only loads after the visitor accepts in the cookie banner
 * (`components/analytics/index.astro`), which sets `window.analyticsLoaded`.
 * Before that, after declining, in dev or without PUBLIC_GA_ID this is a no-op:
 * events are dropped, not queued, so nothing collected before consent is sent
 * once it is given.
 *
 * Params never carry personal data: no emails, names or free text.
 */
type EventParams = Record<string, string | number | boolean>;

type AnalyticsWindow = Window & {
  analyticsLoaded?: boolean;
  gtag?: (command: "event", name: string, params: EventParams) => void;
};

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  if (!w.analyticsLoaded || typeof w.gtag !== "function") return;
  w.gtag("event", name, params);
}

const COURSES_ORIGIN = "https://cursos.eduardoalvarez.dev";

/**
 * A click on a header link. Every link sends `navigation_click`; the one to the
 * courses site also sends `select_content`, the event to mark as a key event in
 * GA4: it is the step from reading to learning with me.
 */
export function trackNavigation(link: { name: string; href: string }, location: "header" | "mobile_menu"): void {
  trackEvent("navigation_click", { link: link.name });
  if (link.href.startsWith(COURSES_ORIGIN)) {
    trackEvent("select_content", { content_type: "course_link", item_id: "cursos", location });
  }
}
