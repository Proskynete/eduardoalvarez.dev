export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message: string;
  status: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
  status: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiResponseBuilder {
  static json(body: ApiResponse, status: number): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  static success<T = unknown>(message: string, data?: T): Response {
    return ApiResponseBuilder.json({ success: true, message, data, status: 200 }, 200);
  }

  static created<T = unknown>(message: string, data?: T): Response {
    return ApiResponseBuilder.json({ success: true, message, data, status: 201 }, 201);
  }

  static noContent(): Response {
    return new Response(null, { status: 204 });
  }

  static badRequest(message: string, errors?: Array<{ field?: string; message: string }>): Response {
    return ApiResponseBuilder.json({ success: false, message, errors, status: 400 }, 400);
  }

  static unauthorized(message: string = "No autorizado"): Response {
    return ApiResponseBuilder.json({ success: false, message, status: 401 }, 401);
  }

  static forbidden(message: string = "Acceso prohibido"): Response {
    return ApiResponseBuilder.json({ success: false, message, status: 403 }, 403);
  }

  static notFound(message: string = "Recurso no encontrado"): Response {
    return ApiResponseBuilder.json({ success: false, message, status: 404 }, 404);
  }

  static conflict(message: string): Response {
    return ApiResponseBuilder.json({ success: false, message, status: 409 }, 409);
  }

  static tooManyRequests(message: string = "Demasiadas solicitudes", retryAfter?: number): Response {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (retryAfter) {
      headers["Retry-After"] = retryAfter.toString();
    }
    return new Response(JSON.stringify({ success: false, message, status: 429 }), { status: 429, headers });
  }

  static internalError(message: string = "Error interno del servidor"): Response {
    return ApiResponseBuilder.json({ success: false, message, status: 500 }, 500);
  }
}
