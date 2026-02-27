## ADDED Requirements

### Requirement: Hero section
The homepage SHALL open with a hero section containing a brief personal intro and a positioning tagline. The hero SHALL NOT be a fullscreen splash — it occupies roughly 40vh on desktop.

**Content:**
```
[Isotipo — small, 32px]
Eduardo Álvarez
Engineering Leadership & Platform Thinking in the AI Era.
[Tagline]: "Building engineering culture for the AI era."
[CTA links]: "Read articles →"  |  "Work with me →"
```

**Visual:**
- Background: `hero-gradient` (dark to subtle cyan tint)
- `accent-glow` radial gradient behind the name
- Name: `text-5xl` (desktop) / `text-3xl` (mobile), Geist Bold
- Tagline: `text-lg`, `text-secondary`, Geist Light
- CTA links: inline, `text-accent`, with `→` arrow, underline on hover

#### Scenario: Hero renders correctly on desktop
- **WHEN** the homepage loads on a viewport ≥ 1024px
- **THEN** the hero section SHALL show name, positioning statement, tagline, and both CTA links in a single uncluttered view

#### Scenario: Hero is readable on mobile
- **WHEN** the homepage loads on a viewport < 768px
- **THEN** the hero text SHALL stack vertically with no horizontal overflow

---

### Requirement: Featured articles section
Immediately below the hero, the homepage SHALL show the 3 most recent articles without pagination.

**Section header:** "Latest Writing" with a link "View all →" aligned right.

**Article card (compact):**
```
[Category badge]  [Date — text-muted, text-sm]
[Title — text-xl, Geist SemiBold, hover: text-accent]
[Description — text-secondary, text-sm, max 2 lines]
```

**Layout:** Vertical list (not grid) — single column even on desktop. Clean, editorial.

#### Scenario: Homepage shows exactly 3 articles
- **WHEN** the homepage renders
- **THEN** exactly 3 article cards SHALL appear, sorted by date descending

#### Scenario: Article card navigates correctly
- **WHEN** user clicks an article card or its title
- **THEN** the browser SHALL navigate to `/articles/[slug]`

#### Scenario: View all link works
- **WHEN** user clicks "View all →"
- **THEN** the browser SHALL navigate to `/articles`

---

### Requirement: Speaking highlights section
The homepage SHALL show a compact section with 2–3 recent/featured talks.

**Section header:** "Recent Speaking"

**Talk item (minimal):**
```
[Event name — text-secondary]  [Year — text-muted]
[Talk title — text-base, Geist Medium]
[Link to slides/video when available]
```

**Layout:** Vertical list, same visual rhythm as articles section.

#### Scenario: Speaking section shows featured talks
- **WHEN** the homepage renders
- **THEN** 2 to 3 featured talks SHALL appear from `src/settings/talks.ts`

---

### Requirement: Newsletter CTA section
Near the bottom of the homepage, a minimal newsletter signup section SHALL appear.

**Content:**
```
Newsletter
Stay updated on engineering leadership, platform thinking, and AI.
[Email input]  [Subscribe button]
```

**Visual:**
- Contained in a card with `surface` background and `surface-border` border
- No decorative elements — functional and clean
- Reuses the existing subscribe component logic

#### Scenario: Subscribe form submits correctly
- **WHEN** user enters a valid email and clicks Subscribe
- **THEN** the API POST to `/api/subscribe` is called and a success message is shown

---

### Requirement: Donations page removal
The `/donaciones` page SHALL be removed. The homepage SHALL NOT include any donation CTA or link.

#### Scenario: Donations page no longer accessible
- **WHEN** a user visits `/donaciones`
- **THEN** they SHALL be redirected to the homepage (301)
