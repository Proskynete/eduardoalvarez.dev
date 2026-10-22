## Why

The newsletter is leaving Mailchimp. The welcome email and the monthly newsletter now come from Resend, sent by `blog-content-manager` with the new Arrecife design (change `resend-migration` in that repo). This site's form keeps working exactly as it does today. Only the place signups go changes.

## What Changes

- `src/pages/api/subscribe.ts` stops calling the Mailchimp SDK. It forwards `{ email, name }` to `${NEWSLETTER_API_URL}/api/newsletter/subscribe` with the header `x-newsletter-secret: ${NEWSLETTER_SUBSCRIBE_SECRET}`.
- Validation (Zod), the rate limit (5/min), the user-facing messages and the 409 for an existing subscriber stay as they are.
- Env validation (`src/utils/env.ts`, `src/env.d.ts`, `.env.template`) asks for `NEWSLETTER_API_URL` and `NEWSLETTER_SUBSCRIBE_SECRET` instead of `MAILCHIMP_*`.
- `@mailchimp/mailchimp_marketing` stays installed until the first Resend monthly goes out (2026-12-01). Until then, reverting `subscribe.ts` is the rollback. The dependency, CI secrets and docs are removed after that, in task 3.x.

## Capabilities

### New Capabilities
- `newsletter-subscribe-api`: how `/api/subscribe` hands a signup to the newsletter service and what it answers.

### Modified Capabilities
- None. `page-newsletter` and `page-home` keep calling `/api/subscribe` with the same responses.

## Impact

- Code: `src/pages/api/subscribe.ts`, `src/utils/env.ts`, `src/env.d.ts`, `.env.template`, a new unit test.
- Vercel (this project) needs `NEWSLETTER_API_URL` and `NEWSLETTER_SUBSCRIBE_SECRET`. CI needs the same two in `.github/workflows/ci.yml`.
- No breaking change for readers.

## Success Criteria

- A signup from the site creates the contact in Resend and the welcome email arrives. Nothing is written to Mailchimp.
- An existing subscriber sees "Ya estás suscrito con este correo." exactly as before.
- When the newsletter service is down or rejects the request, the reader sees the generic error and Sentry gets the event.
