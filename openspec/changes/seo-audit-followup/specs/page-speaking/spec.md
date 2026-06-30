## ADDED Requirements

### Requirement: /speaking incluye TL;DR sobre formatos y topics

`/speaking` SHALL incluir un párrafo de 40–60 palabras tras el subtítulo describiendo los tipos de charlas (keynotes, workshops, panels) y topics principales (liderazgo técnico, plataformas, IA).

#### Scenario: /speaking renderiza TL;DR como `<p>`
- **WHEN** se accede a `/speaking`
- **THEN** el HTML SHALL contener un `<p>` con 40–60 palabras dentro del `<header>` de la página

---

### Requirement: /speaking usa título descriptivo en rango 30–60 chars

El `seo.title` de `/speaking` SHALL ser más descriptivo que la palabra "Charlas" genérica. El `<title>` final renderizado SHALL caer en el rango 30–60 chars.

#### Scenario: `<title>` de /speaking cae en rango
- **WHEN** se accede a `/speaking`
- **THEN** el `<title>` renderizado SHALL tener entre 30 y 60 chars
