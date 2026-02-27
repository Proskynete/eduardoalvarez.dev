# Specs: Accesibilidad con Screen Readers

## ADDED Requirements

### Requirement: Global Accessibility & Landmarks

The system MUST provide proper landmark navigation on all pages.

#### Scenario: Verify Main Landmarks

- **WHEN** a user navigates using a screen reader's landmark shortcut (e.g., `D` in NVDA, `VO+U` in VoiceOver)
- **THEN** the system announces the following landmarks in order: Banner (header), Navigation (main menu), Main (content), Contentinfo (footer)

#### Scenario: Skip Link Functionality

- **WHEN** a keyboard user presses `Tab` immediately after page load
- **THEN** a "Saltar al contenido principal" link becomes visible and receives focus
- **WHEN** the user presses `Enter` on this link
- **THEN** focus moves to the `<main id="main-content">` element

### Requirement: Home Page Accessibility

The Home page MUST identify its main sections semantically.

#### Scenario: Hero Section

- **WHEN** a screen reader user navigates to the hero area
- **THEN** it is identified as a `Region` with an appropriate label (e.g., "Presentación")
- **THEN** the heading "Eduardo Álvarez" is a level 1 heading

#### Scenario: Content Sections Have Labels

- **WHEN** a user navigates through sections (Últimos artículos, Charlas recientes, Newsletter)
- **THEN** each section is identified as a `Region` with a descriptive `aria-label`

### Requirement: Articles Listing Accessibility

The Articles Listing page (`/articles`) MUST allow efficient navigation through articles.

#### Scenario: Category Filter Interaction

- **WHEN** a user activates a category filter button
- **THEN** the button's `aria-pressed` state reflects the current selection
- **THEN** the articles list updates and a screen reader is informed of the result count

#### Scenario: Article List Structure

- **WHEN** a user views the list of articles
- **THEN** the container is structured as a list or has `role="list"`
- **THEN** each item contains an accessible heading for the article title

#### Scenario: No Results Announcement

- **WHEN** a filtered category has no articles
- **THEN** the "no results" message is announced by screen readers via `aria-live`

### Requirement: Talks Page Accessibility (`/speaking`)

The Talks page MUST present grouped content accessibly. _(Note: no dropdown exists on this page — it uses a plain list grouped by year.)_

#### Scenario: Talks Heading Hierarchy

- **WHEN** a user navigates through talks
- **THEN** the main page title is H1 ("Charlas")
- **THEN** each year label is an H2
- **THEN** each talk title is an H3

#### Scenario: Resource Links Are Descriptive

- **WHEN** a user encounters resource links (Slides, Repo) for a talk
- **THEN** each link has an `aria-label` that includes the context of the talk (e.g., "Ver slides de [talk title]")

### Requirement: Individual Article Accessibility

The Article Detail page MUST provide a clear reading structure and navigation.

#### Scenario: Article Landmark

- **WHEN** a user navigates into the article
- **THEN** the `<article>` element is announced with a label derived from the article title via `aria-labelledby`

#### Scenario: Table of Contents (TOC)

- **WHEN** a user navigates the sidebar
- **THEN** the TOC is identified as a `Navigation` landmark labeled "Tabla de contenidos"
- **THEN** links navigate to the corresponding sections in the content

#### Scenario: Article Content Structure

- **WHEN** a user reads the main content
- **THEN** headings follow a logical H2 → H3 → H4 hierarchy within the article body

#### Scenario: Share Links Are Labeled

- **WHEN** a user focuses on share buttons in the sidebar
- **THEN** each link announces its purpose (e.g., "Compartir en Twitter", "Compartir en LinkedIn")

### Requirement: Other Pages Accessibility

New pages added in the rebranding MUST comply with basic WCAG 2.1 AA requirements.

#### Scenario: Projects Status Filter

- **WHEN** a user interacts with the project status filter on `/projects`
- **THEN** filter buttons have `aria-pressed` state and the group has an `aria-label`

#### Scenario: Podcast Player Controls

- **WHEN** a user interacts with the AudioPlayer on `/podcasts`
- **THEN** all controls (play/pause, skip, speed, volume) have descriptive `aria-label` attributes
