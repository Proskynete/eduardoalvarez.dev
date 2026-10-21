## 1. Preparación

- [x] 1.1 Agregar `satori`, `@fontsource/bricolage-grotesque` y `@fontsource/jetbrains-mono` como devDependencies
- [x] 1.2 Prueba de humo: pintar `articleTemplate` con un título fijo a PNG desde un script y revisarlo a ojo (fuentes, aleta, cara) antes de tocar el sitio

## 2. Generador

- [ ] 2.1 `src/utils/og.ts`: carga única de fuentes, reemplazo de `arrecife:/…` por `data:` URIs, `renderOg(tree)` → PNG con Satori y sharp
- [ ] 2.2 `ogImageFor(article)`: `seo_image` si existe, si no `/og/articles/<slug>.png?v=<hash>` (título, categoría, minutos y versión de arrecife)
- [ ] 2.3 Tests de `ogImageFor` (override, generada, hash estable, hash que cambia con el título) y del reemplazo de `src`

## 3. Endpoint y consumidores

- [ ] 3.1 `src/pages/og/articles/[slug].png.ts` prerenderizado con `getStaticPaths` desde los `.mdx`
- [ ] 3.2 `seo_image` opcional en `src/interfaces/index.ts`
- [ ] 3.3 El layout de artículo pasa `ogImageFor` a `head` y al `BlogPosting`; `og:image:width`/`height` se emiten también para la generada
- [ ] 3.4 `src/scripts/algolia.ts` usa `ogImageFor`

## 4. Imagen por defecto

- [ ] 4.1 `scripts/generate-og-default.mjs` con `defaultTemplate` y el mismo pipeline (Satori → sharp → `recordVersions`)
- [ ] 4.2 Comparar la nueva `og-default.png` con la actual y ajustar si hace falta

## 5. Cierre

- [ ] 5.1 `npm run build`: 12 PNG de 1200×630 en la salida; revisar cada una
- [ ] 5.2 Quitar temporalmente `seo_image` de un artículo y verificar `og:image`, `BlogPosting` y Algolia en el HTML; restaurarlo
- [ ] 5.3 Prueba local, no sobre un preview (la rama `docs/**` no despliega): `npm run build && npm run preview`, abrir `/og/articles/<slug>.png` y confirmar que responde PNG de 1200×630 y que el `og:image` del artículo apunta ahí. El inspector de LinkedIn o de X necesita una URL pública: queda para cuando el cambio llegue a `develop`
- [ ] 5.4 `BRAND.md` §13: el generador de OG existe en arrecife y este sitio lo usa
- [ ] 5.5 Lint, unitarios, `astro check` y build en verde
