import { expect, test } from "@playwright/test";

test.describe("Newsletter Subscription", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    // Scroll al formulario de suscripción
    const subscribeButton = page.getByRole("button", { name: /suscribirme/i });
    await subscribeButton.scrollIntoViewIfNeeded();
  });

  test("debe mostrar formulario de suscripción", async ({ page }) => {
    const form = page.locator("#subscribe-form");
    await expect(form).toBeVisible();

    const nameInput = page.getByLabel(/nombre/i);
    const emailInput = page.getByLabel(/email/i);
    const submitButton = page.getByRole("button", { name: /suscribirme/i });

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("debe validar campos requeridos", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: /suscribirme/i });
    await submitButton.click();

    // Validación HTML5 debe prevenir submit
    const nameInput = page.getByLabel(/nombre/i);
    await expect(nameInput).toHaveAttribute("required");
  });

  test("debe validar formato de email", async ({ page }) => {
    const nameInput = page.getByLabel(/nombre/i);
    const emailInput = page.getByLabel(/email/i);
    const submitButton = page.getByRole("button", { name: /suscribirme/i });

    await nameInput.fill("Test User");
    await emailInput.fill("invalid-email");
    await submitButton.click();

    // Validación HTML5 de email
    await expect(emailInput).toHaveAttribute("type", "email");
  });

  test("debe suscribirse exitosamente", async ({ page }) => {
    // Mock de API response exitosa
    await page.route("**/api/subscribe", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Registro exitoso",
        }),
      });
    });

    const nameInput = page.getByLabel(/nombre/i);
    const emailInput = page.getByLabel(/email/i);
    const submitButton = page.getByRole("button", { name: /suscribirme/i });

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await submitButton.click();

    // Esperar mensaje de éxito
    const successMessage = page.getByText(/registro exitoso/i);
    await expect(successMessage).toBeVisible();

    // Formulario debe limpiarse
    await expect(nameInput).toHaveValue("");
    await expect(emailInput).toHaveValue("");
  });

  test("debe mostrar error de email duplicado", async ({ page }) => {
    await page.route("**/api/subscribe", async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Este correo ya está registrado",
        }),
      });
    });

    const nameInput = page.getByLabel(/nombre/i);
    const emailInput = page.getByLabel(/email/i);
    const submitButton = page.getByRole("button", { name: /suscribirme/i });

    await nameInput.fill("Test User");
    await emailInput.fill("existing@example.com");
    await submitButton.click();

    const errorMessage = page.getByText(/ya está registrado/i);
    await expect(errorMessage).toBeVisible();
  });

  test("debe mostrar estado de loading", async ({ page }) => {
    await page.route("**/api/subscribe", async (route) => {
      // Delay de 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "OK" }),
      });
    });

    const nameInput = page.getByLabel(/nombre/i);
    const emailInput = page.getByLabel(/email/i);
    const submitButton = page.getByRole("button", { name: /suscribirme/i });

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await submitButton.click();

    // Esperar un poco para que el estado de loading se active
    await page.waitForTimeout(100);

    // Verificar que el texto cambia o que el botón muestra algún estado de loading
    const buttonText = await submitButton.textContent();
    // El texto debería cambiar de "Suscribirme" a algo relacionado con loading
    expect(buttonText).not.toBe("Suscribirme");
  });
});
