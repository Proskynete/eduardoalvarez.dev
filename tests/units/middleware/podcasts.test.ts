import { describe, expect, it } from "vitest";

import { PODCASTS_REDIRECT_STATUS, podcastsRedirect } from "../../../src/middleware/podcasts";

describe("podcastsRedirect", () => {
  describe("with the section switched off", () => {
    it.each(["/podcasts", "/podcasts/", "/podcasts/ia-en-desarrollo-web", "/podcasts/made-up-slug/"])(
      "sends %s home",
      (pathname) => {
        expect(podcastsRedirect(pathname, false)).toBe("/");
      },
    );

    it.each(["/", "/articles", "/podcastsfoo", "/articles/podcasts", "/images/podcasts/podcasts-cover.webp"])(
      "leaves %s alone",
      (pathname) => {
        expect(podcastsRedirect(pathname, false)).toBeNull();
      },
    );
  });

  it("redirects nothing once the section is switched on", () => {
    expect(podcastsRedirect("/podcasts", true)).toBeNull();
    expect(podcastsRedirect("/podcasts/ia-en-desarrollo-web", true)).toBeNull();
  });

  it("is temporary, so the section can come back", () => {
    expect(PODCASTS_REDIRECT_STATUS).toBe(302);
  });
});
