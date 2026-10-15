import type { MiddlewareHandler } from "astro";

import { environmentFromUrl, normaliseEnvironment } from "../utils/sentry-environment";

type ClientOptions = { environment?: string };
type GetClient = () => { getOptions(): ClientOptions } | undefined;

/**
 * Last resort for the server's Sentry `environment`: when neither the runtime
 * nor the build knew VERCEL_ENV, take it from the host of the first request the
 * function serves (eduardoalvarez.dev → production, *.vercel.app → preview,
 * localhost → development). Events read the option when they are processed, so
 * setting it once covers every later error and transaction.
 */
export function createSentryEnvironment(
  getClient: GetClient,
  known: string | undefined = process.env.VERCEL_ENV || __SENTRY_ENVIRONMENT__,
): MiddlewareHandler {
  let resolved = normaliseEnvironment(known) !== undefined;
  return (context, next) => {
    if (!resolved) {
      const client = getClient();
      const environment = environmentFromUrl(context.url.href);
      if (client && environment) {
        client.getOptions().environment = environment;
        resolved = true;
      }
    }
    return next();
  };
}
