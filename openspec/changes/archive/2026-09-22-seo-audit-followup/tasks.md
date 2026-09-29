## 1. Title length guard

- [x] 1.1 En `src/layouts/base/components/head.astro`, reemplazar la construcción directa de `title` por: `candidate = ${prop.title} | ${settings.title}`; `title = (candidate.length > 60 && prop.title) ? prop.title : candidate`
- [x] 1.2 Verificar manualmente con un título ficticio de 50 chars que el sufijo se omite
- [x] 1.3 Verificar con título corto ("Charlas") que el sufijo se añade

## 2. Ajuste de seo.title en páginas índice

- [x] 2.1 En `src/pages/articles/index.astro`, cambiar `seo.title` de `"Artículos"` a `"Artículos sobre ingeniería, liderazgo e IA"` (44 chars → con sufijo 62 → guard lo deja en 44, OK)
- [x] 2.2 En `src/pages/speaking/index.astro`, cambiar `seo.title` de `"Charlas"` a `"Charlas y talleres técnicos"` (27 chars → con sufijo 45)
- [x] 2.3 En `src/pages/about/index.astro`, cambiar `seo.title` de `"Sobre mí"` a `"Sobre Eduardo Álvarez — Engineering Leader"` (43 chars → con sufijo 61 → guard lo deja en 43)
- [x] 2.4 ~~En `src/pages/working-with-me/index.astro`, cambiar `seo.title` de `"Trabajemos"` a `"Consulting, workshops y mentoring técnico"` (42 chars → con sufijo 60)~~ → superado: `/working-with-me` se eliminó en `857bad9` (ver design.md §D7)
- [x] 2.5 En `src/pages/newsletter/index.astro`, cambiar `seo.title` de `"Newsletter"` a `"Newsletter de liderazgo de ingeniería e IA"` (42 chars → con sufijo 60)
- [x] 2.6 Homepage: no requiere cambio manual — el guard absorbe el título largo actual

## 3. Componente PageFAQ reutilizable — implementado en `e079770`, eliminado al quedar sin consumidores (ver design.md §D7)

- [x] 3.1 Crear directorio `src/components/page-faq/`
- [x] 3.2 Crear `src/components/page-faq/index.astro` con props `faq?: FAQItem[]` y `title?: string` (default: "Preguntas frecuentes")
- [x] 3.3 Implementar HTML semántico: `<section>`, `<h2>{title}</h2>`, `<dl>` con `<dt>`/`<dd>` por item
- [x] 3.4 Implementar emisión de `<script type="application/ld+json">` con `@type: "FAQPage"` y `mainEntity` como array de `Question`/`Answer`
- [x] 3.5 Verificar que no renderiza nada cuando `faq` está vacío o ausente
- [x] 3.6 Aplicar estilos consistentes con el design system (bg-surface, border-surface-border, text-text-secondary, text-text-primary)

## 4. FAQ en /working-with-me

- [x] 4.1 ~~En `src/settings/working-with-me.ts`, añadir export `faq: FAQItem[]` con 4-5 pares pregunta/respuesta (ej. "¿Cómo se factura el consulting?", "¿Trabajas con equipos remotos?", "¿Cuál es el tiempo mínimo de engagement?", "¿Qué incluye un workshop?")~~ → superado: `/working-with-me` se eliminó en `857bad9` (ver design.md §D7)
- [x] 4.2 ~~En `src/pages/working-with-me/index.astro`, importar `PageFAQ` y `faq` desde settings~~ → superado: `/working-with-me` se eliminó en `857bad9` (ver design.md §D7)
- [x] 4.3 ~~Renderizar `<PageFAQ faq={faq} />` después de la sección `<section class="space-y-12 mb-16">` (engagements) y antes de `<section class="border-t border-surface-border pt-10">` (Cómo empezamos)~~ → superado: `/working-with-me` se eliminó en `857bad9` (ver design.md §D7)
- [x] 4.4 ~~Verificar que cada `answer` tiene 40-120 palabras y está en texto plano~~ → superado: `/working-with-me` se eliminó en `857bad9` (ver design.md §D7)

