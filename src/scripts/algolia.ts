import "dotenv/config";
import type { AstroIntegration } from "astro";
import fs from "node:fs";
import kleur from "kleur";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import algoliasearch from "algoliasearch";

interface PostRSS {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
  description: string;
  author?: string;
}

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

  let integration: AstroIntegration = {
    name: "astro-integration-publish-algolia-rss-posts",
    hooks: {
      [hooks[7]]: async (args) => {
        if (
          process.env.ALGOLIA_APPLICATION_ID === undefined ||
          process.env.ALGOLIA_ADMIN_API_KEY === undefined ||
          process.env.ALGOLIA_INDEX_NAME === undefined
        ) {
          console.log(
            `${kleur.red("publishAlgoliaRSS: ")} Missing Algolia config.\n`
          );
          return;
        }

        try {
          const rss = await fs.promises.readFile(
            path.resolve(args.dir.pathname, "./rss.xml"),
            "utf8"
          );

          if (rss === undefined) {
            console.log(
              `${kleur.red("publishAlgoliaRSS: ")} Missing RSS file.\n`
            );
            return;
          }

          const options = {};
          const parser = new XMLParser(options);
          const json = parser.parse(rss);

          const client = algoliasearch(
            process.env.ALGOLIA_APPLICATION_ID,
            process.env.ALGOLIA_ADMIN_API_KEY
          );
          const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

          const posts = json.rss.channel.item.map((post: PostRSS) => ({
            ...post,
            objectID: post.guid,
          }));

          await index.saveObjects(posts);

          console.log(
            `${kleur.green(
              "publishAlgoliaRSS: "
            )} Sended posts to Algolia... 🚀\n`
          );
        } catch (err) {
          console.log(`${kleur.red("publishAlgoliaRSS: ")} ${err}.\n`);
        }
      },
    },
  };

  return integration;
};
