## 1. Endpoint

- [x] 1.1 `src/pages/api/subscribe.ts`: honeypot check on the raw body before Zod; `turnstileToken` check with `siteverify` (5 s timeout, `remoteip`); new success message; update the comment that says there is no double opt-in.
- [x] 1.2 `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in `src/utils/env.ts`, `src/env.d.ts` and `.env.template` (Cloudflare test keys).

## 2. Form

- [x] 2.1 `src/components/subscribe/subscribe-form.tsx`: hidden `website` input, Turnstile explicit render with `interaction-only`, token and honeypot in the body, `turnstile.reset()` after every submit. No script without a site key.

## 3. Tests

- [x] 3.1 `tests/units/pages/subscribe.test.ts`: honeypot filled → success, no fetch; no token → 400, no fetch; `siteverify` false → 400, app not called; `siteverify` down → 500 and Sentry; existing cases with the new message.
- [x] 3.2 `tests/e2e/subscribe.spec.ts`: success case with the new message.
  > Also fixed `getByLabel(/email/i)` → `/correo/i`: the field is labelled «Correo», so 8 of 9 cases already failed on `develop`. CI does not run e2e. 9/9 pass with `--workers=1`; with several workers against one dev server the hydration wait times out.
- [x] 3.3 `npm run lint`, `npm run test:unit:run`, `npm run build`.

## 4. Docs

- [x] 4.1 `openspec/changes/newsletter-to-resend/tasks.md` 2.1: CI builds with `SKIP_ENV_VALIDATION`, so it does not fail without the secrets.

## 5. Deploy

- [ ] 5.1 Create the Turnstile site for `eduardoalvarez.dev` in Cloudflare (managed mode) and load `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in this Vercel project (Production and Preview).
  > ⛔ BLOCKED: needs Eduardo in Cloudflare and Vercel.
- [ ] 5.2 Deploy `develop` → `main` (ships `newsletter-to-resend` too). Pause the Mailchimp welcome email. Depends on 5.1.

## Notes

- 2026-10-23: lint clean, `npm run test:unit:run` 327/327, `npm run build` (with `SKIP_ENV_VALIDATION`) 0 errors, e2e subscribe 9/9.
