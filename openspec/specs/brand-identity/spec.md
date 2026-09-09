## Purpose

Definir la marca visual del sitio: el logotipo tipográfico, el isotipo (la aleta del
tiburón ballena), el set completo de iconos, la imagen Open Graph por defecto y las
animaciones de marca. La fuente de verdad transversal a los cinco repositorios es
`BRAND.md`; esta spec cubre lo que aplica a `eduardoalvarez.dev`.

## Requirements

### Requirement: Wordmark logo
The system SHALL display the typographic wordmark "Eduardo Álvarez" as the primary brand mark in the header. The wordmark is rendered as inline HTML text using Tailwind classes inside the header component — not a standalone SVG file.

**Specs:**
- Text: "Eduardo Álvarez" in Geist Bold (700), `text-text-primary`
- Tagline below (desktop only): "Engineering Leadership · Platform Thinking", `text-text-muted`, uppercase, `text-xs`, wide tracking
- No background, no border, no shadow

#### Scenario: Logo renders in header
- **WHEN** any page loads
- **THEN** the header SHALL display the wordmark text linked to `/`

#### Scenario: Logo is accessible
- **WHEN** a screen reader encounters the logo
- **THEN** it SHALL read "Eduardo Álvarez — Ir al inicio" (via aria-label on the anchor)

---

### Requirement: Isotipo (symbol mark)
The system SHALL have a standalone isotype that works independently from the wordmark: the dorsal fin of the whale shark mascot. The fin is the only mark allowed to stand alone at small sizes. The full mascot is illustration, never the logo.

The previous EA-01 isotype (concentric diamond with vertical arrows, diagonal arms and corner brackets) is RETIRED. Two competing symbols SHALL NOT coexist.

**Isotype specs:**
```
Canvas:     64×64 viewBox
Geometry:   single closed path —
            M12 52 C16 38 24 18 40 8 C44 5.5 47 8 45.5 13
            C40 30 42 42 54 51 C56 52.5 55 55 52 55
            L15 55 C11.5 55 11 54 12 52 Z
Bounding:   x 11.5–56, y 5.5–55 → visual centre (33.75, 30.25), NOT (32, 32).
            Any centred placement SHALL use the real bounding box.
Color:      #06b6d4 (accent)
Variants:   mark → flat fin, no spots
            full → fin plus six spots (#0a0a0a at 0.45 opacity), ≥40px only
```

**Component:** `src/components/isotipo/index.astro` (inline, so `currentColor` would work)
**Files:** `public/logos/aleta-*.svg` — see `BRAND.md` §2 for the per-file usage table

#### Scenario: Isotipo is readable at 16px
- **WHEN** the fin is rendered as a 16×16px favicon
- **THEN** the silhouette SHALL remain a recognisable fin without the spots

#### Scenario: Spots are suppressed below 40px
- **WHEN** the isotype renders below 40px
- **THEN** the `mark` variant SHALL be used, because the spots blur together at that size

#### Scenario: Isotipo is readable at 512px
- **WHEN** the isotype is rendered at 512×512px (PWA icon)
- **THEN** the shape SHALL remain clean without pixelation (SVG scales)

---

### Requirement: Favicon set
The system SHALL provide a complete icon set generated from the fin.

**Files in `public/images/favicon/`:**
```
favicon.svg          — fin on a #080b12 rounded square (rx 15/64)
favicon-32x32.png    — 32×32
favicon-16x16.png    — 16×16
favicon.ico          — multi-size 16 + 32 + 48, PNG-encoded entries
```

**Files in `public/images/manifest/`:**
```
apple-touch-icon.png       — 180×180, full-bleed dark background (iOS rounds it itself)
android-chrome-192x192.png — 192×192
android-chrome-512x512.png — 512×512
mstile-150x150.png         — 150×150
safari-pinned-tab.svg      — single-colour fin, no background
```

`public/favicon.ico` SHALL also exist at the root: some crawlers request that path
directly and never read the `<link>` tags.

**Maskable safe zone:** the two `android-chrome-*` icons are declared
`purpose: "any maskable"` in `src/settings/manifest-config.ts`. Android may crop them to a
circle of 80% diameter, so the fin SHALL be scaled to 0.62 of the canvas — a square box
inscribed in that circle cannot exceed ~0.57 of the width.

**HTML meta tags (in `src/layouts/base/components/head.astro`):**
```html
<link rel="icon" href="/images/favicon/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/images/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
<link rel="icon" href="/images/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
<link rel="shortcut icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
<link rel="apple-touch-icon" sizes="180x180" href="/images/manifest/apple-touch-icon.png" />
<link rel="mask-icon" href="/images/manifest/safari-pinned-tab.svg" color="#06b6d4" />
```

#### Scenario: Browser shows brand favicon
- **WHEN** the site is open in a browser tab
- **THEN** the tab icon SHALL show the fin in cyan on a blue-black rounded square

