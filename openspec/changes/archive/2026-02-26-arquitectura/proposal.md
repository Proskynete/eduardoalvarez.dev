# Proposal: Architecture Improvements (Phase 3 & 4)

## Goal

Complete the architectural improvements for eduardoalvarez.dev by implementing Phase 3 (Performance) and Phase 4 (Security & Maintenance), elevating the project from A- to A+.

## Problem

While significant progress has been made (Security & Testing phases completed), the following critical areas remain:

- **Performance**: Image optimization is incomplete (served from public/), and bundle size is unmonitored.
- **Security**: API endpoints lack rate limiting, exposing them to abuse.
- **Maintenance**: No automated dependency updates or sophisticated CI checks.

## Solution

Execute the remaining steps of the implementation plan:

1.  **Image Optimization**: Implement a reusable `Image` component using `astro:assets` and move images to `src/assets`.
2.  **Bundle Optimization**: Add `rollup-plugin-visualizer` to analyze and reduce bundle size.
3.  **Rate Limiting**: Implement a Vercel KV or Upstash-based rate limiter for API routes.
4.  **CI/CD Enhancements**: Add GitHub Actions for automated testing and linting on PRs.

## Scope

- **In Scope**:
  - `src/components/ui/Image.astro` (new component).
  - Migration of article images to `src/assets`.
  - `src/middleware/rate-limit.ts`.
  - `.github/workflows/ci.yml`.
- **Out of Scope**:
  - Rewriting existing features not related to performance/security.

## Impact

- **Performance**: Improved LCP and reduced bandwidth (~60% smaller images).
- **Security**: Protection against DoS and spam on `subscribe` endpoint.
- **Stability**: Automated verification of all changes.

## Success Criteria

- [ ] All article images served as WebP/AVIF.
- [ ] Lighthouse Performance score > 95.
- [ ] API endpoints return 429 after 5 requests/minute.
- [ ] CI passes for all new PRs.
