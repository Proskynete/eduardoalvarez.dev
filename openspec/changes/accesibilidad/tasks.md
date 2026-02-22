# Tasks: Accesibilidad con Screen Readers

## 1. Global Structure & Home Page

- [ ] 1.1 Update `src/layouts/base/index.astro` to ensure unique main landmark
- [ ] 1.2 Implement visible Skip Link in `src/layouts/base/index.astro`
- [ ] 1.3 Update `src/pages/index.astro`: Add `aria-label` to Author Profile section
- [ ] 1.4 Update `src/pages/index.astro`: Convert social links to `<nav>` list
- [ ] 1.5 Update `src/pages/index.astro`: Add `aria-labelledby` to Articles section
- [ ] 1.6 Update `src/components/subscribe/index.astro`: Ensure form labels/ARIA

## 2. Articles Listing Page

- [ ] 2.1 Update `src/pages/articulos/[...page].astro`: Remove redundancy, correct heading hierarchy
- [ ] 2.2 Update `src/pages/articulos/[...page].astro`: Connect section with `aria-labelledby`
- [ ] 2.3 Refactor `src/components/pagination/index.astro` to use `<nav>` and descriptive labels

## 3. Talks & Workshops Page

- [ ] 3.1 Update `src/pages/charlas-talleres/index.astro`: Correct heading hierarchy (H2 for talks)
- [ ] 3.2 Update `src/pages/charlas-talleres/index.astro`: Semantic list for organizations
- [ ] 3.3 Update `src/pages/charlas-talleres/index.astro`: metadata with `<dl>`
- [ ] 3.4 Refactor `src/components/dropdown/index.tsx` for full keyboard/ARIA support

## 4. Individual Article Page

- [ ] 4.1 Update `src/layouts/article/index.astro`: Add `aria-labelledby` to article
- [ ] 4.2 Update `src/layouts/article/components/head.astro`: Semantic header and Accessible formatted date
- [ ] 4.3 Update `src/layouts/article/components/aside.astro`: Organize sidebar with named sections/navs
- [ ] 4.4 Update `src/layouts/article/index.astro`: Accessible "Share" button

## 5. Verification

- [ ] 5.1 Run `npm run test:a11y:all` (axe-core)
- [ ] 5.2 Manual verification with VoiceOver/NVDA (Landmarks, Headings)
