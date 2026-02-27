## ADDED Requirements

### Requirement: Article detail layout
Individual article pages SHALL use an editorial layout: wide content area with a sticky sidebar on desktop. The layout SHALL feel like a premium technical publication, not a tutorial blog.

**Layout (desktop ≥ 1024px):**
```
[Article content — 65% width, max 672px prose]  |  [Sidebar — 30%]
```

**Layout (mobile < 1024px):** Single column, sidebar content moves below article.

#### Scenario: Article renders with correct layout on desktop
- **WHEN** an article page loads on viewport ≥ 1024px
- **THEN** content and sidebar SHALL appear side by side

#### Scenario: Article stacks on mobile
- **WHEN** an article page loads on viewport < 768px
- **THEN** sidebar content SHALL appear below the article body

---

### Requirement: Article header
Each article SHALL have a header section above the body with: category badges, title, description, date, and reading time.

**Header structure:**
```
[Category badge(s)]
[Title — text-4xl, Geist Bold]
[Description — text-lg, text-secondary]
[Date · Reading time — text-sm, text-muted]
```

#### Scenario: Article header shows all metadata
- **WHEN** an article page loads
- **THEN** the header SHALL display category, title, description, publication date, and reading time

---

### Requirement: Article body typography
The article prose SHALL use Geist Sans with a comfortable reading line-length, generous line-height, and clear heading hierarchy.

**Prose styles:**
```
body text:     text-base (16px), line-height 1.75, text-primary, font-weight 400
paragraphs:    margin-bottom 1.5rem
h2:            text-3xl, Geist Bold, margin-top 3rem, margin-bottom 1rem
h3:            text-xl, Geist SemiBold, margin-top 2rem, margin-bottom 0.75rem
links:         text-accent, underline on hover
code inline:   font-mono, text-sm, surface background, accent text, 4px padding, 4px radius
code blocks:   font-mono, text-sm, surface-raised background, full-width, 16px padding
blockquotes:   left border 3px accent, text-secondary, italic, 1rem left padding
```

#### Scenario: Code blocks use mono font with syntax highlighting
- **WHEN** a fenced code block renders in an article
- **THEN** it SHALL use Geist Mono, Shiki syntax highlighting (Monokai theme), and `surface-raised` background

#### Scenario: Links within article are distinguishable
- **WHEN** an article body renders inline links
- **THEN** links SHALL appear in `accent` color, visually distinct from body text

---

### Requirement: Article sidebar
The sticky sidebar SHALL contain: table of contents, article metadata, and a share button.

**Sidebar sections (in order):**
1. **Table of Contents** — anchored links from frontmatter `sections[]`, active section highlighted on scroll
2. **Article info** — Published date, reading time, categories
3. **Share** — Single button "Share on X" (Twitter intent), `text-muted` icon + label

**TOC behavior:**
- Active section: `accent` color + left border accent indicator
- Smooth scroll on click

#### Scenario: TOC highlights current section
- **WHEN** user scrolls to a section defined in frontmatter
- **THEN** the corresponding TOC entry SHALL receive the `accent` color

#### Scenario: Share button opens Twitter intent
- **WHEN** user clicks the share button
- **THEN** a Twitter Web Intent URL SHALL open in a new tab with the article title and URL pre-filled

---

### Requirement: Giscus comments
Comments via Giscus (GitHub Discussions) SHALL remain at the bottom of every article, below the body and above the footer.

**Visual update:**
- Giscus theme SHALL be set to `dark` or `transparent_dark` to match the new design
- No visual container or card around Giscus — flush with the page background

#### Scenario: Comments section loads
- **WHEN** an article page loads with valid Giscus env vars
- **THEN** the Giscus comment widget SHALL render below the article content
