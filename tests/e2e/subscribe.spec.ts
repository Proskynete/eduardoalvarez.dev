import { expect, test } from "@playwright/test";

test.describe("Newsletter Subscription", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    // Scroll al formulario de suscripción
    const form = page.locator("#subscribe-form");
    await form.scrollIntoViewIfNeeded();
  });

  test("debe mostrar formulario de suscripción", async ({ page }) => {
    const form = page.locator("#subscribe-form");
    await expect(form).toBeVisible();

    // Scope selectors to the form to avoid matching the footer email link
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("debe validar campos requeridos", async ({ page }) => {
    const form = page.locator("#subscribe-form");
    const submitButton = form.getByRole("button", { name: /suscribirme/i });
    await submitButton.click();

    // Validación HTML5 debe prevenir submit
    const nameInput = form.getByLabel(/nombre/i);
    await expect(nameInput).toHaveAttribute("required");
  });

  test("debe validar formato de email", async ({ page }) => {
    const form = page.locator("#subscribe-form");
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

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

    const form = page.locator("#subscribe-form");
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

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

    const form = page.locator("#subscribe-form");
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

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

    const form = page.locator("#subscribe-form");
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await submitButton.click();

    // Esperar un poco para que el estado de loading se active
    await page.waitForTimeout(100);

    // El texto del botón debería cambiar durante el loading
    const buttonText = await submitButton.textContent();
    expect(buttonText).not.toBe("Suscribirme");
  });

  test("debe mostrar error de validación del servidor (400)", async ({ page }) => {
    await page.route("**/api/subscribe", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Datos de entrada inválidos",
          errors: [{ path: ["name"], message: "El nombre solo puede contener letras" }],
        }),
      });
    });

    const form = page.locator("#subscribe-form");
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

    // Email válido para que pase la validación HTML5 del browser
    await nameInput.fill("Test123");
    await emailInput.fill("test@example.com");
    await submitButton.click();

    // Mensaje de error general visible
    const errorMessage = page.locator("#error-message");
    await expect(errorMessage).toBeVisible();
    await expect(page.locator("#error-text")).toContainText(/datos de entrada inválidos/i);
  });

  test("debe mostrar error interno del servidor (500)", async ({ page }) => {
    await page.route("**/api/subscribe", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Error interno del servidor",
        }),
      });
    });

    const form = page.locator("#subscribe-form");
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await submitButton.click();

    const errorMessage = page.locator("#error-message");
    await expect(errorMessage).toBeVisible();
    await expect(page.locator("#error-text")).toContainText(/error interno/i);
  });

  test("debe limpiar el error de campo al volver a escribir", async ({ page }) => {
    await page.route("**/api/subscribe", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Error de validación",
          errors: [{ path: ["email"], message: "Formato de email inválido" }],
        }),
      });
    });

    const form = page.locator("#subscribe-form");
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

    // Email válido para que pase HTML5 pero el servidor devuelve 400 con error de campo
    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await submitButton.click();

    // Verificar que el error de campo aparece
    const emailError = page.locator("#email-error");
    await expect(emailError).toBeVisible();

    // Al escribir en el input de email, el error debe ocultarse
    await emailInput.fill("nuevo@email.com");
    await expect(emailError).not.toBeVisible();
  });
});
