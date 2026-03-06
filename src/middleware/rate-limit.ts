interface RateLimitConfig {
  windowMs: number; // Ventana de tiempo en ms
  maxRequests: number; // Máximo de requests en la ventana
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Simple in-memory store (en producción usar Redis/Vercel KV)
const store = new Map<string, RateLimitEntry>();

/**
 * Rate limiter simple basado en IP
 * En producción, considera usar Vercel KV o Redis para persistencia
 */
export function rateLimit(config: RateLimitConfig) {
  return (request: Request): Response | null => {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    const now = Date.now();
    const entry = store.get(ip);

    // Limpiar entradas antiguas cada 100 requests
    if (store.size > 100) {
      for (const [key, value] of store.entries()) {
        if (value.resetTime < now) {
          store.delete(key);
        }
      }
    }

    if (!entry || entry.resetTime < now) {
      // Primera request o ventana expirada
      store.set(ip, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return null; // Permitir request
    }

    if (entry.count >= config.maxRequests) {
      // Rate limit excedido
      const resetIn = Math.ceil((entry.resetTime - now) / 1000);

      return new Response(
        JSON.stringify({
          success: false,
          message: `Demasiadas solicitudes. Intenta de nuevo en ${resetIn} segundos.`,
          status: 429,
          retryAfter: resetIn,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": resetIn.toString(),
            "X-RateLimit-Limit": config.maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": entry.resetTime.toString(),
          },
        },
      );
    }

    // Incrementar contador
    entry.count++;
    store.set(ip, entry);

    return null; // Permitir request
  };
}
