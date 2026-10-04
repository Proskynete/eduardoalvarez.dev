import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SPLASH_ATTRIBUTE, SPLASH_DURATION_MS, splashScript } from "../../../src/components/splash-screen/script";

const html = document.documentElement;
const run = () => new Function(splashScript)();

function setStandalone(standalone: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({ matches: standalone && query.includes("standalone") })),
  );
}

describe("splashScript", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    html.removeAttribute(SPLASH_ATTRIBUTE);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("marks <html> in the installed app, so the splash is in the first paint", () => {
    setStandalone(true);
    run();
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(true);
  });

  it("clears the mark once the sequence has finished", () => {
    setStandalone(true);
    run();
    vi.advanceTimersByTime(SPLASH_DURATION_MS);
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(false);
  });

  it("shows once per session", () => {
    setStandalone(true);
    run();
    vi.advanceTimersByTime(SPLASH_DURATION_MS);
    run();
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(false);
  });

  it("never shows in a browser tab", () => {
    setStandalone(false);
    run();
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(false);
    expect(sessionStorage.getItem("pwa-splash-shown")).toBeNull();
  });
});
