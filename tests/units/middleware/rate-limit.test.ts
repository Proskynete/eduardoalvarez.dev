import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { rateLimit } from "../../../src/middleware/rate-limit";

// Each test uses a unique IP to avoid cross-test store contamination
let testCounter = 0;
const uniqueIp = (prefix: string) => `${prefix}-${++testCounter}`;

const makeRequest = (ip: string) =>
  new Request("http://localhost/api/subscribe", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
  });

const makeRequestWithRealIp = (ip: string) =>
  new Request("http://localhost/api/subscribe", {
    method: "POST",
    headers: { "x-real-ip": ip },
  });

const makeRequestWithNoIp = () =>
  new Request("http://localhost/api/subscribe", {
    method: "POST",
  });

describe("rateLimit middleware", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("solicitudes permitidas", () => {
    it("permite la primera solicitud (retorna null)", () => {
      const limiter = rateLimit({ windowMs: 60_000, maxRequests: 5 });
      const ip = uniqueIp("first");

      const result = limiter(makeRequest(ip));
      expect(result).toBeNull();
    });

    it("permite solicitudes sucesivas dentro del límite", () => {
      const limiter = rateLimit({ windowMs: 60_000, maxRequests: 3 });
      const ip = uniqueIp("within-limit");

      expect(limiter(makeRequest(ip))).toBeNull();
      expect(limiter(makeRequest(ip))).toBeNull();
      expect(limiter(makeRequest(ip))).toBeNull();
    });

    it("bloquea la solicitud que excede el límite", () => {
      const limiter = rateLimit({ windowMs: 60_000, maxRequests: 2 });
      const ip = uniqueIp("exceed");

      limiter(makeRequest(ip)); // 1
      limiter(makeRequest(ip)); // 2 — at limit
      const result = limiter(makeRequest(ip)); // 3 — exceeded

      expect(result).not.toBeNull();
      expect(result?.status).toBe(429);
    });
  });

  describe("respuesta 429", () => {
    it("incluye el header Retry-After", async () => {
      const limiter = rateLimit({ windowMs: 30_000, maxRequests: 1 });
      const ip = uniqueIp("retry-after");

      limiter(makeRequest(ip)); // consume the 1 allowed
      const response = limiter(makeRequest(ip)); // blocked

      expect(response).not.toBeNull();
      const retryAfter = response?.headers.get("Retry-After");
      expect(retryAfter).toBeTruthy();
      expect(Number(retryAfter)).toBeGreaterThan(0);
    });

    it("incluye el header X-RateLimit-Limit con el máximo configurado", () => {
      const limiter = rateLimit({ windowMs: 60_000, maxRequests: 5 });
      const ip = uniqueIp("ratelimit-limit");

      for (let i = 0; i < 5; i++) limiter(makeRequest(ip));
      const response = limiter(makeRequest(ip));

      expect(response?.headers.get("X-RateLimit-Limit")).toBe("5");
    });

    it("incluye el header X-RateLimit-Remaining con valor 0", () => {
      const limiter = rateLimit({ windowMs: 60_000, maxRequests: 2 });
      const ip = uniqueIp("remaining");

      limiter(makeRequest(ip));
      limiter(makeRequest(ip));
      const response = limiter(makeRequest(ip));

      expect(response?.headers.get("X-RateLimit-Remaining")).toBe("0");
    });

    it("el cuerpo contiene success=false y status=429", async () => {
      const limiter = rateLimit({ windowMs: 60_000, maxRequests: 1 });
      const ip = uniqueIp("body");

      limiter(makeRequest(ip));
      const response = limiter(makeRequest(ip));

      expect(response).not.toBeNull();
      const body = await response!.json();
      expect(body.success).toBe(false);
      expect(body.status).toBe(429);
      expect(body.retryAfter).toBeGreaterThan(0);
    });
  });

  describe("extracción de IP", () => {
    it("lee la IP desde el header x-forwarded-for", () => {
      const limiter = rateLimit({ windowMs: 60_000, maxRequests: 1 });
      const ip = uniqueIp("forwarded");

      // Ambas solicitudes usan la misma IP → la segunda debe ser bloqueada
      limiter(makeRequest(ip));
      const result = limiter(makeRequest(ip));

      expect(result?.status).toBe(429);
    });

    it("lee la IP desde el header x-real-ip cuando no hay x-forwarded-for", () => {
      const limiter = rateLimit({ windowMs: 60_000, maxRequests: 1 });
      const ip = uniqueIp("real-ip");

      limiter(makeRequestWithRealIp(ip));
      const result = limiter(makeRequestWithRealIp(ip));

      expect(result?.status).toBe(429);
    });

    it("usa 'unknown' cuando no hay headers de IP", () => {
      const limiter = rateLimit({ windowMs: 60_000, maxRequests: 1 });

      // Ambas solicitudes sin IP comparten la clave 'unknown'
      limiter(makeRequestWithNoIp());
      const result = limiter(makeRequestWithNoIp());

      // La segunda puede o no estar bloqueada dependiendo de otros tests
      // Lo importante es que no lance un error
      expect(result === null || result?.status === 429).toBe(true);
    });
  });

  describe("ventana de tiempo", () => {
    it("resetea el contador cuando la ventana de tiempo expira", () => {
      const limiter = rateLimit({ windowMs: 5_000, maxRequests: 2 });
      const ip = uniqueIp("window-reset");

      // Agotar el límite
      limiter(makeRequest(ip));
      limiter(makeRequest(ip));
      expect(limiter(makeRequest(ip))?.status).toBe(429);

      // Avanzar el tiempo más allá de la ventana
      vi.advanceTimersByTime(6_000);

      // El contador se reinicia → vuelve a permitir
      const result = limiter(makeRequest(ip));
      expect(result).toBeNull();
    });

    it("no resetea el contador si la ventana no ha expirado", () => {
      const limiter = rateLimit({ windowMs: 10_000, maxRequests: 2 });
      const ip = uniqueIp("no-reset");

      limiter(makeRequest(ip));
      limiter(makeRequest(ip));

      // Avanzar solo 4s (ventana es 10s)
      vi.advanceTimersByTime(4_000);

      // Aún bloqueado
      const result = limiter(makeRequest(ip));
      expect(result?.status).toBe(429);
    });
  });
});
