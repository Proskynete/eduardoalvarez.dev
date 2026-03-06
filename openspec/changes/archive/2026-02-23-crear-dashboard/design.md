# Design: Dashboard de Artículos con IA

## Architecture

Aplicación web construida sobre **Astro** (SSR) con **React** para componentes interactivos en el cliente.

- **Frontend**: Astro pages para routing y estructura, React components (CodeMirror, Dashboards) para interactividad.
- **Backend**: API Routes de Astro (`src/pages/api/`) para lógica de servidor (Auth, AI, CRUD).
- **Persistence**: Sistema de archivos local (`.mdx` con frontmatter) gestionado via Node.js `fs` y `glob`.
- **Auth**: Auth.js (NextAuth) v5 con JWT y cookies httpOnly.
- **AI**: Integración directa con OpenAI API (GPT-4 + DALL-E 3).

### Directory Structure

```
src/
├── pages/
│   ├── dashboard/           # Rutas protegidas
│   │   ├── index.astro      # Lista de artículos
│   │   ├── articulos/       # Editor (nuevo/editar)
│   │   └── login.astro      # Login page
│   └── api/                 # Endpoints
│       ├── auth/            # Login/Logout/Session
│       ├── articulos/       # CRUD
│       └── ai/              # Generación
├── components/
│   └── dashboard/           # Componentes UI (Editor, Lists)
├── lib/
│   ├── auth/                # Lógica de auth
│   ├── ai/                  # Clientes OpenAI/Sharp
│   └── articles/            # File system helpers
└── middleware/              # Protección de rutas
```

## Data Model

### Article (MDX + Frontmatter)

Modelo principal almacenado como archivo `.mdx`.

```typescript
interface DashboardArticle {
  title: string;
  slug: string; // Identificador único (filename)
  description: string; // SEO meta description
  date: string; // ISO string
  categories: Category[]; // ["react", "web-dev", etc.]
  seo_image: string; // Path local a la imagen
  status: "draft" | "published";
  content: string; // Markdown body
  sections: Section[]; // Estructura para TOC
  aiGenerated?: {
    // Metadatos de generación
    description: boolean;
    image: boolean;
    tags: boolean;
  };
}
```

## API Design

### Authentication

- `POST /api/auth/login`: Valida credenciales vs env vars, setea cookie `dashboard_session`.
- `POST /api/auth/logout`: Elimina cookie.
- `GET /api/auth/session`: Retorna estado de sesión actual.

### Articles CRUD

- `GET /api/articulos/list`: Lista todos los artículos con filtros (status, search).
- `GET /api/articulos/[slug]`: Retorna contenido de un artículo específico.
- `POST /api/articulos/create`: Crea nuevo archivo `.mdx` (valida slug único).
- `PUT /api/articulos/update`: Actualiza archivo existente (maneja cambio de slug + backup).
- `DELETE /api/articulos/delete`: Elimina archivo (crea backup antes).

### AI Services

- `POST /api/ai/generate-description`: Genera SEO description basado en contenido.
- `POST /api/ai/suggest-tags`: Sugiere categorías permitidas.
- `POST /api/ai/suggest-title`: Propone títulos alternativos.
- `POST /api/ai/generate-image`: Genera cover image con DALL-E 3, descarga y optimiza con Sharp.

## User Experience

### Authentication Flow

1. Usuario accede a `/dashboard`.
2. Middleware verifica cookie. Si no existe -> redirect `/dashboard/login`.
3. Login exitoso -> redirect `/dashboard`.

### Content Creation Flow

1. **List View**: Ver todos los artículos, estado (draft/published), filtrar.
2. **Editor**:
   - **Markdown**: Panel izquierdo con CodeMirror (syntax highlighting).
   - **Preview**: Panel derecho (renderizado real-time).
   - **Sidebar**: Metadata (título, slug, fecha).
   - **AI Tools**: Botones para "Auto-generar Descripción", "Sugerir Tags", "Generar Cover".
3. **Saving**: Auto-save (draft) cada 30s. Guardado manual.

## Security

- **Auth**: JWT firmado, cookies `httpOnly`, `secure`, `sameSite`.
- **Validation**: Zod schemas para todos los inputs de API.
- **Rate Limit**: Control básico de requests a endpoints de IA (por IP/sesión) para controlar costos.
