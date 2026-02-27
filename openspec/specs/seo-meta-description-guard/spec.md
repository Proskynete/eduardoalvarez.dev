## ADDED Requirements

### Requirement: Meta description truncada a ≤ 160 caracteres

El sistema SHALL truncar automáticamente cualquier meta description que supere 160 caracteres antes de renderizarla en `<meta name="description">` y `<meta property="og:description">`. El truncamiento se aplica de forma silenciosa — sin error en build ni en runtime.

#### Scenario: Description corta no se modifica
- **WHEN** la description del artículo o página tiene ≤ 160 caracteres
- **THEN** el contenido de `<meta name="description">` SHALL ser idéntico al valor original sin modificaciones

#### Scenario: Description larga se trunca a 160 caracteres
- **WHEN** la description del artículo o página supera 160 caracteres
- **THEN** el contenido de `<meta name="description">` SHALL tener exactamente 160 caracteres
- **THEN** el contenido de `<meta property="og:description">` SHALL tener exactamente 160 caracteres

#### Scenario: Truncamiento es coherente entre description y og:description
- **WHEN** la description se trunca por superar el límite
- **THEN** el valor de `<meta name="description">` y `<meta property="og:description">` SHALL ser idénticos

---

### Requirement: Longitud máxima de description documentada

El límite de 160 caracteres para meta descriptions SHALL estar documentado en `CLAUDE.md` como requisito editorial para nuevos artículos y páginas.

#### Scenario: CLAUDE.md incluye guía de description
- **WHEN** un desarrollador consulta CLAUDE.md para añadir un nuevo artículo
- **THEN** el documento SHALL indicar explícitamente que la description debe tener ≤ 160 caracteres
