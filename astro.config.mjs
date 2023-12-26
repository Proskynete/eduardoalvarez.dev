import { defineConfig } from "astro/config";
import webmanifest from "astro-webmanifest";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import config from "./src/settings";

// https://astro.build/config
export default defineConfig({
  site: "https://eduardoalvarez.dev",
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
      icon: "src/images/your-icon.svg",
      description: config.description,
      start_url: "/",
      theme_color: "#030712",
      background_color: "#030712",
      display: "standalone",
    }),
  ],
});
