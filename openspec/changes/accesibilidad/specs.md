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

#### Scenario: Author Profile Section

- **WHEN** a screen reader user navigates to the Author Profile area
- **THEN** it is identified as a `Region` with label "Perfil del autor"
- **THEN** the heading "¡Hola! Mi nombre es Eduardo Álvarez" is a level 1 heading

#### Scenario: Social Network Navigation

- **WHEN** a user navigates to the social links
- **THEN** they are contained within a `Navigation` landmark labeled "Redes sociales"
- **THEN** the links are structured as a list

### Requirement: Articles Listing Accessibility

The Articles Listing page MUST allow efficient navigation through articles.

#### Scenario: Article List Structure

- **WHEN** a user views the list of articles
- **THEN** the list is announced as a `List` with X items
- **THEN** each item contains an `<article>` with a level 3 heading

#### Scenario: Pagination Navigation

- **WHEN** a user reaches the bottom of the article list
- **THEN** a `Navigation` landmark labeled "Paginación de artículos" is available
- **THEN** links are clearly labeled "Artículos más recientes" and "Artículos anteriores"

### Requirement: Talks & Workshops Accessibility

The Talks page MUST handles metadata and interactive elements accessibly.

#### Scenario: Talks Heading Hierarchy

- **WHEN** a user navigates through talks
- **THEN** the main page title is H1
- **THEN** each talk title is H2 (not H3) to maintain proper hierarchy

#### Scenario: Resources Dropdown Interaction

- **WHEN** a user focuses the resources button
- **THEN** it announces "Opciones de recursos" and its expanded/collapsed state
- **WHEN** the user presses `Enter` or `Space`
- **THEN** the menu opens and focus is managed
- **WHEN** the user presses `Escape`
- **THEN** the menu closes and focus returns to the button

### Requirement: Individual Article Accessibility

The Article Detail page MUST provide a clear reading structure and navigation.

#### Scenario: Table of Contents (TOC)

- **WHEN** a user navigates the sidebar
- **THEN** the TOC is identified as a `Navigation` landmark labeled "Tabla de contenidos"
- **THEN** links navigate to the corresponding sections in the content

#### Scenario: Article Content Structure

- **WHEN** a user reads the main content
- **THEN** it is contained within a `Region` labeled "Contenido del artículo"
- **THEN** headings follow a logical H2 -> H3 -> H4 hierarchy starting from the content root
