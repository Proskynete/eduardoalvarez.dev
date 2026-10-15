import { describe, expect, it } from "vitest";

import { environmentFromHost, environmentFromUrl, normaliseEnvironment } from "../../../src/utils/sentry-environment";

describe("sentry environment", () => {
  it("maps the production domains to production", () => {
    expect(environmentFromHost("eduardoalvarez.dev")).toBe("production");
    expect(environmentFromHost("www.eduardoalvarez.dev")).toBe("production");
  });

  it("maps local hosts to development", () => {
    expect(environmentFromHost("localhost")).toBe("development");
    expect(environmentFromHost("127.0.0.1")).toBe("development");
    expect(environmentFromHost(undefined)).toBe("development");
  });

  it("maps any other host, like a Vercel preview, to preview", () => {
    expect(environmentFromHost("website-git-develop-eduardoalvarez-dev.vercel.app")).toBe("preview");
  });

  it("reads the host from a URL", () => {
    expect(environmentFromUrl("https://eduardoalvarez.dev/api/sentry-test")).toBe("production");
    expect(environmentFromUrl("not a url")).toBeUndefined();
    expect(environmentFromUrl(undefined)).toBeUndefined();
  });

  it("only accepts Vercel's three values", () => {
    expect(normaliseEnvironment("production")).toBe("production");
    expect(normaliseEnvironment("preview")).toBe("preview");
    expect(normaliseEnvironment("")).toBeUndefined();
    expect(normaliseEnvironment(undefined)).toBeUndefined();
  });
});
