## ADDED Requirements

### Requirement: Campo faq opcional en frontmatter de artículos

El tipo `Article` en `src/interfaces/index.ts` SHALL incluir la interfaz `FAQItem` y el campo opcional `faq?: FAQItem[]`. Cada `FAQItem` tiene `question: string` y `answer: string` (texto plano, sin Markdown ni HTML).

#### Scenario: Campo faq es opcional en frontmatter
- **WHEN** un artículo MDX no incluye `faq` en su frontmatter
- **THEN** el artículo SHALL compilar y renderizarse sin errores
- **THEN** TypeScript SHALL aceptar el tipo sin requerir el campo

#### Scenario: Campo faq acepta array de pares pregunta/respuesta
- **WHEN** un artículo MDX incluye `faq` con dos o más items en su frontmatter
- **THEN** el valor SHALL ser tipado como `FAQItem[]` y accesible en el layout del artículo

#### Scenario: El campo answer no acepta Markdown
- **WHEN** el campo `answer` de un FAQItem contiene sintaxis Markdown (ej. `**bold**`)
- **THEN** el texto se trata como string plano sin parsear — el Markdown se renderiza como texto literal en el schema

---

### Requirement: Componente ArticleFAQ renderiza sección visible + JSON-LD

El componente `src/components/article-faq/index.astro` SHALL renderizar, cuando recibe un array `faq` no vacío:
1. Una sección HTML semántica con heading `<h2>Preguntas frecuentes</h2>` y lista `<dl>` de pares `<dt>/<dd>`
2. Un bloque `<script type="application/ld+json">` con schema `FAQPage`

#### Scenario: FAQ con items renderiza sección HTML accesible
- **WHEN** el componente recibe `faq` con al menos un item
- **THEN** el HTML SHALL contener `<h2>Preguntas frecuentes</h2>`
- **THEN** el HTML SHALL contener un `<dl>` con un `<dt>` por cada `question` y un `<dd>` por cada `answer`

#### Scenario: FAQ vacío o ausente no renderiza nada
- **WHEN** el componente recibe `faq` como array vacío o no recibe el prop
- **THEN** el HTML resultante SHALL NO contener la sección FAQ ni el script JSON-LD

#### Scenario: FAQ renderiza schema FAQPage válido
- **WHEN** el componente recibe `faq` con al menos un item
- **THEN** el HTML SHALL contener `<script type="application/ld+json">` con `"@type": "FAQPage"`
- **THEN** el campo `mainEntity` SHALL ser un array con un objeto `{"@type": "Question", "name": "<question>", "acceptedAnswer": {"@type": "Answer", "text": "<answer>"}}` por cada FAQItem

#### Scenario: Schema FAQPage es parseable como JSON válido
- **WHEN** el script JSON-LD de FAQPage se renderiza
- **THEN** el contenido SHALL ser JSON sintácticamente válido

---

### Requirement: Layout de artículo inyecta el componente FAQ automáticamente

`src/layouts/article/index.astro` SHALL renderizar el componente `ArticleFAQ` después del cuerpo del artículo y antes de la sección de comentarios Giscus, pasando `content.faq` como prop.

#### Scenario: Artículo con faq muestra la sección FAQ antes de comentarios
- **WHEN** un artículo tiene `faq` definido en su frontmatter
- **THEN** el HTML de la página SHALL mostrar la sección FAQ después del contenido del artículo y antes de los comentarios Giscus

#### Scenario: Artículo sin faq no muestra sección FAQ
- **WHEN** un artículo no tiene `faq` en su frontmatter
- **THEN** el layout SHALL no renderizar ninguna sección FAQ ni script FAQPage

---

### Requirement: Al menos dos artículos recientes tienen FAQ en su frontmatter

Los artículos `es-la-ia-la-nueva-droga-de-los-programadores` y `no-estas-obligado-a-aprender-todo-el-tiempo` SHALL tener al menos 3 FAQItems relevantes añadidos a su frontmatter como ejemplo de implementación.

#### Scenario: Artículo reciente tiene mínimo 3 preguntas frecuentes
- **WHEN** se accede a `/articles/es-la-ia-la-nueva-droga-de-los-programadores`
- **THEN** el HTML SHALL contener la sección FAQ con al menos 3 pares pregunta/respuesta

#### Scenario: FAQ es coherente con el contenido del artículo
- **WHEN** se revisa el frontmatter del artículo
- **THEN** cada `question` SHALL ser una pregunta que el artículo responde directamente
- **THEN** cada `answer` SHALL tener entre 40 y 120 palabras — suficiente para un featured snippet
