# Fase 2: Arquitectura del Dashboard

**Tiempo estimado**: 6-8 horas
**Prioridad**: 🔴 Crítica
**Dependencias**: Fase 1 (Autenticación)

---

## Objetivos

Crear la estructura base del dashboard con navegación, layout, lista de artículos y estados vacíos. Esta fase establece la fundación sobre la cual se construirán las funcionalidades de creación y edición.

## Estructura de Archivos

```
src/
├── pages/
│   └── dashboard/
│       ├── index.astro                    # Dashboard principal (lista)
│       ├── articulos/
│       │   ├── nuevo.astro                # Crear artículo
│       │   ├── editar/
│       │   │   └── [slug].astro           # Editar artículo
│       │   └── preview/
│       │       └── [slug].astro           # Preview artículo
│       └── api/
│           └── articulos/
│               ├── list.ts                # GET lista
│               └── [slug].ts              # GET artículo
├── components/
│   └── dashboard/
│       ├── DashboardLayout.astro          # Layout principal
│       ├── DashboardNav.tsx               # Navegación
│       ├── ArticleList.tsx                # Lista de artículos
│       ├── ArticleCard.tsx                # Card individual
│       ├── EmptyState.tsx                 # Estado vacío
│       ├── LoadingState.tsx               # Estado de carga
│       └── UserMenu.tsx                   # Menú de usuario
├── lib/
│   └── articles/
│       ├── file-reader.ts                 # Leer archivos .mdx
│       └── utils.ts                       # Utilidades
└── types/
    └── dashboard.ts                       # TypeScript interfaces
```

## Paso 1: Types y Interfaces

### src/types/dashboard.ts
```typescript
import type { CategoryAllowed, Section } from './index';

export interface DashboardArticle {
  title: string;
  slug: string;
  description: string;
  date: string;
  categories: CategoryAllowed[];
  seo_image: string;
  sections: Section[];
  status: 'draft' | 'published';
  filePath: string;
  lastModified: string;
  aiGenerated?: {
    description: boolean;
    image: boolean;
    tags: boolean;
  };
}

export interface ArticleListResponse {
  articles: DashboardArticle[];
  total: number;
}

export interface ArticleFilter {
  status?: 'all' | 'draft' | 'published';
  category?: CategoryAllowed | 'all';
  search?: string;
  sortBy?: 'date' | 'title' | 'modified';
  sortOrder?: 'asc' | 'desc';
}
```

## Paso 2: File Reader

### src/lib/articles/file-reader.ts
```typescript
import { glob } from 'glob';
import { readFileSync, statSync } from 'fs';
import matter from 'gray-matter';
import type { DashboardArticle } from '@/types/dashboard';

/**
 * Leer todos los artículos .mdx
 */
export async function getAllArticles(): Promise<DashboardArticle[]> {
  const files = await glob('src/pages/articulos/**/*.mdx');

  const articles = files.map((filePath) => {
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    const stats = statSync(filePath);

    return {
      title: data.title || 'Sin título',
      slug: data.slug || '',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      categories: data.categories || [],
      seo_image: data.seo_image || '',
      sections: data.sections || [],
      status: data.status || 'draft',
      filePath,
      lastModified: stats.mtime.toISOString(),
      aiGenerated: data.aiGenerated,
    } as DashboardArticle;
  });

  // Ordenar por fecha (más recientes primero)
  return articles.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Leer un artículo específico por slug
 */
export async function getArticleBySlug(
  slug: string
): Promise<DashboardArticle | null> {
  const articles = await getAllArticles();
  return articles.find(article => article.slug === slug) || null;
}

/**
 * Filtrar artículos
 */
export function filterArticles(
  articles: DashboardArticle[],
  filters: ArticleFilter
): DashboardArticle[] {
  let filtered = [...articles];

  // Filtrar por status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(a => a.status === filters.status);
  }

  // Filtrar por categoría
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(a =>
      a.categories.includes(filters.category as CategoryAllowed)
    );
  }

  // Búsqueda por texto
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(search) ||
      a.description.toLowerCase().includes(search)
    );
  }

  // Ordenar
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'modified':
          comparison = new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
          break;
      }

      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });
  }

  return filtered;
}
```

## Paso 3: API Endpoint - Lista de Artículos

