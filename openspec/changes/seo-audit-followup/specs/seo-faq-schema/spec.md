## MODIFIED Requirements

### Requirement: FAQ en artículos legacy queda fuera de scope

El audit marcó 4 artículos legacy con headings interrogativos como candidatos a FAQ (`el-javascript-necesario-para-react-parte-1/2/3` y `empezando-en-el-desarrollo-web`). Se descarta esta aplicación: duplicar preguntas que el cuerpo del artículo ya responde genera contenido repetido que suena a SEO-spam, en lugar de aportar al lector. Los LLMs pueden citar el contenido del artículo sin necesidad de un bloque FAQ dedicado.

Los dos artículos con FAQ ya implementado (`es-la-ia-la-nueva-droga-de-los-programadores` y `no-estas-obligado-a-aprender-todo-el-tiempo`) permanecen sin cambios — fueron añadidos en el change anterior (`2026-04-14-seo-geo-aeo-optimization`) donde las preguntas eran genuinamente extensiones del tema y no meras repeticiones.

#### Scenario: No se exige FAQ en artículos legacy
- **WHEN** un artículo MDX contiene headings interrogativos en su cuerpo
- **THEN** el frontmatter NO está obligado a incluir `faq`
- **THEN** la decisión queda a criterio editorial del autor sobre si las preguntas aportan valor distinto al cuerpo del artículo
