## ADDED Requirements

### Requirement: Homepage incluye TL;DR de 40–60 palabras

La homepage SHALL incluir, después del hero existente, un párrafo adicional de 40–60 palabras que resume funcionalmente qué encontrará el visitante en el sitio (artículos, charlas, newsletter, servicios). El párrafo está en lenguaje natural con sentencias completas (apto para voice search y featured snippets).

#### Scenario: Homepage renderiza TL;DR como `<p>`
- **WHEN** se accede a `/`
- **THEN** el HTML SHALL contener un `<p>` con entre 40 y 60 palabras, después del hero y antes de "Últimos artículos"

#### Scenario: El TL;DR no es lista ni tabla
- **WHEN** se inspecciona el bloque TL;DR
- **THEN** SHALL ser un único `<p>`, no `<ul>` ni `<ol>` ni `<table>`
