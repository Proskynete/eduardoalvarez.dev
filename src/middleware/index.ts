// Initialise Sentry on the server before any route runs. The @sentry/astro
// integration runs with `server: false` (astro.config.mjs): its init script only
// reached SSR pages, so this import is what covers API routes and actions too.
import "../../sentry.server.config.js";

import * as Sentry from "@sentry/astro";
import { defineMiddleware, sequence } from "astro:middleware";

import { podcastsEnabled } from "../settings/podcasts";
import { PODCASTS_REDIRECT_STATUS, podcastsRedirect } from "./podcasts";
import { createSentryFlush } from "./sentry-flush";

/**
 * Runs for every on-demand request, and at build time for prerendered pages.
 * Both podcast routes are on demand, so on Vercel `/podcasts` and
 * `/podcasts/<slug>` reach the server function and this. A prerendered route
 * would not: Vercel answers a path it has no file for with the static 404.
 */
const podcasts = defineMiddleware((context, next) => {
  const destination = podcastsRedirect(context.url.pathname, podcastsEnabled);
  if (destination) return context.redirect(destination, PODCASTS_REDIRECT_STATUS);
  return next();
});

/*
 * 1. createSentryFlush: outermost, so it flushes after everything below has
 *    reported (see sentry-flush.ts for why Sentry's own flush is not enough).
 * 2. Sentry.handleRequest: one transaction per request named after the route
 *    (GET /api/sentry-test), and captures errors thrown by pages, endpoints and
 *    actions.
 */
export const onRequest = sequence(createSentryFlush(Sentry.flush), Sentry.handleRequest(), podcasts);
