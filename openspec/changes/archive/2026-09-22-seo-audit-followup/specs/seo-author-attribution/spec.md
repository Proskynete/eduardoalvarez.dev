## ADDED Requirements

### Requirement: Bio inline centralizada en settings

`src/settings/index.ts` SHALL exportar un objeto `authorInlineBio: { text: string; href: string }` con el texto de bio corta (1–2 líneas que identifique al autor) y la URL relativa a la página completa de autor (`/about`).

#### Scenario: authorInlineBio está disponible desde settings
- **WHEN** un componente importa `settings` desde `src/settings/index.ts`
- **THEN** `settings.authorInlineBio.text` SHALL ser un string no vacío
- **THEN** `settings.authorInlineBio.href` SHALL ser `"/about"`

---

### Requirement: /speaking muestra bio inline visible del autor

La página `/speaking` SHALL mostrar texto visible de autoría en el DOM (no solo en JSON-LD), incluyendo nombre del autor y link a `/about`.

#### Scenario: /speaking contiene nombre del autor en el DOM
- **WHEN** se accede a `/speaking` y se inspecciona el HTML renderizado
- **THEN** el HTML SHALL contener el texto "Eduardo Álvarez" dentro de un elemento visible (no solo en `<script>` JSON-LD ni en `<meta>`)

#### Scenario: /speaking contiene link a /about
- **WHEN** se accede a `/speaking`
- **THEN** el HTML SHALL contener un `<a href="/about">` accesible desde el header de página

---

### Requirement: /newsletter muestra bio inline visible del autor

La página `/newsletter` SHALL mostrar texto visible de autoría en el DOM, incluyendo nombre del autor y link a `/about`.

#### Scenario: /newsletter contiene nombre del autor en el DOM
- **WHEN** se accede a `/newsletter` y se inspecciona el HTML renderizado
- **THEN** el HTML SHALL contener el texto "Eduardo Álvarez" dentro de un elemento visible

#### Scenario: /newsletter contiene link a /about
- **WHEN** se accede a `/newsletter`
- **THEN** el HTML SHALL contener un `<a href="/about">` accesible desde el bloque superior de la página
