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

const SUCCESS_MESSAGE = "Revisa tu correo y confirma con el botón de la bienvenida.";
const BOT_MESSAGE = "No pudimos verificar que no eres un bot. Recarga la página e intenta de nuevo.";
const TURNSTILE_TIMEOUT_MS = 5_000;

/** Whether Cloudflare vouches for the Turnstile token. Throws when siteverify is down. */
async function isHuman(token: string, request: Request): Promise<boolean> {
  const body = new URLSearchParams({ secret: import.meta.env.TURNSTILE_SECRET_KEY, response: token });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (ip) body.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
    signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Turnstile answered ${res.status}`);
  const result: { success?: boolean } = await res.json();
  return result.success === true;
}

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

    // Honeypot: only bots fill the hidden `website` field. They get the same
    // success as everyone, checked before Zod so a junk name gets no hint either.
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return ApiResponseBuilder.success(SUCCESS_MESSAGE);
    }

    // Validar con Zod
    const validatedData: SubscribeInput = SubscribeSchema.parse(body);

    const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    if (!token || !(await isHuman(token, request))) {
      return ApiResponseBuilder.badRequest(BOT_MESSAGE);
    }

    const res = await forwardSignup(validatedData);

    if (res.status === 409) {
      return ApiResponseBuilder.conflict("Ya estás suscrito con este correo.");
    }
    if (!res.ok) {
      throw new Error(`Newsletter service answered ${res.status}`);
    }

    // The newsletter service keeps the signup pending until the person clicks
    // «Confirmar suscripción» in the welcome, so the message says so.
    return ApiResponseBuilder.success(SUCCESS_MESSAGE);
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

    // Turnstile or the newsletter service down, slow or rejecting the request
    console.error("Newsletter subscribe error:", error);
    Sentry.captureException(error, { tags: { context: "newsletter.subscribe" } });
    return ApiResponseBuilder.internalError("No pude completar la suscripción. Intenta de nuevo en unos minutos.");
  }
};
