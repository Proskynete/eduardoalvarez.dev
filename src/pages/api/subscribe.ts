import client from "@mailchimp/mailchimp_marketing";
import type { APIRoute } from "astro";
import { z } from "zod";

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
        return new Response(
          JSON.stringify({
            success: false,
            message: "Este correo ya está registrado en nuestra lista",
            status: 409,
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          },
        );
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

    return new Response(
      JSON.stringify({
        success: true,
        message: "¡Registro exitoso! Revisa tu correo para confirmar la suscripción",
        status: 200,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    // Error de validación de Zod
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.errors[0].message,
          errors: error.errors,
          status: 400,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Errores de Mailchimp
    if (error instanceof Error && "status" in error) {
      const mailchimpError = error as Error & { status?: number };
      console.error("Mailchimp error:", mailchimpError);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Error al procesar la suscripción. Intenta de nuevo más tarde.",
          status: mailchimpError.status || 500,
        }),
        {
          status: mailchimpError.status || 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Error genérico
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error interno del servidor",
        status: 500,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
