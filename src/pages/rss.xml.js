import rss from "@astrojs/rss";
import config from "../settings/index.ts";
import { articlesSort } from "../utils/articles";

const articlesFiles = import.meta.glob("./articulos/*.mdx", { eager: true });
const articles = Object.values(articlesFiles).sort(articlesSort);

export function GET(context) {
  return rss({
    title: config.title,
    description: config.description,
    site: context.site,
    items: articles.map(({ frontmatter }) => {
      return {
        title: frontmatter.title,
        link: `${config.url}/articulos/${frontmatter.slug}`,
        pubDate: frontmatter.date,
        description: frontmatter.description,
        customData: `<author>${config.author.name}</author>`,
      };
    }),
    lastBuildDate: new Date().toISOString(),
    customData: `<language>es-ES</language>`,
  });
}
