## ADDED Requirements

### Requirement: /newsletter incluye TL;DR ampliado de 40–60 palabras

`/newsletter` SHALL incluir, en el header de página, un párrafo de 40–60 palabras describiendo contenido, frecuencia y audiencia objetivo de la newsletter. Puede reemplazar o complementar el subtítulo actual.

#### Scenario: /newsletter renderiza TL;DR como `<p>`
- **WHEN** se accede a `/newsletter`
- **THEN** el HTML SHALL contener un `<p>` con 40–60 palabras dentro del `<header>` de la página

---

### Requirement: /newsletter usa título descriptivo en rango 30–60 chars

El `seo.title` de `/newsletter` SHALL ser más descriptivo que la palabra "Newsletter" sola. El `<title>` final renderizado SHALL caer en el rango 30–60 chars.

#### Scenario: `<title>` de /newsletter cae en rango
- **WHEN** se accede a `/newsletter`
- **THEN** el `<title>` renderizado SHALL tener entre 30 y 60 chars
