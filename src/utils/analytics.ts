/**
 * Envía un evento personalizado a Google Analytics (GA4).
 *
 * GA corre dentro de Partytown (web worker), por lo que `gtag` no existe en el
 * hilo principal. Partytown lo expone vía `forward: ["gtag"]` (ver
 * astro.config.mjs) y reenvía la llamada al worker. Es no-op si Partytown aún
 * no inicializó o si el navegador no cargó el script.
 */
type EventParams = Record<string, string | number | boolean>;

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const w = window as typeof window & {
    gtag?: (command: "event", name: string, params: EventParams) => void;
  };
  w.gtag?.("event", name, params);
}
