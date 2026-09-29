import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { brandAssets } from "../../../src/settings/brand-assets";
import manifest from "../../../src/settings/manifest-config";

const publicDir = resolve(__dirname, "../../../public");

describe("brandAssets", () => {
  it.each(Object.entries(brandAssets))("%s points at a file that exists in public/", (_, path) => {
    expect(existsSync(resolve(publicDir, `.${path}`))).toBe(true);
  });

  it("the manifest only declares icons from brandAssets", () => {
    const declared = new Set<string>(Object.values(brandAssets));
    for (const icon of manifest.icons) expect(declared.has(icon.src)).toBe(true);
  });
});
