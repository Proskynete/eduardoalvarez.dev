import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SPLASH_ATTRIBUTE,
  SPLASH_FADE_MS,
  SPLASH_HOLD_MS,
  SPLASH_SHOWN_KEY,
  splashScript,
} from "../../../src/components/splash-screen/script";

const html = document.documentElement;
const IMAGE = "/images/manifest/startup/apple-splash-1206x2622.png?v=abc";
const run = () => new Function(splashScript({ ground: "#091319", images: { "402x874@3": IMAGE } }))();
const prop = (name: string) => html.style.getPropertyValue(`--pwa-splash-${name}`);

/** An iPhone 16 Pro: 402×874 screen, the page 62 px shorter under the status bar. */
function iPhone({ standalone = true, width = 402, height = 874, innerWidth = 402, innerHeight = 812, ratio = 3 } = {}) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({ matches: standalone && query.includes("standalone") })),
  );
  vi.stubGlobal("screen", { width, height });
  vi.stubGlobal("innerWidth", innerWidth);
  vi.stubGlobal("innerHeight", innerHeight);
  vi.stubGlobal("devicePixelRatio", ratio);
}

describe("splashScript", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    html.removeAttribute(SPLASH_ATTRIBUTE);
    html.removeAttribute("style");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("puts the device's launch image on <html> before the first paint", () => {
    iPhone();
    run();
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(true);
    expect(prop("image")).toBe(`url("${IMAGE}")`);
    expect(prop("ground")).toBe("#091319");
  });

  it("draws it at screen size, lifted by what the status bar takes", () => {
    iPhone();
    run();
    expect(prop("width")).toBe("402px");
    expect(prop("height")).toBe("874px");
    expect(prop("offset")).toBe("62px");
  });

  it("hands the CSS how long to hold and fade", () => {
    iPhone();
    run();
    expect(prop("hold")).toBe(`${SPLASH_HOLD_MS}ms`);
    expect(prop("fade")).toBe(`${SPLASH_FADE_MS}ms`);
  });

  it("holds, fades, then clears everything", () => {
    iPhone();
    run();
    vi.advanceTimersByTime(SPLASH_HOLD_MS + SPLASH_FADE_MS - 1);
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(true);
    vi.advanceTimersByTime(1);
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(false);
    expect(html.getAttribute("style") ?? "").toBe("");
  });

  it("shows once per session", () => {
    iPhone();
    run();
    vi.advanceTimersByTime(SPLASH_HOLD_MS + SPLASH_FADE_MS);
    run();
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(false);
  });

  it("does nothing where iOS has no launch image for the device", () => {
    iPhone({ width: 412, height: 915, innerWidth: 412, innerHeight: 860, ratio: 2.625 });
    run();
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(false);
    expect(sessionStorage.getItem(SPLASH_SHOWN_KEY)).toBeNull();
  });

  it("does nothing in landscape, where iOS shows no launch image", () => {
    iPhone({ innerWidth: 874, innerHeight: 402 });
    run();
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(false);
  });

  it("never shows in a browser tab", () => {
    iPhone({ standalone: false });
    run();
    expect(html.hasAttribute(SPLASH_ATTRIBUTE)).toBe(false);
    expect(sessionStorage.getItem(SPLASH_SHOWN_KEY)).toBeNull();
  });
});
