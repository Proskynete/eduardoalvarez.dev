## ADDED Requirements

### Requirement: og:type correcto para artículos

Las páginas de artículo SHALL emitir `<meta property="og:type" content="article">` en lugar de `"website"`. Las páginas que no son artículos (homepage, listados, charlas, podcasts) SHALL seguir usando `"website"`.

#### Scenario: Artículo emite og:type article
- **WHEN** una red social o crawler accede a una URL de artículo
- **THEN** el HTML SHALL contener `<meta property="og:type" content="article">`

#### Scenario: Homepage mantiene og:type website
- **WHEN** una red social o crawler accede a la homepage
- **THEN** el HTML SHALL contener `<meta property="og:type" content="website">`

---

### Requirement: Meta tags article:* en páginas de artículo

Las páginas de artículo SHALL emitir los siguientes meta tags Open Graph específicos de artículo:
- `article:published_time` con el valor ISO 8601 de la fecha del artículo.
- `article:author` con el nombre del autor.
- `article:tag` con una entrada por cada categoría del artículo.

#### Scenario: Artículo emite article:published_time
- **WHEN** una red social accede a una URL de artículo
- **THEN** el HTML SHALL contener `<meta property="article:published_time">` con la fecha ISO 8601 del artículo

#### Scenario: Artículo emite article:author
- **WHEN** una red social accede a una URL de artículo
- **THEN** el HTML SHALL contener `<meta property="article:author" content="Eduardo Álvarez Castañeda">`

#### Scenario: Artículo emite article:tag por cada categoría
- **WHEN** un artículo tiene N categorías en su frontmatter
- **THEN** el HTML SHALL contener N elementos `<meta property="article:tag">`, uno por cada categoría

#### Scenario: Artículo sin categorías no emite article:tag
- **WHEN** un artículo no tiene categorías definidas
- **THEN** el HTML SHALL NO contener ningún `<meta property="article:tag">`

---

### Requirement: og:url usa URL canónica absoluta

Todas las páginas SHALL emitir `<meta property="og:url">` con la URL canónica completa (protocolo + dominio + path), coherente con `<link rel="canonical">`.

#### Scenario: og:url es coherente con canonical
- **WHEN** se renderiza cualquier página del sitio
- **THEN** el valor de `og:url` SHALL ser idéntico al valor de `<link rel="canonical">`
