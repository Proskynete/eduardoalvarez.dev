import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SPLASH_ATTRIBUTE,
  SPLASH_DURATION_MS,
  SPLASH_GROUND_PROPERTY,
  splashScript,
} from "../../../src/components/splash-screen/script";

const html = document.documentElement;
const GROUND = "#091319";
const run = () => new Function(splashScript({ ground: GROUND }))();

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
    html.style.removeProperty(SPLASH_GROUND_PROPERTY);
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

  it("hands <html> the launch image's ground, whatever the theme", () => {
    setStandalone(true);
    run();
    expect(html.style.getPropertyValue(SPLASH_GROUND_PROPERTY)).toBe(GROUND);
  });

  it("clears the mark once the sequence has finished", () => {
    setStandalone(true);
    run();
    vi.advanceTimersByTime(SPLASH_DURATION_MS);
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(false);
    expect(html.style.getPropertyValue(SPLASH_GROUND_PROPERTY)).toBe("");
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
