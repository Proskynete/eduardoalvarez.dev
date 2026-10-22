import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@sentry/astro", () => ({ captureException: vi.fn() }));

import * as Sentry from "@sentry/astro";

import { POST } from "../../../src/pages/api/subscribe";

let ip = 0;
const call = (body: unknown) =>
  POST({
    request: new Request("http://localhost/api/subscribe", {
      method: "POST",
      headers: { "x-forwarded-for": `subscribe-${++ip}` },
      body: JSON.stringify(body),
    }),
  } as Parameters<typeof POST>[0]) as Promise<Response>;

const valid = { name: "Ana Pérez", email: "Ana@Example.com" };

describe("POST /api/subscribe", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("NEWSLETTER_API_URL", "https://app.test");
    vi.stubEnv("NEWSLETTER_SUBSCRIBE_SECRET", "shared-secret-value");
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
    vi.mocked(Sentry.captureException).mockClear();
  });

  it("forwards the signup with the shared secret and answers success", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const res = await call(valid);

    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe("Listo, ya estás suscrito. La próxima edición te llega al correo.");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://app.test/api/newsletter/subscribe");
    expect(init.headers["x-newsletter-secret"]).toBe("shared-secret-value");
    expect(JSON.parse(init.body)).toEqual({ email: "ana@example.com", name: "Ana Pérez" });
  });

  it("keeps the 409 for an existing subscriber", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 409 }));
    const res = await call(valid);

    expect(res.status).toBe(409);
    expect((await res.json()).message).toBe("Ya estás suscrito con este correo.");
  });

  it("answers the generic error and reports when the service fails", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 502 }));
    const res = await call(valid);

    expect(res.status).toBe(500);
    expect(Sentry.captureException).toHaveBeenCalledOnce();
  });

  it("answers the generic error when the service is unreachable", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    const res = await call(valid);

    expect(res.status).toBe(500);
    expect(Sentry.captureException).toHaveBeenCalledOnce();
  });

  it("rejects an invalid form without calling the service", async () => {
    const res = await call({ name: "A", email: "no-es-correo" });

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
