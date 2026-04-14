## 1. Tipos e interfaces

- [x] 1.1 Añadir interfaz `FAQItem { question: string; answer: string }` en `src/interfaces/index.ts`
- [x] 1.2 Añadir campo opcional `faq?: FAQItem[]` al tipo `Article` en `src/interfaces/index.ts`
- [x] 1.3 Añadir campo opcional `date_modified?: string` al tipo `Article` en `src/interfaces/index.ts`

## 2. Componente ArticleFAQ

- [x] 2.1 Crear directorio `src/components/article-faq/`
- [x] 2.2 Crear `src/components/article-faq/index.astro` con props `faq?: FAQItem[]`
- [x] 2.3 Implementar renderizado HTML semántico: `<section>`, `<h2>Preguntas frecuentes</h2>`, `<dl>` con pares `<dt>`/`<dd>` por cada FAQItem
- [x] 2.4 Implementar emisión de `<script type="application/ld+json">` con schema `FAQPage` cuando `faq` tiene al menos un item
- [x] 2.5 Verificar que el componente no renderiza nada cuando `faq` está vacío o ausente

## 3. Layout de artículo — integración FAQ y dateModified

- [x] 3.1 Importar `ArticleFAQ` en `src/layouts/article/index.astro`
- [x] 3.2 Renderizar `<ArticleFAQ faq={content.faq} />` después del `article-body` y antes de `GiscusWrapper`
- [x] 3.3 Actualizar la construcción del schema `BlogPosting` para incluir `dateModified: content.date_modified` cuando el campo existe (sin fallback)

## 4. TOC visible en mobile

- [x] 4.1 En `src/layouts/article/components/aside.astro`, añadir bloque `<details class="xl:hidden ...">` con `<summary>Secciones del artículo</summary>` y `<nav aria-label="Tabla de contenidos">` con los links de sección
- [x] 4.2 Mantener el bloque `hidden xl:block` existente del TOC desktop sin modificaciones
- [x] 4.3 Verificar que el TOC mobile solo se renderiza cuando `content.sections` tiene items
- [x] 4.4 Aplicar estilos Tailwind consistentes con el design system (bg-surface, border-surface-border, texto en text-text-secondary/text-accent)

## 5. Schema Person extendido en /about

- [x] 5.1 En `src/pages/about/index.astro`, construir objeto `schema` de tipo `Person` con campos: `@context`, `@type`, `name`, `url`, `email`, `jobTitle`, `knowsAbout`, `hasOccupation`, `sameAs`
- [x] 5.2 Derivar el array `sameAs` desde `src/settings/index.ts` (social_network + contacts con URLs externas)
- [x] 5.3 Pasar el schema a `Layout` vía `seo={{ ..., schema }}` para que `BaseHead` lo emita como JSON-LD
- [ ] 5.4 Verificar que el JSON-LD es válido con la herramienta Rich Results Test (o `JSON.parse` en consola)

## 6. Schema Event en /speaking

- [x] 6.1 En `src/pages/speaking/index.astro`, construir array de schemas `Event` a partir de `visibleTalks`
- [x] 6.2 Por cada talk: construir `{ "@type": "Event", name, startDate (ISO 8601), description, location: { "@type": "Place", name, url }, organizer: [{ "@type": "Organization", name, url }] }`
- [x] 6.3 Emitir el array como `@graph` pasándolo a `Layout` vía `seo.schema`
- [x] 6.4 Asegurar que `talk.date[0]` se convierte a ISO 8601 con `new Date(talk.date[0]).toISOString()` antes de usarlo en el schema

## 7. Schema Service en /working-with-me

- [x] 7.1 En `src/pages/working-with-me/index.astro`, construir array de schemas `Service` a partir de `engagements`
- [x] 7.2 Por cada engagement: construir `{ "@type": "Service", name: engagement.type, description: engagement.description, provider: { "@type": "Person", name: "Eduardo Álvarez Castañeda", url: "https://eduardoalvarez.dev" }, url: "https://eduardoalvarez.dev/working-with-me" }`
- [x] 7.3 Emitir el array como `@graph` pasándolo a `Layout` vía `seo.schema`

## 8. Schema CollectionPage en /articles

- [x] 8.1 En `src/pages/articles/index.astro`, construir objeto schema `CollectionPage`
- [x] 8.2 Incluir `hasPart` como array de `BlogPosting` con `headline`, `url` (absoluta) y `datePublished` por cada artículo ordenado por fecha descendente
- [x] 8.3 Incluir `author` como objeto `Person` y campo `name` y `url` del sitio
- [x] 8.4 Pasar el schema a `Layout` vía `seo.schema`

## 9. Corrección de seo_description en artículos

- [x] 9.1 Corregir `seo_description` de `es-la-ia-la-nueva-droga-de-los-programadores.mdx` a ≤ 155 chars manteniendo la keyword principal
- [x] 9.2 Corregir `seo_description` de `no-estas-obligado-a-aprender-todo-el-tiempo.mdx` a ≤ 155 chars
- [x] 9.3 Corregir `seo_description` de `el-javascript-necesario-para-react-parte-3.mdx` a ≤ 155 chars
- [x] 9.4 Revisar `seo_description` de `empezando-en-el-desarrollo-web.mdx` (154 chars) y ajustar si queda ajustado con el sufijo del title tag

## 10. FAQ en artículos recientes

- [x] 10.1 Añadir campo `faq` al frontmatter de `es-la-ia-la-nueva-droga-de-los-programadores.mdx` con 3-5 pares pregunta/respuesta relevantes al contenido del artículo
- [x] 10.2 Añadir campo `faq` al frontmatter de `no-estas-obligado-a-aprender-todo-el-tiempo.mdx` con 3-5 pares pregunta/respuesta
- [x] 10.3 Verificar que cada `answer` tiene entre 40 y 120 palabras y está en texto plano (sin Markdown)

## 11. dateModified en artículos actualizados

- [x] 11.1 Añadir `date_modified` al frontmatter de los artículos que se modifiquen en esta change (mínimo los 4 con descriptions corregidas)
- [x] 11.2 Verificar que el schema `BlogPosting` incluye `dateModified` para esos artículos y lo omite para los no modificados

## 12. Verificación final

- [x] 12.1 Ejecutar `npm run build` sin errores de TypeScript
- [x] 12.2 Verificar con DevTools que `/about`, `/speaking`, `/working-with-me` y `/articles` emiten el JSON-LD esperado
- [x] 12.3 Verificar que el TOC mobile es visible y funcional en viewport < 768px
- [x] 12.4 Verificar que los artículos con `faq` muestran la sección HTML y el schema `FAQPage`
- [x] 12.5 Verificar que ningún `seo_description` en los MDX modificados supera 155 chars
- [ ] 12.6 Validar al menos una página en Google Rich Results Test (https://search.google.com/test/rich-results)
