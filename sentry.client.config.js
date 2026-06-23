import * as Sentry from "@sentry/astro";

// Browser-side Sentry. Inactive without a DSN, so it only runs in production:
// PUBLIC_SENTRY_DSN is set only in Vercel's Production environment.
Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.MODE,
  // Conservative trace sampling to stay within the plan's quota.
  tracesSampleRate: 0.1,
  // Forward application logs to Sentry.
  enableLogs: true,
  integrations: [Sentry.browserTracingIntegration()],
});
