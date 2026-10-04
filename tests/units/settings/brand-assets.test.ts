import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { brandAssets, versioned } from "../../../src/settings/brand-assets";
import versions from "../../../src/settings/brand-asset-versions.json";
import manifest from "../../../src/settings/manifest-config";

const publicDir = resolve(__dirname, "../../../public");
const hashOf = (path: string) =>
  createHash("sha256")
    .update(readFileSync(resolve(publicDir, `.${path}`)))
    .digest("hex")
    .slice(0, 8);

describe("brandAssets", () => {
  it.each(Object.entries(brandAssets))("%s points at a file that exists in public/", (_, url) => {
    expect(existsSync(resolve(publicDir, `.${url.split("?")[0]}`))).toBe(true);
  });

  it.each(Object.entries(versions))("%s is versioned with the hash of its current content", (path, hash) => {
    // A PNG replaced without `npm run brand:assets` would keep the old URL,
    // and every cache that holds the old drawing would keep showing it.
    expect(hashOf(path)).toBe(hash);
  });

  it("the manifest only declares icons from brandAssets", () => {
    const declared = new Set<string>(Object.values(brandAssets));
    for (const icon of manifest.icons) expect(declared.has(icon.src)).toBe(true);
  });

  it("refuses a path the generators never versioned", () => {
    expect(() => versioned("/images/not-a-brand-file.png")).toThrow(/brand:assets/);
  });
});
