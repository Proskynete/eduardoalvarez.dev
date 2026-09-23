import { dark } from "@eduardoalvarez/arrecife/tokens";

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
  /* Los dos colores del manifiesto salen del paquete de tokens, no de un
     hexadecimal escrito aquí. `./tokens` no arrastra React, así que se puede
     importar desde un archivo de configuración sin coste. */
  theme_color: dark.background,
  background_color: dark.background,
  display_override: ["standalone", "minimal-ui"],
  display: "standalone",
  categories: ["education", "productivity"],
  /* Un icono por propósito. `"any maskable"` en una sola entrada obliga al
     mismo PNG a servir de icono plano y de icono recortable, y Chrome y
     Lighthouse piden declararlos por separado. La aleta cabe en la zona segura
     de `maskable` (el círculo del 80 %), así que los mismos archivos sirven
     para ambos. */
  icons: [
    { src: "/images/manifest/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/images/manifest/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/images/manifest/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    { src: "/images/manifest/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
  /* El `<link rel="manifest">` y el `theme-color` los escribe `head.astro`.
     El plugin solo sabe insertarlos en el HTML prerenderado al final del build,
     y los artículos se renderizan bajo demanda: se quedaban sin manifiesto, y
     las páginas estáticas con el `theme-color` duplicado. */
  config: {
    insertManifestLink: false,
    insertThemeColorMeta: false,
  },
};
