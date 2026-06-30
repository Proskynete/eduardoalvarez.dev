## ADDED Requirements

### Requirement: Schema Event por cada charla visible en /speaking

`src/pages/speaking/index.astro` SHALL emitir un bloque `<script type="application/ld+json">` con un `@graph` que contenga un objeto `Event` por cada charla cuyo campo `show` sea `true`.

#### Scenario: Página /speaking emite @graph con Events
- **WHEN** un crawler accede a `https://eduardoalvarez.dev/speaking`
- **THEN** el HTML SHALL contener `<script type="application/ld+json">` con `"@graph"` siendo un array de objetos `"@type": "Event"`

#### Scenario: Cada Event incluye name y startDate
- **WHEN** el @graph de /speaking se renderiza
- **THEN** cada objeto Event SHALL incluir `"name"` igual al `title` del talk
- **THEN** cada objeto Event SHALL incluir `"startDate"` con la fecha ISO 8601 derivada de `talk.date[0]`

#### Scenario: Cada Event incluye location como Place
- **WHEN** el @graph de /speaking se renderiza
- **THEN** cada objeto Event SHALL incluir `"location"` con `"@type": "Place"`, `"name"` igual a `talk.location.name` y `"url"` igual a `talk.location.url`

#### Scenario: Cada Event incluye organizer como Organization
- **WHEN** un talk tiene una o más organizations en su array `organizations`
- **THEN** el campo `"organizer"` del Event SHALL ser un array de objetos `{"@type": "Organization", "name": ..., "url": ...}` derivados de `talk.organizations`

#### Scenario: Cada Event incluye description cuando existe
- **WHEN** un talk tiene `description` no vacío
- **THEN** el objeto Event SHALL incluir `"description"` con ese valor

#### Scenario: Solo charlas con show:true aparecen en el schema
- **WHEN** existen talks con `show: false`
- **THEN** esos talks SHALL NO aparecer en el @graph de /speaking

---

### Requirement: Schema Event es JSON válido

El bloque JSON-LD de /speaking SHALL ser sintácticamente válido y cada `startDate` SHALL ser una fecha ISO 8601 válida.

#### Scenario: JSON-LD de /speaking es parseable
- **WHEN** el HTML de /speaking se renderiza
- **THEN** el contenido del script JSON-LD SHALL ser JSON válido sin errores de sintaxis

#### Scenario: startDate es fecha ISO 8601 válida
- **WHEN** `talk.date[0]` se usa para construir el Event
- **THEN** el valor de `startDate` SHALL ser parseable como fecha válida por `new Date()`
- **THEN** el valor SHALL estar en formato ISO 8601 (ej. `"2024-09-15T00:00:00.000Z"`)
