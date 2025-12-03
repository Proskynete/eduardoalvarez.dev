# Guía de Implementación: Artículos Listing

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

Mejorar la accesibilidad de la vista de listado de artículos para que usuarios de lectores de pantalla puedan:

1. **Entender inmediatamente** que están en una página de listado de todos los artículos del blog
2. **Navegar eficientemente** entre artículos usando listas semánticas
3. **Comprender la paginación** y navegar entre páginas de resultados
4. **Acceder a metadata** de cada artículo (fecha, tiempo de lectura, categorías)

### Alcance

**Archivos a modificar**:
- `src/pages/articulos/[...page].astro` (principal)
- `src/components/pagination/index.astro`
- `src/components/article/index.astro` (verificar mejoras de Fase 1)

**Tiempo estimado**: 1-2 horas

---

## Estructura Actual

### HTML Simplificado Actual

```astro
<!-- src/pages/articulos/[...page].astro -->
<Layout seo={seo}>
  <div class="flex flex-col">
    <section class="space-y-5 mb-20">
      <hgroup class="mb-8">
        <h1 class="font-hero text-4xl...">Artículos</h1>
        <p class="text-gray-400">Todo lo que he escrito en este blog, ordenado por fecha de publicación.</p>
      </hgroup>

      <section class="grid grid-cols-1 gap-5">
        <ul class="divide-y divide-gray-700">
          {data.slice(0, 5).map((post: ArticleLayout) => (
            <li class="py-6 first:pt-0">
              <Article article={post.frontmatter} />
            </li>
          ))}
        </ul>

        <Pagination next={next} prev={prev} />
      </section>
    </section>
  </div>
</Layout>
```

### Problemas Identificados

1. ❌ **Div wrapper innecesario**: `<div class="flex flex-col">` no aporta semántica
2. ❌ **Secciones anidadas confusas**: `<section>` dentro de `<section>` sin identificación clara
3. ❌ **hgroup correcto pero sin ID**: No conectado con aria-labelledby
4. ❌ **Paginación sin contexto**: No sabemos si es navegación

---

## Estructura Propuesta

### Mapa de Landmarks

```
<main id="main-content">
  └─ <section aria-labelledby="articles-heading">
     ├─ <hgroup>
     │  ├─ h1 id="articles-heading": "Artículos"
     │  └─ p: Descripción
     │
     ├─ <ul> Lista de artículos
     │  └─ <li><article>...</article></li> (8 artículos)
     │
     └─ <nav aria-label="Paginación de artículos">
        ├─ Link: "Artículos más recientes"
        └─ Link: "Artículos anteriores"
</main>
```

### Jerarquía de Headings

```
h1: "Artículos"
  h3: Título artículo 1
  h3: Título artículo 2
  h3: Título artículo 3
  ...
  h3: Título artículo 8
```

**Nota**: Los h3 vienen del componente `<Article>` que debe tener estructura correcta.

---

## Cambios Específicos

### Cambio 1: Simplificar Estructura Principal

#### Antes

```astro
<Layout seo={seo}>
  <div class="flex flex-col">
    <section class="space-y-5 mb-20">
      <hgroup class="mb-8">
        <h1 class="font-hero text-4xl leading-9 text-gray-100 sm:leading-10 md:text-3xl">Artículos</h1>
        <p class="text-gray-400">Todo lo que he escrito en este blog, ordenado por fecha de publicación.</p>
      </hgroup>

      <section class="grid grid-cols-1 gap-5">
        <!-- Contenido -->
      </section>
    </section>
  </div>
</Layout>
```

#### Después

```astro
<Layout seo={seo}>
  <section
    aria-labelledby="articles-heading"
    class="space-y-5 mb-20"
  >
    <hgroup class="mb-8">
      <h1
        id="articles-heading"
        class="font-hero text-4xl leading-9 text-gray-100 sm:leading-10 md:text-3xl"
      >
        Artículos
      </h1>
      <p class="text-gray-400">
        Todo lo que he escrito en este blog, ordenado por fecha de publicación.
      </p>
    </hgroup>

    <!-- Lista de artículos -->
    <ul class="divide-y divide-gray-700">
      {
        data.slice(0, 5).map((post: ArticleLayout) => (
          <li class="py-6 first:pt-0">
            <Article article={post.frontmatter} />
          </li>
        ))
      }
    </ul>

    <!-- Paginación -->
    <Pagination next={next} prev={prev} />
  </section>
</Layout>
```

**Por qué**:
- Eliminado `<div>` innecesario
- Eliminada sección anidada confusa
- `aria-labelledby` conecta sección con h1
- Estructura más plana y clara

---

### Cambio 2: Mejorar Componente de Paginación

#### Antes

