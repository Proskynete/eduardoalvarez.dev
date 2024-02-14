import config from "./index";

export default {
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
  background_color: "#0d0d0d",
  theme_color: "#0d0d0d",
  display: "standalone",
};
