## 1. Design System Foundation

- [ ] 1.1 Install `geist` npm package (`npm install geist`) and verify it resolves correctly
- [ ] 1.2 Update `tailwind.config.mjs` — add all color tokens: background, surface, surface-raised, surface-border, text-primary, text-secondary, text-muted, accent, accent-hover, accent-subtle, error, success, warning
- [ ] 1.3 Update `tailwind.config.mjs` — add font families: `font-sans: ['Geist', ...]` and `font-mono: ['Geist Mono', ...]`
- [ ] 1.4 Update `tailwind.config.mjs` — add container width tokens: content (672px), wide (960px), full (1280px)
- [ ] 1.5 Update `tailwind.config.mjs` — add spacing tokens: section-gap (96px), card-pad (24px), nav-height (64px)
- [ ] 1.6 Update `tailwind.config.mjs` — add controlled gradients as backgroundImage tokens: hero-gradient, accent-glow
- [ ] 1.7 Update `src/assets/styles/base.css` — replace `*:focus-visible` outline from pink to `#06b6d4`; remove Hero/Avenir `@font-face` declarations
- [ ] 1.8 Update `src/assets/styles/article.css` — remove Hero/Avenir font rules, update prose typography to Geist scale, update code block colors to surface-raised, update blockquote to accent left border
- [ ] 1.9 Verify: run `npm run build` and confirm no Tailwind class resolution errors

## 2. Brand Identity Assets

- [ ] 2.1 Create isotype SVG (`public/images/logo-mark.svg`) — three-node network graph, cyan accent color, 64×64 viewBox, stroke-only, asymmetric triangle layout
- [ ] 2.2 Create wordmark SVG (`public/images/logo.svg`) — "Eduardo Álvarez" in Geist Bold, `#f5f5f5`, horizontal layout, max-height 28px when rendered
- [ ] 2.3 Generate favicon set from isotype SVG: `favicon.ico` (16+32px), `favicon-32x32.png` — place in `public/images/favicon/`
- [ ] 2.4 Generate PWA icon set from isotype: `apple-touch-icon.png` (180px), `android-chrome-192x192.png`, `android-chrome-512x512.png` — place in `public/images/manifest/`
- [ ] 2.5 Create OG default image (`public/images/og-default.png`, 1200×630px) — dark background, isotipo left, wordmark right, tagline below
- [ ] 2.6 Update `src/layouts/base/components/head.astro` — update favicon meta tags to reference new SVG favicon and PNG fallbacks
- [ ] 2.7 Update `src/settings/index.ts` — update site title, description, and keywords to reflect new positioning
- [ ] 2.8 Verify: open browser and confirm favicon shows isotype in tab; share a URL and confirm OG image renders correctly

## 3. Base Layout & Navigation

- [ ] 3.1 Rewrite `src/layouts/base/components/header/index.astro` — sticky header, 64px height, wordmark left + flat nav right, search icon right, `surface` background with `backdrop-blur` on scroll
- [ ] 3.2 Update header navigation links — replace old routes with: Articles (`/articles`), Speaking (`/speaking`), Now (`/now`), Stack (`/stack`), About (`/about`), Working with Me (`/working-with-me`)
- [ ] 3.3 Implement mobile nav — hamburger button, slide-in drawer with all nav items, focus trap when open, close on nav or ✕
- [ ] 3.4 Implement active link highlighting — apply `text-accent` to the nav item matching the current pathname
- [ ] 3.5 Rewrite `src/layouts/base/components/footer/index.astro` — remove terminal text and cursor animation; add isotipo (20px), wordmark, social icons (GitHub, LinkedIn, Twitter, RSS, Email), copyright
- [ ] 3.6 Update `src/layouts/base/index.astro` — replace `bg-black/95` with `bg-background`; update container classes to new width tokens
- [ ] 3.7 Update `src/components/scrolling-progress-bar/index.tsx` — change `bg-teal-700` to `bg-accent`
- [ ] 3.8 Verify: navigate through all existing pages and confirm header/footer render correctly with new design; test keyboard navigation through nav

## 4. URL Redirects & Routing

- [ ] 4.1 Create `src/pages/articles/` directory and `src/pages/articles/index.astro` (articles listing, replaces `/articulos/[...page].astro`)
- [ ] 4.2 Create `src/pages/articles/[slug].astro` or move existing MDX articles to be accessible under `/articles/`
- [ ] 4.3 Create `src/pages/speaking/index.astro` (replaces `/charlas-talleres/index.astro`)
- [ ] 4.4 Update `vercel.json` — add 301 redirects: `/articulos` → `/articles`, `/articulos/:path*` → `/articles/:path*`, `/charlas-talleres` → `/speaking`, `/donaciones` → `/`
- [ ] 4.5 Remove `src/pages/donaciones.astro`
- [ ] 4.6 Verify: test each redirect URL manually and confirm 301 status; check Algolia index URLs still resolve (or plan re-index)

## 5. Article Layout Redesign