```astro
<!-- src/components/pagination/index.astro -->
---
export interface Props {
  prev: string | undefined;
  next: string | undefined;
}

const { prev, next } = Astro.props;
---

<div class="flex justify-between mt-5">
  {
    prev && (
      <a
        href={prev}
        class="text-base font-medium leading-6 text-gray-100 hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
      >
        &larr; artículos más recientes
      </a>
    )
  }

  <span />

  {
    next && (
      <a
        href={next}
        class="text-base font-medium leading-6 text-gray-100 hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
      >
        artículos anteriores &rarr;
      </a>
    )
  }
</div>
```

#### Después

```astro
<!-- src/components/pagination/index.astro -->
---
export interface Props {
  prev: string | undefined;
  next: string | undefined;
}

const { prev, next } = Astro.props;
---

<nav
  aria-label="Paginación de artículos"
  class="flex justify-between mt-5"
>
  {
    prev ? (
      <a
        href={prev}
        aria-label="Ir a la página de artículos más recientes"
        class="text-base font-medium leading-6 text-gray-100 hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
      >
        &larr; artículos más recientes
      </a>
    ) : (
      <span aria-hidden="true"></span>
    )
  }

  {
    next ? (
      <a
        href={next}
        aria-label="Ir a la página de artículos anteriores"
        class="text-base font-medium leading-6 text-gray-100 hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
      >
        artículos anteriores &rarr;
      </a>
    ) : (
      <span aria-hidden="true"></span>
    )
  }
</nav>
```

**Cambios clave**:
1. `<div>` → `<nav>`: Crea landmark de navegación
2. `aria-label="Paginación de artículos"`: Identifica el propósito
3. Links con `aria-label` más descriptivo
4. `<span>` vacío tiene `aria-hidden="true"`
5. Operador ternario completo para manejar ambos casos

**Por qué**:
- Screen reader anuncia: "Navigation, Paginación de artículos"
- Usuario puede encontrar paginación con comando "N" (next navigation)
- ARIA labels dan contexto completo de cada link

---

### Cambio 3: Verificar Componente Article

El componente `Article` debe haber sido mejorado en Fase 1 (Home), pero verificamos:

#### Checklist para Article

```astro
<!-- src/components/article/index.astro -->

<!-- Debe tener esta estructura -->
<article>
  <a href={`/articulos/${article.slug}`}>
    <h3>{article.title}</h3>
  </a>

  <div class="flex flex-wrap gap-2 items-center text-sm text-gray-400">
    <!-- Fecha con aria-label -->
    <time
      datetime={article.date}
      aria-label={`Publicado el ${formatDateLong(article.date)}`}
    >
      {formatDateShort(article.date)}
    </time>

    <!-- Separador decorativo -->
    <span aria-hidden="true">·</span>

    <!-- Tiempo de lectura con aria-label -->
    <span aria-label={`Tiempo estimado de lectura: ${readingTime} minutos`}>
      {readingTime} min lectura
    </span>

    <!-- Categorías como lista si son múltiples -->
    {article.categories.length > 0 && (
      <>
        <span aria-hidden="true">·</span>
        <ul class="flex gap-2">
          {article.categories.map((cat) => (
            <li>
              <span class="text-primary-400">{cat}</span>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>

  <p class="mt-2 text-gray-300">
    {article.description}
  </p>
</article>
```

**Puntos críticos**:
- `<article>` como contenedor
- h3 dentro del link (no fuera) para que sea el título del article
- `<time>` con `datetime` y `aria-label`
- Separadores con `aria-hidden="true"`
- Metadata descriptiva

**Acción**:
Si el componente Article no cumple estos requisitos, ajustarlo. Si ya fue mejorado en Fase 1, solo verificar.

---

## Código de Implementación

### Archivo Completo: src/pages/articulos/[...page].astro

```astro
---
import type { GetStaticPaths } from "astro";
import Article from "../../components/article/index.astro";
import type { Article as IArticle, ArticleLayout } from "../../interfaces";
import Layout from "../../layouts/main/index.astro";
import { articlesSort } from "../../utils/articles";
import Pagination from "../../components/pagination/index.astro";

export const prerender = true;

type Frontmatter = IArticle;

const seo = {
  title: "Artículos",
};

export const getStaticPaths = (async ({ paginate }) => {
  const posts = await Astro.glob<Frontmatter>("./*.mdx");
  posts.sort(articlesSort);

  return paginate(posts, {
    pageSize: 8,
  });
}) satisfies GetStaticPaths;

const {
  page: {
    data,
    url: { next, prev },
  },
} = Astro.props;
---

<Layout seo={seo}>
  <section
    aria-labelledby="articles-heading"
    class="space-y-5 mb-20"
  >
    <hgroup class="mb-8">
      <h1
        id="articles-heading"
        class="font-hero text-4xl leading-9 text-gray-100 sm:leading-10 md:text-3xl"
      >
        Artículos
      </h1>
      <p class="text-gray-400">
        Todo lo que he escrito en este blog, ordenado por fecha de publicación.
      </p>
    </hgroup>

    <ul class="divide-y divide-gray-700">
      {
        data.slice(0, 5).map((post: ArticleLayout) => (
          <li class="py-6 first:pt-0">
            <Article article={post.frontmatter} />
          </li>
        ))
      }
    </ul>

    <Pagination next={next} prev={prev} />
  </section>
</Layout>
```

