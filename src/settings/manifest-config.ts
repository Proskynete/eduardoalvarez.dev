import config from "./index";

export default {
  name: `Portafolio y blog de ${config.author.name}`,
  short_name: `${config.author.name}`,
  description: config.description,
  lang: "es",
  id: "/",
  start_url: "/",
  orientation: "portrait",
  theme_color: "#0d0d0d",
  background_color: "#0d0d0d",
  display_override: ["fullscreen"],
  display: "standalone", // fullscreen
  icons: [
    {
      src: "./images/manifest/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "./images/manifest/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};
