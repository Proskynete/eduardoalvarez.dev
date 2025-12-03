# Guía de Implementación: Home Page

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

Mejorar la accesibilidad de la página principal para que usuarios de lectores de pantalla puedan:

1. **Entender inmediatamente** que están en la página principal del portfolio de Eduardo Álvarez
2. **Navegar eficientemente** entre las 3 secciones principales: Perfil, Artículos, Newsletter
3. **Acceder rápidamente** a redes sociales y contenido destacado
4. **Completar el formulario** de newsletter con feedback claro

### Alcance

**Archivos a modificar**:
- `src/pages/index.astro` (principal)
- `src/components/article/index.astro` (si es necesario)
- `src/components/subscribe/index.astro` (verificar)

**Tiempo estimado**: 2-3 horas

---

## Estructura Actual

### HTML Simplificado Actual

```astro
<!-- src/pages/index.astro -->
<Layout seo={seo}>
  <div class="flex flex-col md:flex-row...">
    <!-- Imagen y bio -->
    <Image src={ME} alt="..." />
    <div>
      <h1>¡Hola! Mi nombre es Eduardo Álvarez.</h1>
      <div class="mt-4 space-y-4 md:space-y-2">
        <p>Ingeniero de Software...</p>

        <!-- Links de redes sociales -->
        {config.social_network.map((social) => (
          <span class="inline-flex...">
            <a href={social.link}>{social.name}</a>
          </span>
        ))}
      </div>
    </div>
  </div>

  <section class="space-y-5 mb-20">
    <h2>Últimos artículos</h2>
    <ul class="divide-y divide-gray-700">
      {posts.map(({ frontmatter }) => (
        <li class="py-6 first:pt-0">
          <Article article={frontmatter} />
        </li>
      ))}
    </ul>
    <div class="flex justify-end">
      <a href="/articulos">Ver todos los artículos &rarr;</a>
    </div>
  </section>

  <Subscribe />
</Layout>
```

### Problemas Identificados

1. ❌ **Div-soup en sección de perfil**: No hay landmark semántico
2. ❌ **Redes sociales sin estructura**: No es una lista semántica ni navegación
3. ❌ **Section sin identificar**: "Últimos artículos" no tiene aria-label
4. ❌ **Subscribe sin contexto**: No sabemos si es una sección importante

---

## Estructura Propuesta

### Mapa de Landmarks

```
<main id="main-content">
  ├─ <section aria-label="Perfil del autor">
  │  ├─ h1: "¡Hola! Mi nombre es Eduardo Álvarez"
  │  ├─ Párrafo: Bio
  │  └─ <nav aria-label="Redes sociales">
  │     └─ <ul> Lista de links
  │
  ├─ <section aria-labelledby="latest-articles-heading">
  │  ├─ h2 id="latest-articles-heading": "Últimos artículos"
  │  ├─ <ul> Lista de artículos
  │  │  └─ <li><article>...</article></li>
  │  └─ Link: "Ver todos los artículos"
  │
  └─ <section aria-label="Newsletter">
     ├─ h2: "Suscríbete al newsletter"
     └─ <form>...</form>
</main>
```

### Jerarquía de Headings

```
h1: "¡Hola! Mi nombre es Eduardo Álvarez"
  h2: "Últimos artículos"
    h3: Título artículo 1
    h3: Título artículo 2
    h3: Título artículo 3
  h2: "Suscríbete al newsletter" (o visually hidden)
```

---

## Cambios Específicos

### Cambio 1: Sección de Perfil con Landmark

#### Antes

```astro
<div class="flex flex-col md:flex-row md:space-x-6 items-center content-center md:w-5/6 md:mx-auto m-auto mb-20">
  <Image src={ME} alt="Ilustración de Eduardo Alvarez" ... />
  <div>
    <h1>¡Hola! Mi nombre es Eduardo Álvarez.</h1>
    <div class="mt-4 space-y-4 md:space-y-2">
      <p>Ingeniero de Software...</p>
      {/* Links */}
    </div>
  </div>
</div>
```

#### Después