### Archivo Completo: src/components/pagination/index.astro

```astro
---
export interface Props {
  prev: string | undefined;
  next: string | undefined;
}

const { prev, next } = Astro.props;
---

<nav
  aria-label="Paginación de artículos"
  class="flex justify-between mt-5"
>
  {
    prev ? (
      <a
        href={prev}
        aria-label="Ir a la página de artículos más recientes"
        class="text-base font-medium leading-6 text-gray-100 hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
      >
        &larr; artículos más recientes
      </a>
    ) : (
      <span aria-hidden="true"></span>
    )
  }

  {
    next ? (
      <a
        href={next}
        aria-label="Ir a la página de artículos anteriores"
        class="text-base font-medium leading-6 text-gray-100 hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
      >
        artículos anteriores &rarr;
      </a>
    ) : (
      <span aria-hidden="true"></span>
    )
  }
</nav>
```

---

## Testing

### Checklist de Validación

#### 1. Navegación por Teclado

```bash
# Abrir http://localhost:4321/articulos
# Presionar Tab desde la barra de direcciones

✓ Skip link funciona
✓ Header navegación
✓ Lista de artículos (todos los links)
✓ Cada tarjeta de artículo es focusable
✓ Link de paginación "más recientes" (si existe)
✓ Link de paginación "anteriores" (si existe)
✓ Footer

✓ Orden lógico
✓ Focus siempre visible
```

#### 2. VoiceOver (macOS)

```bash
# Activar: Cmd + F5
# Abrir http://localhost:4321/articulos

# Test 1: Landmarks
Cmd + VO + U → Landmarks
✓ Banner (header)
✓ Navigation (nav principal)
✓ Main (contenido)
✓ Region "Artículos"
✓ Navigation "Paginación de artículos"
✓ Contentinfo (footer)

# Test 2: Headings
VO + Cmd + H (repetir)
✓ h1: "Artículos"
✓ h3: Título artículo 1
✓ h3: Título artículo 2
✓ h3: Título artículo 3
... (hasta 8 artículos)

# Test 3: Listas
VO + Cmd + X (siguiente lista)
✓ "List, 8 items" (o el número de artículos en la página)

# Test 4: Navegación
VO + Cmd + → (siguiente navigation)
✓ "Navigation, Paginación de artículos"
✓ Anuncia links con contexto completo

# Test 5: Lectura continua
VO + A (leer todo)
✓ Orden lógico: Header → Título → Descripción → Artículos → Paginación
✓ Cada artículo se lee con contexto (metadata)
✓ Paginación anunciada correctamente
```

#### 3. NVDA (Windows)

```bash
# Activar: Ctrl + Alt + N

# Landmarks
NVDA + D (repetir)
✓ "Main landmark"
✓ "Region, Artículos"
✓ "Navigation, Paginación de artículos"

# Headings
H (repetir)
✓ h1 → h3 (sin saltos)

# Listas
L (siguiente lista)
✓ Lista detectada con número correcto

# Navegación
N (siguiente navigation)
✓ Nav principal detectada
✓ Paginación detectada
```

#### 4. Axe DevTools

```bash
# Abrir DevTools → axe DevTools → Scan All

✓ 0 Critical issues
✓ 0 Serious issues
✓ 0 Moderate issues
✓ 0 Minor issues

# Verificar específicamente:
✓ page-has-heading-one: PASS (un solo h1)
✓ landmark-one-main: PASS
✓ region: PASS (region tiene aria-labelledby)
✓ list: PASS (estructura correcta)
✓ heading-order: PASS (h1 → h3, no saltos)
```

#### 5. Testing CLI

```bash
# Terminal
npm run test:a11y:articles

# O directamente
axe http://localhost:4321/articulos --exit

# Debe mostrar:
✓ No violations found
```

#### 6. Testing de Paginación

```bash
# Navegar a página 2 si existe
http://localhost:4321/articulos/2

# Verificar:
✓ Ambos links de paginación presentes
✓ "Artículos más recientes" lleva a página 1
✓ "Artículos anteriores" lleva a página 3 (si existe)
✓ Focus order correcto
✓ ARIA labels descriptivos
```

