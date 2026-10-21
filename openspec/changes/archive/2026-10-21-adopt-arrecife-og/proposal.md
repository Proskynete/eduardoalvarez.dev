## Why

La imagen Open Graph de cada artículo es la portada que dibuja el content manager (`blog-content-manager`, capability `article-cover-image`): una ilustración de la marca, sin texto, que el PR del artículo commitea en `public/images/articles/<slug>/<slug>.webp` y declara en `seo_image`. Esa portada es la fuente de verdad y no cambia.

Lo que falta es un respaldo. Si un artículo llega sin portada (no se generó, o el PR no trae el archivo), hoy no tiene tarjeta propia al compartirse, o apunta a una imagen que no existe. arrecife ya publica las plantillas OG del handoff (`@eduardoalvarez/arrecife/og`, en la 0.13.0 instalada) y su `articleTemplate` sirve justo para eso.

## What Changes

- **La portada del content manager sigue mandando**: si `seo_image` existe y, cuando es una ruta local, el archivo está en `public/`, esa es la OG del artículo, como hoy.
- **Respaldo generado**: el build genera para cada artículo una imagen 1200×630 con `articleTemplate` (título, categoría y minutos de lectura). Se usa solo si falta `seo_image` o si apunta a un archivo local que no existe.
- **`seo_image` pasa a ser opcional** en el tipo, para que un artículo sin portada compile y caiga al respaldo.
- El JSON-LD `BlogPosting` y el índice de Algolia usan la misma imagen que el `og:image`.
- **La imagen por defecto no cambia**: `npm run brand:og` sigue dibujando `og-default.png` con su propio SVG. `defaultTemplate` queda como guía mientras se ajusta en la librería.

## Capabilities

### New Capabilities

- `og-images`: la OG de cada artículo es la portada del content manager, con un respaldo generado por `articleTemplate`; cuál gana y cómo se invalidan las cachés de las redes.

### Modified Capabilities

- `seo-schema-markup`: la `image` del `BlogPosting` es la imagen OG resuelta, no solo `seo_image`.

## Impact

**Dependencias nuevas (dev):** `satori`, `@fontsource/bricolage-grotesque` y `@fontsource/jetbrains-mono`, porque Satori no lee `woff2` y los paquetes variables del sitio solo traen ese formato.

**Archivos nuevos:** `src/pages/og/articles/[slug].png.ts` (prerenderizado), `src/utils/og.ts`, tests de `og`.

**Archivos modificados:** `src/interfaces/index.ts` (`seo_image` opcional), `src/layouts/article/index.astro`, `src/scripts/algolia.ts`, `BRAND.md` §13. `scripts/generate-og-default.mjs` no se toca.

**Specs corregidas de paso:** dos escenarios del `BlogPosting` ya no coincidían con el código: `author` y `publisher` son referencias `@id` a la Person, no un objeto con `name`, y `keywords` es un arreglo, no un string.

**Sin cambios visibles al publicarse:** hoy los 12 artículos tienen `seo_image` con su archivo en `public/`, así que siguen mostrando su portada. El respaldo solo aparece en un artículo sin portada.

## Success Criteria

- `npm run build` genera `dist/client/og/articles/<slug>.png` (1200×630) para cada artículo.
- Un artículo con `seo_image` y su archivo emite esa imagen, igual que hoy.
- Un artículo sin `seo_image`, o con una ruta local que no existe, emite `og:image` apuntando a su PNG generada, con `?v=`.
- `og-default.png` no cambia.
- Lint, unitarios y build en verde.