```astro
<section
  aria-label="Perfil del autor"
  class="flex flex-col md:flex-row md:space-x-6 items-center content-center md:w-5/6 md:mx-auto m-auto mb-20"
>
  <Image
    src={ME}
    alt="Ilustración de Eduardo Alvarez"
    class="min-w-[205px] min-h-[200px] w-[205px] h-[200px] focus:outline"
    loading="lazy"
    decoding="async"
  />

  <div>
    <h1 class="font-hero font-semibold text-3xl text-gray-100 sm:leading-10 md:leading-14 text-center md:text-left">
      ¡Hola! Mi nombre es Eduardo Álvarez.
    </h1>

    <div class="mt-4 space-y-4 md:space-y-2">
      <p>
        Ingeniero de Software con más de {getDifferenceInYears()} años de experiencia creando productos digitales centrados
        en el usuario. Me especializo en frontend, liderazgo técnico y arquitectura. En este sitio comparto lo que he aprendido
        construyendo soluciones reales para equipos y empresas de toda Latinoamérica.
      </p>

      <!-- Cambio 2 va aquí -->
    </div>
  </div>
</section>
```

**Por qué**:
- `<section>` crea un landmark "region" que VoiceOver puede detectar
- `aria-label="Perfil del autor"` le da un nombre descriptivo a la región
- Screen reader anuncia: "Region, Perfil del autor"

---

### Cambio 2: Redes Sociales como Navegación

#### Antes

```astro
{config.social_network
  .filter((social) => social.show)
  .map((social, i) => (
    <span class="inline-flex rounded-md shadow-sm">
      <a
        href={social.link}
        target="_blank"
        rel="noopener noreferrer"
        class="text-base font-medium leading-6 text-gray-100  hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
      >
        {social.name}
      </a>
      {i !== config.social_network.filter((social) => social.show).length - 1 && (
        <span class="mx-2 text-gray-400">/</span>
      )}
    </span>
  ))
}
```

#### Después

```astro
<nav aria-label="Redes sociales">
  <ul class="flex flex-wrap gap-2 items-center">
    {config.social_network
      .filter((social) => social.show)
      .map((social) => (
        <li class="flex items-center">
          <a
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visitar mi perfil de ${social.name}`}
            class="text-base font-medium leading-6 text-gray-100 hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
          >
            {social.name}
          </a>
        </li>
      ))
    }
  </ul>
</nav>
```

**Cambios clave**:
1. `<nav>` crea un landmark de navegación
2. `aria-label="Redes sociales"` identifica el propósito
3. `<ul><li>` estructura semántica de lista
4. Cada link tiene `aria-label` descriptivo
5. Removido el separador "/" (innecesario con gap de flexbox)

**Por qué**:
- Screen reader anuncia: "Navigation, Redes sociales, list 4 items"
- Usuario puede saltar directamente con tecla "N" (next navigation)
- Lista detectada permite navegar con comandos de lista

**Nota sobre el separador**:
El separador "/" era visual y confundía a lectores de pantalla. Con `gap-2` en flexbox, mantenemos separación visual sin ruido semántico.

---

### Cambio 3: Sección de Artículos con Identificación

#### Antes

```astro
<section class="space-y-5 mb-20">
  <h2 class="font-hero text-4xl leading-9 text-gray-100 sm:leading-10 md:text-3xl">Últimos artículos</h2>

  <ul class="divide-y divide-gray-700">
    {posts.map(({ frontmatter }) => (
      <li class="py-6 first:pt-0">
        <Article article={frontmatter} />
      </li>
    ))}
  </ul>

  {posts.length >= _MAX_ARTICLES && (
    <div class="flex justify-end">
      <a href="/articulos" class="text-base font-medium...">
        Ver todos los artículos &rarr;
      </a>
    </div>
  )}
</section>
```

#### Después

```astro
<section
  aria-labelledby="latest-articles-heading"
  class="space-y-5 mb-20"
>
  <h2
    id="latest-articles-heading"
    class="font-hero text-4xl leading-9 text-gray-100 sm:leading-10 md:text-3xl"
  >
    Últimos artículos
  </h2>

  <ul class="divide-y divide-gray-700">
    {posts.map(({ frontmatter }) => (
      <li class="py-6 first:pt-0">
        <Article article={frontmatter} />
      </li>
    ))}
  </ul>

  {posts.length >= _MAX_ARTICLES && (
    <div class="flex justify-end">
      <a
        href="/articulos"
        aria-label="Ver todos los artículos del blog"
        class="text-base font-medium leading-6 text-gray-100 hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
      >
        Ver todos los artículos &rarr;
      </a>
    </div>
  )}
