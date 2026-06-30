## ADDED Requirements

### Requirement: /working-with-me incluye TL;DR sobre modalidades

`/working-with-me` SHALL incluir un párrafo de 40–60 palabras tras el subtítulo resumiendo las modalidades (consulting, workshops, mentoring) y el tipo de equipos/líderes a los que apunta.

#### Scenario: /working-with-me renderiza TL;DR como `<p>`
- **WHEN** se accede a `/working-with-me`
- **THEN** el HTML SHALL contener un `<p>` con 40–60 palabras dentro del `<header>` de la página

---

### Requirement: /working-with-me usa título descriptivo en rango 30–60 chars

El `seo.title` de `/working-with-me` SHALL describir las modalidades ofrecidas. El `<title>` final renderizado SHALL caer en el rango 30–60 chars.

#### Scenario: `<title>` de /working-with-me cae en rango
- **WHEN** se accede a `/working-with-me`
- **THEN** el `<title>` renderizado SHALL tener entre 30 y 60 chars
