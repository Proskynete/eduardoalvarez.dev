## Why

El sitio está posicionado como referente en Engineering Leadership & Platform Thinking en la era de la IA, pero carece de las señales estructurales que los motores de búsqueda modernos (Google, Perplexity, ChatGPT, Gemini) necesitan para citar, rankear y referenciar su contenido. La auditoría realizada identificó 22 issues con health score estimado de 62/100: schemas incompletos para AEO/GEO, TOC invisible en mobile, artículos sin estructura para featured snippets y páginas clave sin JSON-LD.

## What Changes

- **Nuevo schema `FAQPage`** en artículos: sección FAQ al final con 3-5 preguntas/respuestas + JSON-LD correspondiente para AEO y GEO
- **Schema `Person` detallado en `/about`**: añadir `knowsAbout`, `alumniOf`, `hasOccupation`, `sameAs` con todos los perfiles verificables para que los LLMs describan correctamente al autor
- **Schema `Event` en `/speaking`**: cada charla emite su propio JSON-LD `Event` con `name`, `startDate`, `location`, `organizer`
- **Schema `Service` en `/working-with-me`**: cada modalidad de engagement (consulting, workshops, mentoring) tiene schema `Service`
- **Schema `CollectionPage` en `/articles`**: el listado de artículos emite JSON-LD estructurado para GEO
- **`dateModified` en `BlogPosting`**: los artículos exponen su fecha de última modificación en el schema, requerida para freshness signals
- **TOC visible en mobile**: la tabla de contenidos actualmente oculta en mobile (`hidden xl:block`) se hace accesible en todos los tamaños de pantalla
- **Corrección de `seo_description` en artículos**: 4 artículos tienen descriptions que superan el límite natural de 155 chars; se reescriben para que no dependan del slice automático

## Capabilities

### New Capabilities

- `seo-faq-schema`: Sección FAQ reutilizable para artículos con schema `FAQPage` JSON-LD — optimiza para featured snippets y citación en AI engines
- `seo-about-schema`: Schema `Person` extendido en la página `/about` con `knowsAbout`, `hasOccupation`, `sameAs` completo y `alumniOf` para GEO/E-E-A-T
- `seo-event-schema`: Schema `Event` JSON-LD por cada charla en `/speaking` con fecha, lugar y organizador
- `seo-service-schema`: Schema `Service` JSON-LD en `/working-with-me` por cada modalidad de trabajo
- `seo-collection-schema`: Schema `CollectionPage` JSON-LD en `/articles` que lista los artículos publicados
- `seo-toc-mobile`: Tabla de contenidos visible y funcional en mobile (actualmente solo en `xl:`)

### Modified Capabilities

- `seo-schema-markup`: Añadir `dateModified` como campo requerido en el schema `BlogPosting` de artículos
- `seo-meta-description-guard`: Los artículos existentes con descriptions > 155 chars deben tener sus `seo_description` corregidas en el frontmatter (no solo truncadas por el sistema)

## Impact

- **`src/layouts/article/index.astro`**: integrar componente FAQ + pasar `dateModified` al schema `BlogPosting`
- **`src/layouts/article/components/aside.astro`**: hacer visible el TOC en mobile
- **`src/pages/about/index.astro`**: añadir schema `Person` extendido con JSON-LD
- **`src/pages/speaking/index.astro`**: emitir schema `Event` por cada talk visible
- **`src/pages/working-with-me/index.astro`**: emitir schema `Service` por cada engagement type
- **`src/pages/articles/index.astro`**: emitir schema `CollectionPage`
- **`src/pages/articles/*.mdx`**: corregir `seo_description` en 4 artículos + añadir sección `## Preguntas frecuentes` con frontmatter `faq`
- **`src/interfaces/index.ts`**: añadir campo opcional `faq?: FAQItem[]` y `date_modified?: string` al tipo `Article`
- **`src/settings/talks.ts`**: verificar que cada Talk incluya `location.url` y fecha completa para el schema Event
- **`src/settings/working-with-me.ts`**: verificar que cada engagement tenga `name` y `description` para el schema Service
- Sin cambios en build pipeline, Algolia, ni dependencias externas
