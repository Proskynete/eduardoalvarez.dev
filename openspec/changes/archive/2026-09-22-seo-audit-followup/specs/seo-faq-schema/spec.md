## REMOVED Requirements

### Requirement: Campo faq opcional en frontmatter de artículos
**Reason**: Decisión §D6 de este change: el FAQ en artículos duplicaba lo que el cuerpo ya responde. Se quitó el bloque `faq` de los dos artículos que lo tenían y el campo del interface `Article`.
**Migration**: Ninguna; los artículos no llevan `faq`.

### Requirement: Componente ArticleFAQ renderiza sección visible + JSON-LD
**Reason**: `src/components/article-faq/` se eliminó (§D2): ya no tenía consumidores.
**Migration**: Ninguna.

### Requirement: Layout de artículo inyecta el componente FAQ automáticamente
**Reason**: El layout de artículo ya no importa ningún componente FAQ.
**Migration**: Ninguna.

### Requirement: Al menos dos artículos recientes tienen FAQ en su frontmatter
**Reason**: Contradice §D6.
**Migration**: Ninguna.

## ADDED Requirements

### Requirement: El FAQ no se usa como táctica de SEO

El sitio SHALL NOT añadir bloques FAQ ni schema `FAQPage` a una página solo para mejorar señales de AEO. Un FAQ se incorpora únicamente cuando responde preguntas que el contenido de la página no cubre, y en ese caso se especifica en un change propio.

#### Scenario: Ninguna página emite FAQPage
- **WHEN** se inspecciona el HTML de cualquier página del sitio
- **THEN** no SHALL existir un `<script type="application/ld+json">` con `"@type": "FAQPage"`

#### Scenario: Artículos con headings interrogativos
- **WHEN** un artículo MDX contiene headings interrogativos en su cuerpo
- **THEN** el frontmatter NO está obligado a incluir `faq`, y la decisión queda a criterio editorial
