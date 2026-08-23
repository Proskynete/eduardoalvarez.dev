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

const TOKEN = {
  abyss: "#091319",
  bioluz: "#35d6c0",
  bioluzInk: "#06171a",
  arena: "#f2a65a",
  foam: "#edf4f3",
  cardBg: "#0b1620",
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
    const active = page.locator('nav a[aria-current="page"]');
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

  test("focus draws a bioluz ring with 3px offset", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("link", { name: "Leer artículos" }).first();
    await btn.focus();
    await expect(btn).toHaveCSS("outline-color", rgb(TOKEN.bioluz));
    await expect(btn).toHaveCSS("outline-width", "2px");
    await expect(btn).toHaveCSS("outline-offset", "3px");
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
    const pill = page.getByTestId("category-pill").first();
    await expect(pill).toBeVisible();
    await expect(pill).toHaveCSS("color", rgb(TOKEN.arena));
    await expect(pill).toHaveCSS("border-top-color", rgb(TOKEN.pillBorder));
    await expect(pill).toHaveCSS("border-radius", "9999px");
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
    const links = page.locator('nav[aria-label="Tabla de contenidos"] a');
    if ((await links.count()) < 2) test.skip(true, "article has too few sections");
    await page.locator("#article-body h2").nth(1).scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(page.locator('nav[aria-label="Tabla de contenidos"] a[aria-current="true"]')).toHaveCount(1);
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
    await expect(btn).toHaveCSS("color", rgb(TOKEN.paper));
  });

  test("the navbar follows the theme instead of staying dark", async ({ page }) => {
    await page.goto("/");
    await page.locator("#theme-toggle").click();
    // Retrying assertion: the header has a colour transition, so a single
    // read can land mid-interpolation.
    await expect(page.locator("#site-header")).toHaveCSS("background-color", "rgba(246, 242, 234, 0.86)");
  });
});
