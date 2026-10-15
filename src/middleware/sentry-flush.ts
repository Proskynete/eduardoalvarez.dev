import type { MiddlewareHandler } from "astro";

type Flush = (timeout?: number) => PromiseLike<boolean>;
type WaitUntil = (task: Promise<unknown>) => void;

const FLUSH_TIMEOUT_MS = 2000;

/**
 * Vercel's per-request `waitUntil`, read from the same global that
 * `@vercel/functions` uses. `undefined` outside a Vercel function.
 */
export function vercelWaitUntil(): WaitUntil | undefined {
  const context = (globalThis as Record<symbol, unknown>)[Symbol.for("@vercel/request-context")] as
    | { get?: () => { waitUntil?: WaitUntil } | undefined }
    | undefined;
  const waitUntil = context?.get?.()?.waitUntil;
  return typeof waitUntil === "function" ? waitUntil : undefined;
}

/**
 * Makes sure Sentry's events leave the function before Vercel freezes it.
 *
 * `@sentry/astro`'s own flush (`flushIfServerless`) sees Vercel's request
 * context and hands the flush to `vercelWaitUntil`, which only acts in the Edge
 * runtime: in a Node function it returns without flushing. The request
 * transaction usually made it out anyway, but the error event — which goes
 * through async processing first — was still queued when the response returned
 * and the function froze, so endpoint errors never reached Sentry.
 *
 * So, outermost in the middleware chain:
 * - a thrown error or a 5xx response: await the flush before answering (the
 *   error matters more than a few ms);
 * - anything else: flush in the background through `waitUntil`, so normal
 *   requests are not delayed and their traces still arrive.
 */
export function createSentryFlush(flush: Flush, getWaitUntil: () => WaitUntil | undefined = vercelWaitUntil): MiddlewareHandler {
  return async (_context, next) => {
    let response: Response;
    try {
      response = await next();
    } catch (error) {
      await flush(FLUSH_TIMEOUT_MS);
      throw error;
    }
    if (response.status >= 500) {
      await flush(FLUSH_TIMEOUT_MS);
    } else {
      getWaitUntil()?.(Promise.resolve(flush(FLUSH_TIMEOUT_MS)));
    }
    return response;
  };
}
