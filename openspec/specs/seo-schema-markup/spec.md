# seo-schema-markup Specification

## Purpose
Datos estructurados globales del sitio (WebSite, Person y similares).

## Requirements

### Requirement: Schema WebSite en homepage

La homepage SHALL emitir un bloque `<script type="application/ld+json">` con el schema `WebSite` que incluya `name`, `url` y `author` (referencia al `@id` de la Person). No SHALL incluir `SearchAction`: la búsqueda es un modal de Algolia y `/articles` no lee `?q=`, así que el target anunciaría una búsqueda que no existe.

#### Scenario: Homepage renderiza WebSite schema
- **WHEN** un crawler o Google accede a `https://eduardoalvarez.dev/`
- **THEN** el HTML resultante MUST contener un `<script type="application/ld+json">` con `"@type": "WebSite"`, `"url": "https://eduardoalvarez.dev"` y `"name": "Eduardo Álvarez"`

#### Scenario: WebSite schema no anuncia SearchAction
- **WHEN** el schema WebSite se renderiza
- **THEN** el objeto JSON-LD SHALL NOT incluir `"potentialAction"`

---

### Requirement: Schema Person en homepage

La homepage SHALL emitir el schema `Person` compartido (`src/utils/person-schema.ts`) con `@id` `https://eduardoalvarez.dev/#person`, `name`, `alternateName`, `description`, `image`, `url`, `email`, `sameAs` (solo los perfiles con `show: true`, sin el CV) y `jobTitle`. Artículos, charlas y `/about` SHALL referenciar o incluir ese mismo nodo, no uno propio.

#### Scenario: Homepage renderiza Person schema
- **WHEN** un crawler accede a la homepage
- **THEN** el HTML SHALL contener `"@type": "Person"` con `"@id": "https://eduardoalvarez.dev/#person"`, `"name": "Eduardo Álvarez"`, `"alternateName": "Eduardo Álvarez Castañeda"`, `"url": "https://eduardoalvarez.dev"` y `"email": "soy@eduardoalvarez.dev"`

#### Scenario: Person schema incluye sameAs con redes sociales
- **WHEN** el schema Person se renderiza
- **THEN** `"sameAs"` SHALL ser un array que contenga al menos los perfiles de GitHub y LinkedIn del autor

---

### Requirement: Schema BlogPosting en artículos

Cada página de artículo SHALL emitir un schema `BlogPosting` con los campos: `headline`, `description`, `datePublished`, `author` y `publisher` (referencias al `@id` de la Person), `url`, `mainEntityOfPage`, `image` (URL absoluta), `keywords`. **Adicionalmente**, cuando el artículo tenga `date_modified` definido en su frontmatter, el schema SHALL incluir el campo `dateModified` con ese valor en formato ISO 8601.

#### Scenario: Artículo renderiza BlogPosting schema
- **WHEN** un crawler accede a una URL de artículo (ej. `/articles/empezando-en-el-desarrollo-web`)
- **THEN** el HTML SHALL contener `<script type="application/ld+json">` con `"@type": "BlogPosting"` y `"headline"` igual al título del artículo

#### Scenario: BlogPosting incluye fecha de publicación
- **WHEN** el schema BlogPosting se renderiza
- **THEN** `"datePublished"` SHALL ser la fecha ISO 8601 del campo `date` del frontmatter del artículo

#### Scenario: BlogPosting incluye dateModified cuando está disponible
- **WHEN** el artículo tiene `date_modified` en su frontmatter
- **THEN** el schema SHALL incluir `"dateModified"` con ese valor en formato ISO 8601
- **WHEN** el artículo NO tiene `date_modified` en su frontmatter
- **THEN** el schema SHALL NO incluir el campo `"dateModified"` (no usar `datePublished` como fallback)

#### Scenario: BlogPosting incluye imagen
- **WHEN** el artículo tiene `seo_image` en su frontmatter
- **THEN** el schema SHALL incluir `"image"` con la URL absoluta de `seo_image`

#### Scenario: BlogPosting incluye author como Person
- **WHEN** el schema BlogPosting se renderiza
- **THEN** `"author"` SHALL ser un objeto `{"@type": "Person", "name": "Eduardo Álvarez Castañeda"}`

#### Scenario: BlogPosting incluye keywords del artículo
- **WHEN** el artículo tiene `keywords` en su frontmatter
- **THEN** el schema SHALL incluir `"keywords"` como string con las keywords separadas por coma
- **WHEN** el artículo no tiene `keywords` en su frontmatter
- **THEN** el schema SHALL derivar `"keywords"` de las `categories` del artículo

---

### Requirement: Schema JSON-LD válido según estándares de Google

Todo schema emitido por el sitio SHALL pasar la validación de Google Rich Results Test sin errores críticos.

#### Scenario: Schema no contiene campos inválidos
- **WHEN** un schema JSON-LD se renderiza en cualquier página
- **THEN** el JSON SHALL ser parseable sin errores de sintaxis
- **THEN** todos los campos SHALL conformar los tipos de datos esperados por schema.org
