## MODIFIED Requirements

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

---

### Requirement: Los artículos existentes tienen seo_description nativa dentro del límite

**[NUEVO]** Los artículos con `seo_description` que superan 155 caracteres en su frontmatter SHALL ser corregidos para que el texto sea significativo y completo dentro del límite, sin depender del truncamiento automático del sistema.

Los siguientes artículos DEBEN ser corregidos:
- `es-la-ia-la-nueva-droga-de-los-programadores.mdx` (180 chars actual)
- `no-estas-obligado-a-aprender-todo-el-tiempo.mdx` (167 chars actual)
- `el-javascript-necesario-para-react-parte-3.mdx` (165 chars actual)
- `empezando-en-el-desarrollo-web.mdx` (154 chars, límite justo)

#### Scenario: seo_description nativa no excede 155 chars
- **WHEN** se revisa el frontmatter de cualquier artículo MDX
- **THEN** el valor del campo `seo_description` SHALL tener ≤ 155 caracteres sin truncar
- **THEN** la description SHALL terminar en una oración completa, no en medio de una frase

#### Scenario: Description corregida sigue siendo descriptiva
- **WHEN** se corrige una description larga
- **THEN** el nuevo valor SHALL incluir la keyword principal del artículo
- **THEN** el nuevo valor SHALL describir correctamente el contenido del artículo
