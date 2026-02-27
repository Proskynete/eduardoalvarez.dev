import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";
import webmanifest from "astro-webmanifest";
import serviceWorker from "astrojs-service-worker";
import { readdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { publishAlgoliaRSS } from "./src/scripts/algolia.ts";
import config from "./src/settings/manifest-config.ts";
import { validateEnvAtStartup } from "./src/utils/env.ts";

// Build a map of article slug → ISO date from MDX frontmatter for sitemap lastmod
const __dirname = dirname(fileURLToPath(import.meta.url));
const articlesDir = resolve(__dirname, "src/pages/articles");
const articleDates = {};
for (const file of readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"))) {
  const content = readFileSync(resolve(articlesDir, file), "utf-8");
  const dateMatch = content.match(/^date:\s*["']?(.+?)["']?\s*$/m);
  const slugMatch = content.match(/^slug:\s*["']?(.+?)["']?\s*$/m);
  if (dateMatch && slugMatch) {
    articleDates[`/articles/${slugMatch[1].trim()}`] = new Date(dateMatch[1].trim()).toISOString();
  }
}

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
  redirects: {
    "/now": "/",
    "/stack": "/",
    "/about": "/",
    "/working-with-me": "/",
    "/podcasts": "/",
  },
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
    sitemap({
      serialize(item) {
        const pathname = new URL(item.url).pathname.replace(/\/$/, "");
        const lastmod = articleDates[pathname];
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
    partytown(),
    webmanifest(config),
    publishAlgoliaRSS(),
    serviceWorker(),
  ],
});
