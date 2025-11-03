import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";
import webmanifest from "astro-webmanifest";
import serviceWorker from "astrojs-service-worker";

import config from "./src/settings/manifest-config.ts";

export default defineConfig({
  site: "https://eduardoalvarez.dev",
  build: {
    inlineStylesheets: "always",
  },
  compressHTML: true,
  prefetch: true,
  devToolbar: {
    enabled: false,
  },
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "monokai",
    },
  },
  integrations: [mdx(), react(), tailwind(), sitemap(), partytown(), webmanifest(config), serviceWorker()],
});
