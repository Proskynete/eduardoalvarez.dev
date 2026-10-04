import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SPLASH_ATTRIBUTE,
  SPLASH_DURATION_MS,
  SPLASH_GROUND_PROPERTY,
  SPLASH_OFFSET_PROPERTY,
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
    html.style.removeProperty(SPLASH_OFFSET_PROPERTY);
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

  it("measures what the iOS status bar takes from the viewport", () => {
    // The launch image centres on the screen; the page starts below the status bar.
    setStandalone(true);
    vi.stubGlobal("navigator", { ...navigator, standalone: true });
    vi.stubGlobal("screen", { height: 874 });
    vi.stubGlobal("innerHeight", 812);
    run();
    expect(html.style.getPropertyValue(SPLASH_OFFSET_PROPERTY)).toBe("62px");
  });

  it("leaves the offset at zero outside iOS", () => {
    setStandalone(true);
    vi.stubGlobal("screen", { height: 915 });
    vi.stubGlobal("innerHeight", 830);
    run();
    expect(html.style.getPropertyValue(SPLASH_OFFSET_PROPERTY)).toBe("0px");
  });

  it("clears the mark once the sequence has finished", () => {
    setStandalone(true);
    run();
    vi.advanceTimersByTime(SPLASH_DURATION_MS);
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(false);
    expect(html.style.getPropertyValue(SPLASH_GROUND_PROPERTY)).toBe("");
    expect(html.style.getPropertyValue(SPLASH_OFFSET_PROPERTY)).toBe("");
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
