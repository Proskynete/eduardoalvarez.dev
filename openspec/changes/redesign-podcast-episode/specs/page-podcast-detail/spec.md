## ADDED Requirements

### Requirement: La cabecera del episodio es texto, no un velo

La página `/podcasts/[slug]` SHALL identificar el episodio con una cabecera de texto sobre la superficie de la página: badge de episodio, meta con fecha y duración, `<h1>` con el título y los temas. SHALL NO renderizar una banda de degradado con el título encima.

#### Scenario: Sin portada no se reserva espacio
- **WHEN** el episodio no tiene `image`
- **THEN** la página SHALL NO contener ningún contenedor de altura fija a la espera de una imagen

#### Scenario: Con portada, la imagen se pinta como portada
- **WHEN** el episodio tiene `image`
- **THEN** SHALL renderizarse como una imagen junto a la cabecera, con su propia proporción
- **THEN** el `<h1>` SHALL NO renderizarse encima de la imagen

#### Scenario: El título sigue el tema
- **WHEN** se muestra la página en tema claro
- **THEN** el `<h1>` SHALL usar el token de texto primario, sin color fijado a blanco

#### Scenario: El título se dice una vez en el contenido
- **WHEN** se carga la página
- **THEN** SHALL existir exactamente un `<h1>` con el título
- **THEN** el reproductor estático SHALL NO repetir el título

---

### Requirement: El reproductor es lo primero accionable

El reproductor SHALL renderizarse inmediatamente después de la cabecera, sin tarjeta ni encabezado de sección que lo introduzca.

#### Scenario: El reproductor no lleva encabezado propio
- **WHEN** se carga la página
- **THEN** SHALL NO existir un encabezado con el texto "Escuchar episodio"

#### Scenario: El play entra en la primera pantalla en móvil
- **WHEN** la página se carga a 390×844
- **THEN** el control de reproducción SHALL ser visible sin hacer scroll

---

### Requirement: Orden de lectura por ancho

El contenido SHALL ordenarse según el ancho, sin duplicar el marcado: un solo árbol en el DOM, reordenado con CSS.

**Móvil (< lg):**
```
cabecera → reproductor → invitados → sobre el episodio → notas → escuchar en → compartir → volver
```

**Desktop (≥ lg):** cuerpo a la izquierda (sobre el episodio, notas), raíl a la derecha (invitados, escuchar en, compartir).

#### Scenario: En móvil los invitados preceden a las notas
- **WHEN** la página se muestra a 390px con al menos un invitado
- **THEN** el bloque de invitados SHALL aparecer visualmente antes de las notas del episodio

#### Scenario: Las acciones se quedan al final en móvil
- **WHEN** la página se muestra a 390px
- **THEN** "Escuchar en" y "Compartir" SHALL aparecer después de las notas

#### Scenario: Un solo árbol de accesibilidad
- **WHEN** se inspecciona el DOM en cualquier ancho
- **THEN** cada bloque SHALL existir una sola vez: no SHALL haber copias móvil/escritorio del mismo contenido

---

### Requirement: Los temas acompañan a la meta

Los temas del episodio SHALL renderizarse como una fila de badges dentro de la cabecera. SHALL NO tener un encabezado de sección propio del mismo nivel que las notas.

#### Scenario: Los temas no son una sección
- **WHEN** se carga la página
- **THEN** SHALL NO existir un encabezado con el texto "Temas tratados"
- **THEN** los badges de tema SHALL estar dentro de la cabecera del episodio

#### Scenario: Un episodio sin temas no deja rastro
- **WHEN** el episodio no tiene temas
- **THEN** la cabecera SHALL NO renderizar una fila vacía

---

### Requirement: Los invitados se identifican y se enlazan

Cuando el episodio tenga invitados, SHALL renderizarse uno por tarjeta con su nombre, su rol y sus enlaces, y la cabecera SHALL nombrarlos en su línea de meta.

#### Scenario: La cabecera nombra a los invitados
- **WHEN** el episodio tiene dos invitados
- **THEN** la cabecera SHALL mostrar `con {nombre} y {nombre}`

