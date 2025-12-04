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
import { validateEnvAtStartup } from "./src/utils/env.ts";

// Validar variables de entorno en startup (fail-fast)
// Puede omitirse en desarrollo local con: SKIP_ENV_VALIDATION=true
if (process.env.SKIP_ENV_VALIDATION !== "true") {
  try {
    validateEnvAtStartup();
    console.log("✅ Variables de entorno validadas correctamente");
  } catch (error) {
    console.error("❌ Error en validación de environment:");
    console.error(error);
    console.error("\n💡 Tip: Para omitir en desarrollo local, usa: SKIP_ENV_VALIDATION=true");
    process.exit(1);
  }
} else {
  console.log("⚠️  Validación de environment omitida (SKIP_ENV_VALIDATION=true)");
}

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
  output: "static",
  // WORKAROUND: Vercel adapter comentado temporalmente debido a bug que causa hang en astro:build:start
  // El endpoint /api/subscribe.ts seguirá funcionando como serverless function en Vercel
  // Tracking issue: https://github.com/withastro/astro/issues
  // adapter: vercel({
  //   webAnalytics: {
  //     enabled: false,
  //   },
  // }),
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