### src/pages/api/articulos/list.ts
```typescript
import type { APIRoute } from 'astro';
import { getAllArticles, filterArticles } from '@/lib/articles/file-reader';
import type { ArticleFilter } from '@/types/dashboard';

export const GET: APIRoute = async ({ url }) => {
  try {
    // Obtener parámetros de query
    const params = url.searchParams;

    const filters: ArticleFilter = {
      status: (params.get('status') as any) || 'all',
      category: (params.get('category') as any) || 'all',
      search: params.get('search') || undefined,
      sortBy: (params.get('sortBy') as any) || 'date',
      sortOrder: (params.get('sortOrder') as any) || 'desc',
    };

    // Leer todos los artículos
    const allArticles = await getAllArticles();

    // Aplicar filtros
    const articles = filterArticles(allArticles, filters);

    return new Response(
      JSON.stringify({
        success: true,
        articles,
        total: articles.length,
        filters,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching articles:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al obtener artículos',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
```

### src/pages/api/articulos/[slug].ts
```typescript
import type { APIRoute } from 'astro';
import { getArticleBySlug } from '@/lib/articles/file-reader';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { slug } = params;

    if (!slug) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Slug requerido',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const article = await getArticleBySlug(slug);

    if (!article) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Artículo no encontrado',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        article,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching article:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al obtener artículo',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
```

## Paso 4: Layout del Dashboard

### src/components/dashboard/DashboardLayout.astro
```astro
---
import '@/styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>{title} | Dashboard</title>
  {description && <meta name="description" content={description} />}
</head>
<body class="bg-gray-900 text-white">
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 border-r border-gray-700 hidden md:block">
      <div class="p-6">
        <h2 class="text-xl font-bold">Dashboard</h2>
      </div>

      <nav class="px-4 space-y-2">
        <a
          href="/dashboard"
          class="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          📝 Artículos
        </a>
        <a
          href="/dashboard/articulos/nuevo"
          class="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          ✨ Nuevo artículo
        </a>
      </nav>

      <div class="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        <slot name="user-menu" />
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <header class="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 class="text-2xl font-bold">{title}</h1>
        {description && (
          <p class="text-gray-400 mt-1">{description}</p>
        )}
      </header>

      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</body>
</html>
```

### src/components/dashboard/UserMenu.tsx
```tsx
import { useState } from 'react';

export default function UserMenu({ username }: { username: string }) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/dashboard/login';
    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          {username.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium">{username}</span>
      </div>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="text-gray-400 hover:text-white transition-colors text-sm"
        title="Cerrar sesión"
      >
        {loading ? '...' : '🚪'}
      </button>
    </div>
  );
}
```

## Paso 5: Componentes de UI

### src/components/dashboard/ArticleCard.tsx
```tsx
import type { DashboardArticle } from '@/types/dashboard';

interface Props {
  article: DashboardArticle;
}

export default function ArticleCard({ article }: Props) {
  const formattedDate = new Date(article.date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            {article.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {article.description}
          </p>
        </div>

        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            article.status === 'published'
              ? 'bg-green-900/20 text-green-400 border border-green-500'
              : 'bg-yellow-900/20 text-yellow-400 border border-yellow-500'
          }`}
        >
          {article.status === 'published' ? 'Publicado' : 'Borrador'}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-gray-500">
          <span>📅 {formattedDate}</span>
          <span>
            {article.categories.slice(0, 2).map(cat => (
              <span key={cat} className="inline-block px-2 py-0.5 bg-gray-700 rounded text-xs mr-1">
                {cat}
              </span>
            ))}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={`/dashboard/articulos/editar/${article.slug}`}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
          >
            Editar
          </a>
          <a
            href={`/dashboard/articulos/preview/${article.slug}`}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
          >
            Ver
          </a>
        </div>
      </div>

      {article.aiGenerated && (
        <div className="mt-3 pt-3 border-t border-gray-700 flex items-center space-x-2 text-xs text-gray-500">
          <span>🤖 IA:</span>
          {article.aiGenerated.description && <span>Descripción</span>}
          {article.aiGenerated.image && <span>• Imagen</span>}
          {article.aiGenerated.tags && <span>• Tags</span>}
        </div>
      )}
    </div>
  );
}
```

### src/components/dashboard/EmptyState.tsx
```tsx
export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-xl font-semibold text-white mb-2">
        No hay artículos aún
      </h3>
      <p className="text-gray-400 mb-6">
        Comienza creando tu primer artículo con IA
      </p>
      <a
        href="/dashboard/articulos/nuevo"
        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        ✨ Crear primer artículo
      </a>
    </div>
  );
}
```

### src/components/dashboard/LoadingState.tsx
```tsx
export default function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse"
        >
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
}
```

## Paso 6: Lista de Artículos

### src/components/dashboard/ArticleList.tsx
```tsx
import { useState, useEffect } from 'react';
import type { DashboardArticle, ArticleFilter } from '@/types/dashboard';
import ArticleCard from './ArticleCard';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

