import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import matter from "gray-matter";

import type { CategoryAllowed } from "../interfaces";
import { CategoryMap } from "./categories";
import { type ArticleOgData, generatedOgUrl, resolveOgImage } from "./og";
import { calculateReadingTime } from "./reading-time";

export interface ArticleOg {
  slug: string;
  data: ArticleOgData;
  /** The fallback PNG, with its `?v=`. */
  generated: string;
  /** The OG image the article uses: its cover, or the fallback. */
  image: string;
}

/** The installed arrecife version: part of the generated URL's hash. */
export const arrecifeVersion = (root: string): string =>
  (JSON.parse(readFileSync(resolve(root, "node_modules/@eduardoalvarez/arrecife/package.json"), "utf-8")) as {
    version: string;
  }).version;

/**
 * Reads every article's frontmatter and resolves its OG image. Build time only:
 * it reads `src/pages/articles/*.mdx` and checks covers in `public/`.
 *
 * Reading minutes come from the raw MDX body, not the rendered HTML the page
 * counts, so they may differ by a minute: accepted (design, decision 8).
 */
export const readArticleOg = (root: string, version = arrecifeVersion(root)): ArticleOg[] => {
  const articlesDir = resolve(root, "src/pages/articles");
  const publicDir = resolve(root, "public");

  return readdirSync(articlesDir)
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .map((file) => {
      const { data: frontmatter, content } = matter(readFileSync(join(articlesDir, file), "utf-8"));
      const slug = String(frontmatter.slug);
      const firstCategory = (frontmatter.categories as CategoryAllowed[] | undefined)?.[0];
      const data: ArticleOgData = {
        title: String(frontmatter.title),
        category: firstCategory ? (CategoryMap.get(firstCategory) ?? firstCategory) : undefined,
        readingMinutes: calculateReadingTime(content.trim()),
      };
      const generated = generatedOgUrl(slug, data, version);
      const seoImage = typeof frontmatter.seo_image === "string" ? frontmatter.seo_image : undefined;

      return {
        slug,
        data,
        generated,
        image: resolveOgImage(seoImage, generated, (path) => existsSync(join(publicDir, path))),
      };
    });
};
