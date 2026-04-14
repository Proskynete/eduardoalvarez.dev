## Context

El sitio ya tiene schema `WebSite`, `Person` (básico) y `BlogPosting` implementados en homepage y artículos (`src/layouts/base/components/head.astro` y `src/layouts/article/index.astro`). Sin embargo, las páginas `/about`, `/speaking`, `/working-with-me` y `/articles` no emiten ningún JSON-LD. Los artículos tampoco tienen mecanismo para secciones FAQ ni exponen `dateModified`. La tabla de contenidos en artículos es un componente Astro que vive en el `aside` con clase `hidden xl:block`, haciéndola invisible en mobile.

El patrón establecido es: cada layout o página construye su objeto schema inline y lo pasa al componente `BaseHead` que lo serializa como `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`.

## Goals / Non-Goals

**Goals:**
- Emitir JSON-LD válido en `/about`, `/speaking`, `/working-with-me` y `/articles`
- Añadir `dateModified` al schema `BlogPosting` de cada artículo
- Implementar un sistema de FAQ reutilizable en artículos con schema `FAQPage`
- Hacer visible el TOC en mobile con diseño colapsable
- Corregir `seo_description` en los 4 artículos que superan 155 chars de forma nativa

**Non-Goals:**
- Crear páginas de categoría (`/articles/[category]`): scope separado
- Internacionalización del contenido o `hreflang`
- Modificar el pipeline de Algolia ni el sistema de búsqueda
- Añadir schema `Product`, `Review` o `Rating`
- Automatizar generación de OG images con Vercel OG

## Decisions

### D1: Patrón inline vs componente schema dedicado

**Decisión:** Mantener el patrón inline — cada página/layout construye su schema como objeto TypeScript y lo pasa a `BaseHead`.

**Alternativa considerada:** Crear un componente `<SchemaOrg>` genérico. Descartado porque añade abstracción sin valor real — el sitio tiene pocas páginas y los schemas son diferentes entre sí. El patrón inline ya establecido en `src/pages/index.astro` y `src/layouts/article/index.astro` es suficiente.

---

### D2: FAQ como frontmatter + componente Astro

**Decisión:** Añadir campo `faq?: FAQItem[]` al tipo `Article` en `src/interfaces/index.ts`. Crear componente `src/components/article-faq/index.astro` que recibe el array y renderiza tanto el HTML semántico como el JSON-LD `FAQPage`.

**Alternativa considerada:** FAQ escrita directamente en MDX con un componente React. Descartado porque requeriría que el autor importe el componente en cada artículo. Con frontmatter, el layout lo inyecta automáticamente cuando el campo existe.

**Estructura del campo:**
```typescript
interface FAQItem {
  question: string;
  answer: string;
}
```

El componente renderiza:
- `<section>` con `<h2>Preguntas frecuentes</h2>` visible
- `<dl>` con pares `<dt>/<dd>` accesibles
- `<script type="application/ld+json">` con `FAQPage` schema

---

### D3: dateModified — campo en frontmatter, no derivado de git

**Decisión:** Añadir campo opcional `date_modified?: string` al tipo `Article`. Si está presente, se incluye como `dateModified` en el `BlogPosting` schema. Si no está, se omite el campo (no se auto-deriva de git history).

**Alternativa considerada:** Derivar `dateModified` del último commit del archivo MDX. Descartado porque: (a) los commits de estilo/formato no son cambios de contenido y generarían `dateModified` incorrectos, y (b) añade complejidad al build sin beneficio proporcional.

**Para artículos actuales:** En esta iteración solo se añade `date_modified` a los artículos que se actualicen con contenido nuevo (los 4 que se corrigen en esta change).

---

### D4: TOC mobile — collapsible con `<details>`/`<summary>` nativo

**Decisión:** Envolver el TOC en un elemento `<details>` nativo en mobile. En `xl:` se muestra el aside fijo actual sin cambios. Implementado con Tailwind responsivo en el componente `src/layouts/article/components/aside.astro`.

**Alternativa considerada:** TOC flotante con React + useState. Descartado por sobreingeniería — `<details>` es accesible por defecto, no requiere JS y funciona sin hidratación.

