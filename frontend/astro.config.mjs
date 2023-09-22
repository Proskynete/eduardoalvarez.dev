import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    sanity({
      projectId: "0fe29bsm",
      dataset: "production",
      apiVersion: "2023-02-08",
      useCdn: false,
    }),
  ],
});
