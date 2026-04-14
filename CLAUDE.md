# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal site of Eduardo Álvarez — **Engineering Leadership & Platform Thinking in the AI Era** — built with **Astro 5**, React, and TypeScript. Features MDX articles, full-text search via Algolia, comments via Giscus, newsletter via Mailchimp, podcast player with custom AudioPlayer component, and a complete design system (Geist + cyan/dark palette). Deployed to Vercel with static site generation and serverless API routes.

## Development Commands

```bash
# Start development server
npm run dev
# or
npm start

# Build for production (includes TypeScript checking)
npm run build

# Preview production build locally
npm run preview

# Lint TypeScript/JSX files
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run tests (watch mode)
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests once (for CI)
npm run test:run

# Run Astro CLI directly
npm run astro -- [command]
```

## Code Architecture

### Directory Structure

**`src/pages/`** - File-based routing following Astro conventions
- `index.astro` - Homepage (hero, latest articles, recent talks, newsletter CTA)
- `404.astro` - Custom 404 with branded disconnected-node SVG animation
- `articles/` - Articles section
  - `index.astro` - Listing with client-side category filter
  - `*.mdx` - Individual MDX articles
- `speaking/index.astro` - Talks grouped by year (replaces `/charlas-talleres/`)
- `now/index.astro` - Now page: what I'm currently working on
- `stack/index.astro` - Tools and technologies by category
- `about/index.astro` - About page
- `working-with-me/index.astro` - Engagement types and contact info
- `newsletter/index.astro` - Newsletter subscription page
- `projects/index.astro` - Projects with client-side status filter
- `podcasts/` - Podcast section
  - `index.astro` - Episode listing with inline AudioPlayer
  - `[slug].astro` - Episode detail with notes, guests, platforms
- `api/subscribe.ts` - Newsletter subscription endpoint with Zod validation
- `rss.xml.ts` - RSS feed generation

> **URL redirects**: `/articulos` → `/articles`, `/articulos/:path*` → `/articles/:path*`, `/charlas-talleres` → `/speaking` (configured in `vercel.json`)

**`src/layouts/`** - Page layout templates
- `base/index.astro` - Root wrapper with SEO head, sticky header (search + mobile nav), and footer
- `main/index.astro` - General page layout (wraps `base`, provides content container)
- `article/index.astro` - Article layout with card-based sidebar (TOC, share), Giscus, scroll progress bar

**`src/components/`** - Reusable React and Astro components
- `article/` - Article card component
- `audio-player/` - Custom audio player (React) with play/pause, skip ±15s, speed, volume, progress bar
- `dropdown/` - Dropdown menu (React)
- `pagination/` - Pagination controls
- `project/` - Project card component
- `scrolling-progress-bar/` - Reading progress indicator (React)
- `subscribe/` - Newsletter subscription form with error handling, loading states, and field validation
- `ui/image/` - Image wrapper component

**`src/utils/`** - Pure utility functions
- `articles.ts` - Sort articles by date, generate GitHub edit links
- `categories.ts` - Category management
- `date.ts` - Date calculations
- `reading-time.ts` - Calculate reading time for articles
- `strings.ts` - String manipulation

