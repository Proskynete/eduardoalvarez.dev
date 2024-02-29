import config from "./index";

export default {
  name: `Portafolio y blog de ${config.author.name}`,
  short_name: `${config.author.name}`,
  description: config.description,
  lang: "es",
  start_url: "/",
  orientation: "portrait",
  theme_color: "#0d0d0d",
  background_color: "#0d0d0d",
  display: "standalone", // fullscreen
  icons: [
    {
      src: "./images/manifest/72x72.png",
      type: "image/png",
      sizes: "72x72",
    },
    {
      src: "./images/manifest/96x96.png",
      type: "image/png",
      sizes: "96x96",
    },
    {
      src: "./images/manifest/128x128.png",
      type: "image/png",
      sizes: "128x128",
    },
    {
      src: "./images/manifest/144x144.png",
      type: "image/png",
      sizes: "144x144",
    },
    {
      src: "./images/manifest/152x152.png",
      type: "image/png",
      sizes: "152x152",
    },
    {
      src: "./images/manifest/192x192.png",
      type: "image/png",
      sizes: "192x192",
    },
    {
      src: "./images/manifest/384x384.png",
      type: "image/png",
      sizes: "384x384",
    },
    {
      src: "./images/manifest/512x512.png",
      type: "image/png",
      sizes: "512x512",
    },
  ],
};
