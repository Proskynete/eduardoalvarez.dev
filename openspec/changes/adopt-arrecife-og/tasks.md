## 1. Preparación

- [x] 1.1 Agregar `satori`, `@fontsource/bricolage-grotesque` y `@fontsource/jetbrains-mono` como devDependencies
- [x] 1.2 Prueba de humo: pintar `articleTemplate` con un título fijo a PNG desde un script y revisarlo a ojo (fuentes, aleta, cara) antes de tocar el sitio

## 2. Generador

- [x] 2.1 `src/utils/og-render.ts`: carga única de fuentes, reemplazo de `arrecife:/…` por `data:` URIs (`inlineBrandImages`, en `og.ts`), `renderArticleOg(data)` → PNG con Satori y sharp. Va aparte de `og.ts` para que Satori no entre en la función que renderiza los artículos
- [x] 2.2 `astro.config.mjs` lista `public/images/articles/` e inyecta `__ARTICLE_COVERS__` con `vite.define` (y vacío en `vitest.config.ts`)
- [x] 2.3 `ogImageFor(article, covers)`: `seo_image` si existe y, siendo local, está en `covers`; si no, `/og/articles/<slug>.png?v=<hash>` (título, categoría, minutos y versión de arrecife)
- [x] 2.4 Tests de `ogImageFor` (portada, sin `seo_image`, ruta local rota, URL absoluta, hash estable, hash que cambia con el título) y del reemplazo de `src`

## 3. Endpoint y consumidores

- [x] 3.1 `src/pages/og/articles/[slug].png.ts` prerenderizado con `getStaticPaths` desde los `.mdx`
- [x] 3.2 `seo_image` opcional en `src/interfaces/index.ts`
- [x] 3.3 El layout de artículo pasa `ogImageFor` a `head` y al `BlogPosting`; `og:image:width`/`height` se emiten también para la generada
- [x] 3.4 `src/scripts/algolia.ts` usa `ogImageFor`

## 4. Cierre

- [x] 4.1 `npm run build`: 12 PNG de 1200×630 en la salida; revisar cada una
- [x] 4.2 Probar el respaldo: quitar temporalmente `seo_image` de un artículo, y luego apuntarla a un archivo que no existe; en los dos casos verificar `og:image`, `BlogPosting` y Algolia en el HTML; restaurarlo
- [x] 4.3 Prueba local, no sobre un preview (la rama `docs/**` no despliega): `npm run build` y `astro dev` (`astro preview` no corre con el adapter de Vercel), abrir `/og/articles/<slug>.png` y confirmar que responde PNG de 1200×630 y que el `og:image` del artículo apunta ahí. El inspector de LinkedIn o de X necesita una URL pública: queda para cuando el cambio llegue a `develop`
- [x] 4.4 `BRAND.md` §13: el sitio usa `articleTemplate` como respaldo de la portada; `defaultTemplate` queda pendiente
- [x] 4.5 Lint, unitarios, `astro check` y build en verde
