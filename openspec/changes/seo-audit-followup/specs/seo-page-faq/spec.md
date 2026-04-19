## ADDED Requirements

### Requirement: Componente PageFAQ independiente de ArticleFAQ

El proyecto SHALL exponer un componente `src/components/page-faq/index.astro` que renderiza una sección FAQ visible y emite un bloque `<script type="application/ld+json">` con schema `FAQPage`, para su uso en páginas `.astro` (no MDX).

#### Scenario: PageFAQ con items renderiza sección visible
- **WHEN** el componente recibe `faq` con al menos un item
- **THEN** el HTML SHALL contener un `<h2>` con el título (default "Preguntas frecuentes")
- **THEN** el HTML SHALL contener un `<dl>` con un `<dt>` por cada `question` y un `<dd>` por cada `answer`

#### Scenario: PageFAQ vacío o ausente no renderiza nada
- **WHEN** el componente recibe `faq` como array vacío o no recibe el prop
- **THEN** el HTML SHALL NO contener la sección ni el script JSON-LD

#### Scenario: PageFAQ emite FAQPage JSON-LD válido
- **WHEN** el componente recibe `faq` con al menos un item
- **THEN** el HTML SHALL contener `<script type="application/ld+json">` con `"@type": "FAQPage"`
- **THEN** `mainEntity` SHALL contener un objeto `{"@type": "Question", "name", "acceptedAnswer": {"@type": "Answer", "text"}}` por cada FAQItem

#### Scenario: PageFAQ acepta título custom
- **WHEN** el componente recibe `title = "Preguntas sobre charlas"`
- **THEN** el heading visible SHALL ser "Preguntas sobre charlas"

---

### Requirement: /working-with-me emite FAQPage con preguntas sobre consulting

La página `/working-with-me` SHALL incluir un bloque `PageFAQ` con al menos 4 preguntas/respuestas relevantes a las modalidades de trabajo, proceso de contratación y logística.

#### Scenario: /working-with-me contiene sección FAQ visible
- **WHEN** se accede a `/working-with-me`
- **THEN** el HTML SHALL contener la sección `<dl>` con al menos 4 pares pregunta/respuesta

#### Scenario: /working-with-me emite FAQPage JSON-LD
- **WHEN** se accede a `/working-with-me`
- **THEN** el HTML SHALL contener un `<script type="application/ld+json">` con `@type: "FAQPage"` y `mainEntity` de al menos 4 items

#### Scenario: Posición del FAQ no compite con CTA primario
- **WHEN** se revisa el DOM de `/working-with-me`
- **THEN** la sección FAQ SHALL aparecer después del bloque de engagements y antes de "Cómo empezamos"

---

### Requirement: Respuestas del FAQ tienen longitud apta para featured snippet

Cada `answer` definido en cualquier `PageFAQ` SHALL contener entre 40 y 120 palabras, en texto plano sin Markdown ni HTML.

#### Scenario: Answer corto (<40 palabras) es rechazado en code review
- **WHEN** un PR añade un FAQItem con `answer` de menos de 40 palabras
- **THEN** debe rechazarse en revisión (el spec lo prohíbe)

#### Scenario: Answer largo (>120 palabras) es rechazado
- **WHEN** un PR añade un FAQItem con `answer` de más de 120 palabras
- **THEN** debe rechazarse en revisión
