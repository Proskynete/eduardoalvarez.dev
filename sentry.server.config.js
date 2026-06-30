import * as Sentry from "@sentry/astro";

// Server-side Sentry (SSR pages and API routes). Inactive without a DSN, so it
// only runs in production: SENTRY_DSN is set only in Vercel's Production env.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  // Conservative trace sampling to stay within the plan's quota.
  tracesSampleRate: 0.1,
  // Forward application logs to Sentry.
  enableLogs: true,
});
