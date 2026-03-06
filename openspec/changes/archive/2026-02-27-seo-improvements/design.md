## Context

El sitio `eduardoalvarez.dev` es un sitio personal de liderazgo de ingeniería construido con Astro 5 (SSR via Vercel adapter). Las páginas se renderizan en servidor pero los artículos están marcados como `prerender = true`. El SEO actual se genera íntegramente en `src/layouts/base/components/head.astro` (shared para todas las páginas) y `src/layouts/article/index.astro` (layout de artículos).

Las secciones del sitio post-rebranding son: `/` (home), `/articles` (listado con filtro client-side), `/articles/*.mdx` (artículos individuales), `/speaking` (charlas agrupadas por año), `/podcasts`, `/projects`, `/stack`, `/now`, `/about`, `/working-with-me` y `/newsletter`.

Estado actual problemático:
- `public/robots.txt` solo contiene comentarios de AI-signals (sin User-agent/Sitemap).
- `<html lang>` dice `"es"` pero settings define `"es-ES"`.
- Ninguna página emite JSON-LD — Google no puede generar rich results.
- Artículos usan `og:type="website"` en lugar de `"article"`, degradando previews en redes sociales.
- Meta descriptions no tienen límite de longitud, causando truncamiento en SERPs.
- `meta[name="keywords"]` usa siempre las keywords globales del sitio.

## Goals / Non-Goals

**Goals:**
- Habilitar rich results en Google (schema markup).
- Mejorar CTR en SERPs con descriptions correctamente formateadas.
- Mejorar previews sociales de artículos con Open Graph apropiado.
- Permitir keywords granulares por artículo.
- Corregir robots.txt para que crawlers estándar lo procesen correctamente.
- Corregir inconsistencias técnicas (lang, favicon, alt text).

**Non-Goals:**
- Link building o estrategia de contenido.
- Optimización de Core Web Vitals (ya manejado por la arquitectura de Astro/Vercel).
- Implementar OpenGraph para páginas que no son artículos (`/speaking`, `/podcasts`, `/projects`, etc.) — fuera de scope en esta iteración.
- Rate limiting de crawlers en robots.txt — se delega a Cloudflare/Vercel.

## Decisions

### D1 — JSON-LD en `head.astro` como bloque condicional por tipo de página

**Decisión:** Inyectar el bloque `<script type="application/ld+json">` directamente en `head.astro`, pasando el schema como prop opcional (`schema?: object`). Cada layout que quiera emitir un schema distinto lo construye en su frontmatter y lo pasa a `<BaseHead>`.

**Alternativa considerada:** Crear un componente `<SchemaMarkup>` separado.
**Rechazada porque:** Añade una capa de indirección innecesaria para un bloque `<script>` estático. El patrón de props en `head.astro` ya existe (title, description, image, slug) — es coherente extenderlo con `schema`.

**Implementación:**
- `src/layouts/base/components/head.astro` — acepta prop `schema?: Record<string, unknown>` y renderiza `JSON.stringify` del objeto.
- `src/pages/index.astro` — construye schema `WebSite` + `Person` y lo pasa a `<Layout seo={{ schema: ... }}>`.
- `src/layouts/article/index.astro` — construye schema `BlogPosting` desde el frontmatter del artículo y lo pasa a `<Layout seo={{ schema: ... }}>`.

### D2 — og:type dinámico como prop en `head.astro`

**Decisión:** Añadir prop `ogType?: 'website' | 'article'` a `BaseHeadProps`. El valor por defecto sigue siendo `'website'`. El layout de artículo pasa `ogType: 'article'` junto con los meta tags adicionales de Open Graph (`article:published_time`, `article:author`, `article:tag`).

**Alternativa considerada:** Hardcodear `og:type="article"` en el layout de artículo directamente, sin pasar por `head.astro`.
**Rechazada porque:** Rompería la centralización del `<head>`. Todos los meta tags deben vivir en `head.astro` para evitar duplicados.

### D3 — Truncamiento de meta description a nivel de `head.astro`

**Decisión:** Aplicar `.slice(0, 160)` en el momento de renderizar `<meta name="description">` y `<meta property="og:description">`. Sin warning en runtime — es una corrección silenciosa.

**Alternativa considerada:** Validar con Zod y lanzar error en build si la description supera 160 chars.
**Rechazada porque:** Sería demasiado disruptivo para contenido ya existente. El truncamiento silencioso es suficiente como guardia técnica; la responsabilidad editorial se documenta en `CLAUDE.md`.

**Longitud elegida:** 160 caracteres (estándar Google para desktop). Se aplica también a `og:description` para coherencia en previews sociales.

### D4 — Keywords por artículo vía frontmatter opcional

**Decisión:** Añadir campo `keywords?: string[]` al tipo `Article` en `src/interfaces/index.ts`. En `head.astro`, si se recibe `keywords` como prop, se usan esas; si no, se usan las keywords globales de `settings`.

**Alternativa considerada:** Derivar keywords automáticamente desde `categories`.
**Rechazada porque:** Las categories son un set fijo (`CategoryAllowed`), demasiado limitado. El autor debe poder especificar términos más granulares.

### D5 — robots.txt como archivo estático en `public/`

**Decisión:** Crear `public/robots.txt` con directivas estándar + referencia al sitemap. Astro sirve archivos de `public/` directamente sin procesamiento.

**Nota:** El contenido actual de robots.txt (comentarios AI-signals) se puede conservar al final del archivo — no interfiere con parsers de crawlers estándar.

### D6 — Sitemap con `lastmod` via configuración de `@astrojs/sitemap`

**Decisión:** Añadir `lastmod` al sitemap configurando la opción `serialize` del plugin `@astrojs/sitemap` en `astro.config.mjs`. Para artículos, el `lastmod` se extrae del frontmatter `date`. Para otras páginas se omite o se usa la fecha de build.

**Alternativa considerada:** Generar el sitemap manualmente (como un `.xml.ts` endpoint).
**Rechazada porque:** El plugin ya funciona bien — extender con `serialize` es la vía estándar y documentada.

## Risks / Trade-offs

- **[Risk] Schema incorrecto puede generar penalizaciones de Google** → Mitigation: Validar con Google Rich Results Test antes del merge. Los schemas `BlogPosting` y `Person` son simples y bien documentados.
- **[Risk] Truncamiento de description puede cortar información importante** → Mitigation: El estándar de 160 chars es ampliamente conocido. Se documenta en `CLAUDE.md` como requisito editorial.
- **[Risk] `og:type=article` puede romper algún preview existente** → Mitigation: Es una corrección a un valor erróneo — los previews solo pueden mejorar.
- **[Risk] Alt text hardcodeado en MDX requiere editar cada artículo manualmente** → Mitigation: Solo hay 5 artículos actualmente. El impacto es mínimo y el cambio es seguro.

## Migration Plan

1. Todos los cambios son aditivos — no hay breaking changes.
2. Deploy normal a Vercel — el adapter SSR no requiere pasos especiales.
3. Después del deploy, validar con Google Rich Results Test (`https://search.google.com/test/rich-results`).
4. Verificar robots.txt accesible en `https://eduardoalvarez.dev/robots.txt`.
5. No se requiere rollback plan — todos los cambios pueden revertirse con un commit.

## Open Questions

- ¿Incluir `sameAs` en el schema `Person` (links a GitHub, LinkedIn, Twitter)? → Recomendado para mejorar la entidad en el Knowledge Graph. Se incluye en el spec.
- ¿Añadir `image` al schema `BlogPosting` usando `seo_image` del artículo? → Sí, mejora los rich results en Google Discover.
