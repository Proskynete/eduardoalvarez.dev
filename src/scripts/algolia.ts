import "dotenv/config";

import algoliasearch from "algoliasearch";
import type { AstroIntegration } from "astro";
import { readFileSync } from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import kleur from "kleur";

import config from "../settings/index.ts";

const log = console.log;

export const publishAlgoliaRSS = () => {
  const hooks = [
    `astro:config:setup`,
    `astro:config:done`,
    `astro:server:setup`,
    `astro:server:start`,
    `astro:server:done`,
    `astro:build:start`,
    `astro:build:setup`,
    `astro:build:generated`,
    `astro:build:ssr`,
    `astro:build:done`,
  ] as const;

  const integration: AstroIntegration = {
    name: "astro-integration-publish-algolia-rss-posts",
    hooks: {
      [hooks[7]]: async () => {
        if (
          process.env.ALGOLIA_APPLICATION_ID === undefined ||
          process.env.ALGOLIA_ADMIN_API_KEY === undefined ||
          process.env.ALGOLIA_INDEX_NAME === undefined
        ) {
          log(`${kleur.red("publishAlgoliaRSS: ")} Missing Algolia config.\n`);
          return;
        }

        try {
          const articles = await glob("src/pages/articulos/**/*.mdx");
          const posts = articles.map((article) => {
            const fileContent = readFileSync(article, "utf-8");
            const { data } = matter(fileContent);
            const slug = article.replace("src/pages/articulos/", "").replace(".mdx", "");

            return {
              objectID: `${config.url}/articulos/${slug}`,
              title: data.title,
              description: data.description,
              pubDate: new Date(data.date).getTime(),
              link: `${config.url}/articulos/${slug}`,
              guid: `${config.url}/articulos/${slug}`,
              author: config.author.name,
            };
          });

          const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
          const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
          await index.saveObjects(posts);
          log(`${kleur.green("publishAlgoliaRSS: ")} Sent posts to Algolia... 🚀\n`);
        } catch (err) {
          log(`${kleur.red("publishAlgoliaRSS: ")} ${err}.\n`);
        }
      },
    },
  };

  return integration;
};
