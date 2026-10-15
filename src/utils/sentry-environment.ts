/**
 * Where Sentry's `environment` and `release` come from.
 *
 * The Vercel project does not expose its system variables automatically
 * (`autoExposeSystemEnvs` is off), so VERCEL_ENV and VERCEL_GIT_COMMIT_SHA may be
 * missing at build time and at runtime, and Vercel never adds the `PUBLIC_`
 * copies the previous config read. Every event ended up as `development`.
 *
 * So, in order:
 * 1. VERCEL_ENV at runtime (server only), when it is there;
 * 2. VERCEL_ENV at build time, inlined into both bundles by `vite.define`
 *    (astro.config.mjs → `__SENTRY_ENVIRONMENT__`);
 * 3. the host that served the request or page, which is always known.
 */
export type SentryEnvironment = "production" | "preview" | "development";

const PRODUCTION_HOSTS = new Set(["eduardoalvarez.dev", "www.eduardoalvarez.dev"]);
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]", "::1"]);

export function environmentFromHost(hostname: string | undefined): SentryEnvironment {
  if (!hostname) return "development";
  const host = hostname.toLowerCase();
  if (PRODUCTION_HOSTS.has(host)) return "production";
  if (LOCAL_HOSTS.has(host) || host.endsWith(".local")) return "development";
  return "preview";
}

/** `production` | `preview` | `development` from a Vercel value, or `undefined` when unknown. */
export function normaliseEnvironment(value: string | undefined | null): SentryEnvironment | undefined {
  return value === "production" || value === "preview" || value === "development" ? value : undefined;
}

export function environmentFromUrl(url: string | undefined): SentryEnvironment | undefined {
  if (!url) return undefined;
  try {
    return environmentFromHost(new URL(url).hostname);
  } catch {
    return undefined;
  }
}
