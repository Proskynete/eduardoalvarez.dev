## ADDED Requirements

### Requirement: Now page
The `/now` route SHALL be a static page describing what Eduardo is focused on at the present moment. Content is manually updated. The page follows the `/now` movement convention (nownownow.com).

**Page header:**
```
Now
What I'm working on right now. Last updated: [date from settings].
```

**Data source:** `src/settings/now.ts` — array of `NowItem` objects:
```typescript
interface NowItem {
  category: string;        // e.g. "Building", "Reading", "Learning", "Focus"
  title: string;
  description: string;
  url?: string;            // optional link
}
```

#### Scenario: Now page renders current items
- **WHEN** user navigates to `/now`
- **THEN** all items from `src/settings/now.ts` SHALL be rendered grouped by category

#### Scenario: Last updated date is visible
- **WHEN** the now page loads
- **THEN** the date of last manual update SHALL appear in the page header as `text-muted`

---

### Requirement: Now item display
Each now item SHALL render with its category, title, description, and an optional link.

**Item structure:**
```
[Category label — text-accent, text-xs, uppercase, tracking-wider]
[Title — text-lg, Geist SemiBold]
[Description — text-secondary, text-sm]
[Link — "→ [title]" in text-accent, if url present]
```

**Layout:** Single column, items separated by `surface-border` dividers. Categories act as visual anchors, not section headings.

#### Scenario: Item with URL shows link
- **WHEN** a now item has a `url` field
- **THEN** a linked text SHALL appear below the description

#### Scenario: Item without URL shows no broken link
- **WHEN** a now item has no `url` field
- **THEN** no link element SHALL render for that item
