## ADDED Requirements

### Requirement: Wordmark logo
The system SHALL display a typographic wordmark "Eduardo Álvarez" as the primary brand mark in the header. The wordmark SHALL be an SVG file at `public/images/logo.svg` using Geist Sans Bold.

**Specs:**
- Text: "Eduardo Álvarez" in Geist Bold (700)
- Color: `#f5f5f5` (text-primary) — invertible to `#0a0a0a` on light backgrounds
- Size in header: max height 28px
- No background, no border, no shadow

#### Scenario: Logo renders in header
- **WHEN** any page loads
- **THEN** the header SHALL display the wordmark SVG linked to `/`

#### Scenario: Logo is accessible
- **WHEN** a screen reader encounters the logo
- **THEN** it SHALL read "Eduardo Álvarez — Ir al inicio" (via aria-label on the anchor)

---

### Requirement: Isotipo (symbol mark)
The system SHALL have a standalone geometric isotype that works independently from the wordmark. The isotype represents a network of nodes — three connected points in an asymmetric triangle, suggesting platform thinking and interconnected systems.

**Isotype specs:**
```
Shape:      Three nodes (circles, r=4px in 64px canvas) connected by lines (stroke-width: 2px)
Layout:     Asymmetric triangle — top node (leader) slightly larger (r=5px)
            Left node: bottom-left, Right node: bottom-right
Lines:      Connecting all three nodes
Color:      #06b6d4 (accent) on transparent background
Variants:   - accent: cyan on transparent (default)
            - white: #f5f5f5 on transparent (for dark overlays)
Canvas:     64×64px viewBox (scales to any size)
```

**SVG location:** `public/images/logo-mark.svg`

#### Scenario: Isotipo is readable at 16px
- **WHEN** the isotype is rendered as a 16×16px favicon
- **THEN** the three nodes and connecting lines SHALL be visually distinguishable

#### Scenario: Isotipo is readable at 512px
- **WHEN** the isotype is rendered at 512×512px (PWA icon)
- **THEN** the shape SHALL remain clean without pixelation (SVG scales)

---

### Requirement: Favicon set
The system SHALL provide a complete favicon set generated from the isotype SVG.

**Required files in `public/images/favicon/`:**
```
favicon.ico          — 16×16 + 32×32 (multi-size ICO)
favicon-32x32.png    — 32×32
apple-touch-icon.png — 180×180 (in public/images/manifest/)
android-chrome-192x192.png — 192×192 (in public/images/manifest/)
android-chrome-512x512.png — 512×512 (in public/images/manifest/)
```

**HTML meta tags (in base layout head):**
```html
<link rel="icon" href="/images/favicon/favicon.ico" sizes="any">
<link rel="icon" href="/images/logo-mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/images/manifest/apple-touch-icon.png">
```

#### Scenario: Browser shows brand favicon
- **WHEN** the site is open in a browser tab
- **THEN** the tab icon SHALL show the isotype in cyan on dark background

#### Scenario: PWA install shows brand icon
- **WHEN** a user installs the site as a PWA
- **THEN** the home screen icon SHALL use the 512×512 version of the isotype

---

### Requirement: Open Graph default image
The system SHALL have a default OG image for pages without a specific `seo_image`. The OG image uses the wordmark + isotipo on a dark background.

**Spec:**
- Dimensions: 1200×630px
- Background: `#0a0a0a`
- Isotipo: centered-left, 120px
- Wordmark: to the right of isotipo, Geist Bold 48px, `#f5f5f5`
- Tagline below: "Engineering Leadership & Platform Thinking", Geist Regular 24px, `#a3a3a3`
- File: `public/images/og-default.png`

#### Scenario: Article without custom OG uses default
- **WHEN** an article frontmatter has no `seo_image`
- **THEN** the `<meta property="og:image">` SHALL point to `/images/og-default.png`
