## ADDED Requirements

### Requirement: Color token system
The system SHALL define all colors as named tokens in `tailwind.config.mjs`, replacing the current pink-based palette. No component SHALL reference raw Tailwind color classes (e.g., `pink-500`, `teal-700`) — only semantic tokens.

**Token definitions:**
```
background:        #0a0a0a
surface:           #111111
surface-raised:    #161616
surface-border:    #1f1f1f
text-primary:      #f5f5f5
text-secondary:    #a3a3a3
text-muted:        #525252
accent:            #06b6d4  (cyan-500)
accent-hover:      #0891b2  (cyan-600)
accent-subtle:     #164e63  (cyan-900)
error:             #ef4444
success:           #22c55e
warning:           #f59e0b
```

#### Scenario: Text contrast compliance
- **WHEN** `text-primary` (#f5f5f5) is rendered on `background` (#0a0a0a)
- **THEN** contrast ratio SHALL be ≥ 7:1 (WCAG AAA)

#### Scenario: Accent contrast compliance
- **WHEN** `accent` (#06b6d4) is used as text color on `background` (#0a0a0a)
- **THEN** contrast ratio SHALL be ≥ 4.5:1 (WCAG AA)

#### Scenario: No raw color classes in components
- **WHEN** any component file is audited for color classes
- **THEN** no references to `pink-*`, `teal-*`, `indigo-*` or raw hex colors SHALL exist outside `tailwind.config.mjs`

---

### Requirement: Typography scale
The system SHALL use Geist Sans as the primary font and Geist Mono for code, both loaded via the `geist` npm package. The typographic scale SHALL be defined in `tailwind.config.mjs`.

**Font families:**
```
font-sans:  'Geist', system-ui, sans-serif
font-mono:  'Geist Mono', 'Fira Code', monospace
```

**Size scale (base 16px):**
```
text-xs:    12px / line-height 1.5
text-sm:    14px / line-height 1.5
text-base:  16px / line-height 1.6
text-lg:    18px / line-height 1.5
text-xl:    20px / line-height 1.4
text-2xl:   24px / line-height 1.3
text-3xl:   30px / line-height 1.2
text-4xl:   36px / line-height 1.15
text-5xl:   48px / line-height 1.1
text-6xl:   60px / line-height 1.05
```

**Weights used:** 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold).

#### Scenario: Font renders with swap
- **WHEN** the page loads before fonts are available
- **THEN** system fonts SHALL render first with `font-display: swap`

#### Scenario: Code blocks use mono font
- **WHEN** a `<code>` or `<pre>` element is rendered
- **THEN** it SHALL use `font-mono` exclusively

---

### Requirement: Spacing and layout tokens
The system SHALL define spacing tokens for consistent rhythm. All layout containers SHALL follow the defined max-width scale.

**Container max-widths:**
```
content:   672px   (prose, article body)
wide:      960px   (sections with sidebar)
full:      1280px  (outer page container)
```

**Key spacing rhythm:**
```
section-gap:  96px  (vertical space between page sections)
card-pad:     24px  (internal padding for cards)
nav-height:   64px  (sticky header height)
```

#### Scenario: Article body stays readable
- **WHEN** an article is rendered on a viewport wider than 960px
- **THEN** the prose content width SHALL NOT exceed 672px

#### Scenario: Consistent section rhythm
- **WHEN** multiple sections appear on the homepage
- **THEN** vertical gap between sections SHALL be at least 80px

---

### Requirement: Controlled gradient usage
Gradients SHALL only be used in designated contexts: hero backgrounds and accent glows. No decorative gradients on cards, buttons, or navigation elements.

**Allowed gradients:**
```
hero-gradient:  linear-gradient(135deg, #0a0a0a 60%, #0c1f26 100%)
accent-glow:    radial-gradient(ellipse at top, rgba(6,182,212,0.12) 0%, transparent 60%)
```

#### Scenario: Hero section uses gradient
- **WHEN** the homepage hero renders
- **THEN** the background SHALL use `hero-gradient`

#### Scenario: Cards have no gradient
- **WHEN** any card component is inspected
- **THEN** no gradient background SHALL appear on the card surface

---

### Requirement: Focus and interaction states
All interactive elements SHALL have visible focus indicators using the accent color. Hover states SHALL use smooth transitions.

**Focus style (global):**
```css
*:focus-visible {
  outline: 2px solid #06b6d4;
  outline-offset: 3px;
  border-radius: 3px;
}
```

**Transition standard:** `transition: color 200ms ease, opacity 200ms ease`

#### Scenario: Keyboard focus is always visible
- **WHEN** a user tabs through the page
- **THEN** every focused element SHALL show a cyan outline with 3px offset

#### Scenario: Hover transitions are smooth
- **WHEN** a user hovers over a link or button
- **THEN** the color change SHALL animate over 200ms
