import { describe, expect, it } from "vitest";

import { ApiResponseBuilder } from "../../../src/utils/api-response";

describe("ApiResponseBuilder", () => {
  describe("json()", () => {
    it("crea una respuesta con el status y Content-Type correctos", async () => {
      const body = { success: true as const, message: "ok", status: 200 };
      const response = ApiResponseBuilder.json(body, 200);

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("application/json");
      const data = await response.json();
      expect(data).toEqual(body);
    });
  });

  describe("success()", () => {
    it("retorna status 200 con success=true", async () => {
      const response = ApiResponseBuilder.success("Operación exitosa");

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message).toBe("Operación exitosa");
      expect(data.status).toBe(200);
    });

    it("incluye data en el cuerpo cuando se provee", async () => {
      const payload = { id: 42, name: "test" };
      const response = ApiResponseBuilder.success("Creado", payload);

      const data = await response.json();
      expect(data.data).toEqual(payload);
    });
  });

  describe("created()", () => {
    it("retorna status 201", async () => {
      const response = ApiResponseBuilder.created("Recurso creado");

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.status).toBe(201);
    });

    it("incluye data cuando se provee", async () => {
      const response = ApiResponseBuilder.created("OK", { id: 1 });
      const data = await response.json();
      expect(data.data).toEqual({ id: 1 });
    });
  });

  describe("noContent()", () => {
    it("retorna status 204 con cuerpo vacío", async () => {
      const response = ApiResponseBuilder.noContent();

      expect(response.status).toBe(204);
      const text = await response.text();
      expect(text).toBe("");
    });
  });

  describe("badRequest()", () => {
    it("retorna status 400 con success=false", async () => {
      const response = ApiResponseBuilder.badRequest("Datos inválidos");

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("Datos inválidos");
      expect(data.status).toBe(400);
    });

    it("incluye errors en el cuerpo cuando se proveen", async () => {
      const errors = [
        { field: "email", message: "Email inválido" },
        { field: "name", message: "Nombre requerido" },
      ];
      const response = ApiResponseBuilder.badRequest("Validación fallida", errors);

      const data = await response.json();
      expect(data.errors).toEqual(errors);
    });
  });

  describe("unauthorized()", () => {
    it("retorna status 401 con mensaje por defecto", async () => {
      const response = ApiResponseBuilder.unauthorized();

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("No autorizado");
    });

    it("usa el mensaje personalizado cuando se provee", async () => {
      const response = ApiResponseBuilder.unauthorized("Token expirado");
      const data = await response.json();
      expect(data.message).toBe("Token expirado");
    });
  });

  describe("forbidden()", () => {
    it("retorna status 403 con mensaje por defecto", async () => {
      const response = ApiResponseBuilder.forbidden();

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("Acceso prohibido");
    });
  });

  describe("notFound()", () => {
    it("retorna status 404 con mensaje por defecto", async () => {
      const response = ApiResponseBuilder.notFound();

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("Recurso no encontrado");
    });
  });

  describe("conflict()", () => {
    it("retorna status 409 con el mensaje indicado", async () => {
      const response = ApiResponseBuilder.conflict("El email ya está registrado");

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("El email ya está registrado");
      expect(data.status).toBe(409);
    });
  });

  describe("tooManyRequests()", () => {
    it("retorna status 429 con mensaje por defecto", async () => {
      const response = ApiResponseBuilder.tooManyRequests();

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("Demasiadas solicitudes");
    });

    it("incluye el header Retry-After cuando se provee retryAfter", () => {
      const response = ApiResponseBuilder.tooManyRequests("Límite alcanzado", 60);
      expect(response.headers.get("Retry-After")).toBe("60");
    });

    it("no incluye el header Retry-After cuando no se provee", () => {
      const response = ApiResponseBuilder.tooManyRequests();
      expect(response.headers.get("Retry-After")).toBeNull();
    });
  });

  describe("internalError()", () => {
    it("retorna status 500 con mensaje por defecto", async () => {
      const response = ApiResponseBuilder.internalError();

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe("Error interno del servidor");
    });

    it("usa el mensaje personalizado cuando se provee", async () => {
      const response = ApiResponseBuilder.internalError("Fallo en base de datos");
      const data = await response.json();
      expect(data.message).toBe("Fallo en base de datos");
    });
  });
});
