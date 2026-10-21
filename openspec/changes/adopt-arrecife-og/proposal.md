## Why

La imagen Open Graph de cada artículo se hace a mano: un `.webp` por artículo en `public/images/articles/<slug>/`. Los más antiguos son fotos de stock con el título encima y no se parecen a la marca. Un artículo nuevo sin imagen no tiene tarjeta propia al compartirse. arrecife ya publica las plantillas OG del handoff (`@eduardoalvarez/arrecife/og`, en la 0.13.0 instalada) y este sitio no las usa.

## What Changes

- **OG generada por artículo**: cada artículo tiene una imagen 1200×630 hecha con `articleTemplate` (título, categoría y minutos de lectura), generada en el build. Un artículo nuevo la tiene sin que nadie haga nada.
- **`seo_image` pasa a ser opcional y gana si existe**: las ilustraciones hechas para un artículo se conservan. Quitar el campo pasa el artículo a la plantilla.
- **La imagen por defecto sale de `defaultTemplate`**: `npm run brand:og` deja de dibujar su propio SVG y usa la plantilla de la librería. El archivo y su URL versionada no cambian.
- El JSON-LD `BlogPosting` y el índice de Algolia usan la misma imagen que el `og:image`.

## Capabilities

### New Capabilities

- `og-images`: imágenes Open Graph generadas con las plantillas de arrecife, cuál gana para cada artículo y cómo se invalidan las cachés de las redes.

### Modified Capabilities

- `brand-identity`: la imagen OG por defecto se genera con `defaultTemplate` y la usan las páginas que no son artículos.
- `seo-schema-markup`: la `image` del `BlogPosting` es la imagen OG resuelta, no solo `seo_image`.

## Impact

**Dependencias nuevas (dev):** `satori`, `@fontsource/bricolage-grotesque` y `@fontsource/jetbrains-mono`, porque Satori no lee `woff2` y los paquetes variables del sitio solo traen ese formato.

**Archivos nuevos:** `src/pages/og/articles/[slug].png.ts` (prerenderizado), `src/utils/og.ts`, tests de `og`.

**Archivos modificados:** `src/interfaces/index.ts` (`seo_image` opcional), `src/layouts/article/index.astro`, `src/scripts/algolia.ts`, `scripts/generate-og-default.mjs`, `BRAND.md` §13.

**Specs corregidas de paso:** dos escenarios del `BlogPosting` ya no coincidían con el código: `author` y `publisher` son referencias `@id` a la Person, no un objeto con `name`, y `keywords` es un arreglo, no un string.

**Sin cambios visibles al publicarse:** hoy los 12 artículos tienen `seo_image`, así que siguen mostrando su imagen. Qué artículos pasan a la plantilla es una decisión de contenido, artículo por artículo.

## Success Criteria

- `npm run build` genera `dist/client/og/articles/<slug>.png` (1200×630) para cada artículo.
- Un artículo sin `seo_image` emite `og:image` apuntando a su PNG generada, con `?v=`.
- Un artículo con `seo_image` emite esa imagen, igual que hoy.
- `og-default.png` se regenera con `defaultTemplate` y pasa la revisión visual.
- Lint, unitarios y build en verde.
