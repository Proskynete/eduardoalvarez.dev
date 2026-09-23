## ADDED Requirements

### Requirement: El listado de podcasts es un índice, no un reproductor

La página `/podcasts` SHALL listar los episodios visibles como un índice escaneable. El listado SHALL NO renderizar el reproductor de audio, las tarjetas de invitado, los enlaces a plataformas, los tags ni un botón "Ver episodio": esos elementos pertenecen a `/podcasts/[slug]`.

#### Scenario: El listado no monta audio
- **WHEN** se carga `/podcasts`
- **THEN** el DOM SHALL NO contener ningún elemento `<audio>`
- **THEN** la página SHALL NO hidratar ningún componente React

#### Scenario: El listado no repite el detalle
- **WHEN** se carga `/podcasts` con al menos un episodio visible
- **THEN** el DOM SHALL NO contener enlaces a Spotify, YouTube ni Apple Podcasts
- **THEN** el DOM SHALL NO contener las tarjetas de invitado (`AuthorCard`)

#### Scenario: Cada episodio enlaza a su detalle
- **WHEN** se carga `/podcasts` con episodios visibles
- **THEN** SHALL existir exactamente un enlace por episodio visible, apuntando a `/podcasts/{slug}`

#### Scenario: Sólo se listan los episodios marcados como visibles
- **WHEN** un episodio tiene `show: false`
- **THEN** SHALL NO aparecer en el listado

---

### Requirement: Estructura de la fila de episodio

Cada episodio SHALL renderizarse como una fila con cuatro datos, en este orden de lectura: número de episodio, título, línea de meta y resumen. La fila completa SHALL ser el área enlazable.

**Estructura:**
```
[nº · mono, tabular-nums, 2 dígitos] │ [título · ui/medium]              [badge Último]  [caret]
                                     │ [fecha · duración · con invitados — meta, muted]
                                     │ [resumen — label, secondary, 1 línea]
```

#### Scenario: La fila muestra los cuatro datos
- **WHEN** se renderiza un episodio con número 5, fecha 2024-12-15, duración 78 y un invitado
- **THEN** la fila SHALL mostrar `05`
- **THEN** la fila SHALL mostrar el título del episodio
- **THEN** la fila SHALL mostrar `15 dic 2024 · 1h 18min · con María González`
- **THEN** la fila SHALL mostrar el resumen recortado a una línea

#### Scenario: El número se alinea en columna
- **WHEN** el listado contiene episodios de un dígito y de dos
- **THEN** el número SHALL renderizarse con cero a la izquierda y `tabular-nums`, de modo que las cifras queden alineadas verticalmente

#### Scenario: Dos invitados se enumeran; tres o más se resumen
- **WHEN** un episodio tiene dos invitados
- **THEN** la meta SHALL decir `con {nombre} y {nombre}`
- **WHEN** un episodio tiene tres o más invitados
- **THEN** la meta SHALL decir `con {nombre} y {n} más`

#### Scenario: Un episodio sin invitados omite el segmento
- **WHEN** un episodio no tiene invitados
- **THEN** la meta SHALL contener sólo fecha y duración, sin el separador sobrante

#### Scenario: El número no se anuncia dos veces
- **WHEN** un lector de pantalla recorre la fila
- **THEN** el número visible SHALL estar marcado `aria-hidden`
- **THEN** el nombre accesible del enlace SHALL empezar por `Episodio {n}`

---

### Requirement: Los episodios se agrupan por año

El listado SHALL agrupar los episodios por año de publicación, en orden descendente, con el año como encabezado del grupo. Es el mismo tratamiento que `page-speaking` define para las charlas.

#### Scenario: Un grupo por año presente en los datos
- **WHEN** los episodios visibles son de 2024 y 2025
- **THEN** SHALL renderizarse un encabezado `2025` seguido de sus episodios, y después uno `2024` con los suyos

#### Scenario: Dentro del grupo manda la fecha
- **WHEN** un grupo contiene varios episodios
- **THEN** SHALL ordenarse del más reciente al más antiguo

---

### Requirement: La cabecera declara el volumen de la sección

Bajo la descripción de `PageHeader`, la página SHALL mostrar una línea de datos con el número de episodios y la duración total acumulada.

#### Scenario: La línea de totales suma la duración
- **WHEN** hay 5 episodios visibles que suman 365 minutos
- **THEN** la línea SHALL decir `5 episodios · 6h 5min`

#### Scenario: Un solo episodio va en singular
- **WHEN** hay exactamente 1 episodio visible
- **THEN** la línea SHALL decir `1 episodio · {duración}`

---

### Requirement: El episodio más reciente está marcado

El episodio más reciente del listado SHALL llevar una marca visible que lo distinga, sin cambiar la forma de su fila.

#### Scenario: Sólo el primero lleva la marca
- **WHEN** se renderiza el listado con más de un episodio
- **THEN** exactamente una fila SHALL contener el badge `Último`, y SHALL ser la del episodio de fecha más reciente

---

### Requirement: Interacción sin movimiento y accesible

La fila SHALL comunicar sus estados por color y borde, nunca por desplazamiento, y SHALL ser operable con teclado.

#### Scenario: El hover no desplaza nada
- **WHEN** el puntero entra en una fila
- **THEN** SHALL cambiar el color del borde, del título y del número
- **THEN** SHALL NO aplicarse ningún `transform` ni cambio de tamaño

#### Scenario: El foco es visible
- **WHEN** el usuario llega a una fila con el teclado
- **THEN** SHALL renderizarse el anillo de foco del sistema (`focus-ring`)

#### Scenario: El objetivo táctil es suficiente
- **WHEN** el listado se renderiza a 390px de ancho
- **THEN** cada fila SHALL medir al menos 44px de alto
- **THEN** SHALL haber al menos 8px de separación entre filas

#### Scenario: Nada depende del hover
- **WHEN** el listado se usa en un dispositivo táctil
- **THEN** toda la información de la fila SHALL estar visible sin interacción previa

---

### Requirement: Estado vacío

Cuando no haya episodios visibles, la página SHALL renderizar el `EmptyState` del sistema en lugar del índice.

#### Scenario: Sin episodios visibles
- **WHEN** ningún episodio tiene `show: true`
- **THEN** SHALL renderizarse `EmptyState` con `variant="page"` y expresión `waiting`
- **THEN** SHALL NO renderizarse ni la línea de totales ni ningún encabezado de año
