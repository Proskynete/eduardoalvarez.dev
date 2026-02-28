import config from "./index";

export default {
  name: "Eduardo Álvarez — Engineering Leadership",
  short_name: "Eduardo Álvarez",
  description: config.description,
  lang: "es",
  id: "/",
  start_url: "/",
  scope: "/",
  orientation: "portrait",
  theme_color: "#0a0a0a",
  background_color: "#0a0a0a",
  display_override: ["standalone", "minimal-ui"],
  display: "standalone",
  categories: ["education", "productivity"],
  icons: [
    {
      src: "./images/manifest/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable",
    },
    {
      src: "./images/manifest/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
};
