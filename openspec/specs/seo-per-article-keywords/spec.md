## ADDED Requirements

### Requirement: Campo keywords opcional en frontmatter de artículos

El tipo `Article` en `src/interfaces/index.ts` SHALL incluir el campo opcional `keywords?: string[]`. Este campo permite al autor definir keywords específicas para un artículo individual.

#### Scenario: Campo keywords es opcional en frontmatter
- **WHEN** un artículo MDX no incluye `keywords` en su frontmatter
- **THEN** el artículo SHALL compilar y renderizarse sin errores
- **THEN** TypeScript SHALL aceptar el tipo sin requerir el campo

#### Scenario: Campo keywords acepta un array de strings
- **WHEN** un artículo MDX incluye `keywords: ["react", "javascript", "hooks"]` en su frontmatter
- **THEN** el valor SHALL ser tipado como `string[]` y accesible en el layout

---

### Requirement: Meta keywords dinámico por artículo

El tag `<meta name="keywords">` SHALL usar las keywords específicas del artículo si están definidas en el frontmatter. Si no están definidas, SHALL usar las keywords globales del sitio (configuradas en `src/settings/index.ts`).

#### Scenario: Artículo con keywords propias usa sus keywords
- **WHEN** un artículo tiene `keywords: ["typescript", "tipos avanzados"]` en su frontmatter
- **THEN** `<meta name="keywords">` SHALL contener `"typescript, tipos avanzados"`

#### Scenario: Artículo sin keywords usa keywords globales
- **WHEN** un artículo no tiene `keywords` definidas en su frontmatter
- **THEN** `<meta name="keywords">` SHALL contener las keywords globales de `settings.keywords`

#### Scenario: Homepage y páginas no-artículo usan keywords globales
- **WHEN** se renderiza cualquier página que no sea un artículo
- **THEN** `<meta name="keywords">` SHALL usar las keywords globales de `settings.keywords`

---

### Requirement: Keywords del artículo en formato string para meta tag

El sistema SHALL convertir el array `keywords` a un string separado por comas al renderizarlo en `<meta name="keywords">`.

#### Scenario: Array de keywords se convierte a string CSV
- **WHEN** un artículo tiene `keywords: ["react", "frontend", "hooks"]`
- **THEN** `<meta name="keywords">` SHALL tener `content="react, frontend, hooks"`
