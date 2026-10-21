import { createHash } from "node:crypto";

/**
 * Open Graph image of an article (openspec: og-images).
 *
 * The cover the content manager draws and commits (`seo_image`) is the source
 * of truth. The PNG generated from arrecife's `articleTemplate` is only the
 * fallback, for an article whose cover is missing.
 */

/** What `articleTemplate` draws. Anything here that changes must change the URL. */
export interface ArticleOgData {
  title: string;
  category?: string;
  readingMinutes?: number;
}

/** Where the generated PNG of an article is served. */
export const ogArticlePath = (slug: string): string => `/og/articles/${slug}.png`;

/**
 * Short hash of what the template draws plus the arrecife version. LinkedIn and
 * X cache previews by URL: a new title, or a library that redraws the card,
 * gives a new URL and they fetch it again. Nothing changed, same URL.
 */
export const ogHash = (data: ArticleOgData, arrecifeVersion: string): string =>
  createHash("sha256")
    .update(JSON.stringify([data.title, data.category ?? "", data.readingMinutes ?? 0, arrecifeVersion]))
    .digest("hex")
    .slice(0, 10);

export const generatedOgUrl = (slug: string, data: ArticleOgData, arrecifeVersion: string): string =>
  `${ogArticlePath(slug)}?v=${ogHash(data, arrecifeVersion)}`;

/**
 * The cover wins. The generated image takes over when there is no `seo_image`,
 * or when it is a local path whose file is not in `public/` (the PR did not
 * bring it). An absolute URL — the Blob URL the content manager leaves when it
 * could not download the cover — is kept: it cannot be checked without network.
 */
export const resolveOgImage = (
  seoImage: string | undefined,
  generatedUrl: string,
  coverExists: (publicPath: string) => boolean,
): string => {
  if (!seoImage) return generatedUrl;
  if (!seoImage.startsWith("/")) return seoImage;
  return coverExists(seoImage.split("?")[0]) ? seoImage : generatedUrl;
};

/**
 * The resolved OG image of every article, by slug. Computed once at build time
 * by astro.config.mjs and inlined as `__OG_IMAGES__`: articles render on demand
 * in a function that has no `public/` on its disk to check covers against.
 */
export const ogImageFor = (
  article: { slug: string; seo_image?: string },
  images: Record<string, string> = __OG_IMAGES__,
): string => images[article.slug] ?? article.seo_image ?? ogArticlePath(article.slug);

export const isGeneratedOgImage = (image: string): boolean => image.startsWith("/og/");

/** The tree Satori paints, as arrecife's templates build it. */
export interface OgNode {
  type: string;
  props: Record<string, unknown> & { children?: unknown };
}

/** The `basePath` the templates get, so their images can be found and inlined. */
export const OG_ASSET_SCHEME = "arrecife:";

/**
 * Swaps every `arrecife:/<file>` image for a `data:` URI. Satori fetches
 * `<img>` sources, and at build time there is no server to fetch them from.
 */
export const inlineBrandImages = <T>(node: T, load: (file: string) => string): T => {
  if (Array.isArray(node)) return node.map((child: unknown) => inlineBrandImages(child, load)) as T;
  if (!node || typeof node !== "object" || !("props" in node)) return node;

  const { props } = node as unknown as OgNode;
  const prefix = `${OG_ASSET_SCHEME}/`;
  const src = typeof props.src === "string" && props.src.startsWith(prefix) ? load(props.src.slice(prefix.length)) : props.src;

  return {
    ...node,
    props: {
      ...props,
      ...(src === undefined ? {} : { src }),
      ...(props.children === undefined ? {} : { children: inlineBrandImages(props.children, load) }),
    },
  } as T;
};
