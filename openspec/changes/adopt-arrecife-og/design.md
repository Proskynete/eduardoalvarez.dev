## Context

- `@eduardoalvarez/arrecife/og` (0.13.0) exporta `articleTemplate`, `talkTemplate`, `courseTemplate`, `defaultTemplate` y `OG` (1200×630). Cada plantilla devuelve el árbol `{ type, props }` que pinta Satori; no hay React.
- Las plantillas usan tres familias: Bricolage Grotesque 800 (titular), Geist 400/700 y JetBrains Mono (eyebrow y firma). Las imágenes (aleta, caras, poses) se piden como `` `${basePath}/${archivo}` `` y por defecto `basePath` es `/brand`.
- Hoy `scripts/generate-og-default.mjs` dibuja la imagen por defecto con un SVG propio y sharp. `brand-assets.ts` la sirve versionada (`?v=<hash>`), porque `vercel.json` marca `/images/*` como `immutable` por un año.
- Los artículos son `.mdx` en `src/pages/articles/`, se renderizan bajo demanda y cada uno declara `seo_image`. Los escribe también el content manager por PR, que no corre scripts de marca.
- La portada de cada artículo la dibuja el content manager (capability `article-cover-image`): una ilustración de la marca sin texto, 1536×1024 en WebP. El PR la commitea en `public/images/articles/<slug>/<slug>.webp` y escribe esa ruta en `seo_image`. Si no pudo descargarla, deja la URL de Vercel Blob; si no hay portada, omite el campo.

## Goals / Non-Goals

**Goals:**
- La portada del content manager sigue siendo la OG del artículo: es la fuente de verdad.
- Un artículo cuya portada falta tiene igual una OG de marca, sin trabajo manual.
- Una red que ya guardó una tarjeta generada la vuelve a pedir cuando cambia lo que dibuja.

**Non-Goals:**
- OG para charlas: no tienen página propia, así que no hay URL que compartir. `talkTemplate` queda disponible para cuando exista.
- OG para podcasts: la sección está apagada.
- Reemplazar portadas existentes por la plantilla: ninguna se toca.
- La imagen por defecto con `defaultTemplate`: en la 0.13.0 la aleta se sale del halo y pasa el divisor, y la plantilla se está ajustando en la librería. `og-default.png` sigue saliendo de `scripts/generate-og-default.mjs`, y `defaultTemplate` queda como guía.
- Generar en runtime (edge u on-demand): todo se resuelve en el build.

## Decisions

**1. Artículos: endpoint prerenderizado, no PNG en el repositorio.**
`src/pages/og/articles/[slug].png.ts` con `prerender = true` y `getStaticPaths` desde `import.meta.glob("../../articles/*.mdx")`. Un artículo nuevo tiene su PNG en el siguiente build, sin pasos extra.
*Alternativa descartada:* extender `npm run brand:og` para escribir `public/images/og/<slug>.png` y commitearlos. Es coherente con el resto de la marca, pero un PR del content manager quedaría sin imagen hasta que alguien corriera el script.

**2. Imagen por defecto: no cambia.**
La prueba de humo con `defaultTemplate` mostró la aleta a 200 px, fuera del halo y casi sobre el divisor: el error que el script actual ya corrige dibujándola a 168. Hasta que la librería lo ajuste, `npm run brand:og` sigue como está.

**3. Satori → SVG → PNG con sharp.**
sharp ya es dependencia y convierte el SVG de Satori (el texto sale como trazos, así que librsvg no necesita fuentes). Se evita sumar `@resvg/resvg-js`, que trae binarios nativos.

**4. Fuentes leídas de disco en el build.**
Geist sale del paquete `geist` (TTF). Satori no lee `woff2`, y `@fontsource-variable/*` solo trae ese formato, así que se suman `@fontsource/bricolage-grotesque` (800) y `@fontsource/jetbrains-mono` (400) como devDependencies y se lee su `.woff` latin. Se cargan una vez por build en `src/utils/og.ts`.

