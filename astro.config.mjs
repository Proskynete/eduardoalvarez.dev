import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import sentry from "@sentry/astro";
import { defineConfig } from "astro/config";
import webmanifest from "astro-webmanifest";
import serviceWorker from "astrojs-service-worker";

import { publishAlgoliaRSS } from "./src/scripts/algolia.ts";
import config from "./src/settings/manifest-config.ts";
import { arrecife } from "@eduardoalvarez/arrecife/shiki";
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
  // Tailwind v4 installs as a Vite plugin. It replaces the postcss.config.mjs
  // that v3 used: the PostCSS pipeline is no longer involved.
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      /*
       * Bundle these into the server build instead of loading them from
       * node_modules at runtime. Left external, the first request to any
       * on-demand page loaded 6,642 ES modules: 4,541 of them are Phosphor's,
       * one file per icon, and 826 are date-fns, pulled in through the
       * library's date picker. That took ~2 s on a laptop and more than the
       * function's 15 s limit on a Vercel cold start, so every article, the RSS
       * feed and the API answered 504 on the develop previews. Bundled, Vite
       * tree-shakes them down to what is used: ~1,100 modules, ~0.25 s, and the
       * function goes from 9,331 files (99 MB) to 2,790 (64 MB). The rendered
       * HTML is unchanged.
       */
      noExternal: ["@phosphor-icons/react", "@eduardoalvarez/arrecife", "react-day-picker", "date-fns"],
    },
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
      theme: arrecife,
    },
  },
  integrations: [
    // Sentry primero para instrumentar el resto del pipeline. La subida de
    // source maps solo ocurre si hay SENTRY_AUTH_TOKEN (configurado en Vercel).
    sentry({
      sourceMapsUploadOptions: {
        org: "eduardoalvarezdev",
        project: "blog-eduardoalvarez",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    mdx(),
    react(),
    sitemap({
      filter(page) {
        const pathname = new URL(page).pathname;
        // `/podcasts` sale del sitemap mientras `podcastsEnabled` esté en
        // `false` (ver `src/settings/podcasts.ts`): sus rutas redirigen a `/`, y
        // anunciar una puerta cerrada es pedirle a Google que la empuje. La
        // condición se va cuando se encienda la sección.
        return (
          !pathname.startsWith("/resources") &&
          !pathname.startsWith("/cdn-cgi") &&
          !pathname.startsWith("/podcasts") &&
          !pathname.startsWith("/offline")
        );
      },
      serialize(item) {
        const url = new URL(item.url);
        const pathname = url.pathname.replace(/\/$/, "");
        // One URL per page: the sitemap lists the same form as the canonical,
        // the RSS feed and the JSON-LD, which is without the trailing slash.
        item.url = pathname ? `${url.origin}${pathname}` : `${url.origin}/`;
        const lastmod = articleDates[pathname];
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
    partytown({
      // Reenvía gtag/dataLayer al worker para poder emitir eventos custom de
      // GA4 desde el hilo principal (ver src/utils/analytics.ts).
      config: { forward: ["dataLayer.push", "gtag"] },
    }),
    webmanifest(config),
    publishAlgoliaRSS(),
    serviceWorker({
      workbox: {
        /*
         * Precache only what every visit needs. The default, every file in the build, took 87
         * files, ~6.6 MB, on the first visit: every article image, the brand
         * illustrations, the fonts and Partytown's own service worker, even for
         * someone who reads one article. Images now cache as they are seen, and
         * the pages as they are opened.
         */
        globPatterns: [
          "_astro/*.{js,css}",
          "fonts/*.woff2",
          "images/favicon/*",
          "images/manifest/*.png", // not startup/: iOS fetches those itself, at install
          "favicon.ico",
          "manifest.webmanifest",
          // The prerendered pages: home, listings, about, newsletter, 404, offline.
          "index.html",
          "*/index.html",
          "404.html",
          // The faces the 404 and the offline page draw, so they draw offline.
          "brand/face-confused.png",
          "brand/face-waiting.png",
          // The fin, for the splash and the header when the app opens offline.
          "brand/fin-foam.png",
          "brand/fin.png",
        ],
        runtimeCaching: [
          {
            /*
             * Pages: network first, so a new article or a fix is never hidden
             * behind the cache, and the copy stays for when there is no network.
             * The second half catches the ClientRouter, which fetches the next
             * page with `fetch()` instead of navigating.
             */
            urlPattern: ({ request, url, sameOrigin }) =>
              request.mode === "navigate" ||
              (sameOrigin &&
                request.destination === "" &&
                !url.pathname.startsWith("/api/") &&
                !url.pathname.includes(".")),
            handler: "NetworkFirst",
            options: {
              cacheName: "pages",
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 40 },
              // A page never opened, with no network: `src/pages/offline.astro`.
              precacheFallback: { fallbackURL: "/offline/index.html" },
            },
          },
          {
            urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
