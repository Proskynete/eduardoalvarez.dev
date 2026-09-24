import client from "@mailchimp/mailchimp_marketing";
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

// Configurar Mailchimp
client.setConfig({
  apiKey: import.meta.env.MAILCHIMP_API_KEY,
  server: import.meta.env.MAILCHIMP_API_KEY.split("-")[1],
});

const TAGS = {
  SEND_POST_MAIL: "send-post-mail",
  FROM_WEB_PAGE: "from-web-page",
};

export const POST: APIRoute = async ({ request }) => {
  const rateLimitResponse = subscribeRateLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Parse body
    const body = await request.json();

    // Validar con Zod
    const validatedData: SubscribeInput = SubscribeSchema.parse(body);

    // Verificar si el usuario ya existe (O(1) lookup)
    try {
      const member = await client.lists.getListMember(import.meta.env.MAILCHIMP_LIST_ID, validatedData.email);

      if (member) {
        return ApiResponseBuilder.conflict("Ya estás suscrito con este correo.");
      }
    } catch (error: unknown) {
      // Error 404 significa que no existe (proceder con registro)
      if (error && typeof error === 'object' && 'status' in error && error.status !== 404) {
        throw error;
      }
    }

    // Agregar nuevo suscriptor
    await client.lists.addListMember(import.meta.env.MAILCHIMP_LIST_ID, {
      email_address: validatedData.email,
      status: "subscribed",
      tags: [TAGS.SEND_POST_MAIL, TAGS.FROM_WEB_PAGE],
      merge_fields: {
        FNAME: validatedData.name,
      },
    });

    // `status: "subscribed"` adds the member directly, with no double opt-in
    // email, so the message cannot ask them to confirm anything.
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

    // Errores de Mailchimp
    if (error instanceof Error && "status" in error) {
      console.error("Mailchimp error:", error);
      Sentry.captureException(error, { tags: { context: "newsletter.subscribe" } });
      return ApiResponseBuilder.internalError("No pude completar la suscripción. Intenta de nuevo en unos minutos.");
    }

    // Error genérico
    console.error("Unexpected error:", error);
    Sentry.captureException(error, { tags: { context: "newsletter.subscribe" } });
    return ApiResponseBuilder.internalError();
  }
};
