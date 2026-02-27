# Specs: Architecture Improvements

## ADDED Requirements

### Requirement: Environment Validation

The application MUST validate all environment variables at startup.

#### Scenario: Build Fast Fail

- **WHEN** the build process starts (e.g. `npm run build`)
- **AND** a required environment variable (e.g. `PUBLIC_ALGOLIA_SEARCH_API_KEY`) is missing
- **THEN** the process exits immediately with a clear error message listing the missing variable(s).

### Requirement: Rate Limiting

Public API endpoints MUST limit request frequency to prevent abuse.

#### Scenario: Subscribe Limit

- **WHEN** a client sends more than 5 requests to `/api/subscribe` within a 15-minute window
- **THEN** the 6th request returns HTTP 429 Too Many Requests
- **AND** the response includes a `Retry-After` header.

### Requirement: Image Optimization

Images MUST serve in modern formats and responsive sizes.

#### Scenario: Article Image Load

- **WHEN** an article page loads
- **THEN** the main image is served as WebP or AVIF
- **AND** the browser selects the appropriate size from `srcset` based on the viewport width.

### Requirement: Accessible Navigation

The site MUST be navigable by keyboard and screen readers.

#### Scenario: Search Keyboard Navigation

- **WHEN** the search modal is open
- **AND** search results are displayed
- **THEN** pressing `ArrowDown` moves focus to the first result
- **AND** pressing `Enter` navigates to the selected result.

#### Scenario: Skip Content

- **WHEN** a user tabs into the page
- **THEN** a "Saltar al contenido" link becomes visible
- **AND** activating it moves focus to the main content area.
