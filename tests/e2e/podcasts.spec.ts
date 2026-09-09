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

/**
 * La página de episodio es ahora la única vista del episodio, así que estos
 * tests fijan lo que la primera pantalla tiene que resolver — de qué va, con
 * quién, y el play — y lo que ya no debe volver: el título dicho tres veces y
 * los invitados detrás de las notas.
 */
test.describe("Episodio de podcast", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/podcasts/de-junior-a-senior");
  });

  test("dice el título una sola vez y no envuelve el reproductor en una tarjeta", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByText("Escuchar episodio")).toHaveCount(0);
  });

  test("los temas viven en la cabecera, no en una sección propia", async ({ page }) => {
    await expect(page.getByText("Temas tratados")).toHaveCount(0);
    await expect(page.getByText("Carrera Profesional", { exact: true })).toBeVisible();
  });

  test("el reproductor sigue montando su audio", async ({ page }) => {
    await expect(page.locator("audio")).toHaveCount(1);
  });

  test("en móvil los invitados van antes que las notas y las acciones al final", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const guests = await page.locator("section", { has: page.getByRole("heading", { name: "Invitados" }) }).boundingBox();
    const notes = await page
      .locator("section", { has: page.getByRole("heading", { name: "Notas del episodio" }) })
      .boundingBox();
    const actions = await page.locator("aside[aria-label='Escuchar y compartir']").boundingBox();

    expect(guests!.y).toBeLessThan(notes!.y);
    expect(notes!.y).toBeLessThan(actions!.y);
  });

  test("en escritorio el raíl queda a la derecha del cuerpo", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    const notes = await page
      .locator("section", { has: page.getByRole("heading", { name: "Notas del episodio" }) })
      .boundingBox();
    const actions = await page.locator("aside[aria-label='Escuchar y compartir']").boundingBox();

    expect(actions!.x).toBeGreaterThan(notes!.x);
  });

  test("no queda ningún bloque duplicado para móvil y escritorio", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Invitados" })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Escuchar en" })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Compartir" })).toHaveCount(1);
  });

  test("el panel presenta y reproduce en la misma pieza", async ({ page }) => {
    const panel = page.locator("section[aria-labelledby='episode-title']");

    await expect(panel.locator("h1")).toBeVisible();
    await expect(panel.locator("audio")).toHaveCount(1);
    await expect(panel.getByText("Carlos Mendoza")).toBeVisible();
  });

  test("no se rotula como narración de artículo", async ({ page }) => {
    await expect(page.getByText(/narración de audio/i)).toHaveCount(0);
  });

  test("el reproductor sobrevive al scroll", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const floating = page.locator("div.fixed.inset-x-0.bottom-0").first();

    await expect(floating).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 1600));
    await expect(floating).toBeVisible();
  });

  test("las notas se pueden recorrer con anclas reales", async ({ page }) => {
    const jumps = page.locator("section", { has: page.getByRole("heading", { name: "En este episodio" }) }).locator("a");
    const hrefs = await jumps.evaluateAll((links) => links.map((link) => link.getAttribute("href")!));

    expect(hrefs.length).toBeGreaterThan(1);
    for (const href of hrefs) {
      await expect(page.locator(href)).toHaveCount(1);
    }
  });

  test("el episodio pertenece a una serie", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Más episodios" });

    await expect(nav.getByText(/episodio anterior/i)).toBeVisible();
    await expect(nav.getByText(/episodio siguiente/i)).toBeVisible();
  });

  test("el episodio más reciente no ofrece siguiente", async ({ page }) => {
    await page.goto("/podcasts/ia-en-desarrollo-web");
    const nav = page.getByRole("navigation", { name: "Más episodios" });

    await expect(nav.getByText(/episodio siguiente/i)).toHaveCount(0);
    await expect(nav.getByText(/episodio anterior/i)).toBeVisible();
  });
});
