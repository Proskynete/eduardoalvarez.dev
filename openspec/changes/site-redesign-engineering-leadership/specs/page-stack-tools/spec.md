## ADDED Requirements

### Requirement: Stack & Tools page
The `/stack` route SHALL list the tools, languages, frameworks, hardware, and applications Eduardo actually uses. No affiliate links. No "sponsored" items. The page reflects genuine personal preference.

**Page header:**
```
Stack & Tools
The exact tools I use to build, write, and think.
```

**Data source:** `src/settings/stack.ts` — array of `StackItem` objects:
```typescript
interface StackItem {
  name: string;
  description: string;
  url: string;
  category: 'Languages' | 'Frameworks' | 'Infrastructure' | 'Hardware' | 'Apps' | 'AI Tools';
  featured?: boolean;   // shown with accent indicator
}
```

#### Scenario: Stack page renders all categories
- **WHEN** user navigates to `/stack`
- **THEN** all categories with at least one item SHALL render as labeled groups

#### Scenario: Page renders without affiliate markers
- **WHEN** the stack page is inspected
- **THEN** no affiliate link indicators or "sponsored" labels SHALL appear

---

### Requirement: Stack item display
Each tool SHALL render as a compact item with name, description, and link.

**Item structure:**
```
[Name — text-base, Geist SemiBold]  [Featured dot — accent, if featured: true]
[Description — text-secondary, text-sm]
[url — external link icon, text-muted, text-xs]
```

**Layout:** Two-column grid on desktop (≥ 768px), single column on mobile. Items within each category shown in a card with `surface` background.

#### Scenario: Featured items have visual indicator
- **WHEN** a stack item has `featured: true`
- **THEN** a small cyan dot SHALL appear beside the item name

#### Scenario: All items have external links
- **WHEN** a stack item renders
- **THEN** the item name or an explicit link SHALL navigate to the tool's URL in a new tab

---

### Requirement: Category grouping
Stack items SHALL be grouped by category with a category heading. Categories order: Languages, Frameworks, Infrastructure, AI Tools, Hardware, Apps.

#### Scenario: Categories render in defined order
- **WHEN** the stack page loads
- **THEN** categories SHALL appear in the order: Languages, Frameworks, Infrastructure, AI Tools, Hardware, Apps
