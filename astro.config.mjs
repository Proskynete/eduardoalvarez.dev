import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";
import webmanifest from "astro-webmanifest";
import serviceWorker from "astrojs-service-worker";

import { publishAlgoliaRSS } from "./src/scripts/algolia.ts";
import config from "./src/settings/manifest-config.ts";

// NOTA: La validación de variables de entorno está disponible en src/utils/env.ts
// Se valida en tiempo de ejecución cuando se usan las variables, no en build time
// Esto permite builds locales sin todas las variables configuradas

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
  integrations: [
    mdx(),
    react(),
    tailwind(),
    sitemap(),
    partytown(),
    webmanifest(config),
    publishAlgoliaRSS(),
    serviceWorker(),
  ],
});
