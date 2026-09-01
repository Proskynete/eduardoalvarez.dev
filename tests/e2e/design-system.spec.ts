import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

/**
 * Locks the Design System v1 values.
 *
 * It does not check that things "look good" — it checks that the system's
 * values are still there. That is what prevents silent drift when someone
 * swaps a token for a hand-written hex.
 *
 * Locators are semantic or `data-testid`, never styling classes: the styles
 * moved to Tailwind utilities and class-based selectors broke the whole suite
 * the moment they did.
 */

const rgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

/**
  * Resolves a colour property to sRGB using the browser's own canvas.
  *
  * Tailwind v4 applies opacity modifiers with color-mix() in oklab, so
  * `bg-background/[.86]` no longer reads back as "rgba(...)" but as "oklab(...)".
  * The painted colour is identical; only the notation changed. Comparing the
  * string would tie this test to the CSS engine instead of the design value.
  */
const resolveColor = (page: Page, selector: string, property: string) =>
  page.evaluate(
    ([sel, prop]) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const value = getComputedStyle(el).getPropertyValue(prop);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = value;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a: Math.round((a / 255) * 100) / 100 };
    },
    [selector, property] as const,
  );

const TOKEN = {
  abyss: "#091319",
  bioluz: "#35d6c0",
  bioluzInk: "#06171a",
  arena: "#f2a65a",
  foam: "#edf4f3",
  // The card surface is `surface`, not a bespoke near-black. The library made
  // that call deliberately — see its docs/decisiones.md — correcting the
  // original handoff, and it is the source of truth now.
  cardBg: "#10202b",
  cardBorder: "#1e3441",
  pillBorder: "#4a3a25",
  paper: "#f6f2ea",
  hull: "#0b1524",
};

const ARTICLE = "/articles/el-javascript-necesario-para-react-parte-1";

test.describe("Design System · foundations", () => {
  test("page background is abyss, not neutral grey", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toHaveCSS("background-color", rgb(TOKEN.abyss));
  });

  test("headings use the display face, not the body face", async ({ page }) => {
    await page.goto("/");
    const family = await page.locator("h1").first().evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toContain("Bricolage");
  });

  test("navigation uses JetBrains Mono, not Geist Mono", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator('nav[aria-label="Navegación principal"]');
    await expect(nav).toBeVisible();
    const family = await nav.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toContain("JetBrains");
    expect(family).not.toContain("Geist Mono");
  });

  test("no colour from the previous system survives", async ({ page }) => {
    await page.goto("/");
    const html = (await page.content()).toLowerCase();
    for (const old of ["#0a0a0a", "#06b6d4", "#f5f5f5", "#1f1f1f", "#a3a3a3"]) {
      expect(html).not.toContain(old);
    }
  });
});

test.describe("Design System · navigation", () => {
  test("is 64px tall and translucent with blur", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("#site-header");
    expect((await header.boundingBox())?.height).toBe(64);
    const blur = await header.evaluate((el) => {
      const s = getComputedStyle(el);
      return s.backdropFilter || s.getPropertyValue("-webkit-backdrop-filter");
    });
    expect(blur).toContain("blur(14px)");
  });

  test("the active item keeps its brackets and gains the underline", async ({ page }) => {
    await page.goto("/articles");
    // Acotado a la cabecera: /articles tiene ahora otras dos navegaciones con
    // `aria-current` —las píldoras de categoría y la paginación— y el selector
    // suelto casaba con las tres.
    const active = page.locator('#site-header nav a[aria-current="page"]');
    await expect(active).toBeVisible();
    await expect(active).toContainText("[");
    await expect(active).toContainText("]");
    await expect(active).toHaveCSS("border-bottom-color", rgb(TOKEN.bioluz));
  });
});

