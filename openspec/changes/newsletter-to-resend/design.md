## Context

`blog-content-manager` now owns every newsletter email: templates, the Resend segment, webhooks and metrics (see its `openspec/changes/resend-migration/design.md`, decision 1). This site only collects the form.

## Goals / Non-Goals

**Goals:** forward signups to the app with no visible change for readers.

**Non-Goals:** calling Resend from this site. Building emails here.

## Decisions

- **Server-to-server `fetch` with a shared secret.** The browser never talks to the app, so this site keeps its rate limit and needs no CORS. The secret only allows creating signups.
- **Status mapping.** 200 → success message. 409 → `conflict("Ya estás suscrito con este correo.")`. 400 → `badRequest` (should not happen, since Zod already validated). Anything else, or a network error → `internalError(...)` and `Sentry.captureException` with tag `newsletter.subscribe`.
- **Timeout.** 10 s with `AbortSignal.timeout`, so a slow app cannot hold the function open.

## Risks / Trade-offs

- [App down] → The signup is lost and the reader is asked to retry. This is the same exposure as Mailchimp being down today.
- [Secret leaked] → An attacker could only create signups. The secret is rotated by changing the env var in both projects.
