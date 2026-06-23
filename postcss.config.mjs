// Tailwind v3 vía PostCSS (reemplaza a @astrojs/tailwind, no compatible con Astro 7).
// Astro procesa automáticamente este archivo a través de su pipeline de Vite/PostCSS.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
