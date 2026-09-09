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
- **THEN** el reproductor SHALL NO repetir el título

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
