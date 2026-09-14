## Context

`/podcasts` es la única página del sitio sin capability en `openspec/specs/`, y su listado se construyó como una pila de tarjetas que replican el detalle. La página de episodio (`/podcasts/[slug]`) existe y está bien: tiene reproductor, notas en markdown, invitados con `AuthorCard`, plataformas y compartir. El problema es que el índice enseña todo eso también, así que ninguna de las dos páginas tiene un papel propio.

El sitio ya resolvió este mismo problema dos veces: `/articles` usa `ArticleCard` en rejilla y `/speaking` agrupa `TalkCard` por año. El listado de podcasts es el que se quedó fuera de esa consolidación.

## Goals / Non-Goals

**Goals:**
- Que los cinco episodios se puedan escanear y elegir sin scroll infinito, y que la forma aguante cincuenta.
- Devolverle a `/podcasts/[slug]` su razón de existir.
- Eliminar el hueco de 190px sin exigir arte por episodio.
- Que el listado no hidrate JavaScript.
- Registrar por fin el podcast en el spec, incluida su presencia en la navegación.

**Non-Goals:**
- Sustituir los datos fixture por episodios reales (§D6).
- Resolver el `no-index` que `site-navigation` declara y nunca se implementó (§D6).
- Tocar la página de detalle: ya hace su trabajo.
- Reproducir audio desde el índice — se descartó explícitamente al elegir el enfoque.
- Filtro por tema o por invitado (§D5).
- Portadas por episodio (§D2).

## Decisions

### D1 — Lista densa, no rejilla de tarjetas

**Decisión:** Una fila por episodio con cuatro datos: número, título, meta (`fecha · duración · con invitados`) y resumen a una línea. La fila entera es el `<a>`.

**Alternativa considerada:** Rejilla de dos columnas con `CourseCard`, que acepta `meta` como lista y encaja semánticamente.
**Rechazada porque:** Una tarjeta sin portada es una caja con tres líneas de texto. Con cinco episodios la rejilla se ve más vacía que una lista apretada, y la lista escala mejor cuando haya cincuenta.

**Alternativa considerada:** Híbrido — el último episodio destacado con reproductor y el resto en filas.
**Rechazada porque:** Reintroduce en el índice el reproductor que este change saca, y la jerarquía se consigue con un badge que cuesta una línea.

### D2 — El hueco de la portada se elimina quitándolo, no llenándolo

**Decisión:** El listado deja de intentar pintar `image`. El campo sigue existiendo en `PodcastEpisode` y sigue usándose en el detalle.

**Alternativa considerada:** Exigir una portada por episodio, que es lo que hace que un listado de podcast parezca un podcast.
**Rechazada porque:** Compromete al autor a producir una pieza gráfica por episodio para siempre, y hoy no hay ninguna. La lista funciona sin arte; la rejilla no.

### D3 — Fila compuesta con tokens, y no `LinkRow`

**Decisión:** Componer la fila en `src/components/podcast-row/index.astro` con los tokens del sistema (`surface`, `rounded-card`, `border-hairline`, `focus-ring`, variantes de `Text`).

**Alternativa considerada:** `LinkRow` de arrecife, que es literalmente una fila que es un enlace, con icono, nombre, descripción y hover en el borde.
**Rechazada porque:** Su `description` es una sola línea con `truncate` y no hay hueco para meta *y* resumen. Con `LinkRow` habría que elegir entre decir cuándo se publicó y con quién, o decir de qué va. La fila necesita las dos.

### D4 — El hover no mueve nada

**Decisión:** En hover cambian el color del borde, del título y del número. Ningún `transform`, ningún desplazamiento del caret.

**Razón:** Es la regla del sistema —"the hover changes the border and the icon's color, and nothing else"— y la skill de UI/UX la señala por su cuenta como causa de layout shift. El listado actual la rompe hoy con el `group-hover:opacity-50` de la portada, que se va con la portada.

**Consecuencia:** Nada del índice depende del hover, así que el móvil no pierde información. El caret está siempre visible; no hay un `./escuchar` que aparezca al pasar el ratón.

### D5 — Sin filtro, y por qué se anota

**Decisión:** El índice no lleva filtro por tema ni por invitado.

**Razón:** Con cinco episodios no hay nada que filtrar. Se anota porque `/articles` y `/projects` sí tienen filtro y lo guardan en estado de cliente: no se puede enlazar una vista filtrada. Si el podcast llega a necesitarlo, el filtro va en la URL, y esa deuda es de las otras dos páginas, no de esta.

### D6 — Los fixtures y el `no-index` quedan fuera, pero anotados

**Decisión:** Este change no sustituye los datos ni añade `noindex`.

**Razón:** Son dos problemas distintos del rediseño y cada uno tiene su decisión de negocio detrás. Pero quedan por escrito porque el sitio ya publica en su sitemap cinco episodios con audio de demo, enlaces `mock1` e invitados inventados con cargo y empresa. El rediseño no lo empeora ni lo arregla; lo hace más visible, que es el motivo de dejarlo dicho aquí.

### D7 — Escala: hasta dónde aguanta esta forma

**Decisión:** Renderizado completo, sin paginar ni virtualizar.

**Razón:** Cinco episodios. La guía de rendimiento sitúa el umbral de virtualización en ~50 items, y la de este repo ya tiene paginación para `/articles` si hiciera falta el mismo patrón. Se anota el umbral para que la decisión sea consciente y no un olvido.

## Risks / Trade-offs

- **El índice enseña menos.** Es el objetivo, pero significa que quien quiera saber quiénes son los invitados tiene que entrar al episodio. Mitigado: los nombres van en la meta de la fila, sin enlace.
- **`podcast-row` es un componente propio en un repo que prefiere la librería.** Justificado en §D3; si arrecife publica algún día una fila con meta y resumen, este componente es un candidato claro a morir.
- **Contraste al límite.** `text-text-muted` sobre `surface` da 4.52:1, dos centésimas por encima del mínimo AA. La meta se queda en muted porque es dato secundario; el resumen sube a `secondary` (7.49:1). Si el token de muted cambia, esta página es de las primeras en caerse.
