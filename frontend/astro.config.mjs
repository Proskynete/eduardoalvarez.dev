import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import sanity from "astro-sanity";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://eduardoalvarez.dev",
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
    }),
    sanity({
      projectId: "0fe29bsm",
      dataset: "production",
      apiVersion: "2023-02-08",
      useCdn: false,
    }),
    sitemap(),
  ],
});
