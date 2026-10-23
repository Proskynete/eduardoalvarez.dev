## Context

`SubscribeForm` wraps `NewsletterForm` from `@eduardoalvarez/arrecife`, which builds its own `<form>` and takes no children. `/api/subscribe` validates with Zod, rate-limits (5/min) and forwards to `blog-content-manager`. That app now keeps signups pending until the welcome's button is clicked, and sends at most one welcome per inbox every 24 h.

## Goals / Non-Goals

**Goals:** stop form-filling bots and scripts that POST straight to `/api/subscribe`; tell readers they have to confirm.

**Non-Goals:** checking whether an inbox exists; a visible CAPTCHA; a fallback when Turnstile is down.

## Decisions

### 1. Honeypot outside the library's `<form>`
- **Choice**: `SubscribeForm` renders `<input name="website">` in its own container with `sr-only`, `tabIndex={-1}`, `autoComplete="off"` and `aria-hidden`. It reads the value on submit and sends it in the body.
- **Why**: `NewsletterForm` takes no children. Bots that fill every input on the page fill it anyway. `sr-only` keeps it in the layout without arbitrary Tailwind values.
- **Check order**: the honeypot is checked on the raw body, before Zod. A bot with a junk name gets the same success as everyone, not a 400 that tells it what to fix.

### 2. Turnstile, explicit render, no npm dependency
- **Choice**: `SubscribeForm` loads `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit` once and renders the widget with `PUBLIC_TURNSTILE_SITE_KEY` and `appearance: "interaction-only"`. On submit it reads `turnstile.getResponse()` and always calls `turnstile.reset()` afterwards. Without a site key (tests, CI) the script is not loaded.
- **Server**: `siteverify` gets `secret`, `response` and `remoteip` (first `x-forwarded-for` entry), with a 5 s timeout. `success: false` or no token → 400 "No pudimos verificar que no eres un bot. Recarga la página e intenta de nuevo." HTTP error or timeout → the generic error plus Sentry.
- **Why**: one script and one `fetch` do not justify a dependency. `interaction-only` shows nothing unless Cloudflare doubts.
- **CSP**: `vercel.json` sets no `Content-Security-Policy`. If one is added, it must allow `challenges.cloudflare.com` in `script-src` and `frame-src`.

### 3. Local and test keys
- **Choice**: `.env.template` ships Cloudflare's always-pass test keys (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`). Both variables are required by `src/utils/env.ts`, like the others.

## Risks / Trade-offs

- [Turnstile down blocks every signup] → Generic error plus Sentry. Accepted for a personal blog.
- [Production keys missing at deploy] → The build fails on env validation, as with any required variable. Load them before merging to `main`.
- [A reader misses the 5 s success notice] → The welcome's subject says what to do.
