## ADDED Requirements

### Requirement: /articles incluye overview de tipos de contenido

La página `/articles` SHALL incluir un párrafo de 40–60 palabras después del subtítulo del header, describiendo los tipos de contenido disponibles (opinión técnica, deep-dives, reflexiones sobre liderazgo).

#### Scenario: /articles renderiza overview como `<p>`
- **WHEN** se accede a `/articles`
- **THEN** el HTML SHALL contener, dentro del `<header>` de la página, un `<p>` adicional con entre 40 y 60 palabras

---

### Requirement: /articles usa título descriptivo en el rango 30–60 chars

El `seo.title` de `/articles` SHALL ser más descriptivo que la palabra "Artículos" genérica, manteniendo el `<title>` final renderizado en el rango 30–60 chars.

#### Scenario: `<title>` de /articles cae en rango
- **WHEN** se accede a `/articles`
- **THEN** el `<title>` renderizado SHALL tener entre 30 y 60 chars
- **THEN** SHALL describir el tema (ingeniería/liderazgo/IA) además de la palabra "Artículos"
