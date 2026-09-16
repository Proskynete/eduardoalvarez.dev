import "dotenv/config";

import { algoliasearch } from "algoliasearch";
import type { AstroIntegration } from "astro";
import { readFileSync } from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import kleur from "kleur";

import config from "../settings/index.ts";

/**
 * El indexado en Algolia solo debe ocurrir en el deploy de producción (rama `main`).
 *
 * Vercel construye cada MR como Preview Deployment, y hasta ahora ese build
 * también escribía en el índice: artículos de prueba que nunca llegaron a
 * producción terminaban siendo buscables. `VERCEL_ENV` vale `production`
 * únicamente en el build de la rama de producción, así que es la señal correcta.
 *
 * Escape hatch: `ALGOLIA_FORCE_INDEX=true` fuerza el push (reindexado manual
 * desde local sin tener que tocar este archivo).
 */
const shouldPublishToAlgolia = (): { publish: boolean; reason: string } => {
  if (process.env.ALGOLIA_FORCE_INDEX === "true") {
    return { publish: true, reason: "ALGOLIA_FORCE_INDEX=true" };
  }

  if (process.env.VERCEL !== "1") {
    return { publish: false, reason: "build local (usa ALGOLIA_FORCE_INDEX=true para forzarlo)" };
  }

  if (process.env.VERCEL_ENV !== "production") {
    const ref = process.env.VERCEL_GIT_COMMIT_REF ?? "desconocida";
    return { publish: false, reason: `deploy ${process.env.VERCEL_ENV ?? "preview"} (rama ${ref})` };
  }

  return { publish: true, reason: "deploy de producción" };
};

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
        const { publish, reason } = shouldPublishToAlgolia();

        if (!publish) {
          console.log(`${kleur.yellow("publishAlgoliaRSS: ")} Indexado omitido — ${reason}.\n`);
          return;
        }

        const appId = process.env.PUBLIC_ALGOLIA_APPLICATION_ID;
        const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
        const indexName = process.env.PUBLIC_ALGOLIA_INDEX_NAME;

        if (appId === undefined || adminKey === undefined || indexName === undefined) {
          console.log(`${kleur.red("publishAlgoliaRSS: ")} Missing Algolia config.\n`);
          return;
        }

        try {
          const articles = await glob("src/pages/articles/**/*.mdx");
          const objects = articles.map((article) => {
            const fileContent = readFileSync(article, "utf-8");
            const { data } = matter(fileContent);

            return {
              objectID: `${config.url}/articles/${data.slug}`,
              title: data.title,
              description: data.excerpt,
              pubDate: new Date(data.date).toISOString(),
              link: `${config.url}/articles/${data.slug}`,
              guid: `${config.url}/articles/${data.slug}`,
              slug: data.slug,
              author: config.author.name,
              image: data.image || `${config.url}/${data.seo_image}`,
            };
          });

          const client = algoliasearch(appId, adminKey);
          // `replaceAllObjects` (y no `saveObjects`) para que el índice sea un espejo
          // exacto de los MDX de `main`: lo que se borra del repo desaparece de la
          // búsqueda, incluidos los artículos de prueba que quedaron de builds viejos.
          await client.replaceAllObjects({ indexName, objects });
          console.log(
            `${kleur.green("publishAlgoliaRSS: ")} ${objects.length} artículos enviados a Algolia (${reason})... 🚀\n`,
          );
        } catch (err) {
          console.log(`${kleur.red("publishAlgoliaRSS: ")} ${err}.\n`);
        }
      },
    },
  };

  return integration;
};
