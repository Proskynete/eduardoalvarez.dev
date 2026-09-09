import { expect, type Page, test } from "@playwright/test";

// `NewsletterForm` generates its field ids with `useId`, so there is no
// `#subscribe-form` to hold on to. It is located by the button it contains,
// which is also how someone using the page finds it.
const subscribeForm = (page: Page) =>
  page.locator("form").filter({ has: page.getByRole("button", { name: /suscribirme/i }) });

/**
 * The panel mounts with `client:visible` because on the home page it sits well
 * below the fold. That opens a race the previous version did not have: its
 * script was inline and ready with the HTML, whereas here a click landing
 * before hydration is heard by nobody and the test fails for no reason.
 *
 * Astro removes the `ssr` attribute from <astro-island> the moment it hydrates,
 * so that is the exact signal rather than an arbitrary timeout.
 */
const waitForHydration = async (page: Page) => {
  const island = page.locator('astro-island[component-export="SubscribeForm"]');
  await island.scrollIntoViewIfNeeded();
  await expect(island).not.toHaveAttribute("ssr", /.*/);
};

test.describe("Newsletter Subscription", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
  });

  test("debe mostrar formulario de suscripción", async ({ page }) => {
    const form = subscribeForm(page);
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
    const form = subscribeForm(page);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });
    await submitButton.click();

    // Validación HTML5 debe prevenir submit
    const nameInput = form.getByLabel(/nombre/i);
    await expect(nameInput).toHaveAttribute("required");
  });

  test("debe validar formato de email", async ({ page }) => {
    const form = subscribeForm(page);
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

    const form = subscribeForm(page);
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

    const form = subscribeForm(page);
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

    const form = subscribeForm(page);
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await submitButton.click();

    // The library's button does not change its text while sending: it keeps the
    // label and adds a spinner, `disabled` and `aria-busy`. For a screen reader
    // that beats renaming the control mid-action.
    await expect(submitButton).toHaveAttribute("aria-busy", "true");
    await expect(submitButton).toBeDisabled();
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

    const form = subscribeForm(page);
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

    // A valid email so the browser's HTML5 validation lets the submit through
    await nameInput.fill("Test123");
    await emailInput.fill("test@example.com");
    await submitButton.click();

    // Mensaje de error general visible
    await expect(page.getByRole("alert")).toContainText(/datos de entrada inválidos/i);
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

    const form = subscribeForm(page);
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await submitButton.click();

    await expect(page.getByRole("alert")).toContainText(/error interno/i);
  });

  test("debe limpiar el error al volver a escribir", async ({ page }) => {
    await page.route("**/api/subscribe", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Formato de email inválido",
          errors: [{ path: ["email"], message: "Formato de email inválido" }],
        }),
      });
    });

    const form = subscribeForm(page);
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await form.getByRole("button", { name: /suscribirme/i }).click();

    // The notice is no longer a paragraph under the field: it is an Alert with
    // role=alert, and the field is marked aria-invalid. The API sends the Zod
    // message as `message`, so the general notice names the field that failed.
    const aviso = page.getByRole("alert");
    await expect(aviso).toContainText(/formato de email inválido/i);
    await expect(emailInput).toHaveAttribute("aria-invalid", "true");

    await emailInput.fill("nuevo@email.com");
    await expect(aviso).not.toBeVisible();
    await expect(emailInput).not.toHaveAttribute("aria-invalid", "true");
  });
});
