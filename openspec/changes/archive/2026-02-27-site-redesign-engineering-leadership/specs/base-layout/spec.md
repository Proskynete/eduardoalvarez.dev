## MODIFIED Requirements

### Requirement: Base layout visual design
The base layout (`src/layouts/base/index.astro`) SHALL be updated to use the new design system tokens. All pink/teal/indigo color references SHALL be replaced with the new semantic token classes.

**Changes:**
- Background: `bg-background` (replaces `bg-black/95`)
- Text: `text-text-primary` (replaces `text-white`)
- All `pink-*` references → `accent` tokens
- All `teal-*` references (progress bar) → `accent` tokens
- Focus styles in `base.css`: outline color → `#06b6d4`
- Container widths: adopt `content`, `wide`, `full` tokens

#### Scenario: Base layout renders with new color tokens
- **WHEN** any page using the base layout renders
- **THEN** the page background SHALL be `#0a0a0a` and text SHALL be `#f5f5f5`

#### Scenario: Focus styles use accent color
- **WHEN** a keyboard user focuses on any interactive element
- **THEN** the focus ring SHALL be `2px solid #06b6d4`

---

### Requirement: Header component redesign
The header component (`src/layouts/base/components/header/`) SHALL be redesigned to match the new nav structure and visual spec defined in `site-navigation/spec.md`.

**Changes from current:**
- Remove dropdown menu component (replaced by flat nav links)
- Add isotipo SVG as favicon/brand mark in header alongside wordmark
- Replace nav items with new route structure
- Add `backdrop-blur` on scroll behavior

#### Scenario: Header shows new navigation items
- **WHEN** any page loads
- **THEN** the header SHALL show Articles, Speaking, Now, Stack, About, Working with Me links

#### Scenario: Old nav items are removed
- **WHEN** the header is inspected
- **THEN** no links to `/articulos`, `/charlas-talleres`, or `/donaciones` SHALL appear

---

### Requirement: Footer component redesign
The footer component (`src/layouts/base/components/footer/`) SHALL be redesigned to remove the terminal-style text and align with the minimal footer spec in `site-navigation/spec.md`.

**Changes from current:**
- Remove `$ cd ~/eduardoalvarez.dev/{year}` terminal text
- Remove animated cursor ping effect
- Add isotipo SVG (small, 20px)
- Social icons: GitHub, LinkedIn, Twitter/X, RSS, Email (reorder per new structure)

#### Scenario: Footer renders without terminal text
- **WHEN** any page loads and the footer is visible
- **THEN** no `$ cd ~/` text or cursor animation SHALL appear

#### Scenario: Footer social icons are correct
- **WHEN** the footer renders
- **THEN** GitHub, LinkedIn, Twitter/X, RSS, and Email links SHALL appear with accessible labels

---

### Requirement: Scroll progress bar token update
The scrolling progress bar component (`src/components/scrolling-progress-bar/`) SHALL update its color from `bg-teal-700` to `bg-accent`.

#### Scenario: Progress bar uses accent color
- **WHEN** user scrolls on an article page
- **THEN** the reading progress bar SHALL display in `#06b6d4` (accent color)
