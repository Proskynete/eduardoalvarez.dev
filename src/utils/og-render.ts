import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { articleTemplate, OG } from "@eduardoalvarez/arrecife/og";
import satori from "satori";
import sharp from "sharp";

import { type ArticleOgData, inlineBrandImages, OG_ASSET_SCHEME } from "./og";

/*
 * Build time only: fonts and brand images are read from node_modules. Satori
 * does not read woff2, and the site's @fontsource-variable packages only ship
 * that, hence the static @fontsource packages (dev dependencies) and Geist's TTF.
 */
const modules = resolve(process.cwd(), "node_modules");
const read = (path: string): Buffer => readFileSync(resolve(modules, path));

let fonts: Parameters<typeof satori>[1]["fonts"] | undefined;
const loadFonts = () =>
  (fonts ??= [
    {
      name: "Bricolage Grotesque",
      data: read("@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff"),
      weight: 800,
      style: "normal",
    },
    { name: "Geist", data: read("geist/dist/fonts/geist-sans/Geist-Regular.ttf"), weight: 400, style: "normal" },
    { name: "Geist", data: read("geist/dist/fonts/geist-sans/Geist-Bold.ttf"), weight: 700, style: "normal" },
    {
      name: "JetBrains Mono",
      data: read("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff"),
      weight: 400,
      style: "normal",
    },
  ]);

const brandImages = new Map<string, string>();
const loadBrandImage = (file: string): string => {
  let uri = brandImages.get(file);
  if (!uri) {
    uri = `data:image/png;base64,${read(`@eduardoalvarez/arrecife/assets/brand/${file}`).toString("base64")}`;
    brandImages.set(file, uri);
  }
  return uri;
};

/** The fallback OG of an article: `articleTemplate` → SVG (Satori) → PNG (sharp). */
export const renderArticleOg = async (data: ArticleOgData): Promise<Buffer> => {
  const tree = inlineBrandImages(articleTemplate({ ...data, basePath: OG_ASSET_SCHEME }), loadBrandImage);
  // The template's tree is Satori's element shape, not a React element.
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: OG.width,
    height: OG.height,
    fonts: loadFonts(),
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
};
