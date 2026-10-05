/**
 * The installed app's splash: the iOS launch image, held for a moment.
 *
 * iOS shows its launch image only until the page's first paint, a blink on a
 * good connection. This script, inline in `<head>`, runs before that paint and
 * puts the very same PNG on screen, still, then lets it fade into the page. Two
 * attempts taught what it must not be:
 * - an animation (a glow, a wordmark entering): however exactly its first
 *   frame matched, iOS's cross-fade into the page read as a jump from an image
 *   to an animation;
 * - nothing at all: the launch image blinked and was gone.
 * Same file, same place, nothing moving: there is nothing to see change.
 *
 * Only where a launch image exists for the device (iOS, by screen size and
 * pixel ratio), once per session. The page starts below the iOS status bar
 * while the launch image covers the whole screen, so the image is drawn at
 * screen size and lifted by what the status bar takes (`screen.height -
 * innerHeight`). `<html>` paints it from the first frame, before `<body>` has
 * arrived; the element in `<body>` covers the page with the same picture.
 */
export const SPLASH_ATTRIBUTE = "data-pwa-splash";
export const SPLASH_SHOWN_KEY = "pwa-splash-shown";
/** When the splash starts fading, and how long the fade takes (index.astro). */
export const SPLASH_HOLD_MS = 1400;
export const SPLASH_FADE_MS = 400;

/** Launch image URLs keyed by `${width}x${height}@${ratio}`, in CSS px. */
export type SplashImages = Record<string, string>;

export const splashScript = ({ ground, images }: { ground: string; images: SplashImages }) => `(function () {
  try {
    var standalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (!standalone || sessionStorage.getItem("${SPLASH_SHOWN_KEY}")) return;
    // The launch images are portrait only, like the media queries that pick them.
    if (window.innerWidth > window.innerHeight) return;
    var images = ${JSON.stringify(images)};
    var w = screen.width;
    var h = screen.height;
    var key = "@" + window.devicePixelRatio;
    var image = images[Math.min(w, h) + "x" + Math.max(w, h) + key];
    if (!image) return;
    sessionStorage.setItem("${SPLASH_SHOWN_KEY}", "true");
    // Start the download now. After the first launch it comes from the service
    // worker's image cache.
    new Image().src = image;
    var html = document.documentElement;
    var style = html.style;
    style.setProperty("--pwa-splash-ground", ${JSON.stringify(ground)});
    style.setProperty("--pwa-splash-image", 'url("' + image + '")');
    style.setProperty("--pwa-splash-width", Math.min(w, h) + "px");
    style.setProperty("--pwa-splash-height", Math.max(w, h) + "px");
    style.setProperty("--pwa-splash-offset", Math.max(0, Math.max(w, h) - window.innerHeight) + "px");
    html.setAttribute("${SPLASH_ATTRIBUTE}", "");
    setTimeout(function () {
      html.removeAttribute("${SPLASH_ATTRIBUTE}");
      ["ground", "image", "width", "height", "offset"].forEach(function (name) {
        style.removeProperty("--pwa-splash-" + name);
      });
    }, ${SPLASH_HOLD_MS + SPLASH_FADE_MS});
  } catch (e) {}
})();`;
