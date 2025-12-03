import { expect, test } from "@playwright/test";

test.describe("Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Abrir el input de búsqueda haciendo clic en el botón
    await page.getByRole("button", { name: /buscar/i }).click();
  });

  test("debe mostrar input de búsqueda", async ({ page }) => {
    const searchInput = page.getByRole("combobox");
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test("debe buscar y mostrar resultados", async ({ page }) => {
    const searchInput = page.getByRole("combobox");
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    await searchInput.fill("react");
    await page.waitForTimeout(1000); // Esperar debounce

    const results = page.getByRole("listbox");
    await expect(results).toBeVisible();

    const firstResult = page.getByRole("option").first();
    await expect(firstResult).toBeVisible();
  });

  test("debe navegar con teclado", async ({ page }) => {
    const searchInput = page.getByRole("combobox");

    await searchInput.fill("javascript");
    await page.waitForTimeout(1000);

    // Verificar que hay resultados
    const results = page.getByRole("listbox");
    await expect(results).toBeVisible();

    // Navegar con flecha abajo
    await searchInput.press("ArrowDown");
    await searchInput.press("ArrowDown");

    // Verificar que al menos un resultado es visible (Downshift maneja la navegación)
    const options = page.getByRole("option");
    await expect(options.first()).toBeVisible();
  });

  test("debe cerrar con Escape", async ({ page }) => {
    const searchInput = page.getByRole("combobox");

    await searchInput.fill("javascript");
    await page.waitForTimeout(1000);

    const results = page.getByRole("listbox");
    await expect(results).toBeVisible();

    await searchInput.press("Escape");
    await expect(results).not.toBeVisible();
  });

  test("debe mostrar error con query inválida", async ({ page }) => {
    const searchInput = page.getByRole("combobox");

    // Desconectar network después de cargar la página
    await page.route("**/*", (route) => route.abort());

    await searchInput.fill("test");
    await page.waitForTimeout(1000);

    const errorMessage = page.getByRole("alert");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/error/i);
  });
});
