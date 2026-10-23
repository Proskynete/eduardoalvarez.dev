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

- [x] 5.1 Create the Turnstile site for `eduardoalvarez.dev` in Cloudflare (managed mode) and load `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in this Vercel project (Production and Preview).
  > Done 2026-10-23 through the Cloudflare API: widget «eduardoalvarez.dev newsletter», managed, domain `eduardoalvarez.dev`. Production has the real keys (secret as `sensitive`). Preview and Development have Cloudflare's always-pass test keys, since previews run on `*.vercel.app`, outside the widget's domain.
- [ ] 5.2 Deploy `develop` → `main` (ships `newsletter-to-resend` too). Pause the Mailchimp welcome email. Depends on 5.1.
  > Deployed 2026-10-23 (#305, `a62fada`). Checked in production: no token → 400, fake token → 400, honeypot → 200 with nothing forwarded.
  > ⛔ BLOCKED: Eduardo pauses the Mailchimp welcome email.

- [x] 5.3 Log one line per attempt in `src/pages/api/subscribe.ts` (`[newsletter] subscribe: <outcome>`, never the email or the name), so Vercel's runtime logs show where a signup stopped. Test in `tests/units/pages/subscribe.test.ts`.
  > Added 2026-10-23: Eduardo's test signup never reached blog-content-manager and the endpoint logged nothing on the honeypot or a missing token.
- [x] 5.4 Rewrite `/api/newsletter/confirm` and `/api/newsletter/unsubscribe` in `vercel.json` to blog-content-manager, so the welcome's confirm button and every unsubscribe link stay on `eduardoalvarez.dev`.
  > Added 2026-10-23: the confirm link 404'd on the blog, and sending people to `*.vercel.app` to confirm looked like another site.

## Notes

- 2026-10-23: lint clean, `npm run test:unit:run` 327/327, `npm run build` (with `SKIP_ENV_VALIDATION`) 0 errors, e2e subscribe 9/9.
