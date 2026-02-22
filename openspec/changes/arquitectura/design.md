# Design: Architecture Improvements

## Objectives

- Optimize image delivery using Astro Assets and modern formats.
- Secure API endpoints with rate limiting.
- Ensure environment variable validity at startup.
- Enhance accessibility for keyboard and screen reader users.

## File Structure

### New Files

- `src/components/ui/image/index.astro`: Reusable optimized image component.
- `src/middleware/rate-limit.ts`: Rate limiting logic.
- `src/utils/env.ts`: Environment validation logic.
- `src/layouts/base/components/skip-link.astro`: Skip to content link.
- `vercel.json`: Vercel configuration for headers and functions.

### Modified Files

- `astro.config.mjs`: Integrate env validation.
- `src/pages/api/subscribe.ts`: Apply rate limiting.
- `src/layouts/base/index.astro`: Add skip link.
- `src/layouts/base/components/header/components/navigation.tsx`: Improve keyboard nav.

## Steps

### 1. Image Optimization

- Create `src/components/ui/image/index.astro` wrapping `astro:assets` Image.
- Support `widths`, `sizes`, `formats` props.
- Fallback for remote images not in `src/assets`.
- Migrate existing `<img>` tags to new component.

### 2. Rate Limiting

- Implement Token Bucket or sliding window algorithm in `src/middleware/rate-limit.ts`.
- Use in-memory store for simplicity (or Vercel KV if available/configured).
- Apply to public API endpoints.

### 3. Environment Validation

- Use `zod` to define schemas for public and private env vars.
- Validate on `astro.config.mjs` startup and fail fast if missing.

### 4. Accessibility

- Implement "Skip to content" link hidden by default, visible on focus.
- Trap focus within Search modal when open.
- Ensure Search results are navigatable with Arrow keys.

## Security Considerations

- Rate limiting prevents brute force and spam.
- Env validation prevents runtime crashes due to missing config.
- `nosniff`, `X-Frame-Options` headers in `vercel.json` add depth.

## Testing

- Verify Image component renders `<picture>` or `<img>` with srcset.
- Verify Rate Limit returns 429 after N requests.
- Verify App crashes if env vars are missing (dev mode).
- Verify Keyboard navigation works in Search without mouse.