#### Scenario: PWA install shows brand icon
- **WHEN** a user installs the site as a PWA
- **THEN** the home screen icon SHALL use the 512×512 fin, and the fin SHALL survive
  Android's circular mask without clipping

---

### Requirement: Neutrals carry the mascot's hue
The neutral ramp SHALL be derived from the mascot's outline colour (`#0B1524`), not from
pure grey. The previous ramp measured 0.0% saturation across all seven neutrals while the
mascot sits at 66–69% saturation in the blue family, leaving no chromatic bridge between
illustration and interface.

```
background      #080b12    surface         #0e1420
surface-raised  #141b29    surface-border  #1e2637
text-primary    #edf3f4  ← the shark's belly
text-secondary  #a2b2c4    text-muted      #74869b
accent          #06b6d4  ← unchanged, the mascot's highlights
```

Contrast on `#080b12` SHALL be maintained at or above: primary 17.55:1, secondary 9.09:1,
muted 5.27:1, accent 8.11:1. Any change to a neutral SHALL be re-measured — `text-muted`
previously sat at 4.74:1, barely over the 4.5 AA floor.

#### Scenario: The mascot sits inside its own palette
- **WHEN** the mascot or the fin is placed on any surface token
- **THEN** the surface SHALL share its blue family rather than being neutral grey

#### Scenario: Theme colour agrees everywhere
- **WHEN** the `theme-color` meta tag, the web manifest or `browserconfig.xml` is edited
- **THEN** all three SHALL still resolve to `#080b12` — the `background` token

---

### Requirement: Syntax highlighting uses the mascot's palette
Code blocks SHALL use the `arrecife` theme (`src/settings/shiki-arrecife.ts`), not Monokai.
Code is the most "programming" surface on the site and appears in every article; it is where
the terminal world and the mascot world are joined rather than kept apart.

The block background SHALL be `#0B1524` — the mascot's outline colour. Token colours SHALL
derive from the mascot palette, extended with reef notes only where blue alone could not
separate hues. Every token SHALL meet WCAG AA against the block background; Monokai left
comments below that floor.

```
plain #D6E3EC  variable #B9CFE4  function #7FD1A8  string  #E8A87C
type  #8AB4E8  number   #B79FD4  keyword  #06B6D4  operator #7C90A5
comment #6E8399
```

#### Scenario: No foreign palette survives in code
- **WHEN** an article with code blocks is rendered
- **THEN** no Monokai colour (`#A6E22E`, `#F92672`, `#FD971F`, `#272822`) SHALL appear

#### Scenario: Comments stay readable
- **WHEN** a code comment is rendered on the block background
- **THEN** its contrast SHALL be at least 4.5:1

---

### Requirement: Open Graph default image
The system SHALL have a default OG image for pages without a specific `seo_image`. The OG image uses the wordmark plus the fin on a dark background.

**Spec:**
- Dimensions: 1200×630px
- Background: `#080b12`
- Fin: centred-left in a 290px column, 190px tall, `full` variant with spots, cyan glow
- Vertical rule `#1f1f1f` separating mark from text
- Wordmark: Geist Bold 66px, `#f5f5f5`
- Tagline below: "Engineering Leadership & Platform Thinking", Geist Regular 27px, `#a3a3a3`
- File: `public/images/og-default.png`

#### Scenario: Article without custom OG uses default
- **WHEN** an article frontmatter has no `seo_image`
- **THEN** the `<meta property="og:image">` SHALL point to `/images/og-default.png`

---

### Requirement: Brand animations use the fin's own geometry
Animated brand moments SHALL be built from the canonical fin path, not from invented shapes.
The path splits into three named strokes that SHALL be reused rather than redrawn:

```
leading edge  M12 52 C16 38 24 18 40 8 C44 5.5 47 8 45.5 13
trailing edge M45.5 13 C40 30 42 42 54 51 C56 52.5 55 55 52 55
base          M52 55 L15 55 C11.5 55 11 54 12 52
```

Every animated stroke SHALL declare `pathLength="100"` so a single
`stroke-dasharray: 100` normalises timing across segments of different real length.

**PWA splash** (`src/components/splash-screen/index.astro`): the outline draws, the fill
rises behind it, the spots pop in staggered, the mark glows, the wordmark enters. Total
under the 3800ms exit timeout.

**404** (`src/pages/404.astro`): the same three strokes, failing progressively — the leading
edge completes, the trailing edge reaches 78% and collapses, the base freezes as a fragment,
and the spots flicker once and never land.

#### Scenario: Reduced motion is honoured
- **WHEN** the visitor has `prefers-reduced-motion: reduce`
- **THEN** the splash SHALL render its finished state immediately and the 404 SHALL render
  its broken end state, both without animation
