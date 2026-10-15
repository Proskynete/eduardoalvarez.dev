import { afterEach, describe, expect, it, vi } from "vitest";

import { CONSENT_KEY, readConsent, writeConsent } from "../../../src/utils/consent";

describe("consent", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("has no decision by default", () => {
    expect(readConsent()).toBeNull();
  });

  it("stores and reads the decision", () => {
    writeConsent("granted");
    expect(localStorage.getItem(CONSENT_KEY)).toBe("granted");
    expect(readConsent()).toBe("granted");
    writeConsent("denied");
    expect(readConsent()).toBe("denied");
  });

  it("ignores unknown values", () => {
    localStorage.setItem(CONSENT_KEY, "maybe");
    expect(readConsent()).toBeNull();
  });

  it("survives blocked storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readConsent()).toBeNull();
    expect(() => writeConsent("granted")).not.toThrow();
  });
});
