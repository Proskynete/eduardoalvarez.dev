## ADDED Requirements

### Requirement: Schema CollectionPage en /articles

`src/pages/articles/index.astro` SHALL emitir un bloque `<script type="application/ld+json">` con un schema `CollectionPage` que incluya referencias a todos los artículos publicados.

#### Scenario: Página /articles emite JSON-LD CollectionPage
- **WHEN** un crawler accede a `https://eduardoalvarez.dev/articles`
- **THEN** el HTML SHALL contener `<script type="application/ld+json">` con `"@type": "CollectionPage"`

#### Scenario: CollectionPage incluye name y url
- **WHEN** el schema CollectionPage se renderiza
- **THEN** el campo `"name"` SHALL ser `"Artículos — Eduardo Álvarez"`
- **THEN** el campo `"url"` SHALL ser `"https://eduardoalvarez.dev/articles"`

#### Scenario: CollectionPage incluye hasPart con todos los artículos
- **WHEN** el schema CollectionPage se renderiza
- **THEN** el campo `"hasPart"` SHALL ser un array con un objeto por cada artículo
- **THEN** cada objeto SHALL tener `"@type": "BlogPosting"`, `"headline"` igual al título del artículo, `"url"` con la URL absoluta del artículo y `"datePublished"` con la fecha ISO del artículo

#### Scenario: hasPart está ordenado por fecha descendente
- **WHEN** el schema CollectionPage se renderiza
- **THEN** el array `"hasPart"` SHALL estar ordenado por `datePublished` de más reciente a más antiguo, coherente con el orden de listado en la UI

---

### Requirement: Schema CollectionPage incluye author como Person

#### Scenario: CollectionPage tiene author referenciando al autor del sitio
- **WHEN** el schema CollectionPage se renderiza
- **THEN** el campo `"author"` SHALL ser un objeto `{"@type": "Person", "name": "Eduardo Álvarez Castañeda", "url": "https://eduardoalvarez.dev"}`

---

### Requirement: Schema CollectionPage es JSON válido

#### Scenario: JSON-LD de /articles es parseable
- **WHEN** el HTML de /articles se renderiza
- **THEN** el contenido del script JSON-LD SHALL ser JSON válido sin errores de sintaxis
