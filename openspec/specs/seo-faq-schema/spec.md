# seo-faq-schema Specification

## Purpose
Uso de bloques FAQ y del schema `FAQPage` en el sitio.
## Requirements
### Requirement: El FAQ no se usa como táctica de SEO

El sitio SHALL NOT añadir bloques FAQ ni schema `FAQPage` a una página solo para mejorar señales de AEO. Un FAQ se incorpora únicamente cuando responde preguntas que el contenido de la página no cubre, y en ese caso se especifica en un change propio.

#### Scenario: Ninguna página emite FAQPage
- **WHEN** se inspecciona el HTML de cualquier página del sitio
- **THEN** no SHALL existir un `<script type="application/ld+json">` con `"@type": "FAQPage"`

#### Scenario: Artículos con headings interrogativos
- **WHEN** un artículo MDX contiene headings interrogativos en su cuerpo
- **THEN** el frontmatter NO está obligado a incluir `faq`, y la decisión queda a criterio editorial

