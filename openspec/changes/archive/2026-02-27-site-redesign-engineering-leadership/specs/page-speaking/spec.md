## ADDED Requirements

### Requirement: Speaking page
The `/speaking` route SHALL replace `/charlas-talleres`. It lists all talks, workshops, and conference appearances with year, event, and available resources.

**Page header:**
```
Speaking
Talks and workshops on engineering leadership, platform architecture, and building with AI.
[CTA]: "Want me to speak at your event? → [contact link]"
```

#### Scenario: Old URL redirects to speaking
- **WHEN** user navigates to `/charlas-talleres`
- **THEN** the browser SHALL redirect to `/speaking` with a 301 status

#### Scenario: Page renders with at least one talk
- **WHEN** speaking page loads and talks data is non-empty
- **THEN** at least one talk item SHALL be visible

---

### Requirement: Talk item component
Each talk SHALL render as a structured item with clear metadata and optional resource links.

**Talk item structure:**
```
[Year — text-muted, text-sm]  [Event name — text-secondary, text-sm]
[Talk title — text-xl, Geist SemiBold]
[Short description — text-secondary, text-sm, optional]
[Tags: category badges]
[Links: Slides ↗  |  Video ↗  |  Repo ↗  — only if available]
```

**Visual:**
- Items separated by dividers (`surface-border`)
- No card borders or backgrounds — flat list
- Resource links: `text-accent`, `text-sm`, with external arrow icon

#### Scenario: Talk without resources shows no broken links
- **WHEN** a talk has no slides, video, or repo URL
- **THEN** no resource links SHALL render for that talk

#### Scenario: External links open in new tab
- **WHEN** user clicks a Slides or Video link
- **THEN** the link SHALL open in a new tab with `target="_blank" rel="noopener noreferrer"`

---

### Requirement: Year grouping
Talks SHALL be grouped by year in descending order (most recent year first).

**Group header:**
```
2025
─────────────────
[talks from 2025]

2024
─────────────────
[talks from 2024]
```

#### Scenario: Talks are grouped by year
- **WHEN** the speaking page renders with talks from multiple years
- **THEN** each year SHALL have a labeled group header and talks sorted within the group
