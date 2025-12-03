import { expect, test } from "@playwright/test";

test.describe("Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("debe mostrar input de búsqueda", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /buscar/i });
    await expect(searchInput).toBeVisible();
  });

  test("debe buscar y mostrar resultados", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /buscar/i });

    await searchInput.fill("react");
    await page.waitForTimeout(1000); // Esperar debounce

    const results = page.getByRole("listbox", { name: /resultados/i });
    await expect(results).toBeVisible();

    const firstResult = page.getByRole("option").first();
    await expect(firstResult).toBeVisible();
  });

  test("debe navegar con teclado", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /buscar/i });

    await searchInput.fill("javascript");
    await page.waitForTimeout(1000);

    // Navegar con flecha abajo
    await searchInput.press("ArrowDown");
    await searchInput.press("ArrowDown");

    // El segundo resultado debe estar seleccionado
    const selectedResult = page.getByRole("option", { selected: true });
    await expect(selectedResult).toBeVisible();
  });

  test("debe cerrar con Escape", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: /buscar/i });

    await searchInput.fill("vue");
    await page.waitForTimeout(1000);

    const results = page.getByRole("listbox");
    await expect(results).toBeVisible();

    await searchInput.press("Escape");
    await expect(results).not.toBeVisible();
  });

  test("debe mostrar error con query inválida", async ({ page }) => {
    // Desconectar network
    await page.route("**/*", (route) => route.abort());

    const searchInput = page.getByRole("searchbox");
    await searchInput.fill("test");
    await page.waitForTimeout(1000);

    const errorMessage = page.getByRole("alert");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/error/i);
  });
});
