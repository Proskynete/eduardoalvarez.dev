## ADDED Requirements

### Requirement: Cada artículo tiene una imagen OG generada

El build SHALL generar, para cada artículo de `src/pages/articles/*.mdx`, un PNG de 1200×630 en `/og/articles/<slug>.png` con `articleTemplate` de `@eduardoalvarez/arrecife/og`: el título del artículo, su primera categoría y sus minutos de lectura. La generación SHALL ocurrir solo en el build, sin red y sin lógica en tiempo de request.

#### Scenario: Artículo nuevo
- **WHEN** se agrega un `.mdx` a `src/pages/articles/` y se construye el sitio
- **THEN** `/og/articles/<slug>.png` SHALL existir en la salida estática, sin otro paso manual

#### Scenario: Formato
- **WHEN** se pide `/og/articles/<slug>.png`
- **THEN** la respuesta SHALL ser `image/png` de 1200×630

#### Scenario: Título largo
- **WHEN** el título no cabe en tres líneas
- **THEN** SHALL cortarse con elipsis en la tercera, sin reducir el tamaño de letra

### Requirement: `seo_image` reemplaza a la imagen generada

`seo_image` SHALL ser opcional en el frontmatter. Si existe, SHALL ser la imagen OG del artículo. Si no, SHALL serlo la generada. Una sola función SHALL resolverla, y `og:image`, `twitter:image`, la `image` del `BlogPosting` y el registro de Algolia SHALL usar su resultado.

#### Scenario: Artículo con ilustración propia
- **WHEN** un artículo declara `seo_image`
- **THEN** `og:image` SHALL ser la URL absoluta de `seo_image`

#### Scenario: Artículo sin `seo_image`
- **WHEN** un artículo no declara `seo_image`
- **THEN** `og:image` SHALL ser la URL absoluta de `/og/articles/<slug>.png?v=<hash>`
- **THEN** `og:image:width` y `og:image:height` SHALL ser `1200` y `630`

#### Scenario: Las tres fuentes coinciden
- **WHEN** se renderiza un artículo
- **THEN** `og:image`, la `image` del `BlogPosting` y la `image` del registro de Algolia SHALL ser la misma URL

### Requirement: La URL cambia cuando cambia la imagen

La URL de una imagen generada SHALL llevar `?v=` con un hash de lo que dibuja la plantilla (título, categoría y minutos de lectura) y de la versión de arrecife instalada.

#### Scenario: Cambia el título
- **WHEN** se edita el título de un artículo
- **THEN** el `v` de su imagen SHALL cambiar

#### Scenario: Nada cambia
- **WHEN** se construye dos veces el sitio sin cambios en el artículo ni en arrecife
- **THEN** el `v` SHALL ser el mismo en ambos builds
