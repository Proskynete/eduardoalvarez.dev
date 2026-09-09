import { expect, test } from "@playwright/test";

/**
 * El listado de podcasts es un índice, y estos tests defienden justamente eso:
 * que no vuelva a crecer hasta replicar la página de episodio, que es de donde
 * viene. Cada aserción de las que empiezan por «no» corresponde a algo que el
 * listado sí hacía antes.
 */
test.describe("Listado de podcasts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/podcasts");
  });

  test("lista un episodio por fila, cada uno enlazando a su detalle", async ({ page }) => {
    const rows = page.locator('a[href^="/podcasts/"]');
    await expect(rows).toHaveCount(5);

    const hrefs = await rows.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) expect(href).toMatch(/^\/podcasts\/[a-z0-9-]+$/);
  });

  test("no reproduce audio ni repite la página de episodio", async ({ page }) => {
    await expect(page.locator("audio")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /spotify|youtube|apple podcasts/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /ver episodio/i })).toHaveCount(0);
  });

  test("agrupa por año, del más reciente al más antiguo", async ({ page }) => {
    const years = await page
      .locator("section[aria-labelledby^='year-'] h2")
      .evaluateAll((nodes) => nodes.map((node) => Number(node.textContent?.trim())));

    expect(years.length).toBeGreaterThan(0);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  test("marca un único episodio como el último", async ({ page }) => {
    await expect(page.getByText("Último", { exact: true })).toHaveCount(1);

    const firstRow = page.locator('a[href^="/podcasts/"]').first();
    await expect(firstRow.getByText("Último", { exact: true })).toBeVisible();
  });

  test("la cabecera declara cuántos episodios hay y cuánto duran", async ({ page }) => {
    await expect(page.getByText(/^\d+ episodios? · /)).toBeVisible();
  });

  test("cada fila anuncia su número al lector de pantalla", async ({ page }) => {
    const firstRow = page.locator('a[href^="/podcasts/"]').first();
    await expect(firstRow).toHaveAccessibleName(/^Episodio \d+\./);
  });

  test("la fila lleva al episodio", async ({ page }) => {
    const firstRow = page.locator('a[href^="/podcasts/"]').first();
    const href = await firstRow.getAttribute("href");

    await firstRow.click();

    await expect(page).toHaveURL(new RegExp(`${href}/?$`));
    await expect(page.locator("audio")).toHaveCount(1);
  });
});
