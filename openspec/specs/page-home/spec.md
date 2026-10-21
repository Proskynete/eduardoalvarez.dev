# page-home Specification

## Purpose
Contenido y estructura de la página de inicio.
## Requirements
### Requirement: Hero section
The homepage SHALL open with a hero section containing a brief personal intro and a positioning tagline. The hero SHALL NOT be a fullscreen splash — it occupies roughly 40vh on desktop.

**Content:**
```
[Isotipo — small, 32px]
Eduardo Álvarez
Technical Lead · Spec-Driven Development. Enseño a construir software con IA sin dejar de entender lo que hacemos.
[Tagline]: "Entender antes de construir."
[CTA links]: "Read articles →"  |  "Work with me →"
```

**Visual:**
- Background: `hero-gradient` (dark to subtle cyan tint)
- `accent-glow` radial gradient behind the name
- Name: `text-5xl` (desktop) / `text-3xl` (mobile), Geist Bold
- Tagline: `text-lg`, `text-secondary`, Geist Light
- CTA links: inline, `text-accent`, with `→` arrow, underline on hover

#### Scenario: Hero renders correctly on desktop
- **WHEN** the homepage loads on a viewport ≥ 1024px
- **THEN** the hero section SHALL show name, positioning statement, tagline, and both CTA links in a single uncluttered view

#### Scenario: Hero is readable on mobile
- **WHEN** the homepage loads on a viewport < 768px
- **THEN** the hero text SHALL stack vertically with no horizontal overflow

---

### Requirement: Featured articles section
Immediately below the hero, the homepage SHALL show the 4 most recent articles without pagination.

**Section header:** «Últimos artículos» with a «./ver_todos» link aligned right.

**Layout:** two-column grid from `sm` up (four cards fill two rows), one column below.

#### Scenario: Homepage shows the latest articles
- **WHEN** the homepage renders
- **THEN** up to 4 article cards SHALL appear, sorted by date descending

#### Scenario: Article card navigates correctly
- **WHEN** user clicks an article card or its title
- **THEN** the browser SHALL navigate to `/articles/[slug]`

#### Scenario: View all link works
- **WHEN** user clicks «./ver_todos»
- **THEN** the browser SHALL navigate to `/articles`

### Requirement: Speaking highlights section
The homepage SHALL show the most recent visible talks as arrecife `TalkCard`s.

**Section header:** «Charlas recientes» with a «./ver_todas» link to `/speaking`.

**Talk card:** title, event (first organization, else the location), month and year, location and description. It links to the presentation, else the repository, else the event page, in a new tab.

**Layout:** two-column grid from `sm` up, same rhythm as the articles section. The section SHALL NOT render when there are no visible talks.

#### Scenario: Speaking section shows recent talks
- **WHEN** the homepage renders
- **THEN** up to 4 talks with `show: true` SHALL appear, most recent first, from `src/data/talks/*.json` (loaded by `src/settings/talks.ts`)

### Requirement: Newsletter CTA section
Near the bottom of the homepage, a minimal newsletter signup section SHALL appear.

**Content:**
```
Newsletter
Artículos sobre Spec-Driven Development y desarrollo con IA.
[Email input]  [Subscribe button]
```

**Visual:**
- Contained in a card with `surface` background and `surface-border` border
- No decorative elements — functional and clean
- Reuses the existing subscribe component logic

#### Scenario: Subscribe form submits correctly
- **WHEN** user enters a valid email and clicks Subscribe
- **THEN** the API POST to `/api/subscribe` is called and a success message is shown

---

### Requirement: Donations page removal
The `/donaciones` page SHALL be removed. The homepage SHALL NOT include any donation CTA or link.

#### Scenario: Donations page no longer accessible
- **WHEN** a user visits `/donaciones`
- **THEN** they SHALL be redirected to the homepage (301)

### Requirement: Homepage incluye TL;DR de 40–60 palabras

La homepage SHALL incluir, después del hero existente, un párrafo adicional de 40–60 palabras que resume funcionalmente qué encontrará el visitante en el sitio (artículos, charlas, newsletter, servicios). El párrafo está en lenguaje natural con sentencias completas (apto para voice search y featured snippets).

#### Scenario: Homepage renderiza TL;DR como `<p>`
- **WHEN** se accede a `/`
- **THEN** el HTML SHALL contener un `<p>` con entre 40 y 60 palabras, después del hero y antes de "Últimos artículos"

#### Scenario: El TL;DR no es lista ni tabla
- **WHEN** se inspecciona el bloque TL;DR
- **THEN** SHALL ser un único `<p>`, no `<ul>` ni `<ol>` ni `<table>`

