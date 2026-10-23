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

const valid = { name: "Ana Pérez", email: "Ana@Example.com", website: "", turnstileToken: "token-ok" };
const SUCCESS = "Revisa tu correo y confirma con el botón de la bienvenida.";
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe("POST /api/subscribe", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("NEWSLETTER_API_URL", "https://app.test");
    vi.stubEnv("NEWSLETTER_SUBSCRIBE_SECRET", "shared-secret-value");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "turnstile-secret");
    vi.stubGlobal("fetch", fetchMock);
  });

  // siteverify answers `turnstile`; the newsletter service answers `app`.
  const answer = (
    app: () => Promise<Response>,
    turnstile: () => Promise<Response> = async () => json({ success: true }),
  ) => fetchMock.mockImplementation((url: string) => (url === SITEVERIFY ? turnstile() : app()));
  const appCalls = () => fetchMock.mock.calls.filter(([url]) => url !== SITEVERIFY);

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
    vi.mocked(Sentry.captureException).mockClear();
  });

  it("forwards the signup with the shared secret and answers success", async () => {
    answer(async () => json({}));
    const res = await call(valid);

    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe(SUCCESS);
    const [url, init] = appCalls()[0];
    expect(url).toBe("https://app.test/api/newsletter/subscribe");
    expect(init.headers["x-newsletter-secret"]).toBe("shared-secret-value");
    expect(JSON.parse(init.body)).toEqual({ email: "ana@example.com", name: "Ana Pérez" });
  });

  it("keeps the 409 for an existing subscriber", async () => {
    answer(async () => json({}, 409));
    const res = await call(valid);

    expect(res.status).toBe(409);
    expect((await res.json()).message).toBe("Ya estás suscrito con este correo.");
  });

  it("answers the generic error and reports when the service fails", async () => {
    answer(async () => json({}, 502));
    const res = await call(valid);

    expect(res.status).toBe(500);
    expect(Sentry.captureException).toHaveBeenCalledOnce();
  });

  it("answers the generic error when the service is unreachable", async () => {
    answer(async () => {
      throw new TypeError("fetch failed");
    });
    const res = await call(valid);

    expect(res.status).toBe(500);
    expect(Sentry.captureException).toHaveBeenCalledOnce();
  });

  it("rejects an invalid form without calling the service", async () => {
    const res = await call({ name: "A", email: "no-es-correo" });

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers success to a filled honeypot without calling anything", async () => {
    const res = await call({ ...valid, name: "x9", website: "https://spam.example" });

    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe(SUCCESS);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a signup without a Turnstile token", async () => {
    const res = await call({ ...valid, turnstileToken: undefined });

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("checks the token with siteverify and stops when Cloudflare says no", async () => {
    answer(
      async () => json({}),
      async () => json({ success: false }),
    );
    const res = await call({ ...valid, turnstileToken: "token-bad" });

    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/no eres un bot/);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(SITEVERIFY);
    expect(Object.fromEntries(init.body)).toEqual({
      secret: "turnstile-secret",
      response: "token-bad",
      remoteip: expect.stringMatching(/^subscribe-/),
    });
    expect(appCalls()).toHaveLength(0);
  });

  it("answers the generic error and reports when Turnstile is down", async () => {
    answer(
      async () => json({}),
      async () => json({}, 503),
    );
    const res = await call(valid);

    expect(res.status).toBe(500);
    expect(Sentry.captureException).toHaveBeenCalledOnce();
    expect(appCalls()).toHaveLength(0);
  });

  it("logs where each attempt stopped, without the email or the name", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    answer(async () => json({}));
    await call(valid);
    await call({ ...valid, website: "https://spam.test" });
    await call({ ...valid, turnstileToken: "" });

    expect(info.mock.calls.map(([line]) => line)).toEqual([
      "[newsletter] subscribe: forwarded",
      "[newsletter] subscribe: honeypot",
      "[newsletter] subscribe: no-token",
    ]);
    info.mockRestore();
  });
});
