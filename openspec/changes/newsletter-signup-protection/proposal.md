## Why

Bots are signing up real people's inboxes: Gmail addresses with random dots and junk names. 14 of the 24 contacts migrated from Mailchimp were fake. Each welcome to one of those inboxes is mail nobody asked for, and spam reports burn the domain's reputation in Resend.

`blog-content-manager` now makes every signup pending until the person clicks «Confirmar suscripción» in the welcome (change `newsletter-signup-verification` in that repo, already in production). This change is its sibling on the site: stop bots before a signup reaches the app, and tell real readers to check their inbox.

## What Changes

- **Honeypot**: a hidden `website` field next to the form. People never see or fill it. When it arrives filled, `/api/subscribe` answers the normal success and forwards nothing.
- **Cloudflare Turnstile**: an invisible widget (`interaction-only`) next to the form. Its token goes in the body as `turnstileToken`. `/api/subscribe` checks it with `siteverify` before forwarding. A missing or rejected token is a 400. The widget resets after every submit, since a token works once.
- **New success message**: "Revisa tu correo y confirma con el botón de la bienvenida." It replaces "Listo, ya estás suscrito…" from `newsletter-to-resend`, because the signup is no longer immediate.
- Fix the wrong claim in `newsletter-to-resend/tasks.md` 2.1: CI builds with `SKIP_ENV_VALIDATION`, so it does not fail without the secrets.

**Environment variables**

| Action | Variable | Where |
| --- | --- | --- |
| New | `PUBLIC_TURNSTILE_SITE_KEY` | Vercel, `.env` |
| New | `TURNSTILE_SECRET_KEY` | Vercel, `.env` |

## Capabilities

### New Capabilities
- `newsletter-signup-protection`: the honeypot, the Turnstile check and the success message `/api/subscribe` answers.

### Modified Capabilities
- None in `openspec/specs/`. The success message in `newsletter-to-resend` (not yet archived) is superseded by this change.

## Impact

- Code: `src/pages/api/subscribe.ts`, `src/components/subscribe/subscribe-form.tsx`, `src/utils/env.ts`, `src/env.d.ts`, `.env.template`, `tests/units/pages/subscribe.test.ts`, `tests/e2e/subscribe.spec.ts`.
- External: a Turnstile site for `eduardoalvarez.dev` in the Cloudflare dashboard.
- Order: depends on `newsletter-to-resend` (not yet in `main`). Both ship in the same `develop` → `main` deploy.
