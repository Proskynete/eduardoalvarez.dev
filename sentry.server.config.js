import * as Sentry from "@sentry/astro";

/*
 * Server-side Sentry: on-demand pages, API routes and actions. A silent no-op
 * without SENTRY_DSN. Imported by src/middleware/index.ts (the integration runs
 * with `server: false`), so it is initialised before any route runs; request
 * handling and flushing are wired there too.
 */
const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV || "development",
    release: process.env.VERCEL_GIT_COMMIT_SHA || undefined,
    sendDefaultPii: false,
    // Low-traffic site and a large quota: trace every request.
    tracesSampleRate: 1.0,
    // Forward application logs to Sentry.
    enableLogs: true,
    // Never ship cookies or request bodies (the newsletter form posts an email).
    beforeSend(event) {
      if (event.request) {
        delete event.request.cookies;
        delete event.request.data;
        if (event.request.headers) {
          delete event.request.headers.cookie;
          delete event.request.headers["x-sentry-test"];
        }
      }
      return event;
    },
  });
}
