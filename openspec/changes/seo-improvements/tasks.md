## 1. Correcciones técnicas base

- [ ] 1.1 Crear `public/robots.txt` con `User-agent: *`, `Disallow:` vacío y `Sitemap: https://eduardoalvarez.dev/sitemap-index.xml` (preservar comentarios AI-signals al final)
- [ ] 1.2 Corregir `<html lang="es">` a `<html lang="es-ES">` en `src/layouts/base/index.astro`
- [ ] 1.3 Corregir la referencia rota al favicon en `src/layouts/base/components/head.astro` — verificar que `public/images/favicon/blue.ico` existe y que la ruta en `<link rel="icon">` sea correcta
- [ ] 1.4 Verificar que `https://eduardoalvarez.dev/robots.txt` responde con las nuevas directivas (no 404)

## 2. Meta description guard

- [ ] 2.1 En `src/layouts/base/components/head.astro`, añadir `.slice(0, 160)` al renderizar `<meta name="description">` y `<meta property="og:description">`
- [ ] 2.2 Verificar en el artículo "Empezando en el desarrollo web" que la description renderizada tiene ≤ 160 caracteres
- [ ] 2.3 Actualizar `CLAUDE.md` — añadir en la sección "Adding a Blog Article" que `description` debe tener ≤ 160 caracteres

## 3. Keywords por artículo

- [ ] 3.1 Añadir `keywords?: string[]` al tipo `Article` en `src/interfaces/index.ts`
- [ ] 3.2 Actualizar `BaseHeadProps` en `src/layouts/base/components/head.astro` para aceptar prop `keywords?: string[]`
- [ ] 3.3 En `head.astro`, reemplazar el uso directo de `settings.keywords` en `<meta name="keywords">` por: usar `keywords` prop si está presente, si no usar `settings.keywords`
- [ ] 3.4 En `src/layouts/article/index.astro`, extraer `content.keywords` del frontmatter y pasarlo al `seo` prop de `<Layout>`
- [ ] 3.5 Verificar con TypeScript (`npm run build`) que no hay errores de tipo

## 4. Open Graph para artículos

- [ ] 4.1 Añadir prop `ogType?: 'website' | 'article'` a `BaseHeadProps` en `src/layouts/base/components/head.astro` (default: `'website'`)
- [ ] 4.2 Reemplazar `<meta property="og:type" content="website">` por el valor dinámico del prop `ogType`
- [ ] 4.3 Añadir props opcionales `articlePublishedTime?: string`, `articleAuthor?: string`, `articleTags?: string[]` a `BaseHeadProps`
- [ ] 4.4 En `head.astro`, renderizar condicionalmente los meta tags `article:published_time`, `article:author` y N veces `article:tag` cuando `ogType === 'article'`
- [ ] 4.5 En `src/layouts/article/index.astro`, construir el objeto `seo` con `ogType: 'article'`, `articlePublishedTime: content.date`, `articleAuthor: settings.author.name` y `articleTags: content.categories`
- [ ] 4.6 Verificar en el HTML renderizado de un artículo que `og:type` es `"article"` y que los meta tags `article:*` están presentes

## 5. Schema markup JSON-LD

- [ ] 5.1 Añadir prop `schema?: Record<string, unknown>` a `BaseHeadProps` en `src/layouts/base/components/head.astro`
- [ ] 5.2 En `head.astro`, renderizar `<script type="application/ld+json" set:html={JSON.stringify(schema)} />` si el prop `schema` está presente
- [ ] 5.3 En `src/pages/index.astro`, construir el objeto schema `WebSite` con `@context`, `@type`, `name`, `url` y `potentialAction` (SearchAction)
- [ ] 5.4 En `src/pages/index.astro`, construir el objeto schema `Person` con `@context`, `@type`, `name`, `url`, `email`, `jobTitle` y `sameAs` (GitHub, LinkedIn, Twitter)
- [ ] 5.5 Combinar los schemas de homepage en un array `@graph` o pasarlos como un único objeto y pasarlo al prop `schema` del layout
- [ ] 5.6 En `src/layouts/article/index.astro`, construir el schema `BlogPosting` con `@context`, `@type`, `headline`, `description`, `datePublished`, `url`, `image`, `author` (Person inline) y `keywords`
- [ ] 5.7 Derivar `keywords` del schema `BlogPosting` desde `content.keywords` si existe, o desde `content.categories` como fallback
- [ ] 5.8 Pasar el schema `BlogPosting` al prop `schema` del `<Layout>` en el layout de artículo
- [ ] 5.9 Verificar con `document.querySelectorAll('script[type="application/ld+json"]')` en DevTools que los schemas aparecen en homepage y en un artículo
- [ ] 5.10 Validar los schemas con Google Rich Results Test (`https://search.google.com/test/rich-results`) — deben pasar sin errores críticos

## 6. Alt text en artículos MDX

- [ ] 6.1 En `src/pages/articles/empezando-en-el-desarrollo-web.mdx`, reemplazar `alt="stacks"` en la imagen `front-back.webp` por texto descriptivo (ej. `"Diagrama comparativo entre Frontend y Backend"`)
- [ ] 6.2 En el mismo artículo, actualizar `alt="stacks"` en `api.webp` (ej. `"Diagrama de comunicación entre aplicaciones mediante una API"`)
- [ ] 6.3 En el mismo artículo, actualizar `alt="stacks"` en `git-github.webp` (ej. `"Flujo de trabajo con Git y repositorios en GitHub"`)
- [ ] 6.4 Revisar los demás artículos MDX en `src/pages/articles/` en busca de imágenes con alt text genérico o vacío y corregirlas

## 7. Sitemap con lastmod

- [ ] 7.1 En `astro.config.mjs`, añadir la opción `serialize` al plugin `sitemap()` para incluir `<lastmod>` en las URLs de artículos usando la fecha del frontmatter
- [ ] 7.2 Verificar en `https://eduardoalvarez.dev/sitemap-0.xml` (después de build) que los artículos tienen `<lastmod>`

## 8. Verificación final

- [ ] 8.1 Ejecutar `npm run build` sin errores de TypeScript ni de build
- [ ] 8.2 Ejecutar `npm run lint` sin errores
- [ ] 8.3 Ejecutar `npm run test:run` — todos los tests deben pasar
- [ ] 8.4 Abrir la homepage en DevTools y confirmar: `<html lang="es-ES">`, JSON-LD con WebSite + Person, `og:type="website"`, description ≤ 160 chars
- [ ] 8.5 Abrir un artículo (ej. `/articles/empezando-en-el-desarrollo-web`) en DevTools y confirmar: JSON-LD con BlogPosting, `og:type="article"`, meta tags `article:*`, description ≤ 160 chars, alt text descriptivo en imágenes
- [ ] 8.6 Verificar `robots.txt` en producción referencia el sitemap correcto
