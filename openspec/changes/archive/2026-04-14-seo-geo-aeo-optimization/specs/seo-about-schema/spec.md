## ADDED Requirements

### Requirement: Schema Person extendido en página /about

`src/pages/about/index.astro` SHALL emitir un schema `Person` extendido como JSON-LD, pasándolo a `BaseHead` vía la prop `seo.schema`. El schema SHALL incluir los campos: `@type`, `name`, `url`, `email`, `jobTitle`, `knowsAbout`, `sameAs`.

#### Scenario: Página /about emite JSON-LD con @type Person
- **WHEN** un crawler o motor de IA accede a `https://eduardoalvarez.dev/about`
- **THEN** el HTML SHALL contener `<script type="application/ld+json">` con `"@type": "Person"`

#### Scenario: Schema Person incluye knowsAbout con áreas de expertise
- **WHEN** el schema Person se renderiza en /about
- **THEN** el campo `knowsAbout` SHALL ser un array que incluya al menos: `"Engineering Leadership"`, `"Platform Engineering"`, `"AI-native Engineering"`, `"Technical Leadership"`

#### Scenario: Schema Person incluye sameAs con todos los perfiles públicos
- **WHEN** el schema Person se renderiza en /about
- **THEN** el campo `sameAs` SHALL ser un array que incluya las URLs de GitHub, LinkedIn, Twitter/X e Instagram del autor, derivadas de `src/settings/index.ts`

#### Scenario: Schema Person incluye jobTitle y email
- **WHEN** el schema Person se renderiza en /about
- **THEN** el campo `jobTitle` SHALL ser `"Engineering Leader"`
- **THEN** el campo `email` SHALL ser `"soy@eduardoalvarez.dev"`

#### Scenario: Schema Person es coherente con el schema Person de la homepage
- **WHEN** se comparan los schemas Person de `/` y `/about`
- **THEN** los campos `name`, `url` y `email` SHALL tener valores idénticos en ambas páginas

---

### Requirement: Schema Person incluye hasOccupation

El schema `Person` en `/about` SHALL incluir el campo `hasOccupation` con un objeto `Role` que describe la ocupación principal del autor.

#### Scenario: Schema Person tiene hasOccupation con Role
- **WHEN** el schema Person se renderiza en /about
- **THEN** el campo `hasOccupation` SHALL ser un objeto con `"@type": "Role"` y `"roleName"` describiendo la ocupación actual

---

### Requirement: Schema Person es JSON válido y parseable

El bloque JSON-LD emitido en `/about` SHALL ser sintácticamente válido.

#### Scenario: JSON-LD de /about es parseable
- **WHEN** el HTML de `/about` se renderiza
- **THEN** el contenido del `<script type="application/ld+json">` SHALL ser JSON válido sin errores de sintaxis
- **THEN** el schema SHALL pasar la validación de Google Rich Results Test sin errores críticos
