## MODIFIED Requirements

### Requirement: Article layout visual redesign
The article layout (`src/layouts/article/index.astro`) SHALL be redesigned to match the editorial spec defined in `page-article-detail/spec.md`. The layout structure (grid with sidebar) is preserved; the visual treatment changes completely.

**Changes from current:**
- Remove all `pink-*` color classes → use `accent` tokens
- Remove `font-hero` and `font-avenir` references → use Geist Sans
- Update article typography per `page-article-detail` prose styles
- Sidebar: simplify, remove any decorative elements, align with new minimal aesthetic
- Share button: update from fixed bottom-left position to sidebar placement
- Giscus: update theme to `transparent_dark`

#### Scenario: Article layout renders with Geist typography
- **WHEN** an article page loads after redesign
- **THEN** the prose content SHALL render in Geist Sans, not Hero or Avenir fonts

#### Scenario: Article layout has no pink color references
- **WHEN** an article page is inspected
- **THEN** no `pink-*` Tailwind classes SHALL appear in any rendered element

---

### Requirement: Article CSS update
The `src/assets/styles/article.css` file SHALL be updated to remove Hero/Avenir font declarations and replace typography rules with Geist-based equivalents.

**Changes:**
- Remove `@font-face` for Hero and Avenir
- Remove all `font-family: 'Hero'` and `font-family: 'Avenir'` rules
- Update heading styles to match Geist Bold weights and new size scale
- Update code block styles: remove `color: #0a3f66` and `background: #f4f4f4` → use `surface-raised` and `text-primary`
- Update blockquote style: remove yellow background (`#f0db4f`) → use `accent-subtle` left border per spec

#### Scenario: Code blocks no longer use light background
- **WHEN** a code block renders in an article
- **THEN** the background SHALL be `#161616` (surface-raised), not `#f4f4f4`

#### Scenario: Blockquotes use accent border not yellow background
- **WHEN** a blockquote renders in an article
- **THEN** it SHALL show a 3px left border in `#06b6d4` with no background color fill
