import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  { name: "Home", path: "/" },
  { name: "Articles", path: "/articles" },
  { name: "Speaking", path: "/speaking" },
  // `/podcasts` used to redirect to the home page, so listing it here tested the
  // home twice. The episode page is what actually gets served.
  { name: "Podcast episode", path: "/podcasts/bienvenidos-mi-historia" },
  { name: "Article", path: "/articles/el-javascript-necesario-para-react-parte-1" },
  { name: "About", path: "/about" },
  { name: "Newsletter", path: "/newsletter" },
];

// Both faces. All of this ran in dark only, the default theme, which is why it
// went unnoticed that in light the article body's `h2` came out #EDF4F3 on
// cream: 1.03:1, invisible. axe measures contrast, so it would have caught this
// on day one had it ever run in both themes.
const THEMES = ["dark", "light"] as const;

/**
 * What axe leaves in `incomplete` for legitimate reasons rather than a bad
 * colour: lone glyphs (✓, →), single-character text, and image or gradient
 * backgrounds, where there is no flat colour to measure against.
 */
const UNMEASURABLE = /too short|only non-text characters|background (image|gradient)/i;

for (const { name, path } of PAGES) {
  for (const theme of THEMES) {
    test(`accesibilidad: ${name} (${path}) en ${theme} — sin violaciones críticas`, async ({ page }) => {
      // Without this, axe measures during the 200ms cross-fade between themes
      // and reads intermediate colours — greys that exist in neither — and
      // reports contrasts nobody ever sees. Only the settled states matter.
      await page.addStyleTag({
        content: "*,*::before,*::after{transition:none!important;animation:none!important}",
      }).catch(() => {});
      await page.goto(path);
      await page.addStyleTag({
        content: "*,*::before,*::after{transition:none!important;animation:none!important}",
      });
      if (theme === "light") {
        await page.locator("#theme-toggle").click();
        // Without this assertion the test lies: if the click lands before the
        // button's script attaches its listener nothing happens, the page stays
        // dark, and axe passes the version nobody meant to test. That happened —
        // the full suite went green while the suite alone failed.
        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
        await page.mouse.move(0, 0);
      }
      // `networkidle` is unstable here: the dev server keeps network activity
      // going (HMR, link prefetch) and the state never settles, so the timeout
      // fires before axe gets to run — and which page fails rotates between
      // runs. A real DOM condition is awaited instead: an anchor that is
      // visible and present on every page. `body > *` will not do, because the
      // first child is the skip link, hidden on purpose.
      await page.locator("#site-header").waitFor({ state: "visible" });
      await page.waitForLoadState("domcontentloaded");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude("#giscus-iframe") // comentarios externos, fuera de control
        .analyze();

      /**
       * axe files the worst possible contrast under `incomplete`, not
       * `violations`: a 1:1 usually means text hidden on purpose — image
       * replacement, screen-reader patterns — so it declines to call it a
       * failure. The result was that the article body's `h2`, painted #EDF4F3
       * on cream, measured exactly 1:1 and the suite went green with the text
       * invisible.
       *
       * Nothing here hides text by colour, so a contrast axe cannot resolve
       * counts as a failure. The exception is what it legitimately cannot
       * measure: content too short, and image backgrounds.
       */
      const incompletosDeContraste = results.incomplete
        .filter((v) => v.id === "color-contrast")
        .map((v) => ({
          ...v,
          nodes: v.nodes.filter((n) => !UNMEASURABLE.test(n.any?.[0]?.message ?? "")),
        }))
        .filter((v) => v.nodes.length > 0);

      const criticalViolations = [
        ...results.violations.filter((v) => ["critical", "serious"].includes(v.impact ?? "")),
        ...incompletosDeContraste,
      ];

      if (criticalViolations.length > 0) {
        const report = criticalViolations
          .map(
            (v) =>
              `\n[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}\n` +
              v.nodes
                .slice(0, 3)
                .map((n) => `  → ${n.html}`)
                .join("\n"),
          )
          .join("\n");

        expect.soft(criticalViolations, `Violaciones en ${name} [${theme}]:\n${report}`).toHaveLength(0);
      }

      expect(criticalViolations).toHaveLength(0);
    });
  }
}