- [ ] 5.1 Update `src/layouts/article/index.astro` — update grid layout for new desktop/mobile split; remove all pink-* color classes; apply new token classes
- [ ] 5.2 Update article header component (`src/layouts/article/components/head.astro`) — apply new typography scale; category badges use `accent-subtle` background
- [ ] 5.3 Update sidebar component (`src/layouts/article/components/aside.astro`) — remove decorative elements; apply `text-secondary` and `text-muted` to metadata; TOC active state uses `text-accent` with left border
- [ ] 5.4 Move share button into sidebar (remove fixed bottom-left positioning); update styling to match new design
- [ ] 5.5 Update Giscus component (`src/layouts/article/components/giscus.tsx`) — set theme to `transparent_dark`; remove any card container
- [ ] 5.6 Verify: open an article page and confirm typography, sidebar, TOC, share button, and comments render correctly

## 6. Homepage Redesign

- [ ] 6.1 Rewrite `src/pages/index.astro` — hero section with name, positioning statement, tagline, two CTA links; apply hero-gradient background
- [ ] 6.2 Implement "Latest Writing" section — 3 most recent articles, vertical list layout, card with category/date/title/description/reading-time
- [ ] 6.3 Implement "Recent Speaking" section — 2–3 featured talks from `src/settings/talks.ts`, minimal list layout
- [ ] 6.4 Implement newsletter CTA section — reuse subscribe component in a surface-background card at bottom of page
- [ ] 6.5 Verify: homepage renders all four sections; article cards navigate correctly; subscribe form works

## 7. Articles Listing Page

- [ ] 7.1 Complete `src/pages/articles/index.astro` — page header, single-column article list, client-side category filter bar
- [ ] 7.2 Implement category filter component — horizontal filter bar, active state with accent background, client-side filtering, "no results" empty state
- [ ] 7.3 Verify: articles list renders; category filter works client-side; URL `/articulos` redirects correctly

## 8. Speaking Page

- [ ] 8.1 Complete `src/pages/speaking/index.astro` — page header with contact CTA; talks grouped by year in descending order
- [ ] 8.2 Implement talk item component — year, event, title, description, category badges, conditional resource links (slides/video/repo)
- [ ] 8.3 Update `src/settings/talks.ts` if needed — ensure data structure has year, event, and optional URL fields
- [ ] 8.4 Verify: speaking page renders all talks grouped by year; external links open in new tab; redirect from `/charlas-talleres` works

## 9. New Pages

- [ ] 9.1 Create `src/settings/now.ts` — define `NowItem` interface and initial content data
- [ ] 9.2 Create `src/pages/now/index.astro` — page header with last-updated date; items grouped by category with accent label + description
- [ ] 9.3 Create `src/settings/stack.ts` — define `StackItem` interface with categories (Languages, Frameworks, Infrastructure, AI Tools, Hardware, Apps) and populate with real data
- [ ] 9.4 Create `src/pages/stack/index.astro` — page header; items in two-column grid by category; featured indicator; all links open in new tab
- [ ] 9.5 Create `src/pages/about/index.mdx` (or `.astro`) — five sections: Intro, What I work on, Where I've been, How I think (with accent-border quotes), Connect
- [ ] 9.6 Create `src/pages/working-with-me/index.astro` — three engagement type cards; Who it's for list; How to start with email + Calendly links (no form)
- [ ] 9.7 Create `src/pages/newsletter/index.astro` — value proposition list; subscribe form (reuse component); empty archive placeholder
- [ ] 9.8 Create `src/pages/projects/index.astro` — update `src/settings/projects.ts` with `status` field; project cards with status badges; two-column grid; client-side status filter
- [ ] 9.9 Verify: all eight new pages render without build errors; navigate to each via direct URL; confirm no `noindex` on `/projects`

## 10. 404 Page Update

- [ ] 10.1 Update `src/pages/404.astro` — apply new design tokens; remove pink; keep illustration or replace with a minimal text-only approach consistent with new aesthetic
- [ ] 10.2 Verify: navigate to a non-existent route and confirm the 404 page renders with the new design

## 11. SEO & Metadata Audit

- [ ] 11.1 Update site description in `src/settings/index.ts` to reflect new positioning: "Engineering Leadership & Platform Thinking in the AI Era"
- [ ] 11.2 Update keywords to include: engineering leadership, platform architecture, AI era, engineering culture
- [ ] 11.3 Verify all new pages have correct `<title>` and `<meta name="description">` tags
- [ ] 11.4 Verify OG images: articles use their `seo_image`; other pages use `og-default.png`
- [ ] 11.5 Update sitemap — confirm `/articulos` is replaced by `/articles` in the generated sitemap
- [ ] 11.6 Re-run Algolia index after URL changes: trigger `npm run build` and confirm Algolia index updates with new `/articles/` URLs

## 12. Accessibility & Quality Verification

- [ ] 12.1 Run color contrast audit on all new color combinations — confirm text-primary/background ≥ 7:1; accent/background ≥ 4.5:1; text-secondary/background ≥ 4.5:1
- [ ] 12.2 Keyboard navigation test — tab through homepage, articles page, article detail, and working-with-me; confirm all interactive elements are reachable and have visible focus
- [ ] 12.3 Screen reader test — verify logo aria-label, social icon aria-labels, mobile nav focus trap, and article TOC links
- [ ] 12.4 Run `npm run lint` and fix any TypeScript or ESLint errors introduced during the redesign
- [ ] 12.5 Run `npm run build` — confirm zero TypeScript errors and zero build warnings related to new code
- [ ] 12.6 Run existing test suite `npm run test:run` — confirm all 55 unit tests still pass; update any tests broken by renamed routes or changed components
