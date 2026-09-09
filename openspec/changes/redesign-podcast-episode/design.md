## Context

El change anterior movió a esta página todo lo que sacó del índice —reproductor, invitados, plataformas, tags— con el argumento de que era su trabajo. Lo es, pero la página no estaba dispuesta para recibirlo: se diseñó cuando el índice ya lo enseñaba todo y ella era, en la práctica, una segunda copia con notas.

Ahora es la única vista del episodio, así que la primera pantalla tiene que responder tres preguntas —de qué va, con quién, cuánto dura— y ofrecer el play. Hoy responde una y media y gasta 320px en un degradado.

## Goals / Non-Goals

**Goals:**
- Que el play esté en la primera pantalla en móvil, sin scroll.
- Decir el título una vez.
- Que los invitados estén cerca del reproductor, no detrás de las notas.
- Eliminar el hueco de la portada ausente sin renunciar a la portada cuando exista.
- Que desaparezca la excepción de "texto blanco fijo porque el velo es negro en los dos temas".

**Non-Goals:**
- Transcripción, capítulos o marcas de tiempo (§D4).
- Navegación entre episodios (§D4).
- Consolidar los overrides `prose-*` con `article.css`.
- Tocar `AudioPlayer`, que es de la librería.
- Los fixtures y el `no-index`, que siguen anotados en `redesign-podcast-index` §D6.

## Decisions

### D1 — La cabecera es texto, y la portada es una portada

**Decisión:** El `<h1>` sale del velo y vuelve a la superficie de la página. Cuando `image` exista, se pinta al lado de la cabecera con proporción propia; cuando no, no se reserva nada.

**Alternativa considerada:** Mantener el hero y poner un patrón o un color de marca cuando no hay imagen.
**Rechazada porque:** Es decorar un hueco. El índice resolvió el mismo problema quitándolo, y dos páginas de la misma sección no pueden tener dos respuestas opuestas al mismo dato ausente.

**Consecuencia:** Con el velo se va la única excepción de color de la página. El título vuelve a `text-text-primary` y sigue el tema, que es lo que el sistema pide.

### D2 — El reproductor no lleva tarjeta ni encabezado

**Decisión:** `AudioPlayer` va suelto bajo la cabecera, sin `Card`, sin `CardTitle` "Escuchar episodio" y sin `title`.

**Razón:** Un reproductor con un botón de play no necesita que le expliquen qué es. La tarjeta y su encabezado costaban ~90px y una tercera repetición del título — el mismo que está en el breadcrumb y en el `<h1>` a 200px de distancia. El `AudioPlayer` de la librería acepta `title` opcional justamente porque hay sitios donde el título ya está dicho.

### D3 — En móvil, los invitados van entre el reproductor y las notas

**Decisión:** El aside se parte por rol: invitados suben junto al reproductor en móvil; plataformas y compartir se quedan al final. En desktop el raíl no cambia.

**Razón:** Es un podcast de entrevistas: quién habla es contenido, no metadato. Estaba a más de tres pantallas de scroll, después de las notas completas.

**Alternativa considerada:** Mover el aside entero arriba en móvil.
**Rechazada porque:** "Escuchar en" y "Compartir" son acciones de después de escuchar; delante del contenido son ruido.

### D4 — Lo que no se añade

**Decisión:** Ni transcripción, ni capítulos, ni anterior/siguiente.

**Razón:** Los tres son features, no arreglos de diseño, y dos de ellos dependen de datos que no existen. La página tiene que ser buena con lo que hay antes de crecer.

### D5 — El panel de escucha, en el tinte de acento del sitio

**Decisión:** Cabecera y reproductor pasan a ser una sola unidad sobre `border-accent/25` y un degradado de acento al 8%.

**Razón:** Es el lenguaje que este sitio ya tiene para el audio: la narración de los artículos usa exactamente ese panel. Reutilizarlo hace que el episodio se lea como audio antes de leer una palabra, sin inventar un componente ni pedir una portada.

**El número grande es deliberado:** es el mismo `04` que ancla la fila del índice. Quien llega desde el listado reconoce lo que acaba de pulsar.

### D6 — `compact` y no `banner`, aunque los dos traigan el flotante

**Decisión:** El reproductor va en modo `compact` con `title`.

**Razón:** `banner` rotula el bloque «NARRACIÓN DE AUDIO», que es copy del artículo con voz: aquí el audio no narra un texto, es el episodio. `compact` no rotula nada y su estático tampoco repite el título. El `title` se pasa igualmente porque el flotante sí lo necesita: cuando aparece, la cabecera ya salió de la pantalla.

**Límite conocido de la librería:** el flotante es común a los dos modos y lleva la palabra «Narración» escrita a fuego, visible entre `sm` y `xl`. Debería ser un prop. Es de `arrecife`, no de este repo.

### D7 — El índice de las notas sale del markdown, no de un campo nuevo

**Decisión:** `withHeadingAnchors` inyecta `id` en cada `<h2>` del html que produce `marked` y devuelve la lista en el mismo recorrido.

**Razón:** Las notas ya venían estructuradas. Pedir un campo `sections` en los datos sería duplicar lo que el markdown dice, y se desincronizaría al primer cambio. Los saltos son anclas normales: funcionan sin JavaScript y se pueden enlazar desde fuera.

**Por qué el mismo recorrido:** si la lista y los `id` se generaran por separado, cualquier diferencia de slug rompe los anclajes en silencio.

### D8 — Anterior y siguiente, que en el change anterior era non-goal

**Decisión:** Se añade navegación entre episodios al pie.

**Razón:** Se descartó por YAGNI cuando la página no era el problema. Ahora es la única vista del episodio, y terminar de escuchar sin nada que hacer después es un callejón. El dato no es nuevo: es la lista que el índice ya ordena.

## Risks / Trade-offs

- **La página pierde su imagen de cabecera.** Si algún día hay portadas, la forma que las recibe es la de §D1 y no la banda; quien esperara el hero grande verá un cambio. Es el mismo trato que ya recibió el índice.
- **Dos órdenes de lectura, uno por ancho.** Se resuelve con `order` en el contenedor y no duplicando el marcado: el aside sigue existiendo una sola vez en el DOM, así que no hay dos árboles de accesibilidad que mantener.
