import type { APIContext } from "astro";
import { describe, expect, it, vi } from "vitest";

import { createSentryEnvironment } from "../../../src/middleware/sentry-environment";

const contextFor = (url: string) => ({ url: new URL(url) }) as APIContext;
const next = vi.fn(async () => new Response("ok"));

describe("createSentryEnvironment", () => {
  it("sets the environment from the first request's host when it was unknown", async () => {
    const options: { environment?: string } = { environment: "development" };
    const middleware = createSentryEnvironment(() => ({ getOptions: () => options }), "");
    await middleware(contextFor("https://eduardoalvarez.dev/api/sentry-test"), next);
    expect(options.environment).toBe("production");

    // Only once: a later request on another host does not change it.
    await middleware(contextFor("http://localhost:4321/"), next);
    expect(options.environment).toBe("production");
  });

  it("leaves a known VERCEL_ENV alone", async () => {
    const options: { environment?: string } = { environment: "preview" };
    const middleware = createSentryEnvironment(() => ({ getOptions: () => options }), "preview");
    await middleware(contextFor("https://eduardoalvarez.dev/"), next);
    expect(options.environment).toBe("preview");
  });

  it("does nothing without a Sentry client", async () => {
    const middleware = createSentryEnvironment(() => undefined, "");
    await expect(middleware(contextFor("https://eduardoalvarez.dev/"), next)).resolves.toBeInstanceOf(Response);
  });
});
