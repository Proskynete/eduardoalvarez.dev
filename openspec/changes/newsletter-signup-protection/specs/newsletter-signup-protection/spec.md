## ADDED Requirements

### Requirement: Honeypot field
The subscribe form SHALL include a hidden `website` field that people neither see nor fill, and `POST /api/subscribe` SHALL silently drop signups that carry it filled.

#### Scenario: Hidden from people
- **WHEN** someone views the form, with or without a screen reader
- **THEN** the `website` field is not visible, has `tabindex="-1"`, `autocomplete="off"` and `aria-hidden="true"`, and the form works as before

#### Scenario: Honeypot filled
- **WHEN** `POST /api/subscribe` arrives with a non-empty `website`
- **THEN** the endpoint answers success with "Revisa tu correo y confirma con el botón de la bienvenida." without validating the form, calling Turnstile or calling the newsletter service

#### Scenario: Honeypot empty or missing
- **WHEN** `website` is empty or absent
- **THEN** the endpoint goes on to validation and the Turnstile check

---

### Requirement: Turnstile check
`POST /api/subscribe` SHALL require a valid Cloudflare Turnstile token before forwarding a signup.

#### Scenario: Widget on the form
- **WHEN** the subscribe form loads and `PUBLIC_TURNSTILE_SITE_KEY` is set
- **THEN** the Turnstile widget renders next to the form with `appearance: "interaction-only"`, and its token goes in the body as `turnstileToken`

#### Scenario: Valid token
- **WHEN** the token is present and `siteverify` answers `success: true` for `TURNSTILE_SECRET_KEY`
- **THEN** the endpoint forwards the signup to the newsletter service

#### Scenario: Missing or rejected token
- **WHEN** `turnstileToken` is missing or `siteverify` answers `success: false`
- **THEN** the endpoint answers 400 with "No pudimos verificar que no eres un bot. Recarga la página e intenta de nuevo." and does not call the newsletter service

#### Scenario: Turnstile unavailable
- **WHEN** `siteverify` does not answer within 5 s or answers an HTTP error
- **THEN** the endpoint answers 500 with the generic error, reports to Sentry and does not call the newsletter service

#### Scenario: One token per submit
- **WHEN** a submit finishes, with success or error
- **THEN** the form resets the widget so the next submit gets a fresh token

---

### Requirement: Success message asks to confirm
`POST /api/subscribe` SHALL answer a successful signup with "Revisa tu correo y confirma con el botón de la bienvenida.", since the newsletter service keeps the signup pending until the welcome's button is clicked.

#### Scenario: New or pending subscriber
- **WHEN** the newsletter service answers 200
- **THEN** the endpoint answers success with "Revisa tu correo y confirma con el botón de la bienvenida."

#### Scenario: Already subscribed
- **WHEN** the newsletter service answers 409
- **THEN** the endpoint answers 409 with "Ya estás suscrito con este correo.", as before
