## MODIFIED Requirements

### Requirement: Schema BlogPosting en artículos

Cada página de artículo SHALL emitir un schema `BlogPosting` con los campos: `headline`, `description`, `datePublished`, `author` y `publisher` (referencias al `@id` de la Person), `url`, `mainEntityOfPage`, `image` (URL absoluta de la imagen OG del artículo, ver `og-images`), `keywords`. **Adicionalmente**, cuando el artículo tenga `date_modified` definido en su frontmatter, el schema SHALL incluir el campo `dateModified` con ese valor en formato ISO 8601.

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
- **WHEN** el schema BlogPosting se renderiza
- **THEN** `"image"` SHALL ser la URL absoluta de `seo_image` si el artículo la declara, y la de su imagen generada si no

#### Scenario: BlogPosting referencia a la Person
- **WHEN** el schema BlogPosting se renderiza
- **THEN** `"author"` y `"publisher"` SHALL ser `{"@id": "https://eduardoalvarez.dev/#person"}`

#### Scenario: BlogPosting incluye keywords del artículo
- **WHEN** el artículo tiene `keywords` en su frontmatter
- **THEN** el schema SHALL incluir `"keywords"` como arreglo con esas keywords
- **WHEN** el artículo no tiene `keywords` en su frontmatter
- **THEN** el schema SHALL derivar `"keywords"` de las `categories` del artículo
