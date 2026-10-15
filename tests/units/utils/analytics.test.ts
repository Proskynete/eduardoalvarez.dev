import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { trackEvent, trackNavigation } from "../../../src/utils/analytics";

type TestWindow = Window & { analyticsLoaded?: boolean; gtag?: ReturnType<typeof vi.fn> };

describe("analytics", () => {
  const w = window as TestWindow;

  beforeEach(() => {
    w.gtag = vi.fn();
  });

  afterEach(() => {
    delete w.gtag;
    delete w.analyticsLoaded;
  });

  it("drops events until GA has been loaded with consent", () => {
    trackEvent("sign_up", { method: "newsletter" });
    expect(w.gtag).not.toHaveBeenCalled();
  });

  it("sends events once GA is loaded", () => {
    w.analyticsLoaded = true;
    trackEvent("sign_up", { method: "newsletter" });
    expect(w.gtag).toHaveBeenCalledWith("event", "sign_up", { method: "newsletter" });
  });

  it("is a no-op without gtag", () => {
    w.analyticsLoaded = true;
    delete w.gtag;
    expect(() => trackEvent("share")).not.toThrow();
  });

  it("marks clicks to the courses site as select_content", () => {
    w.analyticsLoaded = true;
    trackNavigation({ name: "Cursos", href: "https://cursos.eduardoalvarez.dev" }, "header");
    expect(w.gtag).toHaveBeenCalledWith("event", "navigation_click", { link: "Cursos" });
    expect(w.gtag).toHaveBeenCalledWith("event", "select_content", {
      content_type: "course_link",
      item_id: "cursos",
      location: "header",
    });
  });

  it("sends only navigation_click for internal links", () => {
    w.analyticsLoaded = true;
    trackNavigation({ name: "Artículos", href: "/articles" }, "mobile_menu");
    expect(w.gtag).toHaveBeenCalledTimes(1);
  });
});
