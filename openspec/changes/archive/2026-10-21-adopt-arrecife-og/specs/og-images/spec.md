## ADDED Requirements

### Requirement: Cada artículo tiene una imagen OG de respaldo

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

### Requirement: La portada del content manager gana; la generada es el respaldo

La OG de un artículo SHALL ser su `seo_image`, la portada que dibuja y commitea el content manager. La imagen generada SHALL usarse solo si el artículo no declara `seo_image`, o si `seo_image` es una ruta local (empieza por `/`) cuyo archivo no existe en `public/`. Una URL absoluta en `seo_image` SHALL usarse tal cual. `seo_image` SHALL ser opcional en el frontmatter. Una sola función SHALL resolver la imagen, y `og:image`, `twitter:image`, la `image` del `BlogPosting` y el registro de Algolia SHALL usar su resultado.

#### Scenario: Artículo con portada
- **WHEN** un artículo declara `seo_image: /images/articles/<slug>/<slug>.webp` y el archivo existe en `public/`
- **THEN** `og:image` SHALL ser la URL absoluta de `seo_image`

#### Scenario: Artículo sin `seo_image`
- **WHEN** un artículo no declara `seo_image`
- **THEN** `og:image` SHALL ser la URL absoluta de `/og/articles/<slug>.png?v=<hash>`
- **THEN** `og:image:width` y `og:image:height` SHALL ser `1200` y `630`

#### Scenario: La portada no llegó
- **WHEN** un artículo declara una `seo_image` local cuyo archivo no está en `public/`
- **THEN** `og:image` SHALL ser la imagen generada, no la ruta rota

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
