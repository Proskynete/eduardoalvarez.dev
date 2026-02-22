# Design: Accesibilidad con Screen Readers

## Objectives

Ensure all site views are navigable and understandable by screen reader users, complying with WCAG 2.1 Level AA.

## File Structure

The implementation will focus on modifying existing Astro components and pages. No new major files are expected, mainly refactoring.

- `src/layouts/base/index.astro`: Main landmark structure.
- `src/components/common/Header.astro`: Navigation roles.
- `src/components/common/Footer.astro`: Contentinfo roles.
- `src/pages/index.astro`: Home view structure.
- `src/pages/articulos/index.astro`: Articles listing structure.
- `src/pages/charlas-talleres.astro`: Talks view structure.
- `src/pages/articulos/[slug].astro`: Individual article structure.

## Steps

### Phase 1: Global Structure & Home

- **Layout**: Ensure `<header>`, `<main>`, `<footer>` exist and are unique.
- **Skip Link**: Implement/Verify visible skip link to `#main-content`.
- **Home**: Add `aria-label` to sections, correct H1-H3 hierarchy.

### Phase 2: Articles Listing

- **Pagination**: Use `<nav aria-label="Paginación">`.
- **List**: Ensure `<ul>` > `<li>` > `<article>`.
- **Headings**: `H1` (Title) -> `H2` (Hidden/SR-only if needed) -> `H3` (Article titles).

### Phase 3: Talks & Workshops

- **Dropdowns**: Ensure keyboard accessibility (Enter/Space to toggle, Esc to close).
- **Images**: Add meaningful `alt` text or `aria-hidden="true"`.

### Phase 4: Individual Article

- **TOC**: `<nav aria-label="Tabla de contenidos">`.
- **Content**: Proper heading hierarchy within Markdown render.
- **Code Blocks**: Ensure they are keyboard accessible (scrollable).

## Security Considerations

N/A - Changes are purely frontend/HTML structure.

## Testing Manual

### Screen Readers

- **VoiceOver (Mac)**: Test navigation with `Ctrl+Opt+U` (Rotor) -> Landmarks/Headings.
- **NVDA (Windows)**: Test with linear navigation and shortcuts `H`, `D`, `L`.

### Keyboard

- **Tab Order**: Verify logical sequence.
- **Visual Focus**: Ensure `outline` is visible on all interactive elements.

## Future Improvements

- Automated CI/CD accessibility checks with Pa11y.
