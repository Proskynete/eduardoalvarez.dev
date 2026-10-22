## ADDED Requirements

### Requirement: Signups are forwarded to the newsletter service
`POST /api/subscribe` SHALL validate the form and forward valid signups to `${NEWSLETTER_API_URL}/api/newsletter/subscribe`, authenticated with `NEWSLETTER_SUBSCRIBE_SECRET`. It SHALL NOT use Mailchimp.

#### Scenario: New subscriber
- **GIVEN** a valid name and email
- **WHEN** the newsletter service answers 200
- **THEN** the endpoint answers success with "Listo, ya estás suscrito. La próxima edición te llega al correo."

#### Scenario: Already subscribed
- **WHEN** the newsletter service answers 409
- **THEN** the endpoint answers 409 with "Ya estás suscrito con este correo."

#### Scenario: Service error or unreachable
- **WHEN** the newsletter service answers any other status, times out after 10 s or the request fails
- **THEN** the endpoint answers 500 with "No pude completar la suscripción. Intenta de nuevo en unos minutos." and reports to Sentry

#### Scenario: Invalid form
- **WHEN** the name or email fails validation
- **THEN** the endpoint answers 400 with the first validation message and does not call the newsletter service

#### Scenario: Rate limit
- **WHEN** the same client sends more than 5 requests in a minute
- **THEN** the endpoint answers 429 without calling the newsletter service
