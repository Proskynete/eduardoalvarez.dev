import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CONSENT_KEY,
  defaultConsent,
  forgetPreferencesUnlessAllowed,
  getConsent,
  isEurope,
  onConsentChange,
  OPEN_PREFERENCES_EVENT,
  openCookiePreferences,
  parseConsent,
  setConsent,
} from "../../../src/utils/consent";

const mockTimeZone = (timeZone: string | undefined) =>
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    timeZone,
  } as Intl.ResolvedDateTimeFormatOptions);

describe("isEurope", () => {
  afterEach(() => vi.restoreAllMocks());

  it.each([
    "Europe/Madrid",
    "Europe/London",
    "Europe/Zurich",
    "Atlantic/Canary",
    "Atlantic/Reykjavik",
    "Arctic/Longyearbyen",
  ])("treats %s as Europe", (timeZone) => expect(isEurope(timeZone)).toBe(true));

  it.each(["America/Santiago", "America/New_York", "Asia/Tokyo", "Atlantic/Bermuda", "Africa/Ceuta2"])(
    "treats %s as outside Europe",
    (timeZone) => expect(isEurope(timeZone)).toBe(false),
  );

  it("fails safe to Europe when the time zone cannot be read", () => {
    mockTimeZone(undefined);
    expect(isEurope()).toBe(true);
    vi.spyOn(Intl, "DateTimeFormat").mockImplementation(() => {
      throw new Error("no Intl");
    });
    expect(isEurope()).toBe(true);
  });

  it("reads the browser's time zone by default", () => {
    mockTimeZone("America/Santiago");
    expect(isEurope()).toBe(false);
  });
});

describe("parseConsent", () => {
  it("migrates the v1 strings", () => {
    expect(parseConsent("granted")).toEqual({ statistics: true, preferences: true });
    expect(parseConsent("all")).toEqual({ statistics: true, preferences: true });
    expect(parseConsent("denied")).toEqual({ statistics: false, preferences: true });
    expect(parseConsent("essential")).toEqual({ statistics: false, preferences: true });
  });

  it("reads v2 JSON", () => {
    expect(parseConsent(JSON.stringify({ v: 2, statistics: false, preferences: false, ts: 1 }))).toEqual({
      statistics: false,
      preferences: false,
    });
    expect(parseConsent(JSON.stringify({ v: 2, statistics: true, ts: 1 }))).toEqual({
      statistics: true,
      preferences: true,
    });
  });

  it("ignores anything else", () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent("maybe")).toBeNull();
    expect(parseConsent("null")).toBeNull();
    expect(parseConsent(JSON.stringify({ statistics: "yes" }))).toBeNull();
  });
});

describe("getConsent / setConsent", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("applies the region default without persisting it", () => {
    mockTimeZone("America/Santiago");
    expect(getConsent()).toEqual({ statistics: true, preferences: true, decided: false });
    mockTimeZone("Europe/Madrid");
    expect(getConsent()).toEqual({ statistics: false, preferences: true, decided: false });
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull();
  });

  it("defaults by region", () => {
    expect(defaultConsent(true)).toEqual({ statistics: false, preferences: true });
    expect(defaultConsent(false)).toEqual({ statistics: true, preferences: true });
  });

  it("migrates a stored v1 decision", () => {
    mockTimeZone("America/Santiago");
    localStorage.setItem(CONSENT_KEY, "denied");
    expect(getConsent()).toEqual({ statistics: false, preferences: true, decided: true });
  });

  it("persists only when the visitor acts, as v2 JSON, and notifies", () => {
    mockTimeZone("Europe/Madrid");
    const listener = vi.fn();
    const unsubscribe = onConsentChange(listener);

    const state = setConsent({ statistics: true });
    expect(state).toEqual({ statistics: true, preferences: true, decided: true });
    const stored = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "{}");
    expect(stored).toMatchObject({ v: 2, statistics: true, preferences: true });
    expect(typeof stored.ts).toBe("number");
    expect(listener).toHaveBeenCalledWith(state);

    unsubscribe();
    setConsent({ preferences: false });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(getConsent()).toEqual({ statistics: true, preferences: false, decided: true });
  });

  it("survives blocked storage", () => {
    mockTimeZone("Europe/Madrid");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(getConsent().decided).toBe(false);
    expect(() => setConsent({ statistics: true })).not.toThrow();
    expect(() => forgetPreferencesUnlessAllowed({ statistics: false, preferences: false })).not.toThrow();
  });
});

describe("forgetPreferencesUnlessAllowed", () => {
  afterEach(() => localStorage.clear());

  it("drops the stored theme only without consent for preferences", () => {
    localStorage.setItem("arrecife-theme", "light");
    forgetPreferencesUnlessAllowed({ statistics: false, preferences: true });
    expect(localStorage.getItem("arrecife-theme")).toBe("light");
    forgetPreferencesUnlessAllowed({ statistics: true, preferences: false });
    expect(localStorage.getItem("arrecife-theme")).toBeNull();
  });

  it("reads the current decision by default", () => {
    localStorage.setItem("arrecife-theme", "light");
    setConsent({ statistics: false, preferences: false });
    forgetPreferencesUnlessAllowed();
    expect(localStorage.getItem("arrecife-theme")).toBeNull();
  });
});

describe("openCookiePreferences", () => {
  it("asks the panel to open", () => {
    const listener = vi.fn();
    window.addEventListener(OPEN_PREFERENCES_EVENT, listener);
    openCookiePreferences();
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_PREFERENCES_EVENT, listener);
  });
});
