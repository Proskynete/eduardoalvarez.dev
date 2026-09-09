## Why

La sección de podcasts se abrió al público en `d3cb5b0` para poder revisarla en el preview, y desde entonces se rediseñaron el índice y la página de episodio. Lo que no cambió son los datos: los cinco episodios siguen siendo fixtures — audio de `soundhelix.com`, enlaces `spotify.com/episode/mock1` e invitados inventados con cargo y empresa reales.

Publicar eso no es una sección a medias: es información falsa sobre personas que existen, indexable. Se cierra hasta que haya un episodio de verdad.

Cerrarla sólo en la navegación no basta. Las rutas se construían igual, respondían 200 escribiendo la URL, y `/podcasts/` estaba anunciada en el sitemap — que es lo que este mismo trabajo descubrió que llevaba tiempo pasando.

## What Changes

- **Una sola llave**: `podcastsEnabled` en `src/settings/podcasts.ts`, hoy en `false`.
- **La navegación** deja de mostrar el enlace, en la barra y en el cajón móvil.
- **Las rutas dejan de existir**: `/podcasts` responde 404 y `getStaticPaths` no declara ningún episodio, así que tampoco se llega escribiendo la URL ni desde un resultado de búsqueda antiguo.
- **El sitemap** deja de anunciarlas.
- **Los tests del índice y del episodio quedan saltados, no borrados**: describen el diseño que vuelve entero cuando se encienda la llave, y hay tests nuevos que verifican que ahora está cerrada.

## Capabilities

### Modified Capabilities

- `site-navigation`: el podcast vuelve a "Hidden from nav", ahora gobernado por una llave y no por un booleano suelto.
- `page-podcasts`: se añade el comportamiento de la sección apagada.

## Impact

**Archivos modificados:**
- `src/settings/podcasts.ts` — la llave
- `src/layouts/base/components/header/constants/index.ts` — el enlace la sigue
- `src/pages/podcasts/index.astro` — deja de prerenderizarse y responde 404
- `src/pages/podcasts/[slug].astro` — sin rutas
- `astro.config.mjs` — el sitemap las excluye
- `tests/e2e/podcasts.spec.ts` — la suite sigue la llave

**Ninguna vista se borra.** El diseño del índice y del episodio queda intacto en el repositorio; lo único que cambia es si el público puede llegar.

**Supersede** el delta de `site-navigation` de `redesign-podcast-index`, que quedó sin archivar y decía lo contrario.