export default function ArticleList() {
  const [articles, setArticles] = useState<DashboardArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<ArticleFilter>({
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  async function fetchArticles() {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/articulos/list?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar artículos');
      }

      setArticles(data.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">❌ {error}</div>
        <button
          onClick={fetchArticles}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value="all">Todos</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </select>

          <input
            type="search"
            placeholder="Buscar artículos..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500"
          />
        </div>

        <div className="text-sm text-gray-400">
          {articles.length} artículo{articles.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
```

## Paso 7: Página Principal del Dashboard

### src/pages/dashboard/index.astro
```astro
---
import DashboardLayout from '@/components/dashboard/DashboardLayout.astro';
import ArticleList from '@/components/dashboard/ArticleList';
import UserMenu from '@/components/dashboard/UserMenu';
import { getSession } from '@/lib/auth/session';

// Obtener sesión (middleware ya validó autenticación)
const session = await getSession(Astro.cookies);
---

<DashboardLayout
  title="Artículos"
  description="Gestiona todos tus artículos del blog"
>
  <ArticleList client:load />

  <UserMenu slot="user-menu" username={session?.username || 'Usuario'} client:load />
</DashboardLayout>
```

## Paso 8: Página de Nuevo Artículo (Placeholder)

### src/pages/dashboard/articulos/nuevo.astro
```astro
---
import DashboardLayout from '@/components/dashboard/DashboardLayout.astro';
import UserMenu from '@/components/dashboard/UserMenu';
import { getSession } from '@/lib/auth/session';

const session = await getSession(Astro.cookies);
---

<DashboardLayout title="Nuevo Artículo">
  <div className="text-center py-12">
    <div className="text-6xl mb-4">🚧</div>
    <h3 className="text-xl font-semibold text-white mb-2">
      Editor en construcción
    </h3>
    <p className="text-gray-400">
      Esta funcionalidad se implementará en la Fase 3
    </p>
  </div>

  <UserMenu slot="user-menu" username={session?.username || 'Usuario'} client:load />
</DashboardLayout>
```

## Testing Manual

### 1. Iniciar servidor
```bash
npm run dev
```

### 2. Navegar al dashboard
```
http://localhost:4321/dashboard
```

### 3. Verificar funcionalidades
- [ ] Login funciona correctamente
- [ ] Dashboard muestra lista de artículos existentes
- [ ] Cards muestran información correcta
- [ ] Estados publicado/borrador se visualizan
- [ ] Filtros funcionan (todos, publicados, borradores)
- [ ] Búsqueda funciona
- [ ] Navegación entre páginas
- [ ] User menu muestra username
- [ ] Logout funciona
- [ ] Estado vacío se muestra si no hay artículos

## Mejoras Futuras

1. **Paginación**
   - Limit/offset en API
   - Botones prev/next
   - Infinite scroll

2. **Acciones Bulk**
   - Seleccionar múltiples
   - Publicar/despublicar en batch
   - Eliminar múltiples

3. **Estadísticas**
   - Total publicados vs borradores
   - Artículos por categoría
   - Gráficos de actividad

4. **Búsqueda Avanzada**
   - Búsqueda full-text
   - Filtros por fecha
   - Filtros por categoría múltiple

## Checklist de Implementación

- [ ] Crear types (dashboard.ts)
- [ ] Implementar file-reader.ts
- [ ] Crear API endpoints (list, [slug])
- [ ] Diseñar DashboardLayout
- [ ] Crear UserMenu component
- [ ] Crear ArticleCard component
- [ ] Crear EmptyState component
- [ ] Crear LoadingState component
- [ ] Implementar ArticleList con filtros
- [ ] Crear página /dashboard
- [ ] Crear placeholder /dashboard/articulos/nuevo
- [ ] Testing manual completo
- [ ] Validar responsive design

## Resultado Esperado

Al completar esta fase, tendrás:
- ✅ Dashboard funcional con lista de artículos
- ✅ Navegación fluida
- ✅ Filtros y búsqueda
- ✅ Estados vacíos y de carga
- ✅ UI moderna y responsive
- ✅ Integración con sistema de auth

**Tiempo real estimado**: 6-8 horas

**Siguiente fase**: `03_editor-markdown.md`
