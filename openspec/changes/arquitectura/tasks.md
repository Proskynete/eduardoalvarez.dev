# Tasks: Architecture Improvements

## 1. Environment Validation

- [ ] 1.1 Create `src/utils/env.ts` with Zod schemas for Public/Private envs
- [ ] 1.2 Implement `validateEnv()` function
- [ ] 1.3 Update `astro.config.mjs` to validate env at startup
- [ ] 1.4 Update `.env.template` with clear documentation

## 2. Image Optimization

- [ ] 2.1 Create `src/components/ui/image/index.astro` wrapping `astro:assets`
- [ ] 2.2 Migrate Homepage images to use new component
- [ ] 2.3 Migrate Article images to use new component
- [ ] 2.4 Migrate Talk images to use new component
- [ ] 2.5 Verify responsive image generation

## 3. Rate Limiting

- [ ] 3.1 Create `src/middleware/rate-limit.ts` implementation
- [ ] 3.2 Update `src/pages/api/subscribe.ts` to use rate limiter
- [ ] 3.3 Create `vercel.json` with function config and security headers
- [ ] 3.4 Verify rate limiting with manual tests

## 4. Accessibility

- [ ] 4.1 Update `src/layouts/base/index.astro` to include Skip Link
- [ ] 4.2 Add styles for `.skip-to-content` in `src/assets/styles/base.css`
- [ ] 4.3 Update `src/layouts/base/components/header/components/navigation.tsx` for keyboard nav
- [ ] 4.4 Verify keyboard traversal of Search results
