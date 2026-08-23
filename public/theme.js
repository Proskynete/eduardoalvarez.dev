/**
 * Theme bootstrap. Must run BEFORE first paint: any delay shows as a flash of
 * the wrong theme.
 *
 * Dark is the brand's PRIMARY mode, so it's the default and doesn't follow the
 * OS setting. Light is an explicit choice and it's remembered.
 *
 * The `astro:after-swap` listener is not optional: with ClientRouter the whole
 * <html> element is replaced on every client-side navigation, and `data-tema`
 * goes with it. Without re-applying, the theme silently reverts to dark the
 * moment you click any link.
 */
(function () {
  function apply() {
    try {
      if (localStorage.getItem("theme") === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch (e) {
      /* storage blocked: stays dark, which is the default */
    }
  }

  apply();
  document.addEventListener("astro:after-swap", apply);
})();