test.describe("Design System · buttons", () => {
  test("the primary button matches bg, ink, padding and radius", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("link", { name: "Leer artículos" }).first();
    await expect(btn).toBeVisible();
    await expect(btn).toHaveCSS("background-color", rgb(TOKEN.bioluz));
    await expect(btn).toHaveCSS("color", rgb(TOKEN.bioluzInk));
    await expect(btn).toHaveCSS("border-radius", "10px");
    await expect(btn).toHaveCSS("font-size", "15px");
    await expect(btn).toHaveCSS("font-weight", "500");
  });

  test("the secondary button never fills its background", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("link", { name: "Trabajar juntos" }).first();
    await expect(btn).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await btn.hover();
    await expect(btn).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("focus draws a bioluz ring with 2px offset", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("link", { name: "Leer artículos" }).first();
    await btn.focus();
    await expect(btn).toHaveCSS("outline-color", rgb(TOKEN.bioluz));
    await expect(btn).toHaveCSS("outline-width", "2px");
    // 2px, no 3px: el botón dejó de traer su propio anillo y usa el de la
    // librería. El 3px era de este botón y de ningún otro.
    await expect(btn).toHaveCSS("outline-offset", "2px");
  });
});

test.describe("Design System · article card", () => {
  test("matches background, border, radius and padding", async ({ page }) => {
    await page.goto("/");
    const card = page.getByTestId("article-card").first();
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS("background-color", rgb(TOKEN.cardBg));
    await expect(card).toHaveCSS("border-top-color", rgb(TOKEN.cardBorder));
    await expect(card).toHaveCSS("border-radius", "14px");
    await expect(card).toHaveCSS("padding-top", "26px");
  });

  test("the category pill is arena with its own border", async ({ page }) => {
    await page.goto("/");
    // The card comes from the library now, so there is no `data-testid` to hang
    // on to. The badge is located by structure instead — the card's only div
    // holds the tag row — rather than by a styling class, which is what broke
    // this suite the last time the styles moved.
    const pill = page.getByTestId("article-card").first().locator("article > div > span").first();
    await expect(pill).toBeVisible();
    await expect(pill).toHaveCSS("color", rgb(TOKEN.arena));
    // Tailwind v3 emitted 9999px for `rounded-full`; v4 uses calc(infinity * 1px),
    // which computes to 3.3e7px. The intent is the same — fully rounded — so
    // that is what gets checked, not the exact figure.
    const radius = await pill.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
    expect(radius).toBeGreaterThan(500);
  });

  test("articles are objects, not table rows", async ({ page }) => {
    await page.goto("/");
    expect(await page.getByTestId("article-card").count()).toBeGreaterThan(0);
    expect(await page.locator(".divide-y.divide-surface-border").count()).toBe(0);
  });
});

test.describe("Design System · brand", () => {
  test("the fin is in the nav and swaps variant with the theme", async ({ page }) => {
    await page.goto("/");
    // Critical rule: foam disappears on light, two-blue disappears on dark.
    // Both render and CSS picks.
    await expect(page.locator('#site-header img[src*="fin-foam"]').first()).toBeVisible();
    await expect(page.locator('#site-header img[src$="/fin.png"]').first()).toBeHidden();

    await page.locator("#theme-toggle").click();
    await expect(page.locator('#site-header img[src$="/fin.png"]').first()).toBeVisible();
    await expect(page.locator('#site-header img[src*="fin-foam"]').first()).toBeHidden();
  });

  test("the mascot floats in the hero and has no wrapper panel", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const mascot = page.getByTestId("hero-mascot");
    await expect(mascot).toBeVisible();
    // No wrapper: the hero section must not paint a gradient panel behind it.
    const heroBg = await page
      .locator('section[aria-label="Introduction"]')
      .evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(heroBg).toBe("none");
    await expect(mascot).toHaveCSS("animation-name", "float");
  });

  test("the table of contents highlights the section being read", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ARTICLE);
    // The nav is named by its title, which the library uses as the aria-label.
    // Two are rendered — one collapsible for narrow screens, one card for wide —
    // so the visible one is the subject, not the first in the DOM.
    const toc = page.locator('nav[aria-label="En esta página"]').filter({ visible: true });
    // Asserted before the skip guard on purpose: with only the guard, renaming
    // the label turned a broken table of contents into a silent skip and the
    // suite stayed green.
    await expect(toc).toBeVisible();
    const links = toc.locator("a");
    if ((await links.count()) < 2) test.skip(true, "article has too few sections");
    await page.locator("#article-body h2").nth(1).scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(toc.locator('a[aria-current="true"]')).toHaveCount(1);
  });

  test("comments load and take real height", async ({ page }) => {
    // The widget is a custom element: with no `display: block` it collapses to
    // ~21px around an iframe that did load. It looked like Giscus was gone.
    await page.goto(ARTICLE);
    const widget = page.locator("giscus-widget");
    await widget.scrollIntoViewIfNeeded();
    await expect(widget).toHaveCSS("display", "block");
    await expect
      .poll(async () => (await widget.boundingBox())?.height ?? 0, { timeout: 15000 })
      .toBeGreaterThan(150);
  });

  test("the code block carries the fin, not macOS traffic lights", async ({ page }) => {
    await page.goto(ARTICLE);
    await expect(page.locator(".code-block-fin").first()).toBeVisible();
    expect(await page.locator(".code-traffic-lights").count()).toBe(0);
  });
});

