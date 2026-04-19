## Why

Un nuevo audit externo (SEO Analyzer · Deep Audit, 19 de abril 2026) arrojó un score global de 69/100. El módulo técnico de SEO (88/100) y GEO (72/100) están en nivel "good/warning", pero AEO (48/100) está en nivel crítico. Los changes previos (`2026-02-27-seo-improvements` y `2026-04-14-seo-geo-aeo-optimization`) cubrieron la base técnica, JSON-LD en páginas índice y FAQ en los dos artículos más recientes — pero quedaron fuera:

1. Longitud de `<title>` fuera del rango 30–60 chars en 5 páginas índice (demasiado corto) y en homepage + 4 artículos (demasiado largo con el sufijo de sitio).
2. Falta de FAQ + `FAQPage` JSON-LD en la página de conversión `/working-with-me` (descartado para `/speaking` y artículos legacy — ver _design.md_ §D6 para el razonamiento).
3. Ausencia de resúmenes concisos (40–60 palabras) aptos para featured snippets y AI citation en el hero de páginas índice.
4. Atribución de autor visible únicamente en JSON-LD (no en el DOM) en `/speaking` y `/newsletter` — los crawlers GEO-first (Perplexity, ChatGPT Search) priorizan texto visible.

No se modifica ningún change archivado (son historial inmutable); este change es aditivo sobre los anteriores.

## What Changes

- **Title length guard automático**: lógica en `head.astro` que omite el sufijo ` | ${settings.title}` cuando el resultado excedería 60 chars, preservando el título semántico del autor.
- **Titles corregidos** en `/articles`, `/speaking`, `/about`, `/working-with-me`, `/newsletter`: títulos más descriptivos que caen en el rango 30–60 chars con sufijo.
- **Componente `PageFAQ` reutilizable** (deriva de `ArticleFAQ` pero independiente del layout de artículo) con los mismos contratos HTML/JSON-LD.
- **FAQ + FAQPage schema en `/working-with-me`** (4–5 preguntas sobre modalidades, proceso, pago, timing). Es la única página de conversión donde una FAQ añade valor genuino al lector y no suena forzada.
- **TL;DR visible** (40–60 palabras, natural language, sentencia completa) en hero de `/`, `/articles`, `/speaking`, `/newsletter`, `/working-with-me`.
- **Bio inline de autor** (1–2 líneas + link a `/about`) en `/speaking` y `/newsletter`.

## Capabilities

### New Capabilities

- `seo-title-length-guard`: Normalización de `<title>` garantizando que todas las páginas renderizadas caen en el rango 30–60 chars, omitiendo el sufijo de sitio cuando causaría desborde.
- `seo-page-faq`: Componente `PageFAQ` reutilizable + schema `FAQPage` para páginas que no son artículos MDX (actualmente sólo `/working-with-me`).
- `seo-author-attribution`: Bio inline visible + link a `/about` en páginas índice que previamente solo emitían autoría en JSON-LD.

### Modified Capabilities

- `page-home`: Añadir TL;DR conciso después del hero.
- `page-articles`: Añadir overview de 40–60 palabras sobre los tipos de contenido disponibles.
- `page-speaking`: Añadir TL;DR y bio inline de autor.
- `page-newsletter`: Añadir TL;DR (reemplazando o ampliando el copy actual) y bio inline.
- `page-working-with-me`: Añadir TL;DR y sección FAQ antes de "Cómo empezamos".

## Impact

**Archivos modificados:**
- `src/layouts/base/components/head.astro` — lógica condicional de sufijo en `title`
- `src/pages/index.astro` — TL;DR en hero
- `src/pages/articles/index.astro` — TL;DR + `seo.title` ajustado
- `src/pages/speaking/index.astro` — TL;DR, bio inline, `seo.title` ajustado
- `src/pages/newsletter/index.astro` — TL;DR, bio inline, `seo.title` ajustado
- `src/pages/about/index.astro` — `seo.title` ajustado
- `src/pages/working-with-me/index.astro` — TL;DR, sección FAQ, `seo.title` ajustado
- `src/components/page-faq/index.astro` — **nuevo** componente reutilizable
- `src/settings/working-with-me.ts` — añadir `faq` al export
- `src/settings/index.ts` — añadir `authorInlineBio`
- `src/layouts/article/index.astro` — remover import y uso de `ArticleFAQ`
- `src/interfaces/index.ts` — remover prop `faq?: FAQItem[]` del interface `Article`
- `src/pages/articles/es-la-ia-la-nueva-droga-de-los-programadores.mdx` — remover bloque `faq` del frontmatter
- `src/pages/articles/no-estas-obligado-a-aprender-todo-el-tiempo.mdx` — remover bloque `faq` del frontmatter

**Archivos eliminados:**
- `src/components/article-faq/index.astro` — ya no queda ningún artículo que lo consuma (ver design.md §D6)

**Sin cambios breaking a nivel público.** El componente eliminado era privado del layout de artículos; su eliminación solo afecta al frontmatter de los 2 artículos que ya estaban incluidos en este change.
