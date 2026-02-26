# Tasks: Architecture Improvements

## 1. Environment Validation

- [x] 1.1 Create `src/utils/env.ts` with Zod schemas for Public/Private envs
- [x] 1.2 Implement `validateEnv()` function
- [x] 1.3 Update `astro.config.mjs` to validate env at startup
- [x] 1.4 Update `.env.template` with clear documentation

## 2. Image Optimization

- [x] 2.1 Create `src/components/ui/image/index.astro` wrapping `astro:assets`
- [x] 2.2 Migrate Homepage images to use new component
- [x] 2.3 Migrate Article images to use new component
- [x] 2.4 Migrate Talk images to use new component
- [x] 2.5 Verify responsive image generation

## 3. Rate Limiting

- [x] 3.1 Create `src/middleware/rate-limit.ts` implementation
- [x] 3.2 Update `src/pages/api/subscribe.ts` to use rate limiter
- [x] 3.3 Create `vercel.json` with function config and security headers
- [x] 3.4 Verify rate limiting with manual tests

## 4. Accessibility

- [x] 4.1 Update `src/layouts/base/index.astro` to include Skip Link
- [x] 4.2 Add styles for `.skip-to-content` in `src/assets/styles/base.css`
- [x] 4.3 Update `src/layouts/base/components/header/components/navigation.tsx` for keyboard nav
- [x] 4.4 Verify keyboard traversal of Search results
