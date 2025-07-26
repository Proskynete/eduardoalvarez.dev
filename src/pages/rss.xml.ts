import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import config from "../settings/index.ts";
import { articlesSort } from "../utils/articles.ts";

const articlesFiles = import.meta.glob("./articulos/*.mdx", { eager: true });
const articles = Object.values(articlesFiles).sort(articlesSort);

export async function GET(context: APIContext) {
  return rss({
    stylesheet: "/rss/styles.xsl",
    title: config.title,
    description: config.description,
    site: context.site?.toString() || config.url,
    items: articles.map(({ frontmatter }) => {
      return {
        title: frontmatter.title,
        link: `${config.url}/articulos/${frontmatter.slug}`,
        pubDate: frontmatter.date,
        description: frontmatter.description,
        customData: `<author>${config.author.name}</author>`,
      };
    }),
    customData: `<language>es-ES</language>`,
  });
}
