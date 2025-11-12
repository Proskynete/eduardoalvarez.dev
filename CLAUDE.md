# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog and portfolio site built with **Astro 5**, React, and TypeScript. It features a content management system for MDX blog posts, full-text search via Algolia, comments via Giscus, and newsletter integration with Mailchimp. The site is deployed to Vercel with server-side rendering enabled.

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

# Run Astro CLI directly
npm run astro -- [command]
```

## Code Architecture

### Directory Structure

**`src/pages/`** - File-based routing following Astro conventions
- `articulos/` - Blog articles as MDX files with dynamic pagination via `[...page].astro`
- `articulos/*.mdx` - Individual blog articles
- `charlas-talleres/` - Talks and workshops page
- `api/` - Serverless endpoints with Zod validation
  - `subscribe.ts` - Newsletter subscription with robust input validation (email, name)
  - `create-new-post.ts` - Admin endpoint for creating new blog posts
- `admin/` - Admin dashboard for creating new blog posts
- `rss.xml.ts` - RSS feed generation

**`src/layouts/`** - Page layout templates
- `base/index.astro` - Main wrapper with header, footer, SEO, and Algolia config
- `article/index.astro` - Blog article layout with sidebar, TOC, Giscus comments, and share button
- `admin/index.astro` - Admin dashboard layout
- `main/index.astro` - Main page layout

**`src/components/`** - Reusable React and Astro components
- `article/` - Article card component
- `pagination/` - Pagination controls
- `dropdown/` - Dropdown menu (React)
- `scrolling-progress-bar/` - Reading progress indicator (React)
- `subscribe/` - Newsletter subscription form
- `project/` - Project card component (currently hidden from display)

**`src/utils/`** - Pure utility functions
- `articles.ts` - Sort articles by date, generate GitHub edit links
- `categories.ts` - Category management
- `date.ts` - Date calculations
- `reading-time.ts` - Calculate reading time for articles
- `strings.ts` - String manipulation

**`src/settings/`** - Configuration and data
- `index.ts` - Main site config (title, social links, SEO defaults, contacts)
- `manifest-config.ts` - PWA web manifest
- `talks.ts` - Talks/workshops data
- `projects.ts` - Project data (currently hidden from display)

**`src/interfaces/index.ts`** - TypeScript type definitions
- Core types: `Article`, `CategoryAllowed`, `ArticleLayout`, `Section`

**`src/scripts/algolia.ts`** - Custom Astro integration
- Hooks into build process (`astro:build:generated`)
- Extracts article metadata from MDX frontmatter
- Publishes index to Algolia for search functionality
- Requires env vars: `PUBLIC_ALGOLIA_APPLICATION_ID`, `PUBLIC_ALGOLIA_INDEX_NAME`, `ALGOLIA_ADMIN_API_KEY`

### Design Patterns

**Layout Composition**: Nested layouts inherit from `BaseLayout` (src/layouts/base/index.astro), which includes SEO head, header with Algolia search, and footer. Article layout extends base layout and adds sidebar with TOC, Giscus comments, and share functionality.

**Component Organization**: Feature-based grouping. Astro components use `.astro` extension, React components use `.tsx`. Interactive components (search, dropdown, progress bar) are React; static components are Astro.

**Data Structure**: Article metadata in MDX frontmatter with these required fields:
- `layout`: Path to layout file (e.g., `../../layouts/article/index.astro`)
- `title`: Article title
- `slug`: URL-friendly identifier
- `description`: SEO description
- `date`: Publication date (ISO format)
- `categories`: Array of `CategoryAllowed` types
- `seo_image`: Path to social media image
- `sections`: Array of `{title, anchor}` for table of contents

**Utility Functions**: Pure functions for sorting (`articlesSort`), filtering, and formatting. All utilities import centralized config from `src/settings/index.ts`.

## Key Technologies & Integrations

| Technology | Purpose |
|---|---|
| **Astro 5** | Static site generation with SSR via Vercel adapter |
| **React 19** | Interactive components (search, dropdown, progress bar) |
| **TypeScript 5.3** | Type safety (strict mode with `strictNullChecks: true`) |
| **Tailwind CSS 3.4** | Utility-first styling with typography and forms plugins |
| **MDX** | Blog content with embedded React components |
| **Algolia** | Full-text search with custom build integration (src/scripts/algolia.ts) |
| **Giscus** | GitHub Discussions-based comments (@giscus/react) |
| **Mailchimp** | Newsletter subscription backend (via api/subscribe.ts) |
| **Zod** | Schema validation and type inference for API endpoints |
| **Vercel** | Hosting with SSR, analytics, and serverless functions |

**Additional Features**:
- PWA support (web manifest via astro-webmanifest, service worker via astrojs-service-worker)
- Auto-generated sitemap and RSS feed
- Image optimization
- Shiki syntax highlighting (Monokai theme)
- Partytown for off-thread analytics scripts

## Common Development Tasks

### Adding a Blog Article

1. Create new file in `src/pages/articulos/my-article.mdx`
2. Add frontmatter with required fields:
   ```yaml
   ---
   layout: ../../layouts/article/index.astro
   title: "Article Title"
   slug: "article-title"
   description: "Brief summary for SEO"
   date: 2025-11-04T12:00:00-03:00
   categories: ["web-development", "javascript"]
   seo_image: /images/articulos/my-article/cover.webp
   sections:
     [
       { title: 'Section 1', anchor: 'section-1' },
       { title: 'Section 2', anchor: 'section-2' },
     ]
   ---
   ```
3. Write content in MDX format with heading IDs matching section anchors
4. On build, the article is automatically indexed in Algolia (via src/scripts/algolia.ts)

**Note**: Categories must be one of the allowed types defined in `src/interfaces/index.ts`: `web-development`, `javascript`, `react`, `vue`, `astro`, `node`, `express`, `sql`, `no-sql`.

### Using the Admin Dashboard

The admin dashboard (src/pages/admin/index.astro) provides a UI for creating new blog posts. It uses:
- `api/create-new-post.ts` - Serverless endpoint that generates MDX files from template
- `admin/template.mdx.tpl` - Template for new articles

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

## Code Style & Quality

**Linting Rules** (.eslintrc.cjs):
- Import sorting enforced via `simple-import-sort` plugin
- React components don't require `React` import (JSX transform enabled)
- TypeScript strict mode enabled (`strictNullChecks: true`)
- No duplicate imports allowed
- `any` types and empty functions are allowed (overrides default TS rules)

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
  - `MAILCHIMP_SERVER_PREFIX` - Mailchimp server prefix (e.g., us1)

## Architecture Decisions

1. **MDX for Content**: Allows mixing markdown with React components for rich, interactive content in articles.

2. **Algolia for Search**: Client-side search without backend queries; indexed at build time via custom integration (src/scripts/algolia.ts) that hooks into `astro:build:generated`.

3. **Giscus for Comments**: Leverages GitHub Discussions, no separate comment backend needed. Comments are embedded per-article using the article slug. Configuration is managed via environment variables with validation and fallback UI for missing configuration.

4. **Vercel Deployment**: Automatic deployments from git, built-in analytics, serverless functions support for API endpoints. SSR enabled via `output: "server"` and Vercel adapter.

5. **Astro + React Hybrid**: Astro handles static content and routing with file-based routing; React for interactive features only (search with Downshift, dropdowns, progress bar). Interactive components use client directives.

6. **Layout System**: BaseLayout provides common structure (header with search, footer); ArticleLayout extends it with article-specific features (sidebar, TOC from sections, Giscus, share button).

## Performance Considerations

- **Inline Critical CSS**: All styles inlined via `inlineStylesheets: "always"` to avoid render-blocking
- **Service Worker**: Enables offline fallback via astrojs-service-worker
- **Image Optimization**: Astro Image component auto-optimizes images
- **Shiki Syntax Highlighting**: Server-side highlighting, no client JS needed
- **Partytown**: Analytics scripts run off main thread to avoid blocking
- **HTML Compression**: Enabled via `compressHTML: true` in astro.config
- **Prefetching**: Enabled for faster navigation via `prefetch: true`
