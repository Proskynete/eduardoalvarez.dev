# Tasks: Dashboard de Artículos con IA

## 1. Authentication & Security

- [ ] 1.1 Install dependencies (bcryptjs, jose)
- [ ] 1.2 Implement password hashing utility and generate admin hash
- [ ] 1.3 Create session management utility (JWT)
- [ ] 1.4 Implement API endpoints for login (`POST /api/auth/login`) and logout (`POST /api/auth/logout`)
- [ ] 1.5 Create Auth Middleware to protect `/dashboard` routes
- [ ] 1.6 Create Login Page UI and form component

## 2. Dashboard Core & Layout

- [ ] 2.1 Create Dashboard Layout (Sidebar, Header)
- [ ] 2.2 Implement `ArticleList` component with filters (status, search)
- [ ] 2.3 Create API endpoint `GET /api/articulos/list` (mocked initially)
- [ ] 2.4 Implement `DashboardArticle` type definitions
- [ ] 2.5 Create core dashboard page (`/dashboard/index.astro`)

## 3. Article Editor

- [ ] 3.1 Install CodeMirror and React Markdown dependencies
- [ ] 3.2 Create `ArticleEditor` skeleton and routing (`/dashboard/articulos/nuevo`, `edit/[slug]`)
- [ ] 3.3 Implement `MarkdownEditor` component with CodeMirror
- [ ] 3.4 Implement `MarkdownPreview` component
- [ ] 3.5 Create `FrontmatterForm` with Zod validation
- [ ] 3.6 Implement Auto-save logic hooks

## 4. AI Content Integration

- [ ] 4.1 Install and configure OpenAI SDK
- [ ] 4.2 Implement rate limiting utility
- [ ] 4.3 Create API endpoint for description generation (`/api/ai/generate-description`)
- [ ] 4.4 Create API endpoint for tag suggestions (`/api/ai/suggest-tags`)
- [ ] 4.5 Implement UI components (`AIAssistantPanel`) to trigger generations

## 5. Image Generation

- [ ] 5.1 Implement `DALL-E 3` client wrapper
- [ ] 5.2 Implement image optimization pipeline with `sharp`
- [ ] 5.3 Create API endpoint `POST /api/ai/generate-image`
- [ ] 5.4 Implement `ImageGenerator` UI component

## 6. File Management Support

- [ ] 6.1 Implement file system CRUD helpers (read, write, delete `.mdx`)
- [ ] 6.2 Implement backup manager logic
- [ ] 6.3 Connect API endpoints (list, create, update, delete) to real file system
- [ ] 6.4 Verify end-to-end flow (Create -> Edit -> Save -> Delete)