---

## Experiencia del Usuario

### Antes de los Cambios

```
Usuario con VoiceOver:
1. "Banner..." (header)
2. Tab Tab Tab (navegación)
3. "Main..." (contenido)
4. "Heading level 1, Artículos"
5. Tab → Link artículo 1 (sin contexto de que es una lista)
6. Tab → Link artículo 2
7. Tab → Link "artículos más recientes" (confuso, sin contexto)
```

**Problemas**:
- No sabe cuántos artículos hay
- No identifica la paginación como navegación
- Links de paginación sin contexto claro

### Después de los Cambios

```
Usuario con VoiceOver:
1. "Banner..." (header)
2. Cmd + VO + U → Landmarks
3. Selecciona "Main" → "Region, Artículos"
4. H → "Heading level 1, Artículos"
5. Leer descripción: "Todo lo que he escrito..."
6. L → "List, 8 items"
   - Sabe inmediatamente cuántos artículos hay
7. Tab Tab Tab (navega por artículos)
   - Cada artículo con metadata legible
8. N (next navigation) → "Navigation, Paginación de artículos"
   - Tab → "Link, Ir a la página de artículos más recientes"
   - Tab → "Link, Ir a la página de artículos anteriores"
```

**Mejoras**:
- ✅ Entiende estructura de lista inmediatamente
- ✅ Sabe cuántos artículos hay en la página
- ✅ Paginación identificada como navegación separada
- ✅ Links con contexto completo y descriptivo
- ✅ Puede saltar entre navegaciones con tecla N

---

## Casos Especiales

### Caso 1: Primera Página (Solo "Siguiente")

```astro
<!-- URL: /articulos o /articulos/1 -->
<!-- prev = undefined, next = "/articulos/2" -->

<nav aria-label="Paginación de artículos" class="flex justify-between mt-5">
  <span aria-hidden="true"></span>

  <a
    href="/articulos/2"
    aria-label="Ir a la página de artículos anteriores"
    class="..."
  >
    artículos anteriores &rarr;
  </a>
</nav>
```

**VoiceOver anuncia**:
- "Navigation, Paginación de artículos"
- Tab → "Link, Ir a la página de artículos anteriores"

### Caso 2: Última Página (Solo "Anterior")

```astro
<!-- URL: /articulos/5 (última) -->
<!-- prev = "/articulos/4", next = undefined -->

<nav aria-label="Paginación de artículos" class="flex justify-between mt-5">
  <a
    href="/articulos/4"
    aria-label="Ir a la página de artículos más recientes"
    class="..."
  >
    &larr; artículos más recientes
  </a>

  <span aria-hidden="true"></span>
</nav>
```

**VoiceOver anuncia**:
- "Navigation, Paginación de artículos"
- Tab → "Link, Ir a la página de artículos más recientes"

### Caso 3: Página Intermedia (Ambos Links)

```astro
<!-- URL: /articulos/3 -->
<!-- prev = "/articulos/2", next = "/articulos/4" -->

<nav aria-label="Paginación de artículos" class="flex justify-between mt-5">
  <a href="/articulos/2" aria-label="Ir a la página de artículos más recientes">
    &larr; artículos más recientes
  </a>

  <a href="/articulos/4" aria-label="Ir a la página de artículos anteriores">
    artículos anteriores &rarr;
  </a>
</nav>
```

**VoiceOver anuncia**:
- "Navigation, Paginación de artículos, 2 links"
- Tab → "Link, Ir a la página de artículos más recientes"
- Tab → "Link, Ir a la página de artículos anteriores"

---

## Resumen de Cambios

| Elemento | Antes | Después | Beneficio |
|----------|-------|---------|-----------|
| **Estructura** | Divs anidados | Section plano | Más simple |
| **Section** | Sin identificar | `aria-labelledby` | Región clara |
| **h1** | Sin ID | `id="articles-heading"` | Conectado a section |
| **Paginación** | `<div>` | `<nav aria-label>` | Landmark navegación |
| **Links paginación** | Texto básico | `aria-label` descriptivo | Contexto completo |
| **Spans vacíos** | Sin atributo | `aria-hidden="true"` | No confunde SR |

---

## Próximos Pasos

1. ✅ Implementar cambios en código
2. ✅ Testing manual con VoiceOver/NVDA
3. ✅ Testing automático con axe-core
4. ✅ Probar todas las páginas de paginación
5. ✅ Crear commit siguiendo formato del plan
6. ⏳ Pasar a Fase 3: Charlas y Talleres

---

**Documento creado**: 2025-12-03
**Última actualización**: 2025-12-03
**Versión**: 1.0.0
**Autor**: Eduardo Álvarez
**Estado**: ✅ Listo para implementación
