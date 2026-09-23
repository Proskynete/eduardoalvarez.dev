## Why

La sección de podcasts nunca tuvo capability en `openspec/specs/`: es la única página del sitio que se construyó sin spec, y se nota en el resultado. Cada tarjeta del listado replica entera la página de detalle —reproductor, descripción, tarjetas de invitado, tags, tres botones de plataforma y un "Ver episodio"— así que el índice hace el trabajo del detalle y el detalle no tiene ninguno.

Medido en un iPhone 14 (390px) con los cinco episodios actuales:

1. **5293px de alto, 6,3 pantallas** para listar cinco episodios. No hay forma de ver de un vistazo qué hay.
2. **Una banda de ~190px de degradado vacío** encabeza cada tarjeta: `image` es opcional en `PodcastEpisode` y ningún episodio la tiene, así que el contenedor pensado para la portada se pinta como un hueco negro.
3. **Cinco islas de React** que nadie usa: el listado hidrata un `AudioPlayer` por episodio con `client:visible` en una página desde la que nadie escucha.
4. **Sin jerarquía**: el episodio más reciente pesa exactamente igual que el más viejo.

Además, escribir este change destapó dos derivas entre el spec y el sitio:

- `site-navigation` declara `Podcast → /podcast (no-index, no nav link)` en "Hidden from nav". El enlace se activó en `d3cb5b0` sin actualizar el spec.
- El "no-index" nunca se implementó: `head.astro` emite `robots: index, follow` para todas las páginas y el sitemap ya publica `/podcasts/` más las cinco rutas de episodio. Con los datos actuales —que son fixtures con invitados inventados— eso es indexable.

## What Changes

- El listado deja de ser cinco páginas de detalle apiladas y pasa a ser un **índice denso**: una fila por episodio con número, título, meta y resumen, agrupadas por año.
- **Fuera del listado**: reproductor, tarjetas de invitado, botones de plataforma, tags, el botón "Ver episodio" y la banda de imagen. Todo eso ya vive en `/podcasts/[slug]`.
- **Jerarquía mínima**: badge `Último` en el episodio más reciente, y una línea de datos bajo la cabecera con el total (`5 episodios · 6h 5min`).
- **Agrupación por año**, el mismo idioma que `page-speaking` ya define para las charlas.
- El listado pasa a **no hidratar nada**: sin `AudioPlayer`, la página no monta React en cliente.
- Se registra en el spec que el podcast **está en la navegación** (corrige la deriva de `d3cb5b0`).

## Capabilities

### New Capabilities

- `page-podcasts`: El listado `/podcasts` como índice de episodios — estructura de la fila, agrupación por año, línea de totales, marca del último episodio, y qué NO aparece en el índice.

### Modified Capabilities

- `site-navigation`: El podcast deja de estar en "Hidden from nav" y pasa a la navegación primaria, en último lugar.

## Impact

**Archivos modificados:**
- `src/pages/podcasts/index.astro` — se reescribe el cuerpo del listado
- `openspec/specs/site-navigation/spec.md` — vía el delta de este change

**Archivos nuevos:**
- `src/components/podcast-row/index.astro` — la fila del índice
- `tests/e2e/podcasts.spec.ts` — cobertura del listado

**Sin cambios en datos.** `src/settings/podcasts.ts` no se toca: `image` sigue siendo opcional y sigue usándose en el detalle. Los episodios continúan siendo fixtures; este change no los convierte en contenido real ni resuelve el `no-index` — ambos quedan anotados como no-goals en `design.md` §D6.

**Sin cambios breaking.** `PodcastGuest` y `AudioPlayer` siguen existiendo y siguen consumiéndose desde `/podcasts/[slug]`.
