# Design: Accesibilidad con Screen Readers

## Objectives

Ensure all site views are navigable and understandable by screen reader users, complying with WCAG 2.1 Level AA.

## File Structure

The implementation will focus on modifying existing Astro components and pages. No new major files are expected, mainly refactoring.

- `src/layouts/base/index.astro`: Main landmark structure. _(Skip link already implemented)_
- `src/layouts/base/components/header/index.astro`: Navigation roles and active state ARIA.
- `src/layouts/base/components/footer/index.astro`: Contentinfo roles.
- `src/pages/index.astro`: Home view — hero section with H1, latest articles, recent speaking, newsletter CTA.
- `src/pages/articles/index.astro`: Articles listing with client-side category filter (no pagination).
- `src/pages/speaking/index.astro`: Talks grouped by year — simple list layout, no dropdown.
- `src/pages/podcasts/index.astro`: Podcast episode listing.
- `src/pages/projects/index.astro`: Projects with client-side status filter.
- `src/pages/now/index.astro`: Now page.
- `src/pages/stack/index.astro`: Stack/tools by category.
- `src/pages/about/index.astro`: About page.
- `src/pages/working-with-me/index.astro`: Engagement types and contact.
- `src/pages/newsletter/index.astro`: Newsletter subscription page.
- `src/layouts/article/index.astro`: Individual article with card-based sidebar.
- `src/layouts/article/components/aside.astro`: Sidebar with TOC nav (needs `aria-label`), info card, share card.
- `src/components/article/index.astro`: Article card component.
- `src/components/subscribe/index.astro`: Newsletter subscription form.

## Steps

### Phase 1: Global Structure & Home

- **Skip Link**: Already implemented in `src/layouts/base/index.astro` — verify it is visually shown on focus and moves focus to `#main-content`.
- **Layout**: Confirm `<header>`, `<main>`, `<footer>` are unique and have proper roles (`banner`, `main`, `contentinfo`).
- **Home**: New hero section — add `aria-label` to each `<section>` (hero, latest articles, recent speaking, newsletter CTA). H1 is "Eduardo Álvarez" in the hero.
- **Header nav**: Verify `<nav aria-label="Navegación principal">` exists and active link has `aria-current="page"`.

### Phase 2: Articles Listing Page

- **Category filter**: The filter uses `role="group" aria-label="Filtrar por categoría"` — already in place. Verify buttons have correct `aria-pressed` state toggle.
- **List**: Ensure each article card is wrapped in a meaningful structure. No `<ul>/<li>` currently — evaluate adding `role="list"` on `#articles-list` or refactoring to semantic list.
- **Headings**: `H1` (Artículos) → article titles should be H2 or H3 within their cards depending on the card component.
- **No pagination**: Pagination was removed. Remove any pagination ARIA requirements from scope.

### Phase 3: Talks Page (`/speaking`)

- The page was completely redesigned. It now uses a simple list grouped by year with no dropdown.
- **Heading hierarchy**: H1 (Charlas) → H2 (year labels, currently styled as `<h2>`) → H3 (talk titles, currently `<h3>`). Verify this is already correct.
- **Article landmark**: Each talk is wrapped in `<article>` — verify this is announced correctly.
- **Resource links**: Plain `<a>` links for slides/repo — ensure they have descriptive text and `aria-label` if needed (e.g., "Ver slides de [talk title]").
- **No dropdown**: The dropdown component (`src/components/dropdown/index.tsx`) is no longer used in the speaking page. Dropdown accessibility is out of scope for this page.

### Phase 4: Individual Article Page

- **TOC**: `src/layouts/article/components/aside.astro` has `<nav>` for sections but is missing `aria-label="Tabla de contenidos"`. Add it.
- **Article landmark**: `src/layouts/article/index.astro` wraps content in `<article>` — add `aria-labelledby` pointing to the article H1.
- **Aside sections**: The info card groups reading time, categories, and tags. Consider adding `aria-label` to the `<aside>` element itself (e.g., `aria-label="Información del artículo"`).
- **Share links**: Already have `aria-label="Compartir en Twitter"` and `aria-label="Compartir en LinkedIn"` — verify these are correct.
- **Content**: Proper heading hierarchy within MDX content — H2 → H3 → H4 within the article body.

### Phase 5: Other Pages

- **`/projects`**: Projects listing has client-side status filter. Verify filter group has proper `role` and `aria-label`.
- **`/stack`**: Grouped by category — verify heading hierarchy and list structure.
- **`/now`, `/about`, `/working-with-me`, `/newsletter`**: Mostly static content — verify heading hierarchy and that all interactive elements are keyboard accessible.
- **`/podcasts`**: AudioPlayer component should have proper ARIA (play/pause, progress, volume controls).

## Security Considerations

N/A - Changes are purely frontend/HTML structure.

## Testing Manual

### Screen Readers

- **VoiceOver (Mac)**: Test navigation with `Ctrl+Opt+U` (Rotor) -> Landmarks/Headings for each main page.
- **NVDA (Windows)**: Test with linear navigation and shortcuts `H`, `D`, `L`.

### Keyboard

- **Tab Order**: Verify logical sequence on all pages.
- **Visual Focus**: Ensure `outline` is visible on all interactive elements (already configured in `src/assets/styles/base.css` with `focus-visible` ring).

## Future Improvements

- Automated CI/CD accessibility checks with Pa11y or axe-core in CI.
