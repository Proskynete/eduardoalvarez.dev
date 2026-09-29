## ADDED Requirements

### Requirement: Title normalizado al rango 30–60 chars en el `<title>` renderizado

`src/layouts/base/components/head.astro` SHALL garantizar que el `<title>` final renderizado nunca supere 60 chars por efecto del sufijo ` | ${settings.title}`. Cuando la concatenación `${prop.title} | ${settings.title}` excede 60 chars y `prop.title` está presente, el head SHALL renderizar únicamente `prop.title` como `<title>`.

#### Scenario: Título corto con sufijo cabe en 60 chars
- **WHEN** una página pasa `seo.title = "Charlas y talleres técnicos"` (27 chars)
- **THEN** el `<title>` renderizado SHALL ser `"Charlas y talleres técnicos | Eduardo Álvarez"` (45 chars)

#### Scenario: Título largo con sufijo excedería 60 chars
- **WHEN** una página pasa `seo.title = "Eduardo Álvarez — Engineering Leadership & Platform Thinking"` (60 chars)
- **THEN** el `<title>` renderizado SHALL ser `"Eduardo Álvarez — Engineering Leadership & Platform Thinking"` sin sufijo (60 chars)

#### Scenario: Página sin `seo.title` usa `settings.title`
- **WHEN** una página no pasa `seo.title`
- **THEN** el `<title>` renderizado SHALL ser `settings.title` (`"Eduardo Álvarez"`)

#### Scenario: La lógica no afecta meta tags OG ni twitter
- **WHEN** el guard omite el sufijo del `<title>`
- **THEN** `<meta property="og:title">` y `<meta name="twitter:title">` SHALL usar el mismo valor resultante que el `<title>` (coherencia entre todos los title tags)
