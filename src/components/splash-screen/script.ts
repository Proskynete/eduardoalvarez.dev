/**
 * Decides, before the first paint, whether this load shows the PWA splash.
 *
 * It has to run in `<head>`: iOS removes its launch image on the page's first
 * paint, and the splash must already be on screen in that frame. Started from a
 * deferred module script, the page painted first and the splash came in on top
 * of it: a flash, and what read as a second splash.
 *
 * Standalone only, once per session. The attribute drives the whole sequence in
 * CSS (`index.astro`) and is removed when the exit fade has finished. `ground`
 * is the launch image's colour: `<html>` paints it, with the fin, from the first
 * frame, before `<body>` (and the splash element in it) has even arrived.
 *
 * The launch image covers the whole screen, but without `viewport-fit=cover`
 * the page starts below the iOS status bar (~62 px on a Pro). Centred in the
 * viewport, the fin landed half of that lower than the launch image's, so the
 * script measures it and the CSS lifts the fin by half (`--pwa-splash-offset`).
 * Only on iOS, the one place there is a launch image to match. Detected by the
 * device, not by `navigator.standalone`: an app added to the home screen from
 * Chrome is a WebKit web app too, and that flag is Safari's. iPadOS reports a
 * Mac, so a touch screen gives it away.
 */
export const SPLASH_ATTRIBUTE = "data-pwa-splash";
export const SPLASH_GROUND_PROPERTY = "--pwa-splash-ground";
export const SPLASH_OFFSET_PROPERTY = "--pwa-splash-offset";
export const SPLASH_DURATION_MS = 1500;

export const splashScript = ({ ground }: { ground: string }) => `(function () {
  try {
    var standalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (!standalone || sessionStorage.getItem("pwa-splash-shown")) return;
    sessionStorage.setItem("pwa-splash-shown", "true");
    var html = document.documentElement;
    html.style.setProperty("${SPLASH_GROUND_PROPERTY}", ${JSON.stringify(ground)});
    var ios =
      /iP(hone|ad|od)/.test(window.navigator.userAgent) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    var offset = ios ? Math.max(0, screen.height - window.innerHeight) : 0;
    html.style.setProperty("${SPLASH_OFFSET_PROPERTY}", offset + "px");
    html.setAttribute("${SPLASH_ATTRIBUTE}", "");
    setTimeout(function () {
      html.removeAttribute("${SPLASH_ATTRIBUTE}");
      html.style.removeProperty("${SPLASH_GROUND_PROPERTY}");
      html.style.removeProperty("${SPLASH_OFFSET_PROPERTY}");
    }, ${SPLASH_DURATION_MS});
  } catch (e) {}
})();`;
