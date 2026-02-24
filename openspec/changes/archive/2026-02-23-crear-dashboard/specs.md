# Specs: Dashboard de Artículos con IA

## ADDED Requirements

### Requirement: Authentication & Session Management

The system MUST protect all dashboard routes and manage user sessions securely.

#### Scenario: Unauthenticated Access

- **WHEN** an unauthenticated user attempts to access any URL starting with `/dashboard` (except `/dashboard/login`)
- **THEN** the system redirects the user to `/dashboard/login`

#### Scenario: Successful Login

- **WHEN** a user submits valid credentials (username `admin` and correct password) to `/api/auth/login`
- **THEN** the system sets a secure, httpOnly cookie named `dashboard_session`
- **THEN** the system redirects the user to `/dashboard`

#### Scenario: Session Expiration

- **WHEN** a user's session has been inactive for more than 30 minutes
- **THEN** the session token becomes invalid
- **THEN** the next request redirects to `/dashboard/login`

#### Scenario: Logout

- **WHEN** an authenticated user clicks the logout button
- **THEN** the system destroys the session cookie
- **THEN** the user is redirected to `/dashboard/login`

### Requirement: Article Editor Core

The system MUST provide a Markdown editor with real-time preview and metadata management.

#### Scenario: Real-time Preview

- **WHEN** the user types Markdown content in the editor pane
- **THEN** the preview pane updates immediately (or debounced < 500ms) to show the rendered HTML

#### Scenario: Frontmatter Validation

- **WHEN** the user attempts to save an article
- **THEN** the system validates that `title`, `slug`, `description`, and `categories` are present and valid
- **THEN** if validation fails, specific error messages are displayed

#### Scenario: Auto-Slug Generation

- **WHEN** the user enters a Title
- **THEN** the system automatically generates a URL-friendly slug (lowercase, dashes, no special chars)

#### Scenario: Auto-Save

- **WHEN** the user has unsaved changes for more than 30 seconds
- **THEN** the system automatically saves a draft to the backend
- **THEN** a "Saved" indicator is shown

### Requirement: AI Content Assistance

The system MUST integrate with OpenAI to assist in content creation.

#### Scenario: Generate SEO Description

- **WHEN** the user clicks "Generate Description"
- **THEN** the system sends the article content to OpenAI (GPT-4)
- **THEN** the returned description (max 160 chars) populates the description field

#### Scenario: Suggest Tags

- **WHEN** the user clicks "Suggest Tags"
- **THEN** the system analyzes the content and suggests up to 3 relevant categories from the allowed list

#### Scenario: Rate Limiting

- **WHEN** a user exceeds the daily limit of AI requests (defaults to 100)
- **THEN** the system blocks the request and returns a specific error message "Daily limit reached"

### Requirement: AI Image Generation

The system MUST generate and optimize cover images using DALL-E 3.

#### Scenario: Generate Cover Image

- **WHEN** the user clicks "Generate Image"
- **THEN** the system uses DALL-E 3 to generate a 16:9 image based on title and description
- **THEN** the image is optimized (WebP, resized) and saved to the file system
- **THEN** the `seo_image` field is populated with the local path

### Requirement: File Management

The system MUST manage physical `.mdx` files and backups.

#### Scenario: Create/Update Article

- **WHEN** an article is saved
- **THEN** a `.mdx` file is written to `src/pages/articulos/[slug].mdx` with valid frontmatter

#### Scenario: Automatic Backup

- **WHEN** an article is updated or deleted
- **THEN** a copy of the previous version is saved to `.backups/articles/` with a timestamp before the operation completes

#### Scenario: Delete Article

- **WHEN** a user deletes an article
- **THEN** the corresponding `.mdx` file is removed from `src/pages/articulos/`
- **THEN** a backup is verified to exist before deletion