**Estructura:**
```html
<!-- mobile: collapsible -->
<details class="xl:hidden ...">
  <summary>Secciones del artículo</summary>
  <nav aria-label="Tabla de contenidos">...</nav>
</details>

<!-- desktop: aside fijo actual sin cambios -->
<div class="hidden xl:block ...">
  <nav aria-label="Tabla de contenidos">...</nav>
</div>
```

---

### D5: Schema `Person` extendido en `/about` — en el layout, no en el componente head

**Decisión:** El schema `Person` extendido se define inline en `src/pages/about/index.astro` y se pasa a `Layout` vía la prop `seo.schema`. Se reutiliza el mecanismo ya existente en `BaseHead`.

El schema incluirá:
```typescript
{
  "@type": "Person",
  name: "Eduardo Álvarez Castañeda",
  url: "https://eduardoalvarez.dev",
  email: "soy@eduardoalvarez.dev",
  jobTitle: "Engineering Leader",
  knowsAbout: ["Engineering Leadership", "Platform Engineering", "AI-native Engineering", "Technical Leadership", "Staff Engineering"],
  sameAs: [github, linkedin, twitter, instagram],
  alumniOf: { /* si aplica */ }
}
```

---

### D6: Schema `Event` en `/speaking` — generado por cada talk visible

**Decisión:** En `src/pages/speaking/index.astro`, construir un array de schemas `Event` a partir de `talks.filter(t => t.show)` y emitir un `@graph` con todos los eventos.

Cada `Event`:
```typescript
{
  "@type": "Event",
  name: talk.title,
  startDate: talk.date[0],
  description: talk.description,
  location: { "@type": "Place", name: talk.location.name, url: talk.location.url },
  organizer: talk.organizations.map(o => ({ "@type": "Organization", name: o.name, url: o.url }))
}
```

---

### D7: Schema `Service` en `/working-with-me` — uno por engagement

**Decisión:** Generar un `@graph` con un `Service` por cada engagement en `src/pages/working-with-me/index.astro`.

```typescript
{
  "@type": "Service",
  name: engagement.type,
  description: engagement.description,
  provider: { "@type": "Person", name: "Eduardo Álvarez Castañeda", url: "https://eduardoalvarez.dev" }
}
```

---

### D8: Schema `CollectionPage` en `/articles`

**Decisión:** Emitir un `CollectionPage` con `hasPart` apuntando a cada artículo publicado.

```typescript
{
  "@type": "CollectionPage",
  name: "Artículos — Eduardo Álvarez",
  url: "https://eduardoalvarez.dev/articles",
  hasPart: posts.map(p => ({
    "@type": "BlogPosting",
    headline: p.frontmatter.title,
    url: `https://eduardoalvarez.dev/articles/${p.frontmatter.slug}`,
    datePublished: p.frontmatter.date
  }))
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| `FAQPage` schema inválido si `answer` contiene HTML | Usar texto plano en el campo `answer` del frontmatter. Documentar en CLAUDE.md que el campo no acepta Markdown. |
| `dateModified` incorrecto si se añade sin actualizar contenido | Solo añadir `date_modified` cuando el contenido del artículo cambie sustancialmente. No añadir a todos los artículos automáticamente. |
| TOC mobile con `<details>` puede no estar abierto por defecto y el usuario no lo descubra | Añadir estado `open` por defecto en artículos con muchas secciones (> 4). |
| Schema `Event` con `date[0]` puede no ser ISO 8601 válido | Validar formato de fecha en el componente antes de emitirlo. |
| `@graph` en `/speaking` con muchos eventos puede crecer — actualmente 6 talks visibles | Aceptable. No hay límite de tamaño para JSON-LD. |

## Migration Plan

1. Cambios son aditivos (solo se añaden schemas y campos opcionales) — sin riesgo de regresión
2. El campo `faq` en frontmatter es opcional — artículos sin FAQ no se ven afectados
3. El campo `date_modified` es opcional — artículos existentes no necesitan actualización inmediata
4. El TOC mobile es puramente aditivo — el TOC desktop no cambia
5. No hay deploy especial — Vercel detecta el push y redeploya automáticamente

## Open Questions

- ¿Añadir `alumniOf` al schema `Person` de `/about`? Requiere saber si Eduardo quiere exponer información de estudios públicamente. **Decisión pendiente del autor.**
- ¿Los artículos de 2020-2021 deben tener sección FAQ aunque el contenido esté desactualizado? **Recomendación: no añadir FAQ a artículos que no se actualicen en esta change.**
