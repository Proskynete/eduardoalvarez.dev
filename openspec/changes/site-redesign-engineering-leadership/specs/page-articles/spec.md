## ADDED Requirements

### Requirement: Articles listing page
The `/articles` route SHALL display all published articles. The page route changes from `/articulos/[...page].astro` to `/articles/index.astro` with a flat list (no numeric pagination).

**Page header:**
```
Articles
Writing about engineering leadership, platform architecture, and the AI era.
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