</section>
```

**Por qué**:
- `aria-labelledby` conecta la sección con su heading
- Screen reader: "Region, Últimos artículos"
- Link "Ver todos" tiene aria-label más descriptivo

---

### Cambio 4: Verificar Componente Subscribe

El componente `Subscribe` ya tiene buena accesibilidad gracias a mejoras anteriores, pero verificamos:

#### Checklist para Subscribe

```astro
<!-- src/components/subscribe/index.astro -->

<!-- ✅ Debe tener landmark -->
<section aria-label="Newsletter">
  <h2 class="sr-only">Suscríbete al newsletter</h2>

  <form>
    <!-- ✅ Labels asociados -->
    <label for="name" class="sr-only">Nombre completo</label>
    <input
      id="name"
      aria-required="true"
      aria-describedby="name-error"
    />
    <p id="name-error" aria-live="polite"></p>

    <!-- ✅ Mismo patrón para email -->
    <label for="email" class="sr-only">Correo electrónico</label>
    <input
      id="email"
      type="email"
      aria-required="true"
      aria-describedby="email-error"
    />
    <p id="email-error" aria-live="polite"></p>

    <!-- ✅ Botón descriptivo -->
    <button type="submit" aria-label="Suscribirse al newsletter">
      Suscribirme
    </button>
  </form>
</section>
```

**Acción**:
- Si Subscribe no tiene `<section aria-label>`, agregarlo
- Si no tiene h2 (aunque sea screen-reader only), agregarlo
- Verificar aria-required y aria-live ya existen (deberían desde fase anterior)

---

## Código de Implementación

### Archivo Completo: src/pages/index.astro

```astro
---
import Article from "../components/article/index.astro";
import type { Article as IArticle } from "../interfaces";
import Layout from "../layouts/main/index.astro";
import config from "../settings";
import { articlesSort } from "../utils/articles";
import { Image } from "astro:assets";
import Subscribe from "../components/subscribe/index.astro";
import ME from "../assets/images/eduardo_alvarez.webp";
import { getDifferenceInYears } from "../utils/date";

export const prerender = true;

interface Posts {
  frontmatter: IArticle;
}

const _MAX_ARTICLES = 3;
const posts: Posts[] = await Astro.glob("./articulos/*.mdx");
posts.sort(articlesSort).splice(_MAX_ARTICLES);

const seo = {
  title: "Inicio",
};
---

