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
});

// Tipos inferidos
export type PublicEnv = z.infer<typeof PublicEnvSchema>;
export type PrivateEnv = z.infer<typeof PrivateEnvSchema>;
export type Env = PublicEnv & PrivateEnv;

/**
 * Valida variables de entorno públicas (client-side)
 *
 * Verifica que todas las variables con prefijo PUBLIC_ estén
 * presentes y sean válidas según el schema de Zod.
 *
 * @returns Objeto con variables públicas validadas
 * @throws {Error} Si falta alguna variable requerida o tiene formato inválido
 *
 * @example
 * ```typescript
 * // En componentes React o Astro (client-side)
 * const env = validatePublicEnv();
 * console.log(env.PUBLIC_ALGOLIA_APPLICATION_ID);
 * ```
 *
 * @remarks
 * - Puede ser llamado desde el cliente (browser)
 * - Usa import.meta.env para acceder a las variables
 * - Las variables PUBLIC_ son incluidas en el bundle del cliente
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
 * Valida variables de entorno privadas (server-side only)
 *
 * Verifica que todas las variables privadas (sin prefijo PUBLIC_)
 * estén presentes y sean válidas según el schema de Zod.
 *
 * @returns Objeto con variables privadas validadas
 * @throws {Error} Si se llama desde el cliente o si falta alguna variable
 *
 * @example
 * ```typescript
 * // En API routes o código server-side
 * const env = validatePrivateEnv();
 * console.log(env.MAILCHIMP_API_KEY);
 * ```
 *
 * @remarks
 * - SOLO puede ser llamado en el servidor (Node.js)
 * - Usa process.env para acceder a las variables
 * - Las variables privadas NUNCA se incluyen en el bundle del cliente
 * - Útil para proteger API keys y secretos
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
 * Valida todas las variables de entorno en startup (astro.config.mjs)
 *
 * Valida tanto variables públicas como privadas desde process.env.
 * Diseñado específicamente para astro.config.mjs donde import.meta.env
 * no está disponible.
 *
 * @returns Objeto con todas las variables validadas
 * @throws {Error} Si se llama desde el cliente o si falta alguna variable
 *
 * @example
 * ```typescript
 * // En astro.config.mjs (startup)
 * if (process.env.SKIP_ENV_VALIDATION !== 'true') {
 *   try {
 *     validateEnvAtStartup();
 *     console.log('✅ Variables de entorno validadas');
 *   } catch (error) {
 *     console.error('❌ Error en validación:', error);
 *     process.exit(1);
 *   }
 * }
 * ```
 *
 * @remarks
 * - SOLO para usar en Node.js (astro.config.mjs)
 * - Valida TODAS las variables (públicas + privadas)
 * - Usa process.env en lugar de import.meta.env
 * - Implementa fail-fast pattern para detectar errores de configuración temprano
 * - Puede omitirse con SKIP_ENV_VALIDATION=true (solo en desarrollo)
 */
export function validateEnvAtStartup(): Env {
  if (typeof process === "undefined") {
    throw new Error("validateEnvAtStartup() solo puede ser llamado en Node.js (astro.config.mjs)");
  }

  // Combinar ambos schemas para validar todo desde process.env
  const AllEnvSchema = PublicEnvSchema.merge(PrivateEnvSchema);
  const result = AllEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Variables de entorno inválidas:");
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error("Validación de environment falló");
  }

  return result.data;
}

/**
 * Helper para obtener env validado con type safety
 */
export function getEnv<T extends keyof Env>(key: T): Env[T] {
  const env = validateEnv();
  return env[key];
}
