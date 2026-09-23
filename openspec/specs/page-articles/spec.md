# page-articles Specification

## Purpose
Contenido y estructura del listado de artículos en `/articles`.
## Requirements
### Requirement: Articles listing page
The `/articles` route SHALL display all published articles. The page route changes from `/articulos/[...page].astro` to `/articles/index.astro` with a flat list (no numeric pagination).

**Page header:**
```
Articles
Artículos sobre Spec-Driven Development, desarrollo con IA y lo que voy aprendiendo liderando un equipo.
```

**Layout:** Single-column list, max-width `content` (672px), centered.

#### Scenario: Articles page loads all articles
- **WHEN** user navigates to `/articles`
- **THEN** all published articles SHALL be listed, sorted by date descending

#### Scenario: Old URL redirects
- **WHEN** user navigates to `/articulos`
- **THEN** the browser SHALL redirect to `/articles` with a 301 status

---

### Requirement: Article card component
Each article in the listing SHALL render as a horizontal card with clear visual hierarchy.

**Card structure:**
```
[Category badge]                    [Date — text-muted, text-sm]
[Title — text-2xl, Geist SemiBold, hover: text-accent transition]
[Description — text-secondary, 2 lines max]
[Reading time — text-muted, text-xs]
```

**Visual:**
- No card border or box shadow — separated by subtle divider lines (`surface-border`)
- Hover: title color changes to `accent`, no background change (no card lift)
- Full card is clickable (wrapped in `<a>`)

#### Scenario: Card shows article metadata
- **WHEN** an article card renders
- **THEN** it SHALL show category, date, title, description, and reading time

#### Scenario: Card hover changes title color
- **WHEN** user hovers over an article card
- **THEN** the title color SHALL transition to `#06b6d4` over 200ms

---

### Requirement: Category filter
The articles page SHALL have a horizontal filter bar showing all available categories. Clicking a category filters the visible articles client-side.

**Filter bar:**
```
[All]  [Web Development]  [JavaScript]  [React]  [AI]  [Engineering]  ...
```

**Behavior:**
- Active filter: `accent` background, `background` text
- Inactive filters: `surface` background, `text-secondary` text, hover to `text-primary`
- "All" is selected by default
- Filtering is client-side (no page reload)

#### Scenario: Default view shows all articles
- **WHEN** user lands on `/articles` with no filter active
- **THEN** all articles SHALL be visible and "All" filter SHALL be active

#### Scenario: Selecting a category filters articles
- **WHEN** user clicks a category filter button
- **THEN** only articles matching that category SHALL remain visible

#### Scenario: No results state
- **WHEN** a category filter is selected and no articles match
- **THEN** a message SHALL appear: "No articles in this category yet."

### Requirement: /articles incluye overview de tipos de contenido

La página `/articles` SHALL incluir un párrafo de 40–60 palabras después del subtítulo del header, describiendo los tipos de contenido disponibles (opinión técnica, deep-dives, reflexiones sobre liderazgo).

#### Scenario: /articles renderiza overview como `<p>`
- **WHEN** se accede a `/articles`
- **THEN** el HTML SHALL contener, en la cabecera de la página (el `PageHeader` o el bloque inmediatamente después), un párrafo con entre 40 y 60 palabras

---

### Requirement: /articles usa título descriptivo en el rango 30–60 chars

El `seo.title` de `/articles` SHALL ser más descriptivo que la palabra "Artículos" genérica, manteniendo el `<title>` final renderizado en el rango 30–60 chars.

#### Scenario: `<title>` de /articles cae en rango
- **WHEN** se accede a `/articles`
- **THEN** el `<title>` renderizado SHALL tener entre 30 y 60 chars
- **THEN** SHALL describir el tema (ingeniería/liderazgo/IA) además de la palabra "Artículos"