test.describe("Design System · layout", () => {
  // A 1024 justo —el punto donde entraba la bajada de la cabecera— la página
  // se pasaba 2px y aparecía scroll horizontal. Es un ancho muy común (iPad
  // apaisado, portátiles pequeños) y no lo cubría ninguna prueba.
  for (const width of [390, 768, 1024, 1060, 1280, 1440]) {
    test(`no hay scroll horizontal a ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const desborde = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(desborde).toBe(0);
    });
  }
});

test.describe("Design System · theme", () => {
  test("the toggle switches to light and survives navigation", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    await page.locator("#theme-toggle").click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(page.locator("body")).toHaveCSS("background-color", rgb(TOKEN.paper));

    // The bug this locks: ClientRouter replaces <html> on every client-side
    // navigation, so `data-theme` was lost on the first link click.
    await page.goto("/articles");
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("in light mode the primary button is solid hull, not bioluz", async ({ page }) => {
    await page.goto("/");
    await page.locator("#theme-toggle").click();
    const btn = page.getByRole("link", { name: "Leer artículos" }).first();
    await expect(btn).toHaveCSS("background-color", rgb(TOKEN.hull));
    // Blanco puro, no papel: en claro el token `accent-on` es #FFFFFF. Antes
    // este botón se pintaba a mano con `light:text-background`.
    await expect(btn).toHaveCSS("color", "rgb(255, 255, 255)");
  });

  test("the toggle's own border follows the theme", async ({ page }) => {
    // It used to hardcode #2c4d5d, the DARK value of hairline-hover. The button
    // therefore kept a dark slate outline on the cream light background, the one
    // hard-edged control on the page. A hardcoded hex cannot fail a build or a
    // type check, so nothing caught it — this test does.
    await page.goto("/");
    await expect
      .poll(() => resolveColor(page, "#theme-toggle", "border-color"))
      .toEqual({ r: 44, g: 77, b: 93, a: 1 });

    await page.locator("#theme-toggle").click();
    // The click leaves the pointer on the button and `hover:border-accent` wins,
    // so the reading has to happen with the mouse somewhere else.
    await page.mouse.move(0, 0);
    await expect
      .poll(() => resolveColor(page, "#theme-toggle", "border-color"))
      .toEqual({ r: 211, g: 200, b: 178, a: 1 });
  });

  test("the navbar follows the theme instead of staying dark", async ({ page }) => {
    await page.goto("/");
    await page.locator("#theme-toggle").click();
    // The header has a colour transition, so a single read can land mid
    // interpolation: expect.poll retries until it settles.
    await expect
      .poll(() => resolveColor(page, "#site-header", "background-color"))
      .toEqual({ r: 246, g: 242, b: 234, a: 0.86 });
  });
});
