import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import webmanifest from "astro-webmanifest";

import { publishAlgoliaRSS } from "./src/scripts/algolia.ts";
import config from "./src/settings/manifest-config.ts";

export default defineConfig({
  site: "https://eduardoalvarez.dev",
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "monokai",
    },
  },
  integrations: [mdx(), react(), tailwind(), sitemap(), partytown(), webmanifest(config), publishAlgoliaRSS()],
});
