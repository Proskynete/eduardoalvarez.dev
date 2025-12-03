# Guía de Implementación: Artículo Individual

## Índice

1. [Visión General](#visión-general)
2. [Estructura Actual](#estructura-actual)
3. [Estructura Propuesta](#estructura-propuesta)
4. [Cambios Específicos](#cambios-específicos)
5. [Código de Implementación](#código-de-implementación)
6. [Testing](#testing)
7. [Experiencia del Usuario](#experiencia-del-usuario)

---

## Visión General

### Objetivo

Mejorar la accesibilidad de la vista de artículo individual para que usuarios de lectores de pantalla puedan:

1. **Entender inmediatamente** que están leyendo un artículo específico
2. **Navegar eficientemente** usando la tabla de contenidos (TOC)
3. **Acceder al contenido principal** sin distraerse con el sidebar
4. **Comprender la jerarquía** de headings del contenido
5. **Usar comentarios y botones** de compartir accesiblemente

### Alcance

**Archivos a modificar**:
- `src/layouts/article/index.astro` (estructura principal)
- `src/layouts/article/components/head.astro` (header del artículo)
- `src/layouts/article/components/aside.astro` (sidebar/TOC)
- `src/layouts/article/components/giscus.tsx` (comentarios, verificar)

**Tiempo estimado**: 3-4 horas

---

## Estructura Actual

### HTML Simplificado Actual

```astro
<!-- src/layouts/article/index.astro -->
<Layout seo={seo}>
  <article>
    <div class="xl:divide-y xl:divide-gray-700">
      <Head content={content} />

      <div class="grid grid-rows-[auto_1fr]...">
        <Aside content={content} timeToRead={timeToRead} ... />

        <div class="divide-y divide-gray-700 col-span-3...">
          <div id="article-body" class="max-w-none pb-8 prose-invert">
            <slot />
          </div>

          <GiscusWrapper client:load slug={content.slug} />
        </div>
      </div>
    </div>
  </article>

  <!-- Botón flotante de compartir -->
  <div class="fixed bottom-10...">
    <a href={toShare}>Comparte el artículo</a>
  </div>
</Layout>
```

### Problemas Identificados

1. ❌ **Article sin identificación**: No tiene aria-label
2. ❌ **Aside sin identificar**: No sabemos que es navegación complementaria
3. ❌ **TOC sin estructura**: Links sueltos sin nav ni ul
4. ❌ **Metadata sin aria-label**: Tiempo de lectura sin contexto
5. ❌ **Secciones sin identificar**: article-body y comentarios sin landmarks
6. ❌ **Categorías sin lista**: Párrafos sueltos en lugar de lista
7. ❌ **Artículos relacionados sin nav**: No es navegación clara
8. ❌ **Botón compartir sin contexto**: Falta aria-label descriptivo

---

## Estructura Propuesta

### Mapa de Landmarks

```
<main id="main-content">
  └─ <article aria-labelledby="article-title">
     ├─ <header>
     │  ├─ Metadata (fecha, autor)
     │  └─ h1 id="article-title": Título del artículo
     │
     ├─ <aside aria-label="Navegación del artículo">
     │  ├─ <section aria-label="Metadata">
     │  │  ├─ Categorías (ul)
     │  │  └─ Tiempo de lectura (con aria-label)
     │  │
     │  ├─ <nav aria-label="Tabla de contenidos">
     │  │  └─ <ul> Lista de secciones
     │  │
     │  ├─ <nav aria-label="Artículos relacionados">
     │  │  ├─ Link: Siguiente
     │  │  └─ Link: Anterior
     │  │
     │  └─ Link: Volver al inicio
     │
     ├─ <section aria-label="Contenido del artículo">
     │  └─ Contenido MDX con h2, h3, h4...
     │
     ├─ <section aria-label="Comentarios">
     │  └─ Giscus iframe
     │
     └─ Link flotante: Compartir artículo
</main>
```

### Jerarquía de Headings

```
h1: Título del artículo
  h2: Sección 1 del contenido
    h3: Subsección 1.1
    h3: Subsección 1.2
  h2: Sección 2 del contenido
    h3: Subsección 2.1
      h4: Sub-subsección 2.1.1
```

**Crítico**: Asegurar que el contenido MDX siga esta jerarquía.

---

## Cambios Específicos

### Cambio 1: Identificar Article Principal

#### Antes

```astro
<!-- src/layouts/article/index.astro -->
<article>
  <div class="xl:divide-y xl:divide-gray-700">
    <Head content={content} />
    <!-- ... -->
  </div>
</article>
```

#### Después

```astro
<!-- src/layouts/article/index.astro -->
<article
  aria-labelledby="article-title"
  class="xl:divide-y xl:divide-gray-700"
>
  <Head content={content} />
  <!-- ... -->
</article>
```

**Por qué**:
- `aria-labelledby` conecta article con h1
- Removido div innecesario
- Screen reader: "Article, [título del artículo]"

---

### Cambio 2: Mejorar Header del Artículo

#### Antes

```astro
<!-- src/layouts/article/components/head.astro -->
<header class="xl:pb-6">
  <div class="space-y-1 text-center">
    <dl class="space-y-10">
      <div>
        <dt class="sr-only">Publicado el</dt>
        <dd class="text-base font-avenir leading-6 text-gray-400">
          <time date-time={content.date}>
            {new Date(content.date).toLocaleDateString()}
          </time>
        </dd>
      </div>
    </dl>

    <div>
      <h1 class="text-3xl...">
        {content.title}
      </h1>
    </div>

    <p class="flex gap-1 justify-center">
      ¿Ves alguna errata?
      <a href={githubArticlePath(content.slug)}>
        Haz una pull request <Icon.Github width={25} />
      </a>
    </p>
  </div>
</header>
```

#### Después

```astro
<!-- src/layouts/article/components/head.astro -->
<header class="xl:pb-6">
  <div class="space-y-1 text-center">
    <dl class="space-y-10">
      <div>
        <dt class="sr-only">Fecha de publicación</dt>
        <dd class="text-base font-avenir leading-6 text-gray-400">
          <time
            datetime={content.date}
            aria-label={`Publicado el ${new Date(content.date).toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`}
          >
            {new Date(content.date).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </dd>
      </div>
    </dl>

    <div>
      <h1
        id="article-title"
        class="text-3xl font-hero leading-9 tracking-tight text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14"
      >
        {content.title}
      </h1>
    </div>

    <p class="flex gap-1 justify-center">
      ¿Ves alguna errata?
      <a
        href={githubArticlePath(content.slug)}
        aria-label="Contribuir con una pull request en GitHub para corregir erratas"
        target="_blank"
        rel="noopener noreferrer"
        class="flex gap-1 text-primary-400 hover:text-primary-600 transition ease-in-out duration-300"
      >
        Haz una pull request
        <Icon.Github width={25} aria-hidden="true" />
      </a>
    </p>
  </div>
</header>
```

**Cambios clave**:
1. h1 con `id="article-title"` para conectar con article
2. `<time>` con `aria-label` en formato largo
3. Link de GitHub con `aria-label` descriptivo
4. Icono con `aria-hidden="true"`
5. Atributo `datetime` corregido (era `date-time`)

---

### Cambio 3: Reestructurar Aside (Sidebar)

#### Antes

```astro
<!-- src/layouts/article/components/aside.astro -->
<aside class="xl:sticky pt-10 top-3 col-span-4 xl:col-span-1">
  <div class="text-sm font-medium leading-5 divide-gray-700 divide-y">
    <div class="...">
      <!-- Categorías -->
      <div class="pb-4 w-full">
        <p class="text-xs uppercase tracking-wide mb-2">Categorías</p>
        <div class="flex flex-wrap">
          {content.categories.map((category: CategoryAllowed) => (
            <p class="mr-3 text-gray-400">{CategoryMap.get(category)}</p>
          ))}
        </div>
      </div>

      <!-- Tiempo de lectura -->
      <div class="py-4...">
        <h3 class="text-xs uppercase tracking-wide mb-2">Tiempo de lectura</h3>
        <div class="flex flex-wrap text-gray-400">
          {timeToRead} {prettyTimeToReadText}
        </div>
      </div>
    </div>

    <!-- TOC -->
    <div class="py-4 hidden xl:block">
      <p class="text-xs uppercase tracking-wide mb-2">Secciones</p>
      {content.sections.map((section: { anchor: string; title: string }) => (
        <a href={`#${section.anchor}`}...>{section.title}</a>
      ))}
    </div>

    <!-- Artículos relacionados -->
    <div class="py-4 flex flex-col gap-4">
      {nextArticle && (...)}
      {previousArticle && (...)}
    </div>

    <!-- Volver al inicio -->
    <div class="py-4">
      <a href="/" aria-label="Volver al inicio">...</a>
    </div>
  </div>
</aside>
```

#### Después

```astro
<!-- src/layouts/article/components/aside.astro -->
<aside
  aria-label="Navegación del artículo"
  class="xl:sticky pt-10 top-3 col-span-4 xl:col-span-1"
>
  <div class="text-sm font-medium leading-5 divide-gray-700 divide-y">
    <!-- SECCIÓN 1: METADATA -->
    <section
      aria-label="Información del artículo"
      class="flex flex-col xl:flex-row md:gap-y-0 sm:flex-row xl:block xl:space-y-8 divide-y divide-gray-700 sm:divide-y-0 xl:divide-y"
    >
      <!-- Categorías -->
      <div class="pb-4 w-full">
        <h2 class="text-xs uppercase tracking-wide mb-2">Categorías</h2>
        <ul class="flex flex-wrap gap-2 list-none">
          {content.categories.map((category: CategoryAllowed) => (
            <li>
              <span class="text-gray-400">{CategoryMap.get(category)}</span>
            </li>
          ))}
        </ul>
      </div>

      <!-- Tiempo de lectura -->
      <div class="py-4 sm:pt-0 xl:pt-4 w-full !mt-0">
        <h2 class="text-xs uppercase tracking-wide mb-2">Tiempo de lectura</h2>
        <p
          class="text-gray-400"
          aria-label={`Tiempo estimado de lectura: ${timeToRead} ${prettyTimeToReadText}`}
        >
          {timeToRead} {prettyTimeToReadText}
        </p>
      </div>
    </section>

    <!-- SECCIÓN 2: TOC (TABLA DE CONTENIDOS) -->
    <nav
      aria-label="Tabla de contenidos"
      class="py-4 hidden xl:block"
    >
      <h2 class="text-xs uppercase tracking-wide mb-2">Secciones</h2>
      <ul class="flex flex-col gap-1 list-none">
        {content.sections.map((section: { anchor: string; title: string }) => (
          <li>
            <a
              href={`#${section.anchor}`}
              class="flex w-fit text-primary-400 hover:text-primary-500 transition ease-in-out duration-300"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>

    <!-- SECCIÓN 3: ARTÍCULOS RELACIONADOS -->
    <nav
      aria-label="Artículos relacionados"
      class="py-4 flex flex-col gap-4"
    >
      <h2 class="sr-only">Artículos relacionados</h2>

      {nextArticle && (
        <div class="flex flex-col">
          <h3 class="flex items-center text-xs uppercase tracking-wide">
            Siguiente artículo
          </h3>
          <a
            href={`/articulos/${nextArticle.frontmatter.slug}`}
            aria-label={`Siguiente: ${nextArticle.frontmatter.title}`}
            class="flex w-fit text-primary-400 hover:text-primary-500 transition ease-in-out duration-300"
          >
            <span class="text-md">{nextArticle.frontmatter.title}</span>
          </a>
        </div>
      )}

      {previousArticle && (
        <div class="flex flex-col">
          <h3 class="flex items-center text-xs uppercase tracking-wide">
            Artículo anterior
          </h3>
          <a
            href={`/articulos/${previousArticle.frontmatter.slug}`}
            aria-label={`Anterior: ${previousArticle.frontmatter.title}`}
            class="flex w-fit text-primary-400 hover:text-primary-500 transition ease-in-out duration-300"
          >
            <span class="text-md">{previousArticle.frontmatter.title}</span>
          </a>
        </div>
      )}
    </nav>

    <!-- SECCIÓN 4: VOLVER AL INICIO -->
    <div class="py-4">
      <a
        href="/"
        aria-label="Volver a la página principal"
        class="flex text-primary-400 hover:text-primary-500 transition ease-in-out duration-300"
      >
        <Icon.ArrowLeft width={18} aria-hidden="true" />
        Volver a la raíz
      </a>
    </div>
  </div>
</aside>
```

**Cambios clave**:
1. `<aside>` con `aria-label="Navegación del artículo"`
2. Categorías: `<ul><li>` en lugar de `<p>`
3. p de títulos → h2 (jerarquía correcta bajo article > header > h1)
4. Tiempo de lectura con `aria-label` descriptivo
5. TOC: `<nav>` con `<ul><li>`
6. Relacionados: `<nav>` con h2 sr-only + h3 para cada uno
7. Links con `aria-label` completos
8. Icono con `aria-hidden="true"`

---

### Cambio 4: Identificar Secciones de Contenido y Comentarios

#### Antes

```astro
<!-- src/layouts/article/index.astro -->
<div class="divide-y divide-gray-700 col-span-3...">
  <div id="article-body" class="max-w-none pb-8 prose-invert">
    <slot />
  </div>

  <GiscusWrapper client:load slug={content.slug} />
</div>
```

#### Después

```astro
<!-- src/layouts/article/index.astro -->
<div class="divide-y divide-gray-700 col-span-3 xl:pb-0 xl:col-start-2 xl:row-span-2 pt-4 xl:pt-0">
  <section
    id="article-body"
    aria-label="Contenido del artículo"
    class="max-w-none pb-8 prose-invert"
  >
    <slot />
  </section>

  <section aria-label="Comentarios">
    <h2 class="sr-only">Comentarios</h2>
    <GiscusWrapper client:load slug={content.slug} />
  </section>
</div>
```

**Por qué**:
- `<section aria-label="Contenido del artículo">`: Región identificada
- `<section aria-label="Comentarios">`: Separación clara
- h2 screen-reader only para jerarquía
- Landmarks navegables con D/R

---

### Cambio 5: Botón de Compartir Accesible

#### Antes

```astro
<!-- src/layouts/article/index.astro -->
<div class="fixed bottom-10 left-0 w-screen flex items-center justify-center">
  <a
    target="_blank"
    rel="nofollow noopener"
    href={toShare}
    class="flex items-center justify-center py-2 px-4 bg-white rounded-full shadow-md text-neutral-800 cursor-pointer transition-transform transform-gpu hover:scale-105"
  >
    Comparte el artículo
  </a>
</div>
```

#### Después

```astro
<!-- src/layouts/article/index.astro -->
<div class="fixed bottom-10 left-0 w-screen flex items-center justify-center z-50">
  <a
    href={toShare}
    target="_blank"
    rel="nofollow noopener"
    aria-label={`Compartir "${content.title}" en Twitter`}
    class="flex items-center justify-center py-2 px-4 bg-white rounded-full shadow-md text-neutral-800 cursor-pointer transition-transform transform-gpu hover:scale-105"
  >
    <span>Comparte el artículo</span>
  </a>
</div>
```

**Por qué**:
- `aria-label` con contexto completo del artículo
- z-50 para asegurar que no quede oculto
- `<span>` para texto visible

---

### Cambio 6: Verificar Giscus Wrapper

```tsx
// src/layouts/article/components/giscus.tsx
export function GiscusWrapper({ slug }: { slug: string }) {
  return (
    <div className="pt-6 pb-6">
      <Giscus
        id="comments"
        repo={GISCUS_REPO}
        repoId={GISCUS_REPO_ID}
        category="General"
        categoryId={GISCUS_CATEGORY_ID}
        mapping="specific"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="dark"
        lang="es"
        loading="lazy"
      />
    </div>
  );
}
```

**Verificar**:
- El componente Giscus de @giscus/react maneja la accesibilidad del iframe
- El iframe debería tener `title="Comentarios"`
- Si no lo tiene, verificar documentación de Giscus

---

## Código de Implementación

### Archivo Completo: src/layouts/article/index.astro

```astro
---
import "../../assets/styles/article.css";

import Layout from "../base/index.astro";
import Head from "./components/head.astro";
import Aside from "./components/aside.astro";
import { articlesSort } from "../../utils/articles";
import { GiscusWrapper } from "./components/giscus";
import { calculateReadingTime } from "../../utils/reading-time";
import type { Props as BaseHeadProps } from "../base/components/head.astro";
import type { Article } from "../../interfaces";

type Frontmatter = Article;

type Props = {
  content: Article;
};

const { content } = Astro.props;

const timeToRead = calculateReadingTime(await Astro.slots.render("default"));

const articles = await Astro.glob<Frontmatter>("../../pages/articulos/*.mdx");
const articleFound = articles.sort(articlesSort).findIndex((article) => article.frontmatter.slug === content.slug);

const previousArticle = articles[articleFound + 1];
const nextArticle = articles[articleFound - 1];

const tags = content.categories.map((tag) => tag.replaceAll(/(-)/g, "")).join(",");
const toShare = `https://twitter.com/intent/tweet?text=${content.title}&url=https://www.eduardoalvarez.dev/articulos/${content.slug}&via=proskynete&hashtags=${tags}`;

const seo: BaseHeadProps = {
  title: content.title,
  description: content.description,
  image: content.seo_image,
  slug: `/articulos/${content.slug}`,
};
---

<Layout seo={seo}>
  <article
    aria-labelledby="article-title"
    class="xl:divide-y xl:divide-gray-700"
  >
    <Head content={content} />

    <div class="grid grid-rows-[auto_1fr] divide-y divide-gray-700 xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
      <Aside
        content={content}
        timeToRead={timeToRead}
        nextArticle={nextArticle}
        previousArticle={previousArticle}
      />

      <div class="divide-y divide-gray-700 col-span-3 xl:pb-0 xl:col-start-2 xl:row-span-2 pt-4 xl:pt-0">
        <section
          id="article-body"
          aria-label="Contenido del artículo"
          class="max-w-none pb-8 prose-invert"
        >
          <slot />
        </section>

        <section aria-label="Comentarios">
          <h2 class="sr-only">Comentarios</h2>
          <GiscusWrapper client:load slug={content.slug} />
        </section>
      </div>
    </div>
  </article>

  <div class="fixed bottom-10 left-0 w-screen flex items-center justify-center z-50">
    <a
      href={toShare}
      target="_blank"
      rel="nofollow noopener"
      aria-label={`Compartir "${content.title}" en Twitter`}
      class="flex items-center justify-center py-2 px-4 bg-white rounded-full shadow-md text-neutral-800 cursor-pointer transition-transform transform-gpu hover:scale-105"
    >
      <span>Comparte el artículo</span>
    </a>
  </div>
</Layout>
```

---

## Testing

### Checklist de Validación

#### 1. Navegación por Teclado

```bash
# Abrir artículo: http://localhost:4321/articulos/[slug]
# Presionar Tab

✓ Skip link funciona (salta a #article-body)
✓ Header navegación
✓ Link de GitHub (contribuir)
✓ TOC links (todos focusables)
✓ Artículos relacionados (focusables)
✓ Volver al inicio (focusable)
✓ Contenido del artículo (links internos focusables)
✓ Comentarios Giscus (campos focusables)
✓ Botón compartir (focusable)
✓ Footer

✓ Orden lógico
✓ Focus visible
```

#### 2. VoiceOver (macOS)

```bash
# Test 1: Landmarks
Cmd + VO + U → Landmarks
✓ Banner (header)
✓ Navigation (nav principal)
✓ Main (contenido)
✓ Article "[título]"
✓ Complementary "Navegación del artículo" (aside)
✓ Region "Información del artículo"
✓ Navigation "Tabla de contenidos"
✓ Navigation "Artículos relacionados"
✓ Region "Contenido del artículo"
✓ Region "Comentarios"
✓ Contentinfo (footer)

# Test 2: Headings
VO + Cmd + H (repetir)
✓ h1: Título del artículo
✓ h2: Categorías
✓ h2: Tiempo de lectura
✓ h2: Secciones
✓ h2: Artículos relacionados (sr-only)
✓ h3: Siguiente artículo
✓ h3: Artículo anterior
✓ h2: Comentarios (sr-only)
✓ h2: Primera sección del contenido
✓ h3: Subsección...
... (continuar por todo el contenido)

# Test 3: Navegaciones
N (next navigation)
✓ "Navigation, Tabla de contenidos"
N
✓ "Navigation, Artículos relacionados"

# Test 4: TOC
Tab hasta TOC
✓ Cada link anuncia sección
Enter en link
✓ Salta a sección correcta

# Test 5: Metadata
✓ Time anuncia formato largo
✓ Categorías detectadas como lista
✓ Tiempo de lectura con contexto

# Test 6: Comentarios
Tabular hasta Giscus
✓ "Region, Comentarios"
✓ Iframe accesible
✓ Campos de comentarios focusables
```

#### 3. Axe DevTools

```bash
✓ 0 violations
✓ page-has-heading-one: PASS (un solo h1)
✓ landmark-one-main: PASS
✓ region: PASS (todas las regiones tienen label)
✓ heading-order: PASS (h1 → h2 → h3, sin saltos)
✓ bypass: PASS (skip link funcional)
✓ aria-valid-attr-value: PASS
✓ link-name: PASS (todos los links tienen nombre accesible)
```

#### 4. Testing CLI

```bash
# Probar con un artículo de ejemplo
npm run test:a11y:article

# O directamente
axe http://localhost:4321/articulos/mi-articulo-ejemplo --exit

✓ No violations found
```

#### 5. Testing de Contenido MDX

```bash
# Verificar manualmente en varios artículos:
✓ h1 solo en el título (no en contenido)
✓ Contenido empieza con h2
✓ No hay saltos (h2 → h4)
✓ IDs de headings coinciden con TOC
✓ Links internos funcionan
✓ Code blocks tienen lenguaje identificado
✓ Imágenes tienen alt descriptivo
```

---

## Experiencia del Usuario

### Antes de los Cambios

```
Usuario con VoiceOver:
1. H → "Heading level 1, [título]"
2. Tab → Fecha (sin contexto completo)
3. Tab → Link categoría (sin saber que es categoría)
4. Tab → Link TOC (confuso, sin estructura)
5. Tab → Contenido (empieza a leer)
6. No sabe dónde terminan los comentarios
```

**Problemas**:
- No puede saltar entre regiones fácilmente
- No entiende estructura del sidebar
- No sabe cuándo empieza/termina cada sección

### Después de los Cambios

```
Usuario con VoiceOver:
1. D (next landmark) → "Article, [título del artículo]"
   H → "Heading level 1, [título]"
   → "Time, Publicado el lunes 15 de marzo de 2024"
2. D → "Complementary, Navegación del artículo"
   H → "Heading level 2, Categorías"
   L → "List, 3 items"
   H → "Heading level 2, Tiempo de lectura"
   → "5 minutos, Tiempo estimado de lectura: 5 minutos"
3. N (next navigation) → "Navigation, Tabla de contenidos"
   H → "Heading level 2, Secciones"
   L → "List, 4 items"
   Tab → "Link, Introducción"
4. D → "Region, Contenido del artículo"
   H (repetir) → Navega por h2, h3, h4 del contenido
5. D → "Region, Comentarios"
   H → "Heading level 2, Comentarios"
6. Tab → Botón compartir
   → "Link, Compartir [título] en Twitter"
```

**Mejoras**:
- ✅ Navegación por landmarks eficiente
- ✅ Sidebar completamente estructurado
- ✅ TOC navegable como lista
- ✅ Contenido y comentarios claramente separados
- ✅ Todos los elementos con contexto completo

---

## Casos Especiales

### Caso 1: Artículo Sin Artículos Relacionados

```astro
<!-- Si es el único artículo o primero/último -->
{!nextArticle && !previousArticle && (
  <p class="py-4 text-sm text-gray-400">
    Este es el primer artículo del blog.
  </p>
)}
```

### Caso 2: TOC Muy Largo

Si el artículo tiene muchas secciones, considerar:

```astro
<nav
  aria-label="Tabla de contenidos"
  class="py-4 hidden xl:block max-h-96 overflow-y-auto"
>
  <!-- Scroll si es necesario -->
</nav>
```

### Caso 3: Contenido Sin Secciones

Si el artículo no tiene `content.sections` en frontmatter:

```astro
{content.sections && content.sections.length > 0 && (
  <nav aria-label="Tabla de contenidos" class="py-4 hidden xl:block">
    <!-- TOC -->
  </nav>
)}
```

---

## Resumen de Cambios

| Elemento | Antes | Después | Beneficio |
|----------|-------|---------|-----------|
| **Article** | Sin identificar | `aria-labelledby` | Conectado con h1 |
| **Aside** | Sin label | `aria-label="Navegación"` | Landmark claro |
| **Categorías** | Párrafos | `<ul><li>` | Lista semántica |
| **Tiempo de lectura** | Sin contexto | `aria-label` completo | Contextual |
| **TOC** | Links sueltos | `<nav><ul><li>` | Navegación + lista |
| **Relacionados** | Divs | `<nav>` con h2/h3 | Jerarquía + nav |
| **Contenido** | Div | `<section aria-label>` | Región identificada |
| **Comentarios** | Sin identificar | `<section>` con h2 | Separado claramente |
| **Botón compartir** | Sin contexto | `aria-label` completo | Descriptivo |
| **Headings sidebar** | p | h2, h3 | Jerarquía correcta |

---

## Validación Final

### Checklist Completo

- [ ] **Estructura**
  - [ ] Article con aria-labelledby
  - [ ] Aside con aria-label
  - [ ] Todas las secciones identificadas

- [ ] **Headings**
  - [ ] h1 único en el título
  - [ ] h2 en sidebar (categorías, tiempo, secciones, relacionados, comentarios)
  - [ ] h3 en artículos relacionados individual
  - [ ] Contenido MDX sigue jerarquía (h2 → h3 → h4)

- [ ] **Navegaciones**
  - [ ] TOC como `<nav><ul><li>`
  - [ ] Relacionados como `<nav>`
  - [ ] Ambas con aria-label

- [ ] **Metadata**
  - [ ] Time con aria-label
  - [ ] Categorías como lista
  - [ ] Tiempo de lectura con aria-label

- [ ] **Accesibilidad**
  - [ ] Tab order lógico
  - [ ] Focus visible
  - [ ] Screen reader coherente
  - [ ] axe-core 0 violations

---

## Próximos Pasos

1. ✅ Implementar cambios en todos los archivos
2. ✅ Testing exhaustivo con artículos reales
3. ✅ Verificar jerarquía de headings en contenido MDX
4. ✅ Testing con VoiceOver/NVDA
5. ✅ Testing automático con axe-core
6. ✅ Crear commit final
7. ✅ **COMPLETAR ESPECIFICACIÓN** ✨

---

**Documento creado**: 2025-12-03
**Última actualización**: 2025-12-03
**Versión**: 1.0.0
**Autor**: Eduardo Álvarez
**Estado**: ✅ Listo para implementación

---

## Conclusión de la Especificación

Con este documento se completa la especificación completa de **Accesibilidad con Screen Readers** para todas las vistas del sitio web:

✅ **01_analisis-tecnico.md** - Fundamentos y diagnóstico
✅ **02_plan-implementacion.md** - Estrategia de 4 fases
✅ **03_guia-home.md** - Página principal
✅ **04_guia-articulos-listing.md** - Lista de artículos
✅ **05_guia-charlas-talleres.md** - Charlas y talleres
✅ **06_guia-articulo-individual.md** - Artículo individual

**Siguiente paso**: Comenzar implementación en Fase 1 (Home).