## 5. FAQ en /speaking — DESCARTADO (ver design.md §D6)

- [x] 5.1 ~~Crear `src/settings/speaking.ts`~~ → descartado: `/speaking` es listado histórico, FAQ resultaba forzado
- [x] 5.2 ~~Importar `PageFAQ` en speaking~~ → descartado
- [x] 5.3 ~~Renderizar PageFAQ~~ → descartado
- [x] 5.4 ~~Verificar answers~~ → descartado

## 6. TL;DRs en páginas índice

- [x] 6.1 En `src/pages/index.astro`, añadir un `<p>` de 40-60 palabras después del párrafo existente ("Ayudo a equipos…"), como resumen funcional de lo que el visitante encontrará en el sitio
- [x] 6.2 En `src/pages/articles/index.astro`, añadir un `<p>` de 40-60 palabras después del subtítulo, describiendo los tipos de artículos (opinión técnica, deep-dives de JavaScript/React, reflexiones sobre liderazgo)
- [x] 6.3 En `src/pages/speaking/index.astro`, añadir un `<p>` de 40-60 palabras tras el subtítulo resumiendo topics y formatos (keynotes, workshops, panels, meetups) y frecuencia
- [x] 6.4 En `src/pages/newsletter/index.astro`, reescribir o ampliar el subtítulo a 40-60 palabras cubriendo contenido, frecuencia y audiencia objetivo
- [x] 6.5 ~~En `src/pages/working-with-me/index.astro`, añadir un `<p>` de 40-60 palabras tras el subtítulo resumiendo modalidades y el tipo de equipos/líderes a los que apunta~~ → superado: `/working-with-me` se eliminó en `857bad9` (ver design.md §D7)

## 7. Bio inline de autor — implementada en `e079770`, perdida en el refactor `8ec0fd6` y restaurada (ver design.md §D7)

- [x] 7.1 Añadir `authorInlineBio` (objeto con `text` y `href`) a `src/settings/index.ts`
- [x] 7.2 En `src/pages/speaking/index.astro`, renderizar la bio inline en el footer del header de página (debajo del TL;DR)
- [x] 7.3 En `src/pages/newsletter/index.astro`, renderizar la bio inline en el mismo lugar

## 8. FAQ en artículos legacy — DESCARTADO (ver design.md §D6)

- [x] 8.1 ~~Añadir `faq` al frontmatter de `parte-1.mdx`~~ → descartado: duplica contenido ya cubierto en el cuerpo del artículo
- [x] 8.2 ~~Añadir `faq` al frontmatter de `parte-2.mdx`~~ → descartado
- [x] 8.3 ~~Añadir `faq` al frontmatter de `parte-3.mdx`~~ → descartado
- [x] 8.4 ~~Añadir `faq` al frontmatter de `empezando-en-el-desarrollo-web.mdx`~~ → descartado
- [x] 8.5 ~~Verificar answers~~ → descartado

## 9. Verificación final

- [x] 9.1 `npm run build` sin errores de TypeScript ni de build
- [x] 9.2 `npm run lint` sin errores
- [x] 9.3 `npm run test:unit` todos los tests pasan
- [x] 9.4 Con DevTools en homepage: `<title>` ≤ 60 chars
- [x] 9.5 ~~Con DevTools en `/working-with-me`: `<script type="application/ld+json">` con `@type: FAQPage` presente y JSON válido~~ → superado: `/working-with-me` se eliminó en `857bad9` (ver design.md §D7)
- [x] 9.6 Con DevTools en `/speaking`: `<script type="application/ld+json">` con Event graph presente (FAQPage descartado per §D6)
- [x] 9.7 ~~Validar con Google Rich Results Test al menos una página con FAQPage nueva — verificar post-deploy~~ → superado: ya no hay ninguna página con FAQPage (ver design.md §D7)
