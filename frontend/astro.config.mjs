import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://eduardoalvarez.dev",
  experimental: {
    viewTransitions: true,
  },
  integrations: [
    sanity({
      projectId: "0fe29bsm",
      dataset: "production",
      apiVersion: "2023-02-08",
      useCdn: false,
    }),
    tailwind(),
  ],
});
