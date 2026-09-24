import { defineMiddleware } from "astro:middleware";

import { podcastsEnabled } from "../settings/podcasts";
import { PODCASTS_REDIRECT_STATUS, podcastsRedirect } from "./podcasts";

/**
 * Runs for every on-demand request, and at build time for prerendered pages.
 * Both podcast routes are on demand, so on Vercel `/podcasts` and
 * `/podcasts/<slug>` reach the server function and this. A prerendered route
 * would not: Vercel answers a path it has no file for with the static 404.
 */
export const onRequest = defineMiddleware((context, next) => {
  const destination = podcastsRedirect(context.url.pathname, podcastsEnabled);
  if (destination) return context.redirect(destination, PODCASTS_REDIRECT_STATUS);
  return next();
});
