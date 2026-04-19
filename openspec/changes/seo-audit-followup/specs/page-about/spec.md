## ADDED Requirements

### Requirement: /about usa título descriptivo en rango 30–60 chars

El `seo.title` de `/about` SHALL ser más descriptivo que "Sobre mí" genérico. El `<title>` final renderizado SHALL caer en el rango 30–60 chars.

#### Scenario: `<title>` de /about cae en rango
- **WHEN** se accede a `/about`
- **THEN** el `<title>` renderizado SHALL tener entre 30 y 60 chars
- **THEN** SHALL contener el nombre del autor o su rol profesional
