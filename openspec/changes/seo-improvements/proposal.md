## Why

El sitio carece de señales SEO técnicas fundamentales: sin schema markup, robots.txt sin directivas estándar, og:type incorrecto en artículos, y alt text genérico en imágenes. Estos problemas limitan la visibilidad orgánica, reducen el CTR en SERPs y bloquean los rich results de Google, impactando directamente el alcance del contenido publicado.

## What Changes

- **robots.txt**: Reemplazar el contenido actual (solo comentarios AI-signals) por directivas estándar con `User-agent`, `Disallow` y referencia al sitemap.
- **Schema JSON-LD**: Añadir structured data `WebSite` + `Person` en la homepage y `BlogPosting` en cada artículo.
- **og:type en artículos**: Cambiar de `"website"` a `"article"` e incluir `article:published_time`, `article:author` y `article:tag` en el `<head>` del layout de artículo.
- **Meta description truncation**: Truncar automáticamente descriptions > 160 caracteres antes de renderizarlas en `<meta>`.
- **Keywords por artículo**: Añadir campo `keywords` opcional al frontmatter de artículos y usarlo en `<meta name="keywords">`.
- **Alt text descriptivo**: Corregir el alt text genérico `"stacks"` de imágenes en artículos MDX existentes.
- **lang attribute**: Alinear `<html lang>` con el valor configurado en settings (`es-ES`).
- **Favicon**: Corregir la referencia rota a `favicon.ico` (actualmente 404).
- **Sitemap con lastmod**: Añadir `<lastmod>` a las URLs del sitemap usando la fecha de publicación de los artículos.

## Capabilities

### New Capabilities

- `seo-schema-markup`: Structured data JSON-LD para homepage (`WebSite`, `Person`) y artículos (`BlogPosting`). Expone metadatos al Knowledge Graph de Google y habilita rich results.
- `seo-article-opengraph`: Meta tags Open Graph correctos para artículos (`og:type=article`, `article:published_time`, `article:author`, `article:tag`). Mejora previews en redes sociales.
- `seo-meta-description-guard`: Truncamiento automático de meta descriptions a ≤ 160 caracteres para evitar recortes en SERPs.
- `seo-per-article-keywords`: Soporte para campo `keywords` opcional en frontmatter de artículos MDX, que sobreescribe las keywords globales del sitio.

### Modified Capabilities

_(Sin capabilities existentes con cambio de requerimientos)_

## Impact

**Archivos afectados:**
- `public/robots.txt` — nuevo archivo con directivas estándar
- `src/layouts/base/components/head.astro` — schema JSON-LD, lang fix, description truncation, keywords dinámicas
- `src/layouts/article/index.astro` — og:type article, article meta tags
- `src/interfaces/index.ts` — añadir campo `keywords?: string[]` al tipo `Article`
- `src/pages/articulos/*.mdx` — corregir alt text en imágenes
- `src/pages/rss.xml.ts` — potencial uso de `keywords` por artículo
- `astro.config.mjs` — verificar configuración de sitemap para `lastmod`

**Sin cambios breaking**: todas las modificaciones son aditivas o correcciones de valores existentes. No se eliminan APIs ni interfaces.
