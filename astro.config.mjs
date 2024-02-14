import { defineConfig } from "astro/config";
import webmanifest from "astro-webmanifest";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { publishAlgoliaRSS } from "./src/scripts/algolia.ts";
import config from "./src/settings/manifest-config.ts";

import partytown from "@astrojs/partytown";

export default defineConfig({
  site: "https://eduardoalvarez.dev",
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "monokai",
    },
  },
  integrations: [
    mdx(),
    react(),
    tailwind(),
    sitemap(),
    partytown(),
    webmanifest(config),
    publishAlgoliaRSS(),
  ],
});
