## 1. Forward signups

- [x] 1.1 Rewrite `src/pages/api/subscribe.ts` to forward to `${NEWSLETTER_API_URL}/api/newsletter/subscribe` with `x-newsletter-secret`, keeping the Zod schema, rate limit and messages. Map 200/409/400/other as in design.md.
- [x] 1.2 Swap `MAILCHIMP_*` for `NEWSLETTER_API_URL` and `NEWSLETTER_SUBSCRIBE_SECRET` in `src/utils/env.ts`, `src/env.d.ts` and `.env.template`.
- [x] 1.3 Unit test (Vitest) for the status mapping with `fetch` mocked: 200, 409, 500, network error and invalid form (no fetch). Verify with `npm run test:unit:run`.
- [x] 1.4 Verify `npm run lint`, `npm run build` and `tests/e2e/subscribe.spec.ts`. The e2e mocks `/api/subscribe`, so it should pass unchanged.
  > Lint and build pass. The e2e did not pass unchanged: its email locator looked for «email» and the field is «Correo». Fixed in `newsletter-signup-protection` 3.2; 9/9 pass.

## 2. Deploy

- [x] 2.1 Load `NEWSLETTER_API_URL` and `NEWSLETTER_SUBSCRIBE_SECRET` in this Vercel project and as GitHub repo secrets. `.github/workflows/ci.yml` passes them to the build, but the build runs with `SKIP_ENV_VALIDATION`, so CI does not fail without them (corrected in `newsletter-signup-protection`).
  > Done: both variables are in Vercel Production. No GitHub secrets needed. Deployed 2026-10-23 with #305.
- [ ] 2.2 Pause the Mailchimp welcome email when this deploys.
  > ⛔ BLOCKED: Eduardo, in Mailchimp.

## 3. Remove Mailchimp (after the 2026-12-01 monthly goes out through Resend)

- [x] 3.1 Remove `@mailchimp/mailchimp_marketing` and `@types/mailchimp__mailchimp_marketing`.
- [x] 3.2 Update `README.md`, `CLAUDE.md`, `openspec/config.yaml` (Newsletter: Resend via blog-content-manager), `src/settings/stack.ts` and the comment in `src/settings/cookies.ts`.
- [x] 3.3 Verify lint, build and tests.
  > Done 2026-10-23, ahead of the 2026-12-01 monthly at Eduardo's request: no code used Mailchimp any more. Lint, 327 unit tests and build pass.
