import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  generatedOgUrl,
  inlineBrandImages,
  isGeneratedOgImage,
  ogArticlePath,
  ogHash,
  ogImageFor,
  resolveOgImage,
} from "../../../src/utils/og";
import { readArticleOg } from "../../../src/utils/og-index";

const data = { title: "Entender antes de construir", category: "Ingeniería AI-Native", readingMinutes: 7 };
const generated = generatedOgUrl("entender", data, "0.13.0");

describe("og utils", () => {
  describe("ogHash", () => {
    it("is stable for the same input", () => {
      expect(ogHash(data, "0.13.0")).toBe(ogHash({ ...data }, "0.13.0"));
    });

    it("changes with the title, the category, the minutes or the arrecife version", () => {
      const base = ogHash(data, "0.13.0");
      expect(ogHash({ ...data, title: "Otro título" }, "0.13.0")).not.toBe(base);
      expect(ogHash({ ...data, category: "Platform Engineering" }, "0.13.0")).not.toBe(base);
      expect(ogHash({ ...data, readingMinutes: 8 }, "0.13.0")).not.toBe(base);
      expect(ogHash(data, "0.14.0")).not.toBe(base);
    });
  });

  describe("generatedOgUrl", () => {
    it("points at the article's PNG with a version", () => {
      expect(generated).toMatch(/^\/og\/articles\/entender\.png\?v=[0-9a-f]{10}$/);
    });
  });

  describe("resolveOgImage", () => {
    const cover = "/images/articles/entender/entender.webp";

    it("keeps the cover when its file exists", () => {
      expect(resolveOgImage(cover, generated, () => true)).toBe(cover);
    });

    it("falls back to the generated image without seo_image", () => {
      expect(resolveOgImage(undefined, generated, () => true)).toBe(generated);
    });

    it("falls back when the local cover file is missing", () => {
      expect(resolveOgImage(cover, generated, () => false)).toBe(generated);
    });

    it("checks the file without the query string", () => {
      const seen: string[] = [];
      resolveOgImage(`${cover}?v=2`, generated, (path) => (seen.push(path), true));
      expect(seen).toEqual([cover]);
    });

    it("keeps an absolute URL as is", () => {
      const blob = "https://blob.example.com/articles/entender/entender.webp";
      expect(resolveOgImage(blob, generated, () => false)).toBe(blob);
    });
  });

  describe("ogImageFor", () => {
    it("reads the image resolved at build time", () => {
      expect(ogImageFor({ slug: "entender" }, { entender: generated })).toBe(generated);
    });

    it("falls back to seo_image, then to the generated path, for an unknown slug", () => {
      expect(ogImageFor({ slug: "otro", seo_image: "/x.webp" }, {})).toBe("/x.webp");
      expect(ogImageFor({ slug: "otro" }, {})).toBe(ogArticlePath("otro"));
    });

    it("defaults to the inlined __OG_IMAGES__", () => {
      expect(ogImageFor({ slug: "otro" })).toBe(ogArticlePath("otro"));
    });
  });

  describe("isGeneratedOgImage", () => {
    it("tells the generated fallback from a cover", () => {
      expect(isGeneratedOgImage(generated)).toBe(true);
      expect(isGeneratedOgImage("/images/articles/a/a.webp")).toBe(false);
    });
  });

  describe("inlineBrandImages", () => {
    it("swaps arrecife:/ sources for what the loader returns, at any depth", () => {
      const tree = {
        type: "div",
        props: {
          children: [
            { type: "img", props: { src: "arrecife:/fin-foam.png" } },
            { type: "div", props: { children: { type: "img", props: { src: "arrecife:/face-hearts.png" } } } },
            "texto",
            null,
          ],
        },
      };

      const out = inlineBrandImages(tree, (file) => `data:${file}`);

      expect(out.props.children[0]).toEqual({ type: "img", props: { src: "data:fin-foam.png" } });
      expect(out.props.children[1]).toEqual({
        type: "div",
        props: { children: { type: "img", props: { src: "data:face-hearts.png" } } },
      });
      expect(out.props.children.slice(2)).toEqual(["texto", null]);
    });

    it("leaves other sources alone", () => {
      const tree = { type: "img", props: { src: "https://example.com/a.png" } };
      expect(inlineBrandImages(tree, () => "nope")).toEqual(tree);
    });
  });
});

describe("readArticleOg", () => {
  let root: string;

  const article = (slug: string, extra = "") =>
    `---\ntitle: "Título de ${slug}"\nslug: "${slug}"\ncategories: ["ai-native-engineering"]\n${extra}---\n\n${Array(450).fill("palabra").join(" ")}\n`;

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), "og-index-"));
    mkdirSync(join(root, "src/pages/articles"), { recursive: true });
    mkdirSync(join(root, "public/images/articles/con-portada"), { recursive: true });
    writeFileSync(join(root, "public/images/articles/con-portada/con-portada.webp"), "");
    writeFileSync(
      join(root, "src/pages/articles/con-portada.mdx"),
      article("con-portada", 'seo_image: "/images/articles/con-portada/con-portada.webp"\n'),
    );
    writeFileSync(
      join(root, "src/pages/articles/portada-rota.mdx"),
      article("portada-rota", 'seo_image: "/images/articles/portada-rota/portada-rota.webp"\n'),
    );
    writeFileSync(join(root, "src/pages/articles/sin-portada.mdx"), article("sin-portada"));
    writeFileSync(join(root, "src/pages/articles/notas.md"), "no es un artículo");
  });

  afterAll(() => rmSync(root, { recursive: true, force: true }));

  it("reads the template data from the frontmatter and the body", () => {
    const [first] = readArticleOg(root, "0.13.0");
    expect(first.data).toEqual({ title: "Título de con-portada", category: "Ingeniería AI-Native", readingMinutes: 3 });
  });

  it("keeps the cover that exists and falls back for the rest", () => {
    const bySlug = Object.fromEntries(readArticleOg(root, "0.13.0").map((a) => [a.slug, a]));

    expect(Object.keys(bySlug)).toEqual(["con-portada", "portada-rota", "sin-portada"]);
    expect(bySlug["con-portada"].image).toBe("/images/articles/con-portada/con-portada.webp");
    expect(bySlug["portada-rota"].image).toBe(bySlug["portada-rota"].generated);
    expect(bySlug["sin-portada"].image).toBe(bySlug["sin-portada"].generated);
  });

  it("reads the installed arrecife version by default", () => {
    const [first] = readArticleOg(process.cwd());
    expect(first.generated).toMatch(/\?v=[0-9a-f]{10}$/);
  });
});
