import type { APIRoute } from "astro";
import { SENTRY_TEST_TOKEN } from "astro:env/server";

export const prerender = false;

/**
 * End-to-end check for server-side Sentry in production.
 *
 * Answers 404 unless SENTRY_TEST_TOKEN is set AND the request carries it in the
 * `x-sentry-test` header. With both, it throws: the @sentry/astro middleware
 * reports the error and Astro answers 500.
 *
 *   curl -i -H "x-sentry-test: $SENTRY_TEST_TOKEN" https://eduardoalvarez.dev/api/sentry-test
 */
export const GET: APIRoute = ({ request }) => {
  if (!SENTRY_TEST_TOKEN || request.headers.get("x-sentry-test") !== SENTRY_TEST_TOKEN) {
    return new Response(null, { status: 404 });
  }
  throw new Error("Sentry test error (server)");
};
