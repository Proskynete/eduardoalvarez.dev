import { expect, type Page, test } from "@playwright/test";

// `NewsletterForm` genera los id de sus campos con `useId`, así que no hay
// `#subscribe-form` al que agarrarse. Se localiza por el botón que contiene,
// que es además como lo encuentra quien usa la página.
const formulario = (page: Page) =>
  page.locator("form").filter({ has: page.getByRole("button", { name: /suscribirme/i }) });

/**
 * El panel se monta con `client:visible` porque en la home queda muy por debajo
 * del pliegue. Eso abre una carrera que la versión anterior no tenía: su script
 * era inline y estaba listo con el HTML, mientras que aquí un click que llegue
 * antes de la hidratación no lo escucha nadie y el test falla sin motivo.
 *
 * Astro quita el atributo `ssr` de <astro-island> justo al hidratar, así que es
 * la señal exacta y no un timeout al azar.
 */
const esperarHidratacion = async (page: Page) => {
  const isla = page.locator('astro-island[component-export="SubscribeForm"]');
  await isla.scrollIntoViewIfNeeded();
  await expect(isla).not.toHaveAttribute("ssr", /.*/);
};

test.describe("Newsletter Subscription", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await esperarHidratacion(page);
  });

  test("debe mostrar formulario de suscripción", async ({ page }) => {
    const form = formulario(page);
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
    const form = formulario(page);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });
    await submitButton.click();

    // Validación HTML5 debe prevenir submit
    const nameInput = form.getByLabel(/nombre/i);
    await expect(nameInput).toHaveAttribute("required");
  });

  test("debe validar formato de email", async ({ page }) => {
    const form = formulario(page);
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

    const form = formulario(page);
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

    const form = formulario(page);
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

    const form = formulario(page);
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await submitButton.click();

    // El botón de la librería no cambia de texto durante el envío: mantiene la
    // etiqueta y añade spinner, `disabled` y `aria-busy`. Para un lector de
    // pantalla eso es mejor que cambiarle el nombre al control a media acción.
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

    const form = formulario(page);
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);
    const submitButton = form.getByRole("button", { name: /suscribirme/i });

    // Email válido para que pase la validación HTML5 del browser
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

    const form = formulario(page);
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

    const form = formulario(page);
    const nameInput = form.getByLabel(/nombre/i);
    const emailInput = form.getByLabel(/email/i);

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");
    await form.getByRole("button", { name: /suscribirme/i }).click();

    // El aviso ya no es un párrafo bajo el campo: es un Alert con role=alert,
    // y el campo queda marcado aria-invalid. La API manda el mensaje de Zod
    // como `message`, así que el aviso general dice cuál campo falla.
    const aviso = page.getByRole("alert");
    await expect(aviso).toContainText(/formato de email inválido/i);
    await expect(emailInput).toHaveAttribute("aria-invalid", "true");

    await emailInput.fill("nuevo@email.com");
    await expect(aviso).not.toBeVisible();
    await expect(emailInput).not.toHaveAttribute("aria-invalid", "true");
  });
});
