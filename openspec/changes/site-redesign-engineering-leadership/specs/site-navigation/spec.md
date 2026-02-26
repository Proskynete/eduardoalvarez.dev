## ADDED Requirements

### Requirement: Primary navigation structure
The site SHALL have a primary navigation with the following links. The navigation SHALL be consistent across all pages via the base layout header.

**Nav items (in order):**
```
Articles        → /articles
Speaking        → /speaking
Now             → /now
Stack           → /stack
About           → /about
Working with Me → /working-with-me
```

**Hidden from nav (accessible via URL):**
```
Podcast         → /podcast    (no-index, no nav link)
Admin           → /admin      (internal tool)
Newsletter      → /newsletter (linked from footer and subscribe CTAs)
Projects        → /projects   (linked from homepage and about)
```

#### Scenario: Desktop navigation renders all items
- **WHEN** the page is viewed on a viewport ≥ 1024px
- **THEN** all six nav items SHALL be visible inline in the header

#### Scenario: Active link is highlighted
- **WHEN** the user is on the `/articles` page
- **THEN** the "Articles" nav item SHALL have the `accent` color applied to indicate current page

---

### Requirement: Mobile navigation
The site SHALL have a mobile navigation that collapses the primary nav into a hamburger menu on viewports < 768px.

**Behavior:**
- Hamburger icon (☰) appears in header replacing inline links
- Clicking opens a full-width overlay or slide-in drawer
- Drawer shows all nav items vertically, large touch targets (min 44px height)
- Clicking any link or the close button (✕) closes the drawer
- Opening the drawer traps focus inside (accessibility)

#### Scenario: Mobile nav opens on tap
- **WHEN** user taps the hamburger icon on mobile
- **THEN** the navigation drawer SHALL open with all nav items visible

#### Scenario: Mobile nav closes on navigation
- **WHEN** user selects a nav item in the mobile drawer
- **THEN** the drawer SHALL close and the page SHALL navigate to the selected route

#### Scenario: Focus is trapped in open mobile nav
- **WHEN** the mobile nav drawer is open
- **THEN** Tab key navigation SHALL cycle only within the drawer elements

---

### Requirement: Header layout and behavior
The header SHALL be sticky (fixed to top), 64px tall, with the wordmark on the left and navigation on the right.

**Header structure:**
```
[Logo/Wordmark] ←————————————→ [Nav items] [Search icon]
```

**Behavior:**
- Sticky on scroll (position: fixed, top: 0)
- Background: `surface` (#111111) with bottom border `surface-border`
- On scroll > 0: subtle backdrop-blur added for depth
- Search icon (🔍) opens Algolia search modal (existing functionality, restyled)

#### Scenario: Header is always visible on scroll
- **WHEN** the user scrolls down any page
- **THEN** the header SHALL remain fixed at the top of the viewport

#### Scenario: Header shows blur on scroll
- **WHEN** the user scrolls past 1px
- **THEN** a `backdrop-blur-sm` effect SHALL be applied to the header background

---

### Requirement: Footer layout
The footer SHALL contain: copyright, social links, and secondary navigation links.

**Footer structure:**
```
[Isotipo + "Eduardo Álvarez"] ← — — — → [Social icons: GitHub, LinkedIn, Twitter, RSS, Email]
[© 2025 — present]                       [Newsletter | Projects | Privacy]
```

**Behavior:**
- Background: `background` (#0a0a0a)
- Top border: `surface-border` (#1f1f1f)
- Remove the current terminal-style `$ cd ~/` text
- Social icons: 20px, color `text-muted`, hover to `text-primary`
- Copyright: `text-muted`, `text-sm`

#### Scenario: Footer links are accessible
- **WHEN** a keyboard user tabs through the footer
- **THEN** all links SHALL be focusable with visible focus indicators

#### Scenario: Social icons have accessible labels
- **WHEN** a screen reader reaches a social icon
- **THEN** each icon link SHALL have an `aria-label` describing the destination

---

### Requirement: URL redirects for renamed routes
The system SHALL serve 301 redirects for all URLs that change due to the redesign.

**Redirects (in `vercel.json`):**
```
/articulos             → /articles          (301)
/articulos/:path*      → /articles/:path*   (301)
/charlas-talleres      → /speaking          (301)
/donaciones            → /              (301, donations removed)
```

#### Scenario: Old article URL redirects correctly
- **WHEN** a user visits `/articulos/el-javascript-necesario-para-react-parte-1`
- **THEN** the browser SHALL be redirected to `/articles/el-javascript-necesario-para-react-parte-1` with a 301 status

#### Scenario: Old talks URL redirects
- **WHEN** a user visits `/charlas-talleres`
- **THEN** the browser SHALL be redirected to `/speaking` with a 301 status
