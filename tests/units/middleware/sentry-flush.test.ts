import type { APIContext } from "astro";
import { describe, expect, it, vi } from "vitest";

import { createSentryFlush, vercelWaitUntil } from "../../../src/middleware/sentry-flush";

const context = {} as APIContext;

describe("createSentryFlush", () => {
  it("awaits the flush before rethrowing an error", async () => {
    const order: string[] = [];
    const flush = vi.fn(async () => {
      order.push("flush");
      return true;
    });
    const middleware = createSentryFlush(flush, () => undefined);
    await expect(
      middleware(context, async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    expect(flush).toHaveBeenCalledWith(2000);
    expect(order).toEqual(["flush"]);
  });

  it("awaits the flush on a 5xx response", async () => {
    let flushed = false;
    const flush = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      flushed = true;
      return true;
    });
    const response = await createSentryFlush(flush, () => undefined)(context, async () => new Response(null, { status: 500 }));
    expect((response as Response).status).toBe(500);
    expect(flushed).toBe(true);
  });

  it("hands the flush to waitUntil on a normal response", async () => {
    const flush = vi.fn(async () => true);
    const waitUntil = vi.fn();
    const response = await createSentryFlush(flush, () => waitUntil)(context, async () => new Response("ok"));
    expect((response as Response).status).toBe(200);
    expect(waitUntil).toHaveBeenCalledTimes(1);
  });

  it("does not block a normal response without waitUntil", async () => {
    const flush = vi.fn(async () => true);
    await createSentryFlush(flush, () => undefined)(context, async () => new Response("ok"));
    expect(flush).not.toHaveBeenCalled();
  });
});

describe("vercelWaitUntil", () => {
  const key = Symbol.for("@vercel/request-context");
  const global = globalThis as Record<symbol, unknown>;

  it("is undefined outside Vercel", () => {
    expect(vercelWaitUntil()).toBeUndefined();
  });

  it("reads waitUntil from Vercel's request context", () => {
    const waitUntil = vi.fn();
    global[key] = { get: () => ({ waitUntil }) };
    expect(vercelWaitUntil()).toBe(waitUntil);
    delete global[key];
  });
});
