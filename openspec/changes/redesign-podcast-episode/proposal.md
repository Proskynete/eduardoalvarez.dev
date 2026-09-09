## Why

`redesign-podcast-index` declaró la página de episodio como non-goal —"ya hace su trabajo"— y eso era verdad sólo en comparación con el índice de entonces. Vista sola, arrastra los mismos defectos que el índice acababa de perder, más los suyos.

Medido en `/podcasts/de-junior-a-senior` (390px, iPhone 14: 3790px de alto, 4,5 pantallas):

1. **El hueco negro sigue aquí, y es más grande**: `h-64 md:h-80`, entre 256 y 320px de degradado vacío con el título encima, porque `image` es opcional y ningún episodio la tiene. Es literalmente el mismo defecto que el change anterior eliminó del listado.
2. **El título se dice tres veces en la primera pantalla**: en el breadcrumb, en el hero y dentro del reproductor, al que se le pasa `title={podcast.title}`.
3. **El reproductor va envuelto en una `Card` titulada "Escuchar episodio"**: una tarjeta y un encabezado para un control que se explica solo, ~90px antes de poder darle al play.
4. **En móvil los invitados quedan enterrados**: el aside cae después de las notas completas, a más de tres pantallas de scroll. En un podcast de entrevistas, el invitado es la razón de escuchar, no un metadato.
5. **"Temas tratados" es una sección con `h2`** —del mismo nivel que las notas del episodio— para pintar tres badges.
6. El velo negro obliga a fijar el texto en blanco en los dos temas; el código ya lo documenta como excepción al sistema de tokens. Al quitar el hero, la excepción desaparece con él.

## What Changes

- **Fuera el hero de degradado vacío.** La cabecera pasa a ser texto: badge de episodio, meta (`20 nov 2024 · 1h 32min`), `<h1>` y la línea de invitados. El episodio se identifica en tres líneas en lugar de en 320px.
- **Cuando exista `image`, se pinta como portada** junto a la cabecera, con proporción propia — no como banda de fondo detrás del título. Sin imagen no se reserva nada.
- **El reproductor queda desnudo y primero**: sin `Card`, sin el encabezado "Escuchar episodio" y sin repetir el título dentro.
- **Los invitados suben**: en móvil van justo después del reproductor; en desktop siguen en el raíl.
- **Los temas bajan a una fila de badges** bajo la meta, sin encabezado propio.
- **El orden en móvil pasa a ser**: cabecera → reproductor → invitados → sobre el episodio → notas → plataformas → compartir → volver.

## Capabilities

### New Capabilities

- `page-podcast-detail`: La página de episodio — cabecera, portada opcional, reproductor, invitados, notas, plataformas y compartir, y el orden en que aparecen en cada ancho.

## Impact

**Archivos modificados:**
- `src/pages/podcasts/[slug].astro` — cabecera, reproductor y orden de las secciones

**Sin archivos nuevos.** La fila del índice no se reutiliza aquí y `PodcastGuest` sigue sirviendo tal cual.

**Sin cambios en datos.** `image` sigue siendo opcional; este change cambia cómo se dibuja cuando existe y qué NO se dibuja cuando no.

**Fuera de alcance:** los seis overrides `prose-*` escritos a mano en este archivo, que probablemente duplican `assets/styles/article.css`. Es una consolidación de tipografía de prosa, no de esta vista.