#### Scenario: Un episodio sin invitados omite el bloque
- **WHEN** el episodio no tiene invitados
- **THEN** SHALL NO renderizarse ni el encabezado "Invitado"/"Invitados" ni ninguna tarjeta

---

### Requirement: El episodio se presenta y se escucha en una sola pieza

La cabecera y el reproductor SHALL formar un único panel, marcado con el tinte de acento que el sistema usa para el audio. El panel SHALL contener, en este orden: número de episodio, ruta del episodio, título, meta, invitados y reproductor, y los temas al cierre.

#### Scenario: El panel contiene la identificación y el control
- **WHEN** se carga la página
- **THEN** el número de episodio, el `<h1>` y el reproductor SHALL estar dentro del mismo contenedor

#### Scenario: El número enlaza visualmente con el índice
- **WHEN** se compara con una fila del listado
- **THEN** el número SHALL renderizarse en mono, con dos dígitos y `tabular-nums`, como en la fila

#### Scenario: El número no se anuncia
- **WHEN** un lector de pantalla recorre el panel
- **THEN** el número SHALL estar marcado `aria-hidden`, porque el título ya lo nombra en el breadcrumb y en la meta

---

### Requirement: El control sobrevive al scroll

El reproductor SHALL seguir disponible cuando el panel salga de la pantalla.

#### Scenario: El flotante aparece al dejar atrás el panel
- **WHEN** el usuario baja hasta las notas en un viewport menor que `xl`
- **THEN** SHALL renderizarse el reproductor flotante con el título del episodio

#### Scenario: El bloque no se rotula como narración
- **WHEN** se carga la página
- **THEN** SHALL NO existir el texto "Narración de audio", que es copy de los artículos con voz

---

### Requirement: Las notas se pueden recorrer

Cuando las notas tengan más de un encabezado de segundo nivel, la página SHALL listar esos encabezados como saltos, y cada encabezado SHALL tener ancla.

#### Scenario: Cada encabezado recibe ancla
- **WHEN** las notas contienen `## Temas discutidos`
- **THEN** el `<h2>` renderizado SHALL tener un `id` derivado de su texto
- **THEN** SHALL existir un enlace a ese `id` en el índice de la página

#### Scenario: Un solo encabezado no genera índice
- **WHEN** las notas tienen un encabezado o ninguno
- **THEN** SHALL NO renderizarse el bloque "En este episodio"

#### Scenario: Los saltos no dependen de JavaScript
- **WHEN** se inspeccionan los saltos
- **THEN** SHALL ser enlaces `href="#id"`, navegables y enlazables desde fuera

---

### Requirement: El episodio pertenece a una serie

Al pie, la página SHALL ofrecer el episodio anterior y el siguiente por fecha, cuando existan.

#### Scenario: Un episodio intermedio ofrece los dos
- **WHEN** el episodio tiene uno anterior y uno posterior
- **THEN** SHALL renderizarse un enlace a cada uno, con su título

#### Scenario: El más reciente no ofrece siguiente
- **WHEN** el episodio es el más reciente
- **THEN** SHALL NO renderizarse el enlace "Episodio siguiente"

#### Scenario: El más antiguo no ofrece anterior
- **WHEN** el episodio es el más antiguo
- **THEN** SHALL NO renderizarse el enlace "Episodio anterior"

---

### Requirement: El raíl es una columna continua y ligera

Los bloques del raíl SHALL quedar contiguos, y las acciones SHALL agruparse en una sola tarjeta con rótulos, no en tarjetas con titular propio.

#### Scenario: Sin huecos entre los bloques del raíl
- **WHEN** la página se muestra a 1280px con notas largas
- **THEN** la separación entre el bloque de invitados y el de acciones SHALL ser la del `gap` de la rejilla, no la altura sobrante del cuerpo

#### Scenario: Una sola tarjeta para las acciones
- **WHEN** se carga la página
- **THEN** "Escuchar en" y "Compartir" SHALL vivir en el mismo contenedor
- **THEN** sus rótulos SHALL usar la escala de `eyebrow`, no la de los encabezados de sección del cuerpo

#### Scenario: Los botones de compartir no se estiran
- **WHEN** se renderizan los enlaces de compartir
- **THEN** SHALL ser controles cuadrados de icono, no botones que ocupen la mitad del ancho cada uno
