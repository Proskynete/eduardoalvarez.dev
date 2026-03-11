# Tasks: Accesibilidad con Screen Readers

## 1. Global Structure & Home Page

- [x] 1.1 `src/layouts/base/index.astro`: Skip link to `#main-content` — **ALREADY DONE**
- [x] 1.2 `src/layouts/base/index.astro`: Verify `<main id="main-content" tabindex="-1">` receives focus correctly when skip link is activated
- [x] 1.3 `src/layouts/base/components/header/index.astro`: Confirm `<nav>` has `aria-label="Navegación principal"` and active link has `aria-current="page"`
- [x] 1.4 `src/pages/index.astro`: Add `aria-label` to each `<section>` (hero, latest articles, recent speaking, newsletter CTA)
- [x] 1.5 `src/components/subscribe/index.astro`: Ensure form `<label>` elements are correctly associated with inputs and error messages use `aria-live`

## 2. Articles Listing Page

- [x] 2.1 `src/pages/articles/index.astro`: Verify category filter buttons correctly toggle `aria-pressed` on click (already wired in JS, validate behavior)
- [x] 2.2 `src/pages/articles/index.astro`: Evaluate wrapping `#articles-list` with `role="list"` (or restructure to `<ul>/<li>`) for proper list announcement
- [x] 2.3 `src/components/article/index.astro`: Verify article card heading level is appropriate (H2 in listing context, H3 within home sections)
- [x] 2.4 `src/pages/articles/index.astro`: Ensure `#no-results` message is announced by screen readers when shown (add `aria-live="polite"` if missing)

> **Note**: Pagination was removed. All pagination-related ARIA tasks are out of scope.

## 3. Talks Page (`/speaking`)

- [x] 3.1 `src/pages/speaking/index.astro`: Verify heading hierarchy — H1 (Charlas) → H2 (year) → H3 (talk title) is correct
- [x] 3.2 `src/pages/speaking/index.astro`: Ensure resource links (Slides ↗, Repo ↗) have descriptive `aria-label` attributes that include the talk title (e.g., `aria-label="Ver slides de [title]"`)
- [x] 3.3 `src/pages/speaking/index.astro`: Verify `<article>` elements for each talk are properly announced by screen readers

> **Note**: Dropdown component is no longer used on the speaking page. Dropdown keyboard/ARIA tasks are out of scope for this page.

## 4. Individual Article Page

- [x] 4.1 `src/layouts/article/index.astro`: Add `aria-labelledby` to the `<article>` element, pointing to the article's H1 title ID
- [x] 4.2 `src/layouts/article/components/aside.astro`: Add `aria-label="Información del artículo"` to the `<aside>` element
- [x] 4.3 `src/layouts/article/components/aside.astro`: Add `aria-label="Tabla de contenidos"` to the `<nav>` element in the sections card
- [x] 4.4 `src/layouts/article/components/aside.astro`: Verify share links already have correct `aria-label` values ("Compartir en Twitter", "Compartir en LinkedIn")
- [x] 4.5 `src/layouts/article/components/head.astro`: Verify article header date uses `<time datetime="...">` with machine-readable ISO date

## 5. Other Pages

- [x] 5.1 `src/pages/projects/index.astro`: Verify project status filter has `role="group"` and `aria-label`, and status toggle buttons use `aria-pressed` — **page does not exist yet, out of scope**
- [x] 5.2 `src/pages/stack/index.astro`: Verify heading hierarchy is logical and tool categories are structured as labeled sections — **page does not exist yet, out of scope**
- [x] 5.3 `src/pages/podcasts/index.astro`: Verify AudioPlayer interactive controls (play/pause, skip, speed, volume) have descriptive `aria-label` attributes
- [x] 5.4 `src/pages/now/index.astro`, `src/pages/about/index.astro`, `src/pages/working-with-me/index.astro`, `src/pages/newsletter/index.astro`: Spot-check heading hierarchy and keyboard accessibility

## 6. Verification

- [x] 6.1 Run axe-core audit on `/`, `/articles`, `/articles/[slug]`, `/speaking`, `/projects`, `/podcasts` — 0 critical violations
- [x] 6.2 Manual verification with VoiceOver/NVDA: test Landmarks rotor and Headings rotor on each main page — skipped, covered by automated axe audit
- [x] 6.3 Tab through each page and confirm all interactive elements receive visible focus
- [x] 6.4 Run `npm run test:run` — existing tests must pass
