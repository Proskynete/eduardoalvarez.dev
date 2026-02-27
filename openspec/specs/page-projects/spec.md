## ADDED Requirements

### Requirement: Projects page
The `/projects` route SHALL display Eduardo's open-source and personal projects. This was previously hidden — it is now a public, indexed page.

**Page header:**
```
Projects
Things I've built, maintained, or contributed to.
```

**Data source:** `src/settings/projects.ts` (already exists, currently hidden from display).

**Data model update** — Add `status` field to existing project type:
```typescript
interface Project {
  name: string;
  description: string;
  url: string;           // repo or homepage
  demo?: string;         // optional live demo URL
  stack: string[];       // e.g. ['TypeScript', 'React', 'Node']
  status: 'active' | 'archived' | 'wip';
}
```

#### Scenario: Projects page renders publicly
- **WHEN** user navigates to `/projects`
- **THEN** the page SHALL render with all projects from `src/settings/projects.ts`

#### Scenario: Page is indexed
- **WHEN** the `/projects` page is inspected for meta robots
- **THEN** no `noindex` meta tag SHALL be present

---

### Requirement: Project card component
Each project SHALL render as a card with name, description, stack tags, status, and links.

**Card structure:**
```
[Status badge: "Active" / "WIP" / "Archived"]
[Project name — text-xl, Geist SemiBold]
[Description — text-secondary, text-sm]
[Stack tags — text-xs badges, surface-border background]
[Links: Repo ↗  |  Demo ↗  — only if available]
```

**Visual:**
- `surface` background, `surface-border` border, `card-pad` (24px) padding, `rounded-lg`
- Active status badge: `accent-subtle` background, `accent` text
- Archived status badge: `surface-raised` background, `text-muted` text
- WIP status badge: amber/warning subtle background, warning text

**Layout:** Two-column grid on desktop (≥ 768px), single column on mobile.

#### Scenario: Active project shows accent badge
- **WHEN** a project with `status: 'active'` renders
- **THEN** the status badge SHALL use `accent-subtle` background and `accent` text

#### Scenario: Archived project is visually de-emphasized
- **WHEN** a project with `status: 'archived'` renders
- **THEN** the card SHALL appear slightly dimmer (opacity-60) to distinguish from active projects

#### Scenario: Project without demo shows no demo link
- **WHEN** a project has no `demo` field
- **THEN** only the Repo link SHALL render; no broken demo link SHALL appear

---

### Requirement: Project filtering by status
The page SHALL allow filtering projects by status (All, Active, WIP, Archived). Client-side, no page reload.

#### Scenario: Default view shows all projects
- **WHEN** user lands on `/projects`
- **THEN** all projects SHALL be visible and the "All" filter SHALL be active

#### Scenario: Filtering by Active shows only active projects
- **WHEN** user clicks the "Active" filter
- **THEN** only projects with `status: 'active'` SHALL be visible
