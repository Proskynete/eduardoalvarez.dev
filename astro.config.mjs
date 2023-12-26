import { defineConfig } from "astro/config";
import webmanifest from "astro-webmanifest";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { publishAlgoliaRSS } from "./src/scripts/algolia.ts";
import config from "./src/settings";

// https://astro.build/config
export default defineConfig({
  site: "https://eduardoalvarez.dev",
  output: "server",
  adapter: vercel(),
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "one-dark-pro",
      langs: ["javascript", "typescript", "bash", "json", "css", "html"],
      wrap: true,
    },
  },
  integrations: [
    mdx(),
    react(),
    tailwind(),
    sitemap(),
    webmanifest({
      name: `Blog de ${config.author.name}`,
      short_name: `Blog de ${config.author.name}`,
      icon: "./public/images/manifest/512x512.png",
      icons: [
        {
          src: "./public/images/manifest/72x72.png",
          type: "image/png",
          sizes: "72x72",
        },
        {
          src: "./public/images/manifest/96x96.png",
          type: "image/png",
          sizes: "96x96",
        },
        {
          src: "./public/images/manifest/128x128.png",
          type: "image/png",
          sizes: "128x128",
        },
        {
          src: "./public/images/manifest/144x144.png",
          type: "image/png",
          sizes: "144x144",
        },
        {
          src: "./public/images/manifest/152x152.png",
          type: "image/png",
          sizes: "152x152",
        },
        {
          src: "./public/images/manifest/192x192.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          src: "./public/images/manifest/384x384.png",
          type: "image/png",
          sizes: "384x384",
        },
        {
          src: "./public/images/manifest/512x512.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
      description: config.description,
      start_url: "/",
      background_color: "#FFFFFF",
      theme_color: "#0A3F66",
      display: "standalone",
    }),
    publishAlgoliaRSS(),
  ],
});
