/**
 * Decides, before the first paint, whether this load shows the PWA splash.
 *
 * It has to run in `<head>`: iOS removes its launch image on the page's first
 * paint, and the splash must already be on screen in that frame. Started from a
 * deferred module script, the page painted first and the splash came in on top
 * of it: a flash, and what read as a second splash.
 *
 * Standalone only, once per session. The attribute drives the whole sequence in
 * CSS (`index.astro`) and is removed when the exit fade has finished.
 */
export const SPLASH_ATTRIBUTE = "data-pwa-splash";
export const SPLASH_DURATION_MS = 1500;

export const splashScript = `(function () {
  try {
    var standalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (!standalone || sessionStorage.getItem("pwa-splash-shown")) return;
    sessionStorage.setItem("pwa-splash-shown", "true");
    var html = document.documentElement;
    html.setAttribute("${SPLASH_ATTRIBUTE}", "");
    setTimeout(function () {
      html.removeAttribute("${SPLASH_ATTRIBUTE}");
    }, ${SPLASH_DURATION_MS});
  } catch (e) {}
})();`;
