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
- `articulos/` - Blog articles as MDX files with dynamic pagination
- `charlas-talleres/` - Talks and workshops page
- `api/` - Serverless endpoints (subscribe, create-new-post)
- `admin/` - Admin dashboard (post creation)

**`src/layouts/`** - Page layout templates
- `base/index.astro` - Main wrapper with header, footer, SEO
- `article/index.astro` - Blog article layout with sidebar and TOC
- `admin/index.astro` - Admin dashboard layout

**`src/components/`** - Reusable React and Astro components
- Features grouped by purpose: `article/`, `project/`, `pagination/`, `search-*/`, `dropdown/`, etc.
- Each component has `index.astro` or `index.tsx` entry point

**`src/utils/`** - Pure utility functions
- `articles.ts` - Sort/filter articles, generate GitHub links
- `categories.ts` - Category management
- `date.ts` - Date calculations
- `reading-time.ts` - Calculate reading time for articles
- `strings.ts` - String manipulation

**`src/settings/`** - Configuration and data
- `index.ts` - Main site config (title, social links, SEO defaults)
- `manifest-config.ts` - PWA web manifest
- `talks.ts` - Talks/workshops data
- `projects.ts` - Project data (currently hidden from display per roadmap)

**`src/interfaces/index.ts`** - TypeScript type definitions
- Core types: `Article`, `CategoryAllowed`, `Talk`, etc.

**`src/scripts/algolia.ts`** - Custom Astro integration
- Hooks into build process (`astro:build:generated`)
- Extracts article metadata from MDX frontmatter
- Publishes index to Algolia for search functionality
- Requires env vars: `ALGOLIA_APPLICATION_ID`, `ALGOLIA_ADMIN_API_KEY`, `ALGOLIA_INDEX_NAME`

### Design Patterns

**Layout Composition**: Nested layouts inherit from `BaseLayout`, which includes SEO head, header with search, and footer.

**Component Organization**: Feature-based grouping with subdirectories for nested components. Example: `header/` contains `Header` component plus `header/components/` for internal components.

**Data Structure**: Article metadata in MDX frontmatter (title, date, categories, description, cover image). Use types from `src/interfaces/index.ts` for consistency.

**Utility Functions**: Pure functions for sorting, filtering, and formatting. Centralized config in `src/settings/index.ts`.

## Key Technologies & Integrations

| Technology | Purpose |
|---|---|
| **Astro** | Static site generation with SSR via Vercel |
| **React 19** | Interactive components |
| **TypeScript 5.3** | Type safety (strict mode enabled) |
| **Tailwind CSS 3.4** | Utility-first styling |
| **MDX** | Blog content as code |
| **Algolia** | Full-text search with custom build integration |
| **Giscus** | GitHub Discussions-based comments |
| **Mailchimp** | Newsletter subscription backend |
| **Vercel** | Hosting with SSR and analytics |

**Additional Features**:
- PWA support (web manifest, service worker)
- Auto-generated sitemap and RSS feed
- Image optimization
- Shiki syntax highlighting (Monokai theme)

## Common Development Tasks

### Adding a Blog Article

1. Create new file in `src/pages/articulos/my-article.mdx`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: "Article Title"
   date: 2025-11-04
   categories: ["web-development", "javascript"]
   description: "Brief summary for SEO"
   cover_image: "https://example.com/image.png"
   ---
   ```
3. Write content in MDX format
4. On build, the article is automatically indexed in Algolia

### Creating a New Component

1. Create folder in `src/components/feature-name/`
2. Create `index.astro` or `index.tsx`
3. Use TypeScript for type safety
4. Import in layout or parent component as needed

### Updating Site Configuration

Edit `src/settings/index.ts` to update:
- Site title and description
- Social media links
- Author information
- SEO defaults

### Debugging Build Issues

Run `astro check` to validate TypeScript without building. This catches type errors before the full build runs.

## Code Style & Quality

**Linting Rules**:
- Import sorting enforced via `simple-import-sort`
- React components don't require `React` import (JSX transform)
- TypeScript strict mode enabled (`strictNullChecks: true`)
- Prettier formatting: 2-space tabs, semicolons, 120 character line width

**Commit Messages**:
- Follows Conventional Commits (enforced by commitlint)
- Format: `type(scope): description`
- Types: feat, fix, refactor, perf, docs, chore, etc.

**Environment Variables**:
- `.env.local` for local development (not in version control)
- Required for Algolia integration:
  - `ALGOLIA_APPLICATION_ID`
  - `ALGOLIA_ADMIN_API_KEY`
  - `ALGOLIA_INDEX_NAME`

## Architecture Decisions

1. **MDX for Content**: Allows mixing markdown with React components for rich content.
2. **Algolia for Search**: Client-side search without backend queries; indexed at build time.
3. **Giscus for Comments**: Leverages GitHub Discussions, no separate comment backend needed.
4. **Vercel Deployment**: Automatic deployments from git, built-in analytics, serverless functions support.
5. **Astro + React**: Astro handles static content and routing; React for interactive features only (search, dropdowns).

## Performance Considerations

- **Inline Critical CSS**: All styles inlined to avoid render-blocking
- **Service Worker**: Enables offline fallback
- **Image Optimization**: Astro Image component auto-optimizes
- **Shiki Syntax Highlighting**: Server-side highlighting, no client JS
- **Partytown**: Analytics scripts run off main thread
