import { z } from "zod";

// Schema para variables públicas (client-side)
const PublicEnvSchema = z.object({
  PUBLIC_ALGOLIA_APPLICATION_ID: z.string().min(1, "Algolia Application ID requerido"),
  PUBLIC_ALGOLIA_SEARCH_API_KEY: z.string().min(1, "Algolia Search API Key requerido"),
  PUBLIC_ALGOLIA_INDEX_NAME: z.string().min(1, "Algolia Index Name requerido"),
  PUBLIC_GISCUS_REPO: z.string().min(1, "Giscus Repo requerido"),
  PUBLIC_GISCUS_REPO_ID: z.string().min(1, "Giscus Repo ID requerido"),
  PUBLIC_GISCUS_CATEGORY_ID: z.string().min(1, "Giscus Category ID requerido"),
});

// Schema para variables privadas (server-side only)
const PrivateEnvSchema = z.object({
  ALGOLIA_ADMIN_API_KEY: z.string().min(1, "Algolia Admin API Key requerido"),
  MAILCHIMP_API_KEY: z.string().min(1, "Mailchimp API Key requerido"),
  MAILCHIMP_LIST_ID: z.string().min(1, "Mailchimp List ID requerido"),
  MAILCHIMP_SERVER_PREFIX: z.string().min(1, "Mailchimp Server Prefix requerido"),
});

// Tipos inferidos
export type PublicEnv = z.infer<typeof PublicEnvSchema>;
export type PrivateEnv = z.infer<typeof PrivateEnvSchema>;
export type Env = PublicEnv & PrivateEnv;

/**
 * Valida variables de entorno públicas
 * Puede ser llamado desde el cliente
 */
export function validatePublicEnv(): PublicEnv {
  const result = PublicEnvSchema.safeParse(import.meta.env);

  if (!result.success) {
    console.error("❌ Variables de entorno públicas inválidas:");
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error("Validación de environment público falló");
  }

  return result.data;
}

/**
 * Valida variables de entorno privadas
 * Solo debe ser llamado en el servidor
 */
export function validatePrivateEnv(): PrivateEnv {
  if (typeof process === "undefined") {
    throw new Error("validatePrivateEnv() solo puede ser llamado en el servidor");
  }

  const result = PrivateEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Variables de entorno privadas inválidas:");
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error("Validación de environment privado falló");
  }

  return result.data;
}

/**
 * Valida todas las variables de entorno
 * Solo debe ser llamado en el servidor (build time, API routes)
 */
export function validateEnv(): Env {
  const publicEnv = validatePublicEnv();
  const privateEnv = validatePrivateEnv();

  return { ...publicEnv, ...privateEnv };
}

/**
 * Helper para obtener env validado con type safety
 */
export function getEnv<T extends keyof Env>(key: T): Env[T] {
  const env = validateEnv();
  return env[key];
}
