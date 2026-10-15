import * as Sentry from "@sentry/astro";

import { normaliseEnvironment } from "./src/utils/sentry-environment";

/*
 * Server-side Sentry: on-demand pages, API routes and actions. A silent no-op
 * without SENTRY_DSN. Imported by src/middleware/index.ts (the integration runs
 * with `server: false`), so it is initialised before any route runs; request
 * handling and flushing are wired there too.
 *
 * environment: VERCEL_ENV at runtime, else VERCEL_ENV inlined at build time.
 * When neither exists, it starts as `development` and the middleware sets it
 * from the first request's host (src/middleware/sentry-environment.ts).
 * release: VERCEL_GIT_COMMIT_SHA at runtime, else the SHA inlined at build.
 */
const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      normaliseEnvironment(process.env.VERCEL_ENV) ?? normaliseEnvironment(__SENTRY_ENVIRONMENT__) ?? "development",
    release: process.env.VERCEL_GIT_COMMIT_SHA || __SENTRY_RELEASE__ || undefined,
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
