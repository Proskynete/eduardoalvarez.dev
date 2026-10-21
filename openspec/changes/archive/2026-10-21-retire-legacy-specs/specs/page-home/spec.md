## MODIFIED Requirements

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
