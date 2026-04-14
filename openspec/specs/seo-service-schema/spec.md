## ADDED Requirements

### Requirement: Schema Service por cada engagement en /working-with-me

`src/pages/working-with-me/index.astro` SHALL emitir un bloque `<script type="application/ld+json">` con un `@graph` que contenga un objeto `Service` por cada engagement definido en `src/settings/working-with-me.ts`.

#### Scenario: Página /working-with-me emite @graph con Services
- **WHEN** un crawler o motor de IA accede a `https://eduardoalvarez.dev/working-with-me`
- **THEN** el HTML SHALL contener `<script type="application/ld+json">` con `"@graph"` siendo un array de objetos `"@type": "Service"`

#### Scenario: Cada Service incluye name y description
- **WHEN** el @graph de /working-with-me se renderiza
- **THEN** cada objeto Service SHALL incluir `"name"` igual a `engagement.type`
- **THEN** cada objeto Service SHALL incluir `"description"` igual a `engagement.description`

#### Scenario: Cada Service incluye provider como Person
- **WHEN** el @graph de /working-with-me se renderiza
- **THEN** cada objeto Service SHALL incluir `"provider"` con `"@type": "Person"`, `"name": "Eduardo Álvarez Castañeda"` y `"url": "https://eduardoalvarez.dev"`

#### Scenario: Cada Service incluye url apuntando a la página
- **WHEN** el @graph de /working-with-me se renderiza
- **THEN** cada objeto Service SHALL incluir `"url": "https://eduardoalvarez.dev/working-with-me"`

---

### Requirement: Schema Service es JSON válido

#### Scenario: JSON-LD de /working-with-me es parseable
- **WHEN** el HTML de /working-with-me se renderiza
- **THEN** el contenido del script JSON-LD SHALL ser JSON válido sin errores de sintaxis
- **THEN** el schema SHALL pasar la validación de Google Rich Results Test sin errores críticos
