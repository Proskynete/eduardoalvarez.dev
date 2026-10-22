import * as Sentry from "@sentry/astro";
import type { APIRoute } from "astro";
import { z } from "zod";

import { rateLimit } from "../../middleware/rate-limit";
import { ApiResponseBuilder } from "../../utils/api-response";

const subscribeRateLimiter = rateLimit({ windowMs: 60_000, maxRequests: 5 });

// Schema de validación
const SubscribeSchema = z.object({
  email: z
    .string()
    .min(1, "Escribe tu correo")
    .check(z.email("Ese correo no parece válido"))
    .max(100, "Ese correo es demasiado largo")
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras")
    .trim(),
});

type SubscribeInput = z.infer<typeof SubscribeSchema>;

// blog-content-manager owns the newsletter (Resend, templates, welcome email);
// this endpoint validates the form and hands the signup over.
const FORWARD_TIMEOUT_MS = 10_000;

const forwardSignup = (data: SubscribeInput) =>
  fetch(`${import.meta.env.NEWSLETTER_API_URL}/api/newsletter/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-newsletter-secret": import.meta.env.NEWSLETTER_SUBSCRIBE_SECRET,
    },
    body: JSON.stringify({ email: data.email, name: data.name }),
    signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
  });

export const POST: APIRoute = async ({ request }) => {
  const rateLimitResponse = subscribeRateLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Parse body
    const body = await request.json();

    // Validar con Zod
    const validatedData: SubscribeInput = SubscribeSchema.parse(body);

    const res = await forwardSignup(validatedData);

    if (res.status === 409) {
      return ApiResponseBuilder.conflict("Ya estás suscrito con este correo.");
    }
    if (!res.ok) {
      throw new Error(`Newsletter service answered ${res.status}`);
    }

    // The signup is immediate, with no double opt-in email, so the message
    // cannot ask them to confirm anything.
    return ApiResponseBuilder.success("Listo, ya estás suscrito. La próxima edición te llega al correo.");
  } catch (error) {
    // Error de validación de Zod
    if (error instanceof z.ZodError) {
      return ApiResponseBuilder.badRequest(
        error.issues[0].message,
        error.issues.map((err) => ({
          field: err.path[0]?.toString(),
          message: err.message,
        })),
      );
    }

    // Newsletter service down, slow or rejecting the request
    console.error("Newsletter subscribe error:", error);
    Sentry.captureException(error, { tags: { context: "newsletter.subscribe" } });
    return ApiResponseBuilder.internalError("No pude completar la suscripción. Intenta de nuevo en unos minutos.");
  }
};