**5. Imágenes de marca como `data:` URIs.**
Satori pide las `<img>` con `fetch`, y en el build no hay servidor. Se pasa `basePath: "arrecife:"` y, antes de pintar, se recorre el árbol y se reemplaza cada `src` que empieza por `arrecife:/` por el `data:image/png;base64` del archivo de `node_modules/@eduardoalvarez/arrecife/assets/brand/`. Así no hay que duplicar los PNG en `public/` y no se depende de la red.
*Alternativa descartada:* `basePath` con una URL absoluta de producción. El build dependería de que el sitio anterior esté arriba y de que sirva esos archivos.

**6. Qué imagen gana: una sola función, la portada primero.**
`ogImageFor(article)` en `src/utils/og.ts` devuelve `seo_image` salvo que falte o que sea una ruta local cuyo archivo no está en `public/`; en esos casos devuelve `/og/articles/<slug>.png?v=<hash>`. Una URL absoluta (la de Blob) se respeta: no se puede comprobar sin red. La usan `head` (vía el layout), el `BlogPosting` y Algolia, para que las tres digan lo mismo.

**6b. Qué archivos existen se sabe en el build.**
Los artículos se renderizan bajo demanda en la función de Vercel, que no tiene `public/` en su disco. `astro.config.mjs` ya lee los `.mdx` al arrancar (para el `lastmod` del sitemap); ahí mismo lista `public/images/articles/` y lo inyecta como `__ARTICLE_COVERS__` con `vite.define`, igual que `__SENTRY_RELEASE__`. `ogImageFor` recibe la lista como parámetro para que los tests no dependan del disco.
*Alternativa descartada:* `import.meta.glob` sobre `public/`: Vite emitiría cada imagen como asset y las duplicaría.

**7. Versión en la URL.**
`v` es un hash corto de lo que dibuja la plantilla (título, categoría, minutos de lectura) más la versión de arrecife. Si cambia el título o la librería redibuja, cambia la URL y LinkedIn y X la vuelven a pedir. Si no cambia nada, la URL es la misma entre builds.

**8. Datos de la plantilla.**
- `title`: el `title` del frontmatter.
- `category`: la primera categoría, como etiqueta legible (`CategoryMap`).
- `readingMinutes`: `calculateReadingTime` sobre el cuerpo crudo del MDX (`?raw`, sin frontmatter). Puede diferir en ±1 minuto del que muestra la página, que cuenta el HTML; se acepta.
- `expression`: la de la plantilla (`hearts`). No se agrega un campo al frontmatter mientras nadie lo pida.

## Risks / Trade-offs

- [Builds más lentos: Satori más sharp por artículo] → Son 12 artículos y unos cientos de ms cada uno. Las fuentes y los PNG se leen una vez.
- [Un título largo corta en 3 líneas con elipsis] → Es lo que define la plantilla. Si el corte molesta en un artículo, el override es `seo_image`.
- [La plantilla cambia de forma en una versión menor de arrecife] → La versión entra en el hash: la imagen cambia de URL, no queda una tarjeta vieja en caché. Revisarlas al subir arrecife.
- [`astro check` sobre un endpoint que devuelve binario] → El endpoint devuelve `new Response(png, { headers: { "content-type": "image/png" } })`, que es un tipo válido de `APIRoute`.

## Migration Plan

1. Hacer opcional `seo_image` y conectar `ogImageFor`: ningún artículo cambia, porque todos tienen el campo y su archivo.
2. Publicar el endpoint y revisar las 12 PNG generadas en `dist`.
3. Cuando arrecife ajuste `defaultTemplate`, evaluar en otro change si `og-default.png` pasa a la plantilla.

Rollback: volver a exigir `seo_image` y borrar el endpoint. Las PNG generadas no se referencian desde ningún otro lado.

## Open Questions

- ¿La categoría va como slug (`ai-native-engineering`, como sugiere el comentario de la plantilla) o como etiqueta legible? Se parte de la etiqueta y se revisa en la primera tanda.
- ¿El content manager debería dejar de escribir la URL de Blob cuando no pudo descargar la portada? Hoy se respeta; es un cambio del otro repo.
