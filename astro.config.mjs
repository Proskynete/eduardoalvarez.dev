import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://eduardoalvarez.dev",
  integrations: [mdx(), react(), tailwind(), sitemap()],
});