**`src/settings/`** - Configuration and data
- `index.ts` - Main site config (title, description, social links, SEO defaults, contacts)
- `manifest-config.ts` - PWA web manifest
- `talks.ts` - Talks/workshops data
- `projects.ts` - Projects data with `status` field (active/maintained/archived)
- `now.ts` - "Now" page content (what I'm currently working on)
- `stack.ts` - Stack items by category (Languages, Frameworks, Infrastructure, AI Tools, Hardware, Apps)
- `podcasts.ts` - Podcast episodes with guests, platforms, topics, and audio URLs

**`src/assets/`** - Static assets
- `styles/base.css` - Global CSS (focus-visible ring in accent color)
- `styles/article.css` - Article prose typography overrides
- `icons/` - SVG icon components (ArrowLeft, Close, GitHub, Mail, Menu, Resources, Search)

**`src/interfaces/index.ts`** - TypeScript type definitions
- Core types: `Article`, `CategoryAllowed`, `ArticleLayout`, `Section`, `Heading`, `HeadingDepth`
- All types are strictly typed (no `any` types)

**`tests/`** - Testing directory (ALL tests MUST be located here)
- `units/` - Unit tests with Vitest (*.test.ts, *.test.tsx)
  - `setup.ts` - Global test setup with jest-dom matchers and cleanup
  - `utils/` - Tests for utility functions
    - `articles.test.ts` - Tests for article utilities (11 tests)
    - `reading-time.test.ts` - Tests for reading time calculation (13 tests)
    - `date.test.ts` - Tests for date utilities (13 tests)
  - `layouts/` - Tests for layout components
  - `components/` - Tests for React/Astro components
- `e2e/` - End-to-end tests with Playwright (*.spec.ts)
  - `search.spec.ts` - E2E tests for search functionality (5 tests)
  - `subscribe.spec.ts` - E2E tests for newsletter subscription (6 tests)

**IMPORTANT**: All tests MUST be placed in the `tests/` directory:
- Vitest unit tests → `tests/units/`
- Playwright E2E tests → `tests/e2e/`
- Never place test files directly in `src/` alongside source code

**`vitest.config.ts`** - Vitest configuration
- React support with @vitejs/plugin-react
- jsdom environment for component testing
- Coverage reporting with v8 provider
- Coverage thresholds: 80% (statements, branches, functions, lines)

**`src/scripts/algolia.ts`** - Custom Astro integration
- Hooks into build process (`astro:build:generated`)
- Extracts article metadata from MDX frontmatter
- Publishes index to Algolia for search functionality
- Requires env vars: `PUBLIC_ALGOLIA_APPLICATION_ID`, `PUBLIC_ALGOLIA_INDEX_NAME`, `ALGOLIA_ADMIN_API_KEY`

### Design Patterns

**Layout Composition**: Nested layouts inherit from `BaseLayout` (`src/layouts/base/index.astro`), which includes SEO head, sticky header with Algolia search, and footer. `MainLayout` (`src/layouts/main/index.astro`) wraps `BaseLayout` for general pages. `ArticleLayout` extends `MainLayout` and adds card-based sidebar (reading time, TOC, share), Giscus comments, and scroll progress bar.

**Design System**: Custom Tailwind tokens defined in `tailwind.config.mjs`:
- **Colors**: `background` (#0a0a0a), `surface` / `surface-raised` / `surface-border`, `text-primary` / `text-secondary` / `text-muted`, `accent` (#06b6d4) / `accent-hover` / `accent-subtle`, `error`, `success`, `warning`
- **Typography**: Geist (sans) + Geist Mono
- **Widths**: `max-w-content` (760px), `max-w-wide` (1100px), `max-w-full` (1280px)
- **Spacing**: `section-gap` (96px), `card-pad` (24px), `nav-height` (64px)
- **Gradients**: `hero-gradient`, `accent-glow`

**View Transitions**: `ClientRouter` (Astro View Transitions) is enabled. Filter scripts on `/articles` and `/projects` are wrapped in an `initFilter()` function subscribed to `document.addEventListener('astro:page-load', initFilter)` so they re-initialize after each navigation.

**Component Organization**: Feature-based grouping. Astro components use `.astro` extension, React components use `.tsx`. Interactive components (search, audio player, dropdown, progress bar, mobile nav) are React with appropriate client directives (`client:load` for above-fold, `client:visible` for below-fold). Static components are Astro.

**Data Structure**: Article metadata in MDX frontmatter with these required fields:
- `layout`: Path to layout file (e.g., `../../layouts/article/index.astro`)
- `title`: Article title
- `slug`: URL-friendly identifier
- `description`: SEO description (máximo 160 caracteres — el sitio trunca automáticamente, pero es mejor escribirla dentro del límite)
- `date`: Publication date (ISO format)
- `categories`: Array of `CategoryAllowed` types
- `seo_image`: Path to social media image
- `sections`: Array of `{title, anchor}` for table of contents

**Utility Functions**: Pure functions for sorting (`articlesSort`), filtering, and formatting. All utilities import centralized config from `src/settings/index.ts`.

## Key Technologies & Integrations

| Technology | Purpose |
|---|---|
| **Astro 5** | Static site generation with serverless API routes |
| **React 19** | Interactive components (search, dropdown, progress bar) |
| **TypeScript 5.3** | Type safety (strict mode with `strictNullChecks: true`) |
| **Tailwind CSS 3.4** | Utility-first styling with typography and forms plugins |
| **MDX** | Blog content with embedded React components |
| **Algolia v5** | Full-text search with custom build integration (src/scripts/algolia.ts) |
| **Giscus** | GitHub Discussions-based comments (@giscus/react) |
| **Mailchimp** | Newsletter subscription backend (via api/subscribe.ts) |
| **Zod** | Schema validation and type inference for API endpoints |
| **Vercel** | Hosting with static site generation and serverless API functions (configured via vercel.json) |
| **Vitest** | Unit testing framework with React Testing Library integration |

**Testing Stack**:
- Vitest 4.0 for unit testing
- @testing-library/react for component testing
- @testing-library/user-event for user interaction testing
- @testing-library/jest-dom for DOM matchers
- jsdom for browser environment simulation
- @vitest/ui for visual test debugging
- @vitest/coverage-v8 for code coverage reporting

**Additional Features**:
- PWA support (web manifest via astro-webmanifest, service worker via astrojs-service-worker)
- Auto-generated sitemap and RSS feed
- Image optimization
- Shiki syntax highlighting (Monokai theme)
- Partytown for off-thread analytics scripts

## Common Development Tasks

### Adding a Blog Article

1. Create new file in `src/pages/articles/my-article.mdx`
2. Add frontmatter with required fields:
   ```yaml
   ---
   layout: ../../layouts/article/index.astro
   title: "Article Title"
   slug: "article-title"
   description: "Brief summary for SEO"
   date: 2025-11-04T12:00:00-03:00
   categories: ["web-development", "javascript"]
   seo_image: /images/articles/my-article/cover.webp
   sections:
     [
       { title: 'Section 1', anchor: 'section-1' },
       { title: 'Section 2', anchor: 'section-2' },
     ]
   ---
   ```
3. Write content in MDX format with heading IDs matching section anchors
4. On build, the article is automatically indexed in Algolia (via `src/scripts/algolia.ts`)

**Note**: Categories must be one of the allowed types defined in `src/interfaces/index.ts`: `web-development`, `javascript`, `react`, `vue`, `astro`, `node`, `express`, `sql`, `no-sql`.

### Working with API Endpoints

API endpoints in `src/pages/api/` use Zod for input validation. Example pattern:

```typescript
import { z } from 'zod';
import type { APIRoute } from 'astro';

// 1. Define validation schema
const InputSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  name: z.string().min(2).max(50).trim(),
});

type Input = z.infer<typeof InputSchema>;

// 2. Validate in endpoint
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validatedData: Input = InputSchema.parse(body);

    // 3. Use validated data
    // ...

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        success: false,
        message: error.errors[0].message,
        errors: error.errors,
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // Handle other errors...
  }
};
```

**Subscribe API** (`src/pages/api/subscribe.ts`):
- Validates email (format, length, sanitization) and name (length, letters only, including accents)
- Uses `getListMember()` for O(1) duplicate checking
- Returns proper status codes: 400 (validation), 409 (duplicate), 200 (success), 500 (server error)
- See `docs/VALIDACION_ZOD_API_SUBSCRIBE.md` for detailed documentation

### Working with the Subscribe Form

The newsletter subscription form (`src/components/subscribe/index.astro`) has complete error handling and state management:

**Features**:
- HTML5 validation (required, minlength, maxlength, type)
- Loading state with spinner and disabled inputs
- Success state with auto-hide after 5 seconds
- Error state with field-specific messages
- Automatic error cleanup when typing
- Dark theme consistent with site design

**States handled**:
- **200 (Success)**: Green message, form cleared, auto-hide
- **400 (Validation)**: Red message + field-specific errors with red borders
- **409 (Duplicate)**: Red message for already registered email
- **500 (Server Error)**: Generic error message
- **Network Error**: Connection error message

**Integration**:
The form consumes the Zod-validated API endpoint and displays appropriate UI for each response type. All error messages are in Spanish and user-friendly.

See `docs/MANEJO_ERRORES_FORMULARIO_SUBSCRIBE.md` for detailed documentation.

### Creating a New Component

1. Create folder in `src/components/feature-name/`
2. Create `index.astro` (static) or `index.tsx` (interactive)
3. Use TypeScript for type safety
4. Import in layout or parent component
5. For React components that need interactivity, use client directives (`client:load`, `client:visible`)

### Updating Site Configuration

Edit `src/settings/index.ts` to update:
- Site title, description, and keywords
- Social media links (social_network array)
- Contact information (contacts array)
- Author information
- SEO defaults and URLs

### Debugging Build Issues

Run `astro check` to validate TypeScript without building. This catches type errors before the full build runs.

### Running Tests

The project has a comprehensive test suite with 55 tests and >93% coverage:

**Running tests**:
```bash
# Watch mode (recommended for development)
npm test

# Run once (for CI)
npm run test:run

# With UI for debugging
npm run test:ui

# With coverage report
npm run test:coverage
```

**Test structure**:
- All test files are located next to the files they test
- Test files end with `.test.ts` or `.test.tsx`
- Use `describe` blocks to group related tests
- Use `it` or `test` for individual test cases

**Writing tests**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

describe('MyFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

**Testing hooks**:
```typescript
import { renderHook, waitFor } from '@testing-library/react';

it('should update state', async () => {
  const { result } = renderHook(() => useMyHook());

  await result.current.doSomething();

  await waitFor(() => {
    expect(result.current.state).toBe(expected);
  });
});
```

**Mocking modules**:
```typescript
vi.mock('module-name', () => ({
  functionName: vi.fn(() => mockValue),
}));
```

**Coverage requirements**:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

Current coverage: 93.84% statements, 86.95% branches, 100% functions

## Code Style & Quality

**Linting Rules** (.eslintrc.cjs):
- Import sorting enforced via `simple-import-sort` plugin
- React components don't require `React` import (JSX transform enabled)
- TypeScript strict mode enabled (`strictNullChecks: true`)
- No duplicate imports allowed
- `@typescript-eslint/no-explicit-any`: 'error' - `any` types are forbidden
- `@typescript-eslint/consistent-type-imports`: 'error' - Type imports must use `import type`
- Empty functions are allowed (overrides default TS rules)

**Prettier Formatting** (.prettierrc):
- 2-space indentation (tabWidth: 2)
- Semicolons required (semi: true)
- Bracket spacing enabled
- 120 character line width (printWidth: 120)

**Commit Messages**:
- Follows Conventional Commits (enforced by commitlint via husky)
- Format: `type(scope): description`
- Common types: feat, fix, refactor, perf, docs, chore, style, test
- Enforced via `.husky/commit-msg` hook

**Pre-commit Hooks**:
- Husky runs lint-staged before commits
- Lints and auto-fixes staged files via `.husky/pre-commit`

**Environment Variables**:
- `.env` or `.env.local` for local development (not in version control)
- Required for Algolia integration:
  - `PUBLIC_ALGOLIA_APPLICATION_ID` - Application ID (shared between client and server)
  - `PUBLIC_ALGOLIA_INDEX_NAME` - Index name (shared between client and server)
  - `PUBLIC_ALGOLIA_SEARCH_API_KEY` - Search-only API key for client-side searches (read-only)
  - `ALGOLIA_ADMIN_API_KEY` - Admin API key for server-side indexing during build (private, keep secret)
- Required for Giscus comments:
  - `PUBLIC_GISCUS_REPO` - GitHub repository in format owner/repo
  - `PUBLIC_GISCUS_REPO_ID` - Repository ID from giscus.app
  - `PUBLIC_GISCUS_CATEGORY_ID` - Discussion category ID from giscus.app
- Required for Mailchimp newsletter:
  - `MAILCHIMP_API_KEY` - Mailchimp API key (private)
  - `MAILCHIMP_LIST_ID` - Newsletter list ID (private)

## Architecture Decisions

1. **MDX for Content**: Allows mixing markdown with React components for rich, interactive content in articles.

2. **Algolia v5 for Search**: Client-side search without backend queries; indexed at build time via custom integration (src/scripts/algolia.ts) that hooks into `astro:build:generated`. Uses the new Algolia v5 client API with `searchForHits` method.

3. **Giscus for Comments**: Leverages GitHub Discussions, no separate comment backend needed. Comments are embedded per-article using the article slug. Configuration is managed via environment variables with validation and fallback UI for missing configuration.

4. **Vercel Deployment**: Automatic deployments from git, serverless functions support for API endpoints. Using `output: "server"` (server-side rendering) with Vercel adapter enabled. API routes in `src/pages/api/` are automatically deployed as serverless functions by Vercel.

5. **Astro + React Hybrid**: Astro handles static content and routing with file-based routing; React for interactive features only (search with Downshift, dropdowns, progress bar). Interactive components use client directives.

6. **Layout System**: BaseLayout provides common structure (header with search, footer); ArticleLayout extends it with article-specific features (sidebar, TOC from sections, Giscus, share button).

## Design System Reference

Use these token classes throughout the codebase — never use raw hex colors or arbitrary Tailwind values:

| Token | Class | Value |
|---|---|---|
| Page background | `bg-background` | `#0a0a0a` |
| Card / section bg | `bg-surface` | `#111111` |
| Elevated surface | `bg-surface-raised` | `#161616` |
| Borders | `border-surface-border` | `#1f1f1f` |
| Primary text | `text-text-primary` | `#f5f5f5` |
| Secondary text | `text-text-secondary` | `#a3a3a3` |
| Muted text | `text-text-muted` | `#7c7c7c` |
| Accent (cyan) | `text-accent` / `bg-accent` | `#06b6d4` |
| Accent hover | `hover:bg-accent-hover` | `#0891b2` |
| Error | `bg-error` / `text-error` | `#ef4444` |
| Success | `bg-success` | `#22c55e` |

## Performance Considerations

- **Inline Critical CSS**: All styles inlined via `inlineStylesheets: "always"` to avoid render-blocking
- **Service Worker**: Enables offline fallback via astrojs-service-worker
- **Image Optimization**: Astro Image component auto-optimizes images
- **Shiki Syntax Highlighting**: Server-side highlighting, no client JS needed
- **Partytown**: Analytics scripts run off main thread to avoid blocking
- **HTML Compression**: Enabled via `compressHTML: true` in astro.config
- **Prefetching**: Enabled for faster navigation via `prefetch: true`

<!-- autoskills:start -->

Summary generated by `autoskills`. Check the full files inside `.claude/skills`.

## Accessibility (a11y)

Audit and improve web accessibility following WCAG 2.2 guidelines. Use when asked to "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", or "make accessible".

- `.claude/skills/accessibility/SKILL.md`
- `.claude/skills/accessibility/references/A11Y-PATTERNS.md`: Practical, copy-paste-ready patterns for common accessibility requirements. Each pattern is self-contained and linked from the main [SKILL.md](../SKILL.md).
- `.claude/skills/accessibility/references/WCAG.md`

## Astro Usage Guide

Skill for building with the Astro web framework. Helps create Astro components and pages, configure SSR adapters, set up content collections, deploy static sites, and manage project structure and CLI commands. Use when the user needs to work with Astro, mentions .astro files, asks about static si...

- `.claude/skills/astro/SKILL.md`

## Brainstorming Ideas Into Designs

You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation.

- `.claude/skills/brainstorming/SKILL.md`

## Deploy to Vercel

Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment".

- `.claude/skills/deploy-to-vercel/SKILL.md`

## Design Thinking

Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beaut...

- `.claude/skills/frontend-design/SKILL.md`

## Node.js Backend Patterns

Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices. Use when creating Node.js servers, REST APIs, GraphQL backends, or microservices architectures.

- `.claude/skills/nodejs-backend-patterns/SKILL.md`
- `.claude/skills/nodejs-backend-patterns/references/advanced-patterns.md`: Advanced patterns for dependency injection, database integration, authentication, caching, and API response formatting.

## Node.js Best Practices

Node.js development principles and decision-making. Framework selection, async patterns, security, and architecture. Teaches thinking, not copying.

- `.claude/skills/nodejs-best-practices/SKILL.md`

## openspec-apply-change

Implement tasks from an OpenSpec change. Use when the user wants to start implementing, continue implementation, or work through tasks.

- `.claude/skills/openspec-apply-change/SKILL.md`

## openspec-archive-change

Archive a completed change in the experimental workflow. Use when the user wants to finalize and archive a change after implementation is complete.

- `.claude/skills/openspec-archive-change/SKILL.md`

## openspec-bulk-archive-change

Archive multiple completed changes at once. Use when archiving several parallel changes.

- `.claude/skills/openspec-bulk-archive-change/SKILL.md`

## openspec-continue-change

Continue working on an OpenSpec change by creating the next artifact. Use when the user wants to progress their change, create the next artifact, or continue their workflow.

- `.claude/skills/openspec-continue-change/SKILL.md`

## The Stance

Enter explore mode - a thinking partner for exploring ideas, investigating problems, and clarifying requirements. Use when the user wants to think through something before or during a change.

- `.claude/skills/openspec-explore/SKILL.md`

## openspec-ff-change

Fast-forward through OpenSpec artifact creation. Use when the user wants to quickly create all artifacts needed for implementation without stepping through each one individually.

- `.claude/skills/openspec-ff-change/SKILL.md`

## openspec-new-change

Start a new OpenSpec change using the experimental artifact workflow. Use when the user wants to create a new feature, fix, or modification with a structured step-by-step approach.

- `.claude/skills/openspec-new-change/SKILL.md`

## Preflight

Guided onboarding for OpenSpec - walk through a complete workflow cycle with narration and real codebase work.

- `.claude/skills/openspec-onboard/SKILL.md`

## openspec-sync-specs

Sync delta specs from a change to main specs. Use when the user wants to update main specs with changes from a delta spec, without archiving the change.

- `.claude/skills/openspec-sync-specs/SKILL.md`

## openspec-verify-change

Verify implementation matches change artifacts. Use when the user wants to validate that implementation is complete, correct, and coherent before archiving.

- `.claude/skills/openspec-verify-change/SKILL.md`

## Playwright Best Practices

Use when writing Playwright tests, fixing flaky tests, debugging failures, implementing Page Object Model, configuring CI/CD, optimizing performance, mocking APIs, handling authentication or OAuth, testing accessibility (axe-core), file uploads/downloads, date/time mocking, WebSockets, geolocatio...

- `.claude/skills/playwright-best-practices/SKILL.md`
- `.claude/skills/playwright-best-practices/advanced/authentication-flows.md`: Intercept API responses to capture verification tokens for testing:
- `.claude/skills/playwright-best-practices/advanced/authentication.md`: **Use when**: You need authenticated tests and want to avoid logging in before every test. **Avoid when**: Tests require completely fresh sessions, or you are testing the login flow itself.
- `.claude/skills/playwright-best-practices/advanced/clock-mocking.md`
- `.claude/skills/playwright-best-practices/advanced/mobile-testing.md`
- `.claude/skills/playwright-best-practices/advanced/multi-context.md`: This file covers **single-user scenarios** with multiple browser tabs, windows, and popups. For **multi-user collaboration testing** (multiple users interacting simultaneously), see [multi-user.md](multi-user.md).
- `.claude/skills/playwright-best-practices/advanced/multi-user.md`
- `.claude/skills/playwright-best-practices/advanced/network-advanced.md`: Use `context.setOffline(true/false)` to simulate network connectivity changes.
- `.claude/skills/playwright-best-practices/advanced/third-party.md`
- `.claude/skills/playwright-best-practices/architecture/pom-vs-fixtures.md`: Use all three patterns together. Most projects benefit from a hybrid approach:
- `.claude/skills/playwright-best-practices/architecture/test-architecture.md`: **Ideal for**:
- `.claude/skills/playwright-best-practices/architecture/when-to-mock.md`: **Mock at the boundary, test your stack end-to-end.** Mock third-party services you don't own (payment gateways, email providers, OAuth). Never mock your own frontend-to-backend communication. Tests should prove YOUR code works, not that third-party APIs are available.
- `.claude/skills/playwright-best-practices/browser-apis/browser-apis.md`
- `.claude/skills/playwright-best-practices/browser-apis/iframes.md`
- `.claude/skills/playwright-best-practices/browser-apis/service-workers.md`: This section covers **offline-first apps (PWAs)** that are designed to work offline using service workers, caching, and background sync. For testing **unexpected network failures** (error recovery, graceful degradation), see [error-testing.md](error-testing.md#offline-testing).
- `.claude/skills/playwright-best-practices/browser-apis/websockets.md`
- `.claude/skills/playwright-best-practices/core/annotations.md`
- `.claude/skills/playwright-best-practices/core/assertions-waiting.md`: Auto-retry until condition is met or timeout. Always prefer these over generic assertions.
- `.claude/skills/playwright-best-practices/core/configuration.md`: **Use when**: Tests run against dev, staging, and production environments.
- `.claude/skills/playwright-best-practices/core/fixtures-hooks.md`: Created fresh for each test:
- `.claude/skills/playwright-best-practices/core/global-setup.md`: This section covers **one-time database setup** (migrations, snapshots, per-worker databases). For related topics:
- `.claude/skills/playwright-best-practices/core/locators.md`: Use locators in this order of preference:
- `.claude/skills/playwright-best-practices/core/page-object-model.md`: Page Object Model encapsulates page structure and interactions, providing:
- `.claude/skills/playwright-best-practices/core/projects-dependencies.md`: Setup projects are the recommended way to handle authentication. They run before your main test projects and can use Playwright fixtures.
- `.claude/skills/playwright-best-practices/core/test-data.md`: This file covers **reusable test data builders** (factories, Faker, data generators). For related topics:
- `.claude/skills/playwright-best-practices/core/test-suite-structure.md`: Full user journey tests through the browser.
- `.claude/skills/playwright-best-practices/core/test-tags.md`
- `.claude/skills/playwright-best-practices/debugging/console-errors.md`
- `.claude/skills/playwright-best-practices/debugging/debugging.md`: Features:
- `.claude/skills/playwright-best-practices/debugging/error-testing.md`: This section covers **unexpected network failures** and error recovery. For **offline-first apps (PWAs)** with service workers, caching, and background sync, see [service-workers.md](service-workers.md#offline-testing).
- `.claude/skills/playwright-best-practices/debugging/flaky-tests.md`: Most flaky tests fall into distinct categories requiring different remediation:
- `.claude/skills/playwright-best-practices/frameworks/angular.md`: Angular generates internal attributes (`_ngcontent-*`, `_nghost-*`, `ng-reflect-*`) that change every build. Always use semantic locators.
- `.claude/skills/playwright-best-practices/frameworks/nextjs.md`: Next.js loads `.env.test` when `NODE_ENV=test`:
- `.claude/skills/playwright-best-practices/frameworks/react.md`: **Use when**: Verifying React context (theme, auth, locale) and state management (Redux, Zustand) produce correct UI changes. **Avoid when**: You want to assert on raw state objects—test the UI, not internal state.
- `.claude/skills/playwright-best-practices/frameworks/vue.md`: Nuxt uses port 3000 and requires a build step before testing.
- `.claude/skills/playwright-best-practices/infrastructure-ci-cd/ci-cd.md`
- `.claude/skills/playwright-best-practices/infrastructure-ci-cd/docker.md`: Run tests without building a custom image:
- `.claude/skills/playwright-best-practices/infrastructure-ci-cd/github-actions.md`: **Use when**: Starting a new project or running a small test suite.
- `.claude/skills/playwright-best-practices/infrastructure-ci-cd/gitlab.md`: **Use when**: Any GitLab project with Playwright tests.
- `.claude/skills/playwright-best-practices/infrastructure-ci-cd/other-providers.md`: All platforms benefit from JUnit output for native test result display:
- `.claude/skills/playwright-best-practices/infrastructure-ci-cd/parallel-sharding.md`: **Use when**: Controlling concurrent test execution on a single machine.
- `.claude/skills/playwright-best-practices/infrastructure-ci-cd/performance.md`: Tests are distributed evenly by file. For optimal sharding:
- `.claude/skills/playwright-best-practices/infrastructure-ci-cd/reporting.md`: Build custom reporters for Slack notifications, database logging, or dashboards.
- `.claude/skills/playwright-best-practices/infrastructure-ci-cd/test-coverage.md`
- `.claude/skills/playwright-best-practices/LICENSE.md`: Copyright © 2026 Currents Software Inc.
- `.claude/skills/playwright-best-practices/README.md`: <img src="https://currents.dev/favicon-96x96.png" width="24" height="24" align="left" />by [currents.dev](https://currents.dev?utm_source=ai-skill) - The all-in-one Dashboard for Playwright Testing.
- `.claude/skills/playwright-best-practices/testing-patterns/accessibility.md`
- `.claude/skills/playwright-best-practices/testing-patterns/api-testing.md`: **Use when**: Multiple tests need an authenticated API client with shared configuration. **Avoid when**: A single test makes one-off API calls — use the built-in `request` fixture directly.
- `.claude/skills/playwright-best-practices/testing-patterns/browser-extensions.md`
- `.claude/skills/playwright-best-practices/testing-patterns/canvas-webgl.md`
- `.claude/skills/playwright-best-practices/testing-patterns/component-testing.md`
- `.claude/skills/playwright-best-practices/testing-patterns/drag-drop.md`: Some drag libraries (react-beautiful-dnd, dnd-kit) require incremental mouse movements:
- `.claude/skills/playwright-best-practices/testing-patterns/electron.md`
- `.claude/skills/playwright-best-practices/testing-patterns/file-operations.md`
- `.claude/skills/playwright-best-practices/testing-patterns/file-upload-download.md`: Drop zones always have an underlying `input[type="file"]`—target it directly instead of simulating OS-level drag events.
- `.claude/skills/playwright-best-practices/testing-patterns/forms-validation.md`: **Use when**: Testing search fields, address lookups, mention pickers, or any input that shows suggestions as the user types.
- `.claude/skills/playwright-best-practices/testing-patterns/graphql-testing.md`: All GraphQL requests go through `POST` to a single endpoint. Send `query`, `variables`, and optionally `operationName` in the JSON body.
- `.claude/skills/playwright-best-practices/testing-patterns/i18n.md`
- `.claude/skills/playwright-best-practices/testing-patterns/performance-testing.md`
- `.claude/skills/playwright-best-practices/testing-patterns/security-testing.md`
- `.claude/skills/playwright-best-practices/testing-patterns/visual-regression.md`: **Use when**: Page contains timestamps, avatars, ad slots, relative dates, random images, or A/B variants.

## SEO Audit

When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions "SEO audit," "technical SEO," "why am I not ranking," "SEO issues," "on-page SEO," "meta tags review," or "SEO health check." For building pages at scale to target keywords, see programmati...

- `.claude/skills/seo-audit/SKILL.md`
- `.claude/skills/seo-audit/references/ai-writing-detection.md`: Words, phrases, and punctuation patterns commonly associated with AI-generated text. Avoid these to ensure writing sounds natural and human.

## SEO optimization

Optimize for search engine visibility and ranking. Use when asked to "improve SEO", "optimize for search", "fix meta tags", "add structured data", "sitemap optimization", or "search engine optimization".

- `.claude/skills/seo/SKILL.md`

## Tailwind CSS Development Patterns

Provides comprehensive Tailwind CSS utility-first styling patterns including responsive design, layout utilities, flexbox, grid, spacing, typography, colors, and modern CSS best practices. Use when styling React/Vue/Svelte components, building responsive layouts, implementing design systems, or o...

- `.claude/skills/tailwind-css-patterns/SKILL.md`
- `.claude/skills/tailwind-css-patterns/references/accessibility.md`
- `.claude/skills/tailwind-css-patterns/references/animations.md`: Usage:
- `.claude/skills/tailwind-css-patterns/references/component-patterns.md`
- `.claude/skills/tailwind-css-patterns/references/configuration.md`: Use the `@theme` directive for CSS-based configuration:
- `.claude/skills/tailwind-css-patterns/references/layout-patterns.md`: Basic flex container:
- `.claude/skills/tailwind-css-patterns/references/performance.md`: Configure content sources for optimal purging:
- `.claude/skills/tailwind-css-patterns/references/reference.md`: Tailwind CSS is a utility-first CSS framework that generates styles by scanning HTML, JavaScript, and template files for class names. It provides a comprehensive design system through CSS utility classes, enabling rapid UI development without writing custom CSS. The framework operates at build-ti...
- `.claude/skills/tailwind-css-patterns/references/responsive-design.md`: Enable dark mode in tailwind.config.js:

## TypeScript Advanced Types

Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating reusable type utilities, or ensuring compile-time type safety in TypeScript pr...

- `.claude/skills/typescript-advanced-types/SKILL.md`

## UI/UX Pro Max - Design Intelligence

UI/UX design intelligence. 50 styles, 21 palettes, 50 font pairings, 20 charts, 9 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, check UI/UX code. Projec...

- `.claude/skills/ui-ux-pro-max/SKILL.md`

## React Composition Patterns

Composition patterns for building flexible, maintainable React components. Avoid boolean prop proliferation by using compound components, lifting state, and composing internals. These patterns make codebases easier for both humans and AI agents to work with as they scale.

- `.claude/skills/vercel-composition-patterns/SKILL.md`
- `.claude/skills/vercel-composition-patterns/AGENTS.md`: **Version 1.0.0** Engineering January 2026
- `.claude/skills/vercel-composition-patterns/README.md`: A structured repository for React composition patterns that scale. These patterns help avoid boolean prop proliferation by using compound components, lifting state, and composing internals.
- `.claude/skills/vercel-composition-patterns/rules/_sections.md`: This file defines all sections, their ordering, impact levels, and descriptions. The section ID (in parentheses) is the filename prefix used to group rules.
- `.claude/skills/vercel-composition-patterns/rules/_template.md`: Brief explanation of the rule and why it matters.
- `.claude/skills/vercel-composition-patterns/rules/architecture-avoid-boolean-props.md`: Don't add boolean props like `isThread`, `isEditing`, `isDMThread` to customize component behavior. Each boolean doubles possible states and creates unmaintainable conditional logic. Use composition instead.
- `.claude/skills/vercel-composition-patterns/rules/architecture-compound-components.md`: Structure complex components as compound components with a shared context. Each subcomponent accesses shared state via context, not props. Consumers compose the pieces they need.
- `.claude/skills/vercel-composition-patterns/rules/patterns-children-over-render-props.md`: Use `children` for composition instead of `renderX` props. Children are more readable, compose naturally, and don't require understanding callback signatures.
- `.claude/skills/vercel-composition-patterns/rules/patterns-explicit-variants.md`: Instead of one component with many boolean props, create explicit variant components. Each variant composes the pieces it needs. The code documents itself.
- `.claude/skills/vercel-composition-patterns/rules/react19-no-forwardref.md`: In React 19, `ref` is now a regular prop (no `forwardRef` wrapper needed), and `use()` replaces `useContext()`.
- `.claude/skills/vercel-composition-patterns/rules/state-context-interface.md`: Define a **generic interface** for your component context with three parts: can implement—enabling the same UI components to work with completely different state implementations.
- `.claude/skills/vercel-composition-patterns/rules/state-decouple-implementation.md`: The provider component should be the only place that knows how state is managed. UI components consume the context interface—they don't know if state comes from useState, Zustand, or a server sync.
- `.claude/skills/vercel-composition-patterns/rules/state-lift-state.md`: Move state management into dedicated provider components. This allows sibling components outside the main UI to access and modify state without prop drilling or awkward refs.

## Vercel React Best Practices

React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimizati...

- `.claude/skills/vercel-react-best-practices/SKILL.md`
- `.claude/skills/vercel-react-best-practices/AGENTS.md`: **Version 1.0.0** Vercel Engineering January 2026
- `.claude/skills/vercel-react-best-practices/README.md`: A structured repository for creating and maintaining React Best Practices optimized for agents and LLMs.
- `.claude/skills/vercel-react-best-practices/rules/_sections.md`: This file defines all sections, their ordering, impact levels, and descriptions. The section ID (in parentheses) is the filename prefix used to group rules.
- `.claude/skills/vercel-react-best-practices/rules/_template.md`: **Impact: MEDIUM (optional impact description)**
- `.claude/skills/vercel-react-best-practices/rules/advanced-effect-event-deps.md`: Effect Event functions do not have a stable identity. Their identity intentionally changes on every render. Do not include the function returned by `useEffectEvent` in a `useEffect` dependency array. Keep the actual reactive values as dependencies and call the Effect Event from inside the effect...
- `.claude/skills/vercel-react-best-practices/rules/advanced-event-handler-refs.md`: Store callbacks in refs when used in effects that shouldn't re-subscribe on callback changes.
- `.claude/skills/vercel-react-best-practices/rules/advanced-init-once.md`: Do not put app-wide initialization that must run once per app load inside `useEffect([])` of a component. Components can remount and effects will re-run. Use a module-level guard or top-level init in the entry module instead.
- `.claude/skills/vercel-react-best-practices/rules/advanced-use-latest.md`: Access latest values in callbacks without adding them to dependency arrays. Prevents effect re-runs while avoiding stale closures.
- `.claude/skills/vercel-react-best-practices/rules/async-api-routes.md`: In API routes and Server Actions, start independent operations immediately, even if you don't await them yet.
- `.claude/skills/vercel-react-best-practices/rules/async-cheap-condition-before-await.md`: When a branch uses `await` for a flag or remote value and also requires a **cheap synchronous** condition (local props, request metadata, already-loaded state), evaluate the cheap condition **first**. Otherwise you pay for the async call even when the compound condition can never be true.
- `.claude/skills/vercel-react-best-practices/rules/async-defer-await.md`: Move `await` operations into the branches where they're actually used to avoid blocking code paths that don't need them.
- `.claude/skills/vercel-react-best-practices/rules/async-dependencies.md`: For operations with partial dependencies, use `better-all` to maximize parallelism. It automatically starts each task at the earliest possible moment.
- `.claude/skills/vercel-react-best-practices/rules/async-parallel.md`: When async operations have no interdependencies, execute them concurrently using `Promise.all()`.
- `.claude/skills/vercel-react-best-practices/rules/async-suspense-boundaries.md`: Instead of awaiting data in async components before returning JSX, use Suspense boundaries to show the wrapper UI faster while data loads.
- `.claude/skills/vercel-react-best-practices/rules/bundle-barrel-imports.md`: Import directly from source files instead of barrel files to avoid loading thousands of unused modules. **Barrel files** are entry points that re-export multiple modules (e.g., `index.js` that does `export * from './module'`).
- `.claude/skills/vercel-react-best-practices/rules/bundle-conditional.md`: Load large data or modules only when a feature is activated.
- `.claude/skills/vercel-react-best-practices/rules/bundle-defer-third-party.md`: Analytics, logging, and error tracking don't block user interaction. Load them after hydration.
- `.claude/skills/vercel-react-best-practices/rules/bundle-dynamic-imports.md`: Use `next/dynamic` to lazy-load large components not needed on initial render.
- `.claude/skills/vercel-react-best-practices/rules/bundle-preload.md`: Preload heavy bundles before they're needed to reduce perceived latency.
- `.claude/skills/vercel-react-best-practices/rules/client-event-listeners.md`: Use `useSWRSubscription()` to share global event listeners across component instances.
- `.claude/skills/vercel-react-best-practices/rules/client-localstorage-schema.md`: Add version prefix to keys and store only needed fields. Prevents schema conflicts and accidental storage of sensitive data.
- `.claude/skills/vercel-react-best-practices/rules/client-passive-event-listeners.md`: Add `{ passive: true }` to touch and wheel event listeners to enable immediate scrolling. Browsers normally wait for listeners to finish to check if `preventDefault()` is called, causing scroll delay.
- `.claude/skills/vercel-react-best-practices/rules/client-swr-dedup.md`: SWR enables request deduplication, caching, and revalidation across component instances.
- `.claude/skills/vercel-react-best-practices/rules/js-batch-dom-css.md`: Avoid interleaving style writes with layout reads. When you read a layout property (like `offsetWidth`, `getBoundingClientRect()`, or `getComputedStyle()`) between style changes, the browser is forced to trigger a synchronous reflow.
- `.claude/skills/vercel-react-best-practices/rules/js-cache-function-results.md`: Use a module-level Map to cache function results when the same function is called repeatedly with the same inputs during render.
- `.claude/skills/vercel-react-best-practices/rules/js-cache-property-access.md`: Cache object property lookups in hot paths.
- `.claude/skills/vercel-react-best-practices/rules/js-cache-storage.md`: **Incorrect (reads storage on every call):**
- `.claude/skills/vercel-react-best-practices/rules/js-combine-iterations.md`: Multiple `.filter()` or `.map()` calls iterate the array multiple times. Combine into one loop.
- `.claude/skills/vercel-react-best-practices/rules/js-early-exit.md`: Return early when result is determined to skip unnecessary processing.
- `.claude/skills/vercel-react-best-practices/rules/js-flatmap-filter.md`: **Impact: LOW-MEDIUM (eliminates intermediate array)**
- `.claude/skills/vercel-react-best-practices/rules/js-hoist-regexp.md`: Don't create RegExp inside render. Hoist to module scope or memoize with `useMemo()`.
- `.claude/skills/vercel-react-best-practices/rules/js-index-maps.md`: Multiple `.find()` calls by the same key should use a Map.
- `.claude/skills/vercel-react-best-practices/rules/js-length-check-first.md`: When comparing arrays with expensive operations (sorting, deep equality, serialization), check lengths first. If lengths differ, the arrays cannot be equal.
- `.claude/skills/vercel-react-best-practices/rules/js-min-max-loop.md`: Finding the smallest or largest element only requires a single pass through the array. Sorting is wasteful and slower.
- `.claude/skills/vercel-react-best-practices/rules/js-request-idle-callback.md`: **Impact: MEDIUM (keeps UI responsive during background tasks)**
- `.claude/skills/vercel-react-best-practices/rules/js-set-map-lookups.md`: Convert arrays to Set/Map for repeated membership checks.
- `.claude/skills/vercel-react-best-practices/rules/js-tosorted-immutable.md`: **Incorrect (mutates original array):**
- `.claude/skills/vercel-react-best-practices/rules/rendering-activity.md`: Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility.
- `.claude/skills/vercel-react-best-practices/rules/rendering-animate-svg-wrapper.md`: Many browsers don't have hardware acceleration for CSS3 animations on SVG elements. Wrap SVG in a `<div>` and animate the wrapper instead.
- `.claude/skills/vercel-react-best-practices/rules/rendering-conditional-render.md`: Use explicit ternary operators (`? :`) instead of `&&` for conditional rendering when the condition can be `0`, `NaN`, or other falsy values that render.
- `.claude/skills/vercel-react-best-practices/rules/rendering-content-visibility.md`: Apply `content-visibility: auto` to defer off-screen rendering.
- `.claude/skills/vercel-react-best-practices/rules/rendering-hoist-jsx.md`: Extract static JSX outside components to avoid re-creation.
- `.claude/skills/vercel-react-best-practices/rules/rendering-hydration-no-flicker.md`: When rendering content that depends on client-side storage (localStorage, cookies), avoid both SSR breakage and post-hydration flickering by injecting a synchronous script that updates the DOM before React hydrates.
- `.claude/skills/vercel-react-best-practices/rules/rendering-hydration-suppress-warning.md`: In SSR frameworks (e.g., Next.js), some values are intentionally different on server vs client (random IDs, dates, locale/timezone formatting). For these *expected* mismatches, wrap the dynamic text in an element with `suppressHydrationWarning` to prevent noisy warnings. Do not use this to hide r...
- `.claude/skills/vercel-react-best-practices/rules/rendering-resource-hints.md`: **Impact: HIGH (reduces load time for critical resources)**
- `.claude/skills/vercel-react-best-practices/rules/rendering-script-defer-async.md`: **Impact: HIGH (eliminates render-blocking)**
- `.claude/skills/vercel-react-best-practices/rules/rendering-svg-precision.md`: Reduce SVG coordinate precision to decrease file size. The optimal precision depends on the viewBox size, but in general reducing precision should be considered.
- `.claude/skills/vercel-react-best-practices/rules/rendering-usetransition-loading.md`: Use `useTransition` instead of manual `useState` for loading states. This provides built-in `isPending` state and automatically manages transitions.
- `.claude/skills/vercel-react-best-practices/rules/rerender-defer-reads.md`: Don't subscribe to dynamic state (searchParams, localStorage) if you only read it inside callbacks.
- `.claude/skills/vercel-react-best-practices/rules/rerender-dependencies.md`: Specify primitive dependencies instead of objects to minimize effect re-runs.
- `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md`: If a value can be computed from current props/state, do not store it in state or update it in an effect. Derive it during render to avoid extra renders and state drift. Do not set state in effects solely in response to prop changes; prefer derived values or keyed resets instead.
- `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state.md`: Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.
- `.claude/skills/vercel-react-best-practices/rules/rerender-functional-setstate.md`: When updating state based on the current state value, use the functional update form of setState instead of directly referencing the state variable. This prevents stale closures, eliminates unnecessary dependencies, and creates stable callback references.
- `.claude/skills/vercel-react-best-practices/rules/rerender-lazy-state-init.md`: Pass a function to `useState` for expensive initial values. Without the function form, the initializer runs on every render even though the value is only used once.
- `.claude/skills/vercel-react-best-practices/rules/rerender-memo-with-default-value.md`: When memoized component has a default value for some non-primitive optional parameter, such as an array, function, or object, calling the component without that parameter results in broken memoization. This is because new value instances are created on every rerender, and they do not pass strict...
- `.claude/skills/vercel-react-best-practices/rules/rerender-memo.md`: Extract expensive work into memoized components to enable early returns before computation.
- `.claude/skills/vercel-react-best-practices/rules/rerender-move-effect-to-event.md`: If a side effect is triggered by a specific user action (submit, click, drag), run it in that event handler. Do not model the action as state + effect; it makes effects re-run on unrelated changes and can duplicate the action.
- `.claude/skills/vercel-react-best-practices/rules/rerender-no-inline-components.md`: **Impact: HIGH (prevents remount on every render)**
- `.claude/skills/vercel-react-best-practices/rules/rerender-simple-expression-in-memo.md`: When an expression is simple (few logical or arithmetical operators) and has a primitive result type (boolean, number, string), do not wrap it in `useMemo`. Calling `useMemo` and comparing hook dependencies may consume more resources than the expression itself.
- `.claude/skills/vercel-react-best-practices/rules/rerender-split-combined-hooks.md`: When a hook contains multiple independent tasks with different dependencies, split them into separate hooks. A combined hook reruns all tasks when any dependency changes, even if some tasks don't use the changed value.
- `.claude/skills/vercel-react-best-practices/rules/rerender-transitions.md`: Mark frequent, non-urgent state updates as transitions to maintain UI responsiveness.
- `.claude/skills/vercel-react-best-practices/rules/rerender-use-deferred-value.md`: When user input triggers expensive computations or renders, use `useDeferredValue` to keep the input responsive. The deferred value lags behind, allowing React to prioritize the input update and render the expensive result when idle.
- `.claude/skills/vercel-react-best-practices/rules/rerender-use-ref-transient-values.md`: When a value changes frequently and you don't want a re-render on every update (e.g., mouse trackers, intervals, transient flags), store it in `useRef` instead of `useState`. Keep component state for UI; use refs for temporary DOM-adjacent values. Updating a ref does not trigger a re-render.
- `.claude/skills/vercel-react-best-practices/rules/server-after-nonblocking.md`: Use Next.js's `after()` to schedule work that should execute after a response is sent. This prevents logging, analytics, and other side effects from blocking the response.
- `.claude/skills/vercel-react-best-practices/rules/server-auth-actions.md`: **Impact: CRITICAL (prevents unauthorized access to server mutations)**
- `.claude/skills/vercel-react-best-practices/rules/server-cache-lru.md`: **Implementation:**
- `.claude/skills/vercel-react-best-practices/rules/server-cache-react.md`: Use `React.cache()` for server-side request deduplication. Authentication and database queries benefit most.
- `.claude/skills/vercel-react-best-practices/rules/server-dedup-props.md`: **Impact: LOW (reduces network payload by avoiding duplicate serialization)**
- `.claude/skills/vercel-react-best-practices/rules/server-hoist-static-io.md`: **Impact: HIGH (avoids repeated file/network I/O per request)**
- `.claude/skills/vercel-react-best-practices/rules/server-no-shared-module-state.md`: For React Server Components and client components rendered during SSR, avoid using mutable module-level variables to share request-scoped data. Server renders can run concurrently in the same process. If one render writes to shared module state and another render reads it, you can get race condit...
- `.claude/skills/vercel-react-best-practices/rules/server-parallel-fetching.md`: React Server Components execute sequentially within a tree. Restructure with composition to parallelize data fetching.
- `.claude/skills/vercel-react-best-practices/rules/server-parallel-nested-fetching.md`: When fetching nested data in parallel, chain dependent fetches within each item's promise so a slow item doesn't block the rest.
- `.claude/skills/vercel-react-best-practices/rules/server-serialization.md`: The React Server/Client boundary serializes all object properties into strings and embeds them in the HTML response and subsequent RSC requests. This serialized data directly impacts page weight and load time, so **size matters a lot**. Only pass fields that the client actually uses.

## Core

Vitest fast unit testing framework powered by Vite with Jest-compatible API. Use when writing tests, mocking, configuring coverage, or working with test filtering and fixtures.

- `.claude/skills/vitest/SKILL.md`
- `.claude/skills/vitest/GENERATION.md`
- `.claude/skills/vitest/references/advanced-environments.md`: Configure environments like jsdom, happy-dom for browser APIs
- `.claude/skills/vitest/references/advanced-projects.md`: Multi-project configuration for monorepos and different test types
- `.claude/skills/vitest/references/advanced-type-testing.md`: Test TypeScript types with expectTypeOf and assertType
- `.claude/skills/vitest/references/advanced-vi.md`: vi helper for mocking, timers, utilities
- `.claude/skills/vitest/references/core-cli.md`: Command line interface commands and options
- `.claude/skills/vitest/references/core-config.md`: Configure Vitest with vite.config.ts or vitest.config.ts
- `.claude/skills/vitest/references/core-describe.md`: describe/suite for grouping tests into logical blocks
- `.claude/skills/vitest/references/core-expect.md`: Assertions with matchers, asymmetric matchers, and custom matchers
- `.claude/skills/vitest/references/core-hooks.md`: beforeEach, afterEach, beforeAll, afterAll, and around hooks
- `.claude/skills/vitest/references/core-test-api.md`: test/it function for defining tests with modifiers
- `.claude/skills/vitest/references/features-concurrency.md`: Concurrent tests, parallel execution, and sharding
- `.claude/skills/vitest/references/features-context.md`: Test context, custom fixtures with test.extend
- `.claude/skills/vitest/references/features-coverage.md`: Code coverage with V8 or Istanbul providers
- `.claude/skills/vitest/references/features-filtering.md`: Filter tests by name, file patterns, and tags
- `.claude/skills/vitest/references/features-mocking.md`: Mock functions, modules, timers, and dates with vi utilities
- `.claude/skills/vitest/references/features-snapshots.md`: Snapshot testing with file, inline, and file snapshots

<!-- autoskills:end -->
