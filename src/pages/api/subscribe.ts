import client from "@mailchimp/mailchimp_marketing";
import type { APIRoute } from "astro";
import { z } from "zod";

import { ApiResponseBuilder } from "../../utils/api-response";

// Schema de validación
const SubscribeSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .max(100, "Email demasiado largo")
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
  try {
    // Parse body
    const body = await request.json();

    // Validar con Zod
    const validatedData: SubscribeInput = SubscribeSchema.parse(body);

    // Verificar si el usuario ya existe (O(1) lookup)
    try {
      const member = await client.lists.getListMember(import.meta.env.MAILCHIMP_LIST_ID, validatedData.email);

      if (member) {
        return ApiResponseBuilder.conflict("Este correo ya está registrado en nuestra lista");
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

    return ApiResponseBuilder.success("¡Registro exitoso! Revisa tu correo para confirmar la suscripción");
  } catch (error) {
    // Error de validación de Zod
    if (error instanceof z.ZodError) {
      return ApiResponseBuilder.badRequest(
        error.errors[0].message,
        error.errors.map((err) => ({
          field: err.path[0]?.toString(),
          message: err.message,
        })),
      );
    }

    // Errores de Mailchimp
    if (error instanceof Error && "status" in error) {
      console.error("Mailchimp error:", error);
      return ApiResponseBuilder.internalError("Error al procesar la suscripción. Intenta de nuevo más tarde.");
    }

    // Error genérico
    console.error("Unexpected error:", error);
    return ApiResponseBuilder.internalError();
  }
};
