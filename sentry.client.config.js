import * as Sentry from "@sentry/astro";

import { environmentFromHost, normaliseEnvironment } from "./src/utils/sentry-environment";

/*
 * Browser-side Sentry. A silent no-op without PUBLIC_SENTRY_DSN (dev, CI,
 * previews without the variable): nothing is initialised and nothing loads.
 *
 * environment: VERCEL_ENV inlined at build time, else the page's host
 * (eduardoalvarez.dev → production, localhost → development, anything else →
 * preview). release: the commit SHA inlined at build time. See
 * src/utils/sentry-environment.ts.
 */
const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: normaliseEnvironment(__SENTRY_ENVIRONMENT__) ?? environmentFromHost(window.location.hostname),
    release: __SENTRY_RELEASE__ || undefined,
    sendDefaultPii: false,
    // Low-traffic site and a large quota: trace every page load and navigation.
    // browserTracingIntegration also reports the Web Vitals (LCP, INP, CLS, TTFB).
    tracesSampleRate: 1.0,
    tracePropagationTargets: [/^\/(?!\/)/, window.location.origin],
    integrations: [Sentry.browserTracingIntegration()],
    // Replay only when an error happens. The integration itself is lazy-loaded
    // below so it stays out of the first load.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    // Forward application logs to Sentry.
    enableLogs: true,
    // Ruido de scripts de terceros de Vercel (no son bugs del sitio): Speed
    // Insights re-registra su web component y su script se re-ejecuta con el
    // ClientRouter (View Transitions); el Vercel Toolbar falla en su pagehide.
    ignoreErrors: [/vercel-(speed-insights|analytics).*already been used/i, "Failed to execute 'replaceWith' on 'Element'"],
    denyUrls: [/vercel\.live/, /_next-live\//],
  });

  const loadReplay = () => {
    Sentry.lazyLoadIntegration("replayIntegration")
      .then((replayIntegration) => {
        Sentry.addIntegration(replayIntegration({ maskAllText: true, blockAllMedia: true }));
      })
      .catch(() => {
        // Blocked by an extension or offline: errors still reach Sentry without a replay.
      });
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(loadReplay, { timeout: 5000 });
  else setTimeout(loadReplay, 3000);

  /*
   * End-to-end check for production: `?sentry-test=1` throws an uncaught error
   * that the SDK reports. Nothing happens without the parameter. Runs on every
   * page load, ClientRouter navigations included.
   */
  const throwTestError = () => {
    if (new URLSearchParams(window.location.search).get("sentry-test") !== "1") return;
    setTimeout(() => {
      throw new Error("Sentry test error (client)");
    });
  };
  document.addEventListener("astro:page-load", throwTestError);
}