<Layout seo={seo}>
  <!-- SECCIÓN 1: PERFIL -->
  <section
    aria-label="Perfil del autor"
    class="flex flex-col md:flex-row md:space-x-6 items-center content-center md:w-5/6 md:mx-auto m-auto mb-20"
  >
    <Image
      src={ME}
      alt="Ilustración de Eduardo Alvarez"
      class="min-w-[205px] min-h-[200px] w-[205px] h-[200px] focus:outline"
      loading="lazy"
      decoding="async"
    />

    <div>
      <h1 class="font-hero font-semibold text-3xl text-gray-100 sm:leading-10 md:leading-14 text-center md:text-left">
        ¡Hola! Mi nombre es Eduardo Álvarez.
      </h1>

      <div class="mt-4 space-y-4 md:space-y-2">
        <p>
          Ingeniero de Software con más de {getDifferenceInYears()} años de experiencia creando productos digitales centrados
          en el usuario. Me especializo en frontend, liderazgo técnico y arquitectura. En este sitio comparto lo que he aprendido
          construyendo soluciones reales para equipos y empresas de toda Latinoamérica.
        </p>

        <nav aria-label="Redes sociales">
          <ul class="flex flex-wrap gap-2 items-center">
            {config.social_network
              .filter((social) => social.show)
              .map((social) => (
                <li class="flex items-center">
                  <a
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visitar mi perfil de ${social.name}`}
                    class="text-base font-medium leading-6 text-gray-100 hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
                  >
                    {social.name}
                  </a>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </div>
  </section>

  <!-- SECCIÓN 2: ÚLTIMOS ARTÍCULOS -->
  <section
    aria-labelledby="latest-articles-heading"
    class="space-y-5 mb-20"
  >
    <h2
      id="latest-articles-heading"
      class="font-hero text-4xl leading-9 text-gray-100 sm:leading-10 md:text-3xl"
    >
      Últimos artículos
    </h2>

    <ul class="divide-y divide-gray-700">
      {
        posts.map(({ frontmatter }) => (
          <li class="py-6 first:pt-0">
            <Article article={frontmatter} />
          </li>
        ))
      }
    </ul>

    {
      posts.length >= _MAX_ARTICLES && (
        <div class="flex justify-end">
          <a
            href="/articulos"
            aria-label="Ver todos los artículos del blog"
            class="text-base font-medium leading-6 text-gray-100 hover:text-gray-300 focus:text-gray-300 transition ease-in-out duration-300"
          >
            Ver todos los artículos &rarr;
          </a>
        </div>
      )
    }
  </section>

  <!-- SECCIÓN 3: NEWSLETTER -->
  <Subscribe />
</Layout>
```

### Componente Subscribe (Verificar)

```astro
<!-- src/components/subscribe/index.astro -->
<section
  aria-label="Newsletter"
  class="border border-gray-700 rounded-lg p-6 mt-12"
>
  <h2 class="text-2xl font-bold mb-4">
    Suscríbete al newsletter
  </h2>

  <p class="mb-6 text-gray-400">
    Recibe las últimas actualizaciones directamente en tu correo.
  </p>

  <form id="subscribe-form">
    <div class="mb-4">
      <label for="name" class="block text-sm mb-2">
        Nombre completo
      </label>
      <input
        type="text"
        id="name"
        name="name"
        required
        minlength="2"
        maxlength="50"
        aria-required="true"
        aria-describedby="name-error"
        class="w-full bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="Nombre"
      />
      <p id="name-error" class="text-red-400 text-xs mt-1 hidden" aria-live="polite"></p>
    </div>

    <div class="mb-4">
      <label for="email" class="block text-sm mb-2">
        Correo electrónico
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        maxlength="100"
        aria-required="true"
        aria-describedby="email-error"
        class="w-full bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="Correo electrónico"
      />
      <p id="email-error" class="text-red-400 text-xs mt-1 hidden" aria-live="polite"></p>
    </div>

    <div>
      <button
        type="submit"
        id="submit-button"
        aria-label="Suscribirse al newsletter"
        class="min-w-40 h-11 w-full md:w-max mt-2 p-2 bg-gray-800 text-gray-100 rounded-md flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-default"
      >
        <span id="button-text">Suscribirme</span>
      </button>
    </div>
  </form>
</section>

<!-- Script de manejo del formulario ya existe -->
```

---

## Testing

### Checklist de Validación

#### 1. Navegación por Teclado

```bash
# Abrir http://localhost:4321
# Presionar Tab desde la barra de direcciones

✓ Skip link aparece y funciona
✓ Logo focusable
✓ Búsqueda Algolia focusable
✓ Links de navegación focusables
✓ Imagen de perfil focusable (con focus:outline)
✓ Links de redes sociales todos focusables
✓ Tarjetas de artículos focusables
✓ Link "Ver todos" focusable
✓ Campos del form focusables
✓ Botón submit focusable
✓ Footer links focusables

✓ Orden lógico
✓ Focus siempre visible
```

#### 2. VoiceOver (macOS)

```bash
# Activar: Cmd + F5
# Abrir http://localhost:4321

# Test 1: Landmarks
Cmd + VO + U → Landmarks
✓ Banner (header)
✓ Navigation (nav principal)
✓ Main (contenido)
✓ Region "Perfil del autor"
✓ Navigation "Redes sociales"
✓ Region "Últimos artículos"
✓ Region "Newsletter"
✓ Contentinfo (footer)

# Test 2: Headings
VO + Cmd + H (repetir)
✓ h1: "¡Hola! Mi nombre es Eduardo Álvarez"
✓ h2: "Últimos artículos"
✓ h3: Título artículo 1
✓ h3: Título artículo 2
✓ h3: Título artículo 3
✓ h2: "Suscríbete al newsletter"

# Test 3: Listas
VO + Cmd + X (siguiente lista)
✓ "List, Redes sociales, 4 items"
✓ "List, Artículos, 3 items"

# Test 4: Lectura continua
VO + A (leer todo)
✓ Orden lógico: Perfil → Redes → Artículos → Newsletter
✓ ARIA labels anunciados correctamente
✓ No se lee contenido escondido
```

#### 3. NVDA (Windows)

```bash
# Activar: Ctrl + Alt + N

# Landmarks
NVDA + D (repetir)
✓ "Main landmark"
✓ "Region, Perfil del autor"
✓ "Navigation, Redes sociales"
✓ "Region, Últimos artículos"
✓ "Region, Newsletter"

# Headings
H (repetir)
✓ Jerarquía correcta

# Listas
L (repetir)
✓ Listas detectadas
```

#### 4. Axe DevTools

```bash
# Instalar extensión
# Abrir DevTools → axe DevTools → Scan All

✓ 0 Critical issues
✓ 0 Serious issues
✓ 0 Moderate issues
✓ 0 Minor issues

# Verificar específicamente:
✓ page-has-heading-one: PASS
✓ landmark-one-main: PASS
✓ region: PASS (todos los regions tienen label)
✓ list: PASS (estructura correcta)
✓ label: PASS (todos los inputs tienen label)
```

#### 5. Testing CLI

```bash
# Terminal
npm run test:a11y:home

# Debe mostrar:
✓ No violations found
```

---

## Experiencia del Usuario

### Antes de los Cambios

```
Usuario con VoiceOver:
1. "Banner..." (header)
2. Tab Tab Tab (navegación)
3. "Main..." (contenido)
4. Tab → Imagen
5. Tab → Link "GitHub" (confuso, sin contexto)
6. Tab → Link "LinkedIn"
7. Tab → Link (tarjeta artículo, pero no sabe que es un artículo)
8. "Grupo..." (subscribe, pero no sabe que es newsletter)
```

**Problemas**:
- No puede saltar rápidamente a secciones
- No entiende la estructura
- Links sin contexto

### Después de los Cambios

```
Usuario con VoiceOver:
1. "Banner..." (header)
2. Cmd + VO + U → Landmarks → "Main"
3. D (next landmark) → "Region, Perfil del autor"
   - H → "Heading level 1, ¡Hola! Mi nombre es Eduardo Álvarez"
   - D → "Navigation, Redes sociales"
   - L → "List, 4 items"
4. D → "Region, Últimos artículos"
   - H → "Heading level 2, Últimos artículos"
   - L → "List, 3 items"
   - Tab Tab Tab (artículos)
5. D → "Region, Newsletter"
   - H → "Heading level 2, Suscríbete al newsletter"
   - F (next form field) → Nombre
   - F → Email
   - F → Botón suscribirse
```

**Mejoras**:
- ✅ Navegación por landmarks (D key)
- ✅ Navegación por headings (H key)
- ✅ Navegación por listas (L key)
- ✅ Contexto claro en cada sección
- ✅ ARIA labels descriptivos

---

## Resumen de Cambios

| Elemento | Antes | Después | Beneficio |
|----------|-------|---------|-----------|
| **Sección Perfil** | `<div>` | `<section aria-label>` | Landmark detectable |
| **Redes Sociales** | `<span>` con links | `<nav><ul><li>` | Navegación + lista |
| **Links sociales** | Solo texto | `aria-label` descriptivo | Contexto claro |
| **Sección Artículos** | `<section>` sin label | `aria-labelledby` | Región identificada |
| **Link "Ver todos"** | Texto genérico | `aria-label` completo | Más descriptivo |
| **Newsletter** | Sin verificar | Verificado landmarks + ARIA | Completo |

---

## Próximos Pasos

1. ✅ Implementar cambios en código
2. ✅ Testing manual con VoiceOver/NVDA
3. ✅ Testing automático con axe-core
4. ✅ Crear commit siguiendo formato del plan
5. ⏳ Pasar a Fase 2: Artículos Listing

---

**Documento creado**: 2025-12-03
**Última actualización**: 2025-12-03
**Versión**: 1.0.0
**Autor**: Eduardo Álvarez
**Estado**: ✅ Listo para implementación
