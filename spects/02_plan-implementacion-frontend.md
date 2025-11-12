# Plan de Implementación - Mejoras Frontend

**Fecha**: 2025-11-11
**Proyecto**: eduardoalvarez.dev
**Basado en**: Análisis de Arquitectura (spects/01_analisis-arquitectura.md)

---

## Resumen Ejecutivo

Este plan detalla la implementación de mejoras frontend identificadas en el análisis arquitectural. El plan está organizado en 4 fases siguiendo la matriz de prioridad: Crítica → Alta → Media → Baja.

**Duración Total Estimada**: 6-7 semanas
**Fases**: 4
**Steps Totales**: 18

---

## Fase 1: Seguridad y Estabilidad (Semana 1-2)

### Step 1: Migrar a API Keys de Solo-Lectura para Algolia ✅ **COMPLETADO**

**Prioridad**: 🔴 Crítica
**Tiempo estimado**: 4 horas → **Tiempo real**: 3 horas
**Estado**: ✅ Completado (2025-11-11)
**Archivos modificados**:
- `src/layouts/base/index.astro`
- `src/layouts/base/components/header/components/use-algolia-search.ts`
- `src/scripts/algolia.ts` (optimización adicional)
- `.env.template`

**Descripción**:
El ADMIN API KEY de Algolia estaba expuesto al cliente, permitiendo a cualquiera modificar o eliminar el índice. Se migró a Search-Only API Key.

**Implementación realizada**:

1. Configuración optimizada de variables de entorno (eliminando duplicación):

```bash
# .env.template (optimizado)
# Variables compartidas (cliente + servidor)
PUBLIC_ALGOLIA_APPLICATION_ID=your_app_id
PUBLIC_ALGOLIA_INDEX_NAME=your_index_name

# Client-side: Search-Only API Key (solo lectura)
PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_only_key

# Server-side: Admin API Key (solo para build)
ALGOLIA_ADMIN_API_KEY=your_admin_key
```

2. Actualizado `src/layouts/base/index.astro`:

```typescript
// DESPUÉS (✅ Seguro)
const algolia = {
  ALGOLIA_SEARCH_API_KEY: import.meta.env.PUBLIC_ALGOLIA_SEARCH_API_KEY,
  ALGOLIA_APPLICATION_ID: import.meta.env.PUBLIC_ALGOLIA_APPLICATION_ID,
  ALGOLIA_INDEX_NAME: import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME,
} as const;
```

3. Optimizado `src/scripts/algolia.ts` para usar variables compartidas:

```typescript
const appId = process.env.PUBLIC_ALGOLIA_APPLICATION_ID;
const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
const indexName = process.env.PUBLIC_ALGOLIA_INDEX_NAME;
```

**Beneficios logrados**:
- ✅ Admin key ya no está expuesta en el cliente
- ✅ Solo 4 variables en lugar de 6 (sin duplicación)
- ✅ Búsqueda funciona con key de solo lectura
- ✅ Indexación segura durante el build

**Validación completada**:
- ✅ ADMIN KEY no visible en DevTools
- ✅ Búsqueda funciona correctamente
- ✅ Escritura en índice falla con 403 (esperado)

**Documentación**:
- Ver: `docs/MIGRACION_ALGOLIA_KEYS.md` para guía completa

---

### Step 2: Mover Secretos de Giscus a Variables de Entorno ✅ **COMPLETADO**

**Prioridad**: 🔴 Crítica
**Tiempo estimado**: 2 horas → **Tiempo real**: 1.5 horas
**Estado**: ✅ Completado (2025-11-11)
**Archivos modificados**:
- `src/layouts/article/components/giscus.tsx`
- `.env.template`

**Descripción**:
Los IDs de repositorio y categoría de Giscus estaban hardcodeados. Se movieron a variables de entorno para mejorar la seguridad y configurabilidad.

**Implementación realizada**:

1. Actualizado `.env.template` con variables de Giscus:

```bash
# ========================================
# GISCUS CONFIGURATION
# ========================================

# GitHub repository for comments (format: owner/repo)
PUBLIC_GISCUS_REPO=

# Giscus repository ID (get from https://giscus.app)
PUBLIC_GISCUS_REPO_ID=

# Giscus category ID for blog comments (get from https://giscus.app)
PUBLIC_GISCUS_CATEGORY_ID=
```

2. Refactorizado `src/layouts/article/components/giscus.tsx`:

```typescript
// DESPUÉS (✅ Seguro y configurable)
const GiscusWrapper = ({ slug }: GiscusProps) => {
  const giscusRepo = import.meta.env.PUBLIC_GISCUS_REPO;
  const giscusRepoId = import.meta.env.PUBLIC_GISCUS_REPO_ID;
  const giscusCategoryId = import.meta.env.PUBLIC_GISCUS_CATEGORY_ID;

  // Validar que todas las variables de entorno estén configuradas
  const isMissingConfig = !giscusRepo || !giscusRepoId || !giscusCategoryId;

  if (isMissingConfig) {
    return (
      <div className="rounded-lg border border-yellow-600 bg-yellow-50 p-6 dark:border-yellow-500 dark:bg-yellow-900/20">
        <h3 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
          Comentarios no disponibles
        </h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          La configuración de Giscus no está completa. Por favor, verifica que las siguientes variables de entorno
          estén configuradas:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-yellow-700 dark:text-yellow-300">
          {!giscusRepo && <li>PUBLIC_GISCUS_REPO</li>}
          {!giscusRepoId && <li>PUBLIC_GISCUS_REPO_ID</li>}
          {!giscusCategoryId && <li>PUBLIC_GISCUS_CATEGORY_ID</li>}
        </ul>
      </div>
    );
  }

  return (
    <Giscus
      id="comments"
      repo={giscusRepo}
      repoId={giscusRepoId}
      category="Blog Comments"
      categoryId={giscusCategoryId}
      mapping="specific"
      term={`blog/${slug}`}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="dark"
      lang="es"
      loading="lazy"
    />
  );
};
```

**Beneficios logrados**:
- ✅ IDs de Giscus ya no están hardcodeados
- ✅ Configuración centralizada en variables de entorno
- ✅ Validación robusta con mensaje específico de qué falta
- ✅ UI de fallback elegante con tema dark coherente
- ✅ Fácil configuración para diferentes ambientes

**Validación completada**:
- ✅ Componente usa variables de entorno correctamente
- ✅ Fallback UI muestra lista de variables faltantes
- ✅ Tema dark consistente con diseño del sitio
- ✅ Prefijo PUBLIC_ aplicado correctamente

**Documentación**:
- Variables documentadas en `.env.template` con referencias a giscus.app

---

### Step 3: Agregar Estados de Error al Hook de Búsqueda ✅ **COMPLETADO**

**Prioridad**: 🔴 Crítica
**Tiempo estimado**: 6 horas → **Tiempo real**: 5 horas
**Estado**: ✅ Completado (2025-11-11)
**Archivos modificados**:
- `src/layouts/base/components/header/components/use-algolia-search.ts`
- `src/layouts/base/components/header/components/search-results.tsx`
- `src/layouts/base/components/header/components/navigation.tsx`

**Descripción**:
El hook `useAlgoliaSearch` no maneja estados de error, dejando a los usuarios sin feedback cuando algo falla.

**Implementación**:

1. Actualizar el hook para incluir estado de error:

```typescript
// src/layouts/base/components/header/components/use-algolia-search.ts
import { useState, useRef, useCallback } from 'react';
import { algoliasearch } from 'algoliasearch';
import type { SearchResult, AlgoliaConfig } from './types';

export function useAlgoliaSearch(algolia?: AlgoliaConfig) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchClientRef = useRef<ReturnType<typeof algoliasearch> | null>(null);

  // Inicializar cliente
  if (!searchClientRef.current && algolia?.ALGOLIA_APPLICATION_ID) {
    searchClientRef.current = algoliasearch(
      algolia.ALGOLIA_APPLICATION_ID,
      algolia.ALGOLIA_SEARCH_API_KEY
    );
  }

  const search = useCallback(async (query: string): Promise<boolean> => {
    // Reset error state
    setError(null);

    if (!query.trim()) {
      setSearchResults([]);
      return false;
    }

    setIsSearching(true);

    try {
      // Validar configuración
      if (!searchClientRef.current || !algolia?.ALGOLIA_INDEX_NAME) {
        throw new Error('La búsqueda no está configurada correctamente');
      }

      const { results } = await searchClientRef.current.searchForHits({
        requests: [
          {
            indexName: algolia.ALGOLIA_INDEX_NAME,
            query,
            hitsPerPage: 10,
          },
        ],
      });

      const hits = (results[0]?.hits || []) as SearchResult[];
      setSearchResults(hits);
      return hits.length > 0;

    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Error al realizar la búsqueda. Por favor, intenta de nuevo.';

      console.error('Search error:', error);
      setError(message);
      setSearchResults([]);
      return false;

    } finally {
      setIsSearching(false);
    }
  }, [algolia]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
    setIsSearching(false);
  }, []);

  return {
    searchResults,
    search,
    isSearching,
    error,
    clearSearch,
  };
}
```

2. Actualizar el componente de resultados para mostrar errores:

```typescript
// src/layouts/base/components/header/components/search-results.tsx
interface SearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
  error: string | null;
  onSelect: (slug: string) => void;
}

export const SearchResults = ({
  results,
  isSearching,
  error,
  onSelect
}: SearchResultsProps) => {
  // Mostrar loader
  if (isSearching) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500" />
        <p className="text-sm text-gray-400 mt-2">Buscando...</p>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="p-4 border-l-4 border-red-500 bg-red-900/20">
        <div className="flex items-start">
          <svg
            className="h-5 w-5 text-red-500 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-400">Error de búsqueda</h3>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Sin resultados
  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>No se encontraron resultados</p>
      </div>
    );
  }

  // Mostrar resultados
  return (
    <ul className="divide-y divide-gray-700">
      {results.map((result) => (
        <li key={result.objectID}>
          <button
            onClick={() => onSelect(result.slug)}
            className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors focus:bg-gray-800 focus:outline-none"
          >
            <h3 className="text-sm font-medium text-white">{result.title}</h3>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {result.description}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
};
```

**Implementación realizada**:

1. Actualizado `src/layouts/base/components/header/components/use-algolia-search.ts`:

```typescript
// Estado de error agregado
const [error, setError] = useState<string | null>(null);

// Reset error al iniciar nueva búsqueda
const search = async (query: string) => {
  setError(null);

  // Validación de configuración
  if (!algolia?.ALGOLIA_APPLICATION_ID || !algolia?.ALGOLIA_INDEX_NAME || !algolia?.ALGOLIA_SEARCH_API_KEY) {
    setError("La configuración de búsqueda no está disponible.");
    return false;
  }

  // Try-catch para manejo de errores
  try {
    // ... búsqueda
  } catch (error) {
    console.error("Error searching:", error);
    setError("Hubo un error al realizar la búsqueda. Por favor, intenta nuevamente.");
    return false;
  }
};

// Clear error en clearSearch
const clearSearch = () => {
  setSearchResults([]);
  setIsSearching(false);
  setError(null);
};

// Retornar error en hook
return { searchResults, search, isSearching, error, clearSearch };
```

2. Actualizado `src/layouts/base/components/header/components/search-results.tsx`:

```typescript
// Agregados props error e isSearching
interface SearchResultsProps {
  error: string | null;
  isSearching: boolean;
  // ... otros props
}

// UI de error con tema dark
if (error) {
  return (
    <div className="border-l-4 border-red-500">
      <svg className="h-5 w-5 text-red-500" />
      <p className="text-sm text-red-400 font-medium">Error de búsqueda</p>
      <p className="text-xs text-gray-400 mt-1">{error}</p>
    </div>
  );
}

// UI de loading
if (isSearching) {
  return <p className="text-sm text-gray-400">Buscando...</p>;
}

// Sin resultados → return null
if (results.length === 0) return null;
```

3. Actualizado `src/layouts/base/components/header/components/navigation.tsx`:

```typescript
// Extraer error del hook
const { searchResults, search, isSearching, error } = useAlgoliaSearch(algolia);

// Pasar error e isSearching a SearchResults
<SearchResults
  error={error}
  isSearching={isSearching}
  // ... otros props
/>
```

**Beneficios logrados**:
- ✅ Estados de error manejados con mensajes claros
- ✅ Validación de configuración antes de búsqueda
- ✅ UI de error con tema dark consistente
- ✅ Loading state visible durante búsqueda
- ✅ Error state se resetea en nueva búsqueda
- ✅ Hook totalmente tipado con TypeScript

**Validación completada**:
- ✅ Búsqueda con configuración válida funciona correctamente
- ✅ Error de configuración muestra mensaje apropiado
- ✅ Errores de red capturados y mostrados
- ✅ Loading state visible durante búsqueda
- ✅ Build y linter pasan sin errores

**Dependencias**: Step 1 (API keys configurados)

---

### Step 4: Validación de Inputs con Zod en API Subscribe ✅ **COMPLETADO**

**Prioridad**: 🔴 Crítica
**Tiempo estimado**: 4 horas → **Tiempo real**: 3.5 horas
**Estado**: ✅ Completado (2025-11-12)
**Archivos modificados**:
- `src/pages/api/subscribe.ts`
- `package.json`

**Descripción**:
El endpoint de suscripción tiene validación débil y no sanitiza inputs. Agregar Zod para validación robusta.

**Implementación realizada**:

1. Instalar Zod:

```bash
npm install zod
```

2. Actualizar el endpoint:

```typescript
// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import client from '@mailchimp/mailchimp_marketing';
import { z } from 'zod';

// Schema de validación
const SubscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .max(100, 'Email demasiado largo')
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras')
    .trim(),
});

type SubscribeInput = z.infer<typeof SubscribeSchema>;

// Configurar Mailchimp
client.setConfig({
  apiKey: import.meta.env.MAILCHIMP_API_KEY,
  server: import.meta.env.MAILCHIMP_SERVER_PREFIX,
});

const TAGS = {
  SEND_POST_MAIL: 'send-post-mail',
  FROM_WEB_PAGE: 'from-web-page',
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse body
    const body = await request.json();

    // Validar con Zod
    const validatedData: SubscribeInput = SubscribeSchema.parse(body);

    // Verificar si el usuario ya existe (O(1) lookup)
    try {
      const member = await client.lists.getListMember(
        import.meta.env.MAILCHIMP_LIST_ID,
        validatedData.email
      );

      if (member) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Este correo ya está registrado en nuestra lista',
            status: 409,
          }),
          {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    } catch (error: any) {
      // Error 404 significa que no existe (proceder con registro)
      if (error.status !== 404) {
        throw error;
      }
    }

    // Agregar nuevo suscriptor
    await client.lists.addListMember(
      import.meta.env.MAILCHIMP_LIST_ID,
      {
        email_address: validatedData.email,
        status: 'subscribed',
        tags: [TAGS.SEND_POST_MAIL, TAGS.FROM_WEB_PAGE],
        merge_fields: {
          FNAME: validatedData.name,
        },
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: '¡Registro exitoso! Revisa tu correo para confirmar la suscripción',
        status: 200,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    // Error de validación de Zod
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.errors[0].message,
          errors: error.errors,
          status: 400,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Errores de Mailchimp
    if (error instanceof Error && 'status' in error) {
      const mailchimpError = error as any;
      console.error('Mailchimp error:', mailchimpError);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error al procesar la suscripción. Intenta de nuevo más tarde.',
          status: mailchimpError.status || 500,
        }),
        {
          status: mailchimpError.status || 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Error genérico
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor',
        status: 500,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
```

**Beneficios logrados**:
- ✅ Validación robusta con Zod instalado y configurado
- ✅ Schema de validación con reglas estrictas para email y nombre
- ✅ Sanitización automática con toLowerCase() y trim()
- ✅ Verificación de duplicados optimizada con O(1) lookup usando getListMember()
- ✅ Manejo completo de errores con status codes apropiados
- ✅ Mensajes de error específicos y útiles para el usuario
- ✅ TypeScript type safety con SubscribeInput inferido del schema
- ✅ Configuración de Mailchimp con variable de entorno SERVER_PREFIX

**Validación completada**:
- ✅ Email inválido rechazado con mensaje claro (400 Bad Request)
- ✅ Nombre con números rechazado por regex (400 Bad Request)
- ✅ Email duplicado retorna 409 Conflict con mensaje apropiado
- ✅ Datos válidos procesan correctamente (200 Success)
- ✅ Código compila sin errores TypeScript (astro check)
- ✅ Linter pasa sin errores (eslint)
- ✅ Imports ordenados correctamente

**Dependencias**: Ninguna

---

### Step 5: Agregar Manejo de Errores al Formulario de Suscripción ✅ **COMPLETADO**

**Prioridad**: 🔴 Crítica
**Tiempo estimado**: 4 horas → **Tiempo real**: 3.5 horas
**Estado**: ✅ Completado (2025-11-12)
**Archivos modificados**:
- `src/components/subscribe/index.astro`

**Descripción**:
El formulario de suscripción necesita mostrar estados de carga, éxito y error al usuario.

**Implementación realizada**:

```astro
---
// src/components/subscribe/index.astro
---

<div class="subscribe-container max-w-md mx-auto p-6 bg-gray-900 rounded-lg">
  <h3 class="text-xl font-bold text-white mb-4">Suscríbete al Newsletter</h3>
  <p class="text-gray-400 text-sm mb-6">
    Recibe las últimas publicaciones directamente en tu correo
  </p>

  <form id="subscribe-form" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
        Nombre
      </label>
      <input
        type="text"
        id="name"
        name="name"
        required
        minlength="2"
        maxlength="50"
        class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Tu nombre"
      />
      <p id="name-error" class="text-red-400 text-xs mt-1 hidden"></p>
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        maxlength="100"
        class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="tu@email.com"
      />
      <p id="email-error" class="text-red-400 text-xs mt-1 hidden"></p>
    </div>

    <button
      type="submit"
      id="submit-button"
      class="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span id="button-text">Suscribirme</span>
      <span id="button-loader" class="hidden">
        <svg class="inline animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Procesando...
      </span>
    </button>

    <!-- Mensaje de éxito -->
    <div id="success-message" class="hidden p-4 bg-green-900/20 border border-green-500 rounded-lg">
      <div class="flex items-start">
        <svg class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <div>
          <h4 class="text-sm font-medium text-green-400">¡Éxito!</h4>
          <p id="success-text" class="text-sm text-green-300 mt-1"></p>
        </div>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div id="error-message" class="hidden p-4 bg-red-900/20 border border-red-500 rounded-lg">
      <div class="flex items-start">
        <svg class="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <h4 class="text-sm font-medium text-red-400">Error</h4>
          <p id="error-text" class="text-sm text-red-300 mt-1"></p>
        </div>
      </div>
    </div>
  </form>
</div>

<script>
  const form = document.getElementById('subscribe-form') as HTMLFormElement;
  const nameInput = document.getElementById('name') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
  const buttonText = document.getElementById('button-text') as HTMLSpanElement;
  const buttonLoader = document.getElementById('button-loader') as HTMLSpanElement;
  const successMessage = document.getElementById('success-message') as HTMLDivElement;
  const successText = document.getElementById('success-text') as HTMLParagraphElement;
  const errorMessage = document.getElementById('error-message') as HTMLDivElement;
  const errorText = document.getElementById('error-text') as HTMLParagraphElement;
  const nameError = document.getElementById('name-error') as HTMLParagraphElement;
  const emailError = document.getElementById('email-error') as HTMLParagraphElement;

  // Función para limpiar mensajes
  function clearMessages() {
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    nameError.classList.add('hidden');
    emailError.classList.add('hidden');
    nameError.textContent = '';
    emailError.textContent = '';
  }

  // Función para mostrar estado de carga
  function setLoading(loading: boolean) {
    submitButton.disabled = loading;
    nameInput.disabled = loading;
    emailInput.disabled = loading;

    if (loading) {
      buttonText.classList.add('hidden');
      buttonLoader.classList.remove('hidden');
    } else {
      buttonText.classList.remove('hidden');
      buttonLoader.classList.add('hidden');
    }
  }

  // Función para mostrar éxito
  function showSuccess(message: string) {
    clearMessages();
    successText.textContent = message;
    successMessage.classList.remove('hidden');

    // Limpiar formulario
    form.reset();

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 5000);
  }

  // Función para mostrar error
  function showError(message: string, fieldErrors?: Record<string, string>) {
    clearMessages();
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');

    // Mostrar errores específicos de campo si existen
    if (fieldErrors) {
      if (fieldErrors.name) {
        nameError.textContent = fieldErrors.name;
        nameError.classList.remove('hidden');
        nameInput.classList.add('border-red-500');
      }
      if (fieldErrors.email) {
        emailError.textContent = fieldErrors.email;
        emailError.classList.remove('hidden');
        emailInput.classList.add('border-red-500');
      }
    }
  }

  // Limpiar estilos de error al escribir
  nameInput.addEventListener('input', () => {
    nameInput.classList.remove('border-red-500');
    nameError.classList.add('hidden');
  });

  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('border-red-500');
    emailError.classList.add('hidden');
  });

  // Manejar submit del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearMessages();
    setLoading(true);

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
    };

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess(data.message);
      } else {
        // Procesar errores de validación específicos
        const fieldErrors: Record<string, string> = {};
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err: any) => {
            if (err.path && err.path[0]) {
              fieldErrors[err.path[0]] = err.message;
            }
          });
        }

        showError(data.message || 'Error al procesar la suscripción', fieldErrors);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      showError('Error de conexión. Por favor, verifica tu internet e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  });
</script>
```

**Beneficios logrados**:
- ✅ Estados de UI completos (loading, success, error)
- ✅ Validación HTML5 en campos (required, minlength, maxlength, type)
- ✅ Mensajes de error específicos por campo
- ✅ Errores del API manejados correctamente (400, 409, 200, 500)
- ✅ Feedback visual inmediato (spinners, iconos, colores)
- ✅ Accesibilidad mejorada (labels, disabled states, focus states)
- ✅ Auto-limpieza de formulario después de éxito
- ✅ Auto-ocultación de mensaje de éxito (5 segundos)
- ✅ Limpieza de errores al escribir en campos
- ✅ Tema dark consistente con el sitio
- ✅ TypeScript strict sin errores

**Validación completada**:
- ✅ Envío con datos válidos muestra mensaje de éxito y limpia formulario
- ✅ Email inválido muestra error específico bajo el campo
- ✅ Nombre con números muestra error específico bajo el campo
- ✅ Email duplicado (409) muestra mensaje de error apropiado
- ✅ Error de servidor (500) muestra mensaje genérico
- ✅ Error de conexión capturado y mostrado
- ✅ Botón e inputs deshabilitados durante carga
- ✅ Spinner visible durante procesamiento
- ✅ Errores se limpian al escribir en los campos
- ✅ Mensaje de éxito se auto-oculta después de 5 segundos
- ✅ Código compila sin errores TypeScript
- ✅ Linter pasa sin errores
- ✅ Estilos consistentes con tema dark del sitio

**Dependencias**: Step 4 (API con validación Zod)

---

## Fase 2: Testing y Type Safety (Semana 3-4)

### Step 6: Configurar Infraestructura de Testing

**Prioridad**: 🔴 Crítica
**Tiempo estimado**: 1 día
**Archivos**:
- `package.json`
- `vitest.config.ts` (nuevo)
- `src/test/setup.ts` (nuevo)

**Descripción**:
Configurar Vitest y React Testing Library para testing de componentes y hooks.

**Implementación**:

1. Instalar dependencias:

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

2. Crear configuración de Vitest:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/*',
      ],
    },
  },
});
```

3. Crear archivo de setup:

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

4. Actualizar `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

**Validación**:
- Ejecutar `npm test` → debe iniciar Vitest
- Ejecutar `npm run test:ui` → debe abrir UI de Vitest

**Dependencias**: Ninguna

---

### Step 7: Crear Tests para Hook useAlgoliaSearch

**Prioridad**: 🔴 Crítica
**Tiempo estimado**: 6 horas
**Archivos**:
- `src/layouts/base/components/header/components/use-algolia-search.test.ts` (nuevo)

**Descripción**:
Testear el hook de búsqueda que es crítico para la funcionalidad del sitio.

**Implementación**:

```typescript
// src/layouts/base/components/header/components/use-algolia-search.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAlgoliaSearch } from './use-algolia-search';

// Mock de algoliasearch
vi.mock('algoliasearch', () => ({
  algoliasearch: vi.fn(() => ({
    searchForHits: vi.fn(),
  })),
}));

describe('useAlgoliaSearch', () => {
  const mockAlgoliaConfig = {
    ALGOLIA_APPLICATION_ID: 'test-app-id',
    ALGOLIA_SEARCH_API_KEY: 'test-api-key',
    ALGOLIA_INDEX_NAME: 'test-index',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe inicializar con estado vacío', () => {
    const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe actualizar isSearching durante la búsqueda', async () => {
    const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

    const searchPromise = result.current.search('react');

    expect(result.current.isSearching).toBe(true);

    await searchPromise;

    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });
  });

  it('debe retornar resultados exitosos', async () => {
    const mockResults = [
      {
        objectID: '1',
        title: 'Test Article',
        slug: 'test-article',
        description: 'Test description',
      },
    ];

    const mockSearch = vi.fn().mockResolvedValue({
      results: [{ hits: mockResults }],
    });

    vi.mocked(algoliasearch).mockReturnValue({
      searchForHits: mockSearch,
    } as any);

    const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

    await result.current.search('test');

    await waitFor(() => {
      expect(result.current.searchResults).toEqual(mockResults);
      expect(result.current.error).toBeNull();
    });
  });

  it('debe manejar errores de búsqueda', async () => {
    const mockError = new Error('Network error');
    const mockSearch = vi.fn().mockRejectedValue(mockError);

    vi.mocked(algoliasearch).mockReturnValue({
      searchForHits: mockSearch,
    } as any);

    const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

    await result.current.search('test');

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
      expect(result.current.searchResults).toEqual([]);
    });
  });

  it('debe limpiar búsqueda correctamente', async () => {
    const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

    // Simular búsqueda con resultados
    await result.current.search('test');

    // Limpiar
    result.current.clearSearch();

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isSearching).toBe(false);
  });

  it('debe lanzar error si la configuración es inválida', async () => {
    const { result } = renderHook(() => useAlgoliaSearch(undefined));

    await result.current.search('test');

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.searchResults).toEqual([]);
    });
  });

  it('debe retornar array vacío con query vacía', async () => {
    const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

    const hasResults = await result.current.search('   ');

    expect(hasResults).toBe(false);
    expect(result.current.searchResults).toEqual([]);
  });
});
```

**Validación**:
- Ejecutar `npm test use-algolia-search` → todos los tests deben pasar
- Coverage del hook debe ser > 80%

**Dependencias**: Step 6 (infraestructura de testing), Step 3 (hook con estados de error)

---

### Step 8: Mejorar Definiciones de TypeScript

**Prioridad**: 🟠 Alta
**Tiempo estimado**: 4 horas
**Archivos**:
- `src/interfaces/index.ts`
- `src/layouts/base/components/header/components/types.ts` (nuevo)

**Descripción**:
Eliminar tipos `any` y crear definiciones de tipos más estrictas.

**Implementación**:

1. Actualizar interfaces principales:

```typescript
// src/interfaces/index.ts
interface Section {
  title: string;
  anchor: string;
}

// Tipos de categorías permitidos
export type CategoryAllowed =
  | "web-development"
  | "javascript"
  | "react"
  | "vue"
  | "astro"
  | "node"
  | "express"
  | "sql"
  | "no-sql";

export interface Article {
  title: string;
  slug: string;
  description: string;
  date: string;
  categories: CategoryAllowed[];
  seo_image: string;
  sections: Section[];
}

// Definición estricta de headings
export interface Heading {
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  slug: string;
}

export interface ArticleLayout {
  file: string;
  url: string | undefined;
  content: Article;
  frontmatter: Article;
  headings: Heading[]; // ✅ Ya no es 'any[]'
}

// Tipos para configuración de site
export interface SocialNetwork {
  name: string;
  link: string;
  show: boolean;
}

export interface Contact {
  name: string;
  href: string;
  show: boolean;
}

export interface SiteConfig {
  title: string;
  description: string;
  keywords: string;
  url: string;
  repo_url: string;
  domain: string;
  languaje: string;
  email: string;
  author: {
    name: string;
  };
  social_network: SocialNetwork[];
  contacts: Contact[];
}
```

2. Crear tipos específicos para búsqueda:

```typescript
// src/layouts/base/components/header/components/types.ts
export interface AlgoliaConfig {
  ALGOLIA_APPLICATION_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  ALGOLIA_INDEX_NAME: string;
}

export interface SearchResult {
  objectID: string;
  title: string;
  slug: string;
  description: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  image: string;
  categories?: string[];
}

export interface SearchState {
  results: SearchResult[];
  isSearching: boolean;
  error: string | null;
  query: string;
}

export interface UseAlgoliaSearchReturn {
  searchResults: SearchResult[];
  search: (query: string) => Promise<boolean>;
  isSearching: boolean;
  error: string | null;
  clearSearch: () => void;
}
```

3. Actualizar regla de ESLint:

```javascript
// .eslintrc.cjs
module.exports = {
  // ... configuración existente
  rules: {
    // ... reglas existentes
    '@typescript-eslint/no-explicit-any': 'error', // ✅ Cambiar de 'off' a 'error'
    '@typescript-eslint/consistent-type-imports': ['error', {
      prefer: 'type-imports',
      fixStyle: 'separate-type-imports'
    }],
  },
};
```

**Validación**:
- Ejecutar `npm run lint` → no debe haber errores de tipos `any`
- Ejecutar `astro check` → no debe haber errores de tipos

**Dependencias**: Ninguna

---

### Step 9: Crear Tests para Utility Functions

**Prioridad**: 🟠 Alta
**Tiempo estimado**: 4 horas
**Archivos**:
- `src/utils/articles.test.ts` (nuevo)
- `src/utils/reading-time.test.ts` (nuevo)
- `src/utils/date.test.ts` (nuevo)

**Descripción**:
Testear funciones utilitarias que son la base de la aplicación. Objetivo: 100% de cobertura.

**Implementación**:

```typescript
// src/utils/articles.test.ts
import { describe, it, expect } from 'vitest';
import { articlesSort, githubArticlePath } from './articles';

describe('articlesSort', () => {
  it('debe ordenar artículos por fecha descendente', () => {
    const articles = [
      { frontmatter: { date: '2021-01-01' } },
      { frontmatter: { date: '2023-01-01' } },
      { frontmatter: { date: '2022-01-01' } },
    ];

    const sorted = [...articles].sort(articlesSort);

    expect(sorted[0].frontmatter.date).toBe('2023-01-01');
    expect(sorted[1].frontmatter.date).toBe('2022-01-01');
    expect(sorted[2].frontmatter.date).toBe('2021-01-01');
  });

  it('debe manejar fechas iguales', () => {
    const articles = [
      { frontmatter: { date: '2021-01-01' } },
      { frontmatter: { date: '2021-01-01' } },
    ];

    const sorted = [...articles].sort(articlesSort);

    expect(sorted).toHaveLength(2);
  });

  it('debe manejar array vacío', () => {
    const articles: any[] = [];
    const sorted = [...articles].sort(articlesSort);

    expect(sorted).toEqual([]);
  });
});

describe('githubArticlePath', () => {
  it('debe generar URL correcta de GitHub', () => {
    const result = githubArticlePath('mi-articulo');

    expect(result).toContain('github.com');
    expect(result).toContain('edit/main');
    expect(result).toContain('mi-articulo.mdx');
  });

  it('debe manejar slugs con caracteres especiales', () => {
    const result = githubArticlePath('artículo-con-tildes');

    expect(result).toContain('artículo-con-tildes.mdx');
  });
});
```

```typescript
// src/utils/reading-time.test.ts
import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from './reading-time';

describe('calculateReadingTime', () => {
  it('debe calcular tiempo de lectura correctamente', () => {
    const text = 'word '.repeat(200); // 200 palabras
    const result = calculateReadingTime(text);

    expect(result).toBe(1); // 200 palabras / 200 wpm = 1 minuto
  });

  it('debe redondear hacia arriba', () => {
    const text = 'word '.repeat(250); // 250 palabras
    const result = calculateReadingTime(text);

    expect(result).toBe(2); // 250 / 200 = 1.25 → 2 minutos
  });

  it('debe retornar al menos 1 minuto', () => {
    const text = 'short text';
    const result = calculateReadingTime(text);

    expect(result).toBeGreaterThanOrEqual(1);
  });

  it('debe manejar string vacío', () => {
    const result = calculateReadingTime('');

    expect(result).toBe(1);
  });

  it('debe ignorar HTML tags', () => {
    const text = '<p>' + 'word '.repeat(200) + '</p>';
    const result = calculateReadingTime(text);

    expect(result).toBe(1);
  });
});
```

**Validación**:
- Ejecutar `npm run test:coverage` → cobertura de utils debe ser 100%

**Dependencias**: Step 6 (infraestructura de testing)

---

## Fase 3: Performance y Optimización (Semana 5-6)

### Step 10: Optimizar Componente de Imágenes

**Prioridad**: 🟠 Alta
**Tiempo estimado**: 1 día
**Archivos**:
- `src/components/article/index.astro`
- `src/layouts/article/components/head.astro`

**Descripción**:
Implementar imágenes responsive con múltiples formatos y tamaños para mejorar Core Web Vitals.

**Implementación**:

```astro
---
// src/components/article/index.astro
import { Image } from 'astro:assets';
import type { Article } from '../../interfaces';

interface Props {
  article: Article;
}

const { article } = Astro.props;

// Importar imagen si está en assets (para optimización)
// Si está en public, se servirá directamente
const imageUrl = article.seo_image;
const isLocalImage = !imageUrl.startsWith('http');
---

<article class="group">
  <a href={`/articulos/${article.slug}`} class="block">
    <div class="relative overflow-hidden rounded-lg aspect-video bg-gray-800">
      {isLocalImage ? (
        <Image
          src={imageUrl}
          alt={article.title}
          width={640}
          height={360}
          widths={[320, 640, 1024]}
          sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1024px"
          formats={['avif', 'webp', 'jpg']}
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <img
          src={imageUrl}
          alt={article.title}
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
    </div>

    <div class="mt-4">
      <h2 class="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
        {article.title}
      </h2>

      <p class="mt-2 text-gray-400 text-sm line-clamp-2">
        {article.description}
      </p>

      <div class="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <time datetime={article.date}>
          {new Date(article.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>

        <div class="flex gap-2">
          {article.categories.slice(0, 2).map((category) => (
            <span class="px-2 py-1 bg-gray-800 rounded text-primary-400">
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  </a>
</article>
```

**Validación**:
- Inspeccionar elemento → debe ver múltiples formatos (avif, webp)
- Lighthouse → LCP debe mejorar
- Network → imágenes deben cargar en formato moderno

**Dependencias**: Ninguna

---

### Step 11: Implementar Validación de Variables de Entorno

**Prioridad**: 🟡 Media
**Tiempo estimado**: 4 horas
**Archivos**:
- `src/utils/env.ts` (nuevo)
- `astro.config.mjs`
- `.env.template`

**Descripción**:
Crear validación centralizada de variables de entorno usando Zod para fail-fast en startup.

**Implementación**:

```typescript
// src/utils/env.ts
import { z } from 'zod';

// Schema para variables públicas (client-side)
const PublicEnvSchema = z.object({
  PUBLIC_ALGOLIA_APPLICATION_ID: z.string().min(1, 'Algolia Application ID requerido'),
  PUBLIC_ALGOLIA_SEARCH_API_KEY: z.string().min(1, 'Algolia Search API Key requerido'),
  PUBLIC_ALGOLIA_INDEX_NAME: z.string().min(1, 'Algolia Index Name requerido'),
  PUBLIC_GISCUS_REPO: z.string().min(1, 'Giscus Repo requerido'),
  PUBLIC_GISCUS_REPO_ID: z.string().min(1, 'Giscus Repo ID requerido'),
  PUBLIC_GISCUS_CATEGORY_ID: z.string().min(1, 'Giscus Category ID requerido'),
});

// Schema para variables privadas (server-side only)
const PrivateEnvSchema = z.object({
  ALGOLIA_ADMIN_API_KEY: z.string().min(1, 'Algolia Admin API Key requerido'),
  MAILCHIMP_API_KEY: z.string().min(1, 'Mailchimp API Key requerido'),
  MAILCHIMP_LIST_ID: z.string().min(1, 'Mailchimp List ID requerido'),
  MAILCHIMP_SERVER_PREFIX: z.string().min(1, 'Mailchimp Server Prefix requerido'),
});

// Tipos inferidos
export type PublicEnv = z.infer<typeof PublicEnvSchema>;
export type PrivateEnv = z.infer<typeof PrivateEnvSchema>;
export type Env = PublicEnv & PrivateEnv;

/**
 * Valida variables de entorno públicas
 * Puede ser llamado desde el cliente
 */
export function validatePublicEnv(): PublicEnv {
  const result = PublicEnvSchema.safeParse(import.meta.env);

  if (!result.success) {
    console.error('❌ Variables de entorno públicas inválidas:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error('Validación de environment público falló');
  }

  return result.data;
}

/**
 * Valida variables de entorno privadas
 * Solo debe ser llamado en el servidor
 */
export function validatePrivateEnv(): PrivateEnv {
  if (typeof process === 'undefined') {
    throw new Error('validatePrivateEnv() solo puede ser llamado en el servidor');
  }

  const result = PrivateEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Variables de entorno privadas inválidas:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error('Validación de environment privado falló');
  }

  return result.data;
}

/**
 * Valida todas las variables de entorno
 * Solo debe ser llamado en el servidor (build time, API routes)
 */
export function validateEnv(): Env {
  const publicEnv = validatePublicEnv();
  const privateEnv = validatePrivateEnv();

  return { ...publicEnv, ...privateEnv };
}

/**
 * Helper para obtener env validado con type safety
 */
export function getEnv<T extends keyof Env>(key: T): Env[T] {
  const env = validateEnv();
  return env[key];
}
```

Actualizar `.env.template`:

```bash
# .env.template

# ===================================
# Variables Públicas (Client-side)
# ===================================
# Estas variables serán incluidas en el bundle del cliente
# Prefijo PUBLIC_ es obligatorio

# Algolia Search (Solo lectura)
PUBLIC_ALGOLIA_APPLICATION_ID=your_application_id
PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_only_api_key
PUBLIC_ALGOLIA_INDEX_NAME=your_index_name

# Giscus Comments
PUBLIC_GISCUS_REPO=owner/repo
PUBLIC_GISCUS_REPO_ID=your_repo_id
PUBLIC_GISCUS_CATEGORY_ID=your_category_id

# ===================================
# Variables Privadas (Server-side)
# ===================================
# Estas variables NUNCA se incluyen en el bundle del cliente
# Se usan solo en tiempo de build y en API routes

# Algolia Admin (Para indexar en build time)
ALGOLIA_ADMIN_API_KEY=your_admin_api_key

# Mailchimp
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_LIST_ID=your_list_id
MAILCHIMP_SERVER_PREFIX=us1

# ===================================
# Notas de Seguridad
# ===================================
# - Nunca commitear este archivo con valores reales
# - Las variables PUBLIC_ son visibles en el cliente
# - Las variables sin PUBLIC_ son solo server-side
# - Obtén las keys de Algolia en: https://www.algolia.com/account/api-keys
# - Obtén las keys de Mailchimp en: https://admin.mailchimp.com/account/api/
# - Obtén los IDs de Giscus en: https://giscus.app/
```

Usar en `astro.config.mjs`:

```javascript
// astro.config.mjs
import { validateEnv } from './src/utils/env.ts';

// Validar al iniciar (fail fast)
try {
  validateEnv();
  console.log('✅ Variables de entorno validadas correctamente');
} catch (error) {
  console.error('❌ Error en validación de environment:');
  console.error(error);
  process.exit(1);
}

export default defineConfig({
  // ... resto de la configuración
});
```

**Validación**:
- Remover una variable → debe fallar en startup con mensaje claro
- Todas las variables presentes → debe iniciar correctamente

**Dependencias**: Step 4 (Zod instalado)

---

### Step 12: Agregar Rate Limiting a API Endpoints

**Prioridad**: 🟡 Media
**Tiempo estimado**: 4 horas
**Archivos**:
- `vercel.json` (nuevo)
- `src/middleware/rate-limit.ts` (nuevo)

**Descripción**:
Implementar rate limiting usando Vercel Edge Config para prevenir abuso de APIs.

**Implementación**:

```json
// vercel.json
{
  "functions": {
    "src/pages/api/subscribe.ts": {
      "maxDuration": 10,
      "memory": 1024
    },
    "src/pages/api/create-new-post.ts": {
      "maxDuration": 10,
      "memory": 1024
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [],
  "redirects": []
}
```

Crear middleware de rate limiting:

```typescript
// src/middleware/rate-limit.ts
interface RateLimitConfig {
  windowMs: number;  // Ventana de tiempo en ms
  maxRequests: number;  // Máximo de requests en la ventana
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Simple in-memory store (en producción usar Redis/Vercel KV)
const store = new Map<string, RateLimitEntry>();

/**
 * Rate limiter simple basado en IP
 * En producción, considera usar Vercel KV o Redis para persistencia
 */
export function rateLimit(config: RateLimitConfig) {
  return (request: Request): Response | null => {
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const now = Date.now();
    const entry = store.get(ip);

    // Limpiar entradas antiguas cada 100 requests
    if (store.size > 100) {
      for (const [key, value] of store.entries()) {
        if (value.resetTime < now) {
          store.delete(key);
        }
      }
    }

    if (!entry || entry.resetTime < now) {
      // Primera request o ventana expirada
      store.set(ip, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return null; // Permitir request
    }

    if (entry.count >= config.maxRequests) {
      // Rate limit excedido
      const resetIn = Math.ceil((entry.resetTime - now) / 1000);

      return new Response(
        JSON.stringify({
          success: false,
          message: `Demasiadas solicitudes. Intenta de nuevo en ${resetIn} segundos.`,
          status: 429,
          retryAfter: resetIn,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': resetIn.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
          },
        }
      );
    }

    // Incrementar contador
    entry.count++;
    store.set(ip, entry);

    return null; // Permitir request
  };
}
```

Usar en API:

```typescript
// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { rateLimit } from '../../middleware/rate-limit';

// Configurar rate limiter: 5 requests cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 5,
});

export const POST: APIRoute = async ({ request }) => {
  // Aplicar rate limiting
  const rateLimitResponse = limiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // ... resto del código de suscripción
};
```

**Validación**:
- Hacer 6 requests en 15 min → la sexta debe retornar 429
- Esperar 15 min → debe permitir nuevas requests
- Headers de rate limit deben estar presentes

**Dependencias**: Ninguna

---

## Fase 4: Accesibilidad y UX (Semana 7)

### Step 13: Agregar Skip Navigation Links

**Prioridad**: 🟢 Baja
**Tiempo estimado**: 2 horas
**Archivos**:
- `src/layouts/base/index.astro`
- `src/assets/styles/base.css`

**Descripción**:
Agregar enlaces de "Skip to content" para mejorar navegación por teclado.

**Implementación**:

```astro
---
// src/layouts/base/index.astro
import "../../assets/styles/base.css";
import { ClientRouter } from "astro:transitions";
import BaseHead from "./components/head.astro";
import Footer from "./components/footer/index.astro";
import Header from "./components/header/index.astro";
import ScrollingProgressBar from "../../components/scrolling-progress-bar/index";

const algolia = {
  ALGOLIA_SEARCH_API_KEY: import.meta.env.PUBLIC_ALGOLIA_SEARCH_API_KEY,
  ALGOLIA_APPLICATION_ID: import.meta.env.PUBLIC_ALGOLIA_APPLICATION_ID,
  ALGOLIA_INDEX_NAME: import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME,
} as const;

const { seo } = Astro.props;
---

<html lang="es">
  <BaseHead {...seo} />

  <ClientRouter />

  <body class="antialiased bg-black/95 text-white">
    <!-- Skip Navigation Links -->
    <a
      href="#main-content"
      class="skip-to-content"
    >
      Saltar al contenido principal
    </a>

    <ScrollingProgressBar client:visible />

    <section class="mx-auto max-w-3xl lg:max-w-5xl xl:max-w-7xl px-4 sm:px-6 xl:px-0">
      <div class="flex flex-col justify-between font-sans">
        <Header algolia={algolia} />

        <main id="main-content" tabindex="-1" class="mb-auto focus:outline-none">
          <slot />
        </main>

        <Footer />
      </div>
    </section>
  </body>
</html>
```

Agregar estilos:

```css
/* src/assets/styles/base.css */

/* Skip to content link - solo visible con teclado */
.skip-to-content {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 9999;
  padding: 1rem 1.5rem;
  background-color: rgb(59, 130, 246); /* primary-600 */
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0 0 0.5rem 0;
  transition: top 0.3s;
}

.skip-to-content:focus {
  top: 0;
  outline: 3px solid rgb(147, 197, 253); /* primary-300 */
  outline-offset: 2px;
}

/* Mejorar focus visible en toda la aplicación */
*:focus-visible {
  outline: 2px solid rgb(59, 130, 246);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Asegurar que los botones tengan focus visible */
button:focus-visible,
a:focus-visible {
  outline: 2px solid rgb(59, 130, 246);
  outline-offset: 2px;
}
```

**Validación**:
- Presionar Tab al cargar página → debe aparecer "Saltar al contenido"
- Presionar Enter → debe saltar al contenido principal
- Navegar con teclado → todos los elementos interactivos deben ser accesibles

**Dependencias**: Ninguna

---

### Step 14: Mejorar Navegación por Teclado en Search

**Prioridad**: 🟢 Baja
**Tiempo estimado**: 4 horas
**Archivos**:
- `src/layouts/base/components/header/components/navigation.tsx`
- `src/layouts/base/components/header/components/search-results.tsx`

**Descripción**:
Mejorar la navegación por teclado y anuncios para lectores de pantalla en el componente de búsqueda.

**Implementación**:

```typescript
// src/layouts/base/components/header/components/navigation.tsx
import { useState, useRef, useEffect } from 'react';
import { useAlgoliaSearch } from './use-algolia-search';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';
import type { AlgoliaConfig } from './types';

interface NavigationProps {
  algolia: AlgoliaConfig;
}

export const Navigation = ({ algolia }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { searchResults, search, isSearching, error } = useAlgoliaSearch(algolia);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Manejar búsqueda
  const handleSearch = async (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      await search(value);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          const result = searchResults[selectedIndex];
          window.location.href = `/articulos/${result.slug}`;
        }
        break;
    }
  };

  // Scroll del elemento seleccionado
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleSelect = (slug: string) => {
    window.location.href = `/articulos/${slug}`;
  };

  return (
    <div ref={containerRef} className="relative" role="search">
      <SearchInput
        ref={inputRef}
        value={query}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        placeholder="Buscar artículos..."
        aria-label="Buscar artículos"
        aria-expanded={isOpen}
        aria-controls="search-results"
        aria-activedescendant={
          selectedIndex >= 0 ? `result-${selectedIndex}` : undefined
        }
      />

      {/* Live region para lectores de pantalla */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isSearching && 'Buscando...'}
        {!isSearching && searchResults.length > 0 && (
          `${searchResults.length} resultado${searchResults.length !== 1 ? 's' : ''} encontrado${searchResults.length !== 1 ? 's' : ''}`
        )}
        {!isSearching && query && searchResults.length === 0 && !error && (
          'No se encontraron resultados'
        )}
        {error && `Error: ${error}`}
      </div>

      {isOpen && (
        <div
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto"
          role="listbox"
          aria-label="Resultados de búsqueda"
        >
          <SearchResults
            ref={resultsRef}
            results={searchResults}
            isSearching={isSearching}
            error={error}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
};
```

Actualizar SearchResults:

```typescript
// src/layouts/base/components/header/components/search-results.tsx
import { forwardRef } from 'react';
import type { SearchResult } from './types';

interface SearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
  error: string | null;
  selectedIndex: number;
  onSelect: (slug: string) => void;
}

export const SearchResults = forwardRef<HTMLUListElement, SearchResultsProps>(
  ({ results, isSearching, error, selectedIndex, onSelect }, ref) => {
    if (isSearching) {
      return (
        <div className="p-4 text-center" role="status" aria-live="polite">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500" />
          <p className="text-sm text-gray-400 mt-2">Buscando...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 border-l-4 border-red-500 bg-red-900/20" role="alert">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-red-500 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-400">Error de búsqueda</h3>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="p-4 text-center text-gray-400" role="status">
          <p>No se encontraron resultados</p>
        </div>
      );
    }

    return (
      <ul ref={ref} className="divide-y divide-gray-700">
        {results.map((result, index) => (
          <li
            key={result.objectID}
            id={`result-${index}`}
            role="option"
            aria-selected={index === selectedIndex}
          >
            <button
              onClick={() => onSelect(result.slug)}
              className={`
                w-full px-4 py-3 text-left transition-colors
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
                ${index === selectedIndex ? 'bg-gray-800' : 'hover:bg-gray-800'}
              `}
              tabIndex={-1}
            >
              <h3 className="text-sm font-medium text-white">{result.title}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {result.description}
              </p>
            </button>
          </li>
        ))}
      </ul>
    );
  }
);

SearchResults.displayName = 'SearchResults';
```

**Validación**:
- Usar lector de pantalla → debe anunciar cantidad de resultados
- Navegar con flechas → debe mover selección visualmente
- Presionar Enter en resultado → debe navegar al artículo

**Dependencias**: Step 3 (hook con error states)

---

### Step 15: Auditoría de Contraste de Colores

**Prioridad**: 🟢 Baja
**Tiempo estimado**: 3 horas
**Archivos**:
- `tailwind.config.cjs`
- Varios componentes con texto

**Descripción**:
Verificar y corregir ratios de contraste para cumplir con WCAG 2.1 AA.

**Implementación**:

1. Instalar herramienta de auditoría:

```bash
npm install -D @axe-core/cli
```

2. Agregar script a package.json:

```json
{
  "scripts": {
    "a11y:audit": "axe http://localhost:4321 --exit"
  }
}
```

3. Actualizar colores en Tailwind si es necesario:

```javascript
// tailwind.config.cjs
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Asegurar contraste 4.5:1 con bg-black/95
          400: '#60a5fa', // Ajustar si falla contraste
          500: '#3b82f6',
          600: '#2563eb',
        },
        gray: {
          300: '#d1d5db', // Para texto normal (4.5:1)
          400: '#9ca3af', // Para texto secundario (4.5:1)
          500: '#6b7280', // Para elementos deshabilitados
        }
      }
    }
  }
}
```

4. Checklist de correcciones comunes:

```markdown
# Checklist de Contraste

## Textos
- [ ] Texto principal (text-white) sobre bg-black/95: ✅ 21:1
- [ ] Texto secundario (text-gray-400) sobre bg-black/95: Verificar ≥ 4.5:1
- [ ] Enlaces (text-primary-400) sobre bg-black/95: Verificar ≥ 4.5:1
- [ ] Botones primarios: text-white sobre bg-primary-600: Verificar ≥ 4.5:1

## Estados Interactivos
- [ ] Hover states deben mantener contraste
- [ ] Focus states deben ser claramente visibles (outline: 2px)
- [ ] Disabled states pueden tener menor contraste (3:1)

## Íconos
- [ ] Íconos informativos: ≥ 3:1
- [ ] Íconos decorativos: No aplica (usar aria-hidden="true")
```

**Validación**:
- Ejecutar `npm run a11y:audit` → debe pasar todas las pruebas
- Usar herramienta manual: https://webaim.org/resources/contrastchecker/
- Lighthouse accessibility score debe ser > 90

**Dependencias**: Ninguna

---

### Step 16: Crear Utilidad para Respuestas de API

**Prioridad**: 🟢 Baja
**Tiempo estimado**: 2 horas
**Archivos**:
- `src/utils/api-response.ts` (nuevo)
- `src/pages/api/subscribe.ts`
- `src/pages/api/create-new-post.ts`

**Descripción**:
Reducir duplicación de código en respuestas de API.

**Implementación**:

```typescript
// src/utils/api-response.ts

export interface ApiSuccessResponse<T = any> {
  success: true;
  data?: T;
  message: string;
  status: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
  status: number;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Utilidad para crear respuestas de API consistentes
 */
export class ApiResponseBuilder {
  /**
   * Respuesta JSON genérica
   */
  static json(body: ApiResponse, status: number): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Respuesta de éxito (200)
   */
  static success<T = any>(message: string, data?: T): Response {
    return ApiResponseBuilder.json(
      {
        success: true,
        message,
        data,
        status: 200,
      },
      200
    );
  }

  /**
   * Recurso creado (201)
   */
  static created<T = any>(message: string, data?: T): Response {
    return ApiResponseBuilder.json(
      {
        success: true,
        message,
        data,
        status: 201,
      },
      201
    );
  }

  /**
   * Sin contenido (204)
   */
  static noContent(): Response {
    return new Response(null, { status: 204 });
  }

  /**
   * Bad request (400)
   */
  static badRequest(
    message: string,
    errors?: Array<{ field?: string; message: string }>
  ): Response {
    return ApiResponseBuilder.json(
      {
        success: false,
        message,
        errors,
        status: 400,
      },
      400
    );
  }

  /**
   * No autorizado (401)
   */
  static unauthorized(message: string = 'No autorizado'): Response {
    return ApiResponseBuilder.json(
      {
        success: false,
        message,
        status: 401,
      },
      401
    );
  }

  /**
   * Prohibido (403)
   */
  static forbidden(message: string = 'Acceso prohibido'): Response {
    return ApiResponseBuilder.json(
      {
        success: false,
        message,
        status: 403,
      },
      403
    );
  }

  /**
   * No encontrado (404)
   */
  static notFound(message: string = 'Recurso no encontrado'): Response {
    return ApiResponseBuilder.json(
      {
        success: false,
        message,
        status: 404,
      },
      404
    );
  }

  /**
   * Conflicto (409)
   */
  static conflict(message: string): Response {
    return ApiResponseBuilder.json(
      {
        success: false,
        message,
        status: 409,
      },
      409
    );
  }

  /**
   * Rate limit excedido (429)
   */
  static tooManyRequests(
    message: string = 'Demasiadas solicitudes',
    retryAfter?: number
  ): Response {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (retryAfter) {
      headers['Retry-After'] = retryAfter.toString();
    }

    return new Response(
      JSON.stringify({
        success: false,
        message,
        status: 429,
      }),
      {
        status: 429,
        headers,
      }
    );
  }

  /**
   * Error interno del servidor (500)
   */
  static internalError(
    message: string = 'Error interno del servidor'
  ): Response {
    return ApiResponseBuilder.json(
      {
        success: false,
        message,
        status: 500,
      },
      500
    );
  }
}
```

Refactorizar API usando la utilidad:

```typescript
// src/pages/api/subscribe.ts (refactorizado)
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { ApiResponseBuilder } from '../../utils/api-response';

// ... schemas y configuración ...

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validatedData = SubscribeSchema.parse(body);

    // Verificar si existe
    try {
      const member = await client.lists.getListMember(
        import.meta.env.MAILCHIMP_LIST_ID,
        validatedData.email
      );

      if (member) {
        return ApiResponseBuilder.conflict(
          'Este correo ya está registrado en nuestra lista'
        );
      }
    } catch (error: any) {
      if (error.status !== 404) throw error;
    }

    // Agregar suscriptor
    await client.lists.addListMember(
      import.meta.env.MAILCHIMP_LIST_ID,
      {
        email_address: validatedData.email,
        status: 'subscribed',
        tags: [TAGS.SEND_POST_MAIL, TAGS.FROM_WEB_PAGE],
        merge_fields: { FNAME: validatedData.name },
      }
    );

    return ApiResponseBuilder.success(
      '¡Registro exitoso! Revisa tu correo para confirmar la suscripción'
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponseBuilder.badRequest(
        'Datos inválidos',
        error.errors.map(err => ({
          field: err.path[0]?.toString(),
          message: err.message,
        }))
      );
    }

    console.error('Subscription error:', error);
    return ApiResponseBuilder.internalError(
      'Error al procesar la suscripción. Intenta de nuevo más tarde.'
    );
  }
};
```

**Validación**:
- Refactorizar ambos endpoints
- Verificar que todas las respuestas mantengan el formato consistente

**Dependencias**: Ninguna

---

### Step 17: Agregar Tests E2E para Flujo Crítico

**Prioridad**: 🟡 Media
**Tiempo estimado**: 1 día
**Archivos**:
- `playwright.config.ts` (nuevo)
- `tests/e2e/subscribe.spec.ts` (nuevo)
- `tests/e2e/search.spec.ts` (nuevo)

**Descripción**:
Crear tests E2E para los flujos críticos: búsqueda y suscripción.

**Implementación**:

1. Instalar Playwright:

```bash
npm install -D @playwright/test
npx playwright install
```

2. Configurar Playwright:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

3. Test de búsqueda:

```typescript
// tests/e2e/search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe mostrar input de búsqueda', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /buscar/i });
    await expect(searchInput).toBeVisible();
  });

  test('debe buscar y mostrar resultados', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /buscar/i });

    await searchInput.fill('react');
    await page.waitForTimeout(1000); // Esperar debounce

    const results = page.getByRole('listbox', { name: /resultados/i });
    await expect(results).toBeVisible();

    const firstResult = page.getByRole('option').first();
    await expect(firstResult).toBeVisible();
  });

  test('debe navegar con teclado', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /buscar/i });

    await searchInput.fill('javascript');
    await page.waitForTimeout(1000);

    // Navegar con flecha abajo
    await searchInput.press('ArrowDown');
    await searchInput.press('ArrowDown');

    // El segundo resultado debe estar seleccionado
    const selectedResult = page.getByRole('option', { selected: true });
    await expect(selectedResult).toBeVisible();
  });

  test('debe cerrar con Escape', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /buscar/i });

    await searchInput.fill('vue');
    await page.waitForTimeout(1000);

    const results = page.getByRole('listbox');
    await expect(results).toBeVisible();

    await searchInput.press('Escape');
    await expect(results).not.toBeVisible();
  });

  test('debe mostrar error con query inválida', async ({ page }) => {
    // Desconectar network
    await page.route('**/*', route => route.abort());

    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('test');
    await page.waitForTimeout(1000);

    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/error/i);
  });
});
```

4. Test de suscripción:

```typescript
// tests/e2e/subscribe.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Newsletter Subscription', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Scroll al formulario
    await page.getByRole('heading', { name: /suscríbete/i }).scrollIntoViewIfNeeded();
  });

  test('debe mostrar formulario de suscripción', async ({ page }) => {
    const form = page.locator('#subscribe-form');
    await expect(form).toBeVisible();

    const nameInput = page.getByLabel(/nombre/i);
    const emailInput = page.getByLabel(/email/i);
    const submitButton = page.getByRole('button', { name: /suscribirme/i });

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('debe validar campos requeridos', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /suscribirme/i });
    await submitButton.click();

    // Validación HTML5 debe prevenir submit
    const nameInput = page.getByLabel(/nombre/i);
    await expect(nameInput).toHaveAttribute('required');
  });

  test('debe validar formato de email', async ({ page }) => {
    const nameInput = page.getByLabel(/nombre/i);
    const emailInput = page.getByLabel(/email/i);
    const submitButton = page.getByRole('button', { name: /suscribirme/i });

    await nameInput.fill('Test User');
    await emailInput.fill('invalid-email');
    await submitButton.click();

    // Validación HTML5 de email
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('debe suscribirse exitosamente', async ({ page }) => {
    // Mock de API response exitosa
    await page.route('**/api/subscribe', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Registro exitoso',
        }),
      });
    });

    const nameInput = page.getByLabel(/nombre/i);
    const emailInput = page.getByLabel(/email/i);
    const submitButton = page.getByRole('button', { name: /suscribirme/i });

    await nameInput.fill('Test User');
    await emailInput.fill('test@example.com');
    await submitButton.click();

    // Esperar mensaje de éxito
    const successMessage = page.getByText(/registro exitoso/i);
    await expect(successMessage).toBeVisible();

    // Formulario debe limpiarse
    await expect(nameInput).toHaveValue('');
    await expect(emailInput).toHaveValue('');
  });

  test('debe mostrar error de email duplicado', async ({ page }) => {
    await page.route('**/api/subscribe', async route => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Este correo ya está registrado',
        }),
      });
    });

    const nameInput = page.getByLabel(/nombre/i);
    const emailInput = page.getByLabel(/email/i);
    const submitButton = page.getByRole('button', { name: /suscribirme/i });

    await nameInput.fill('Test User');
    await emailInput.fill('existing@example.com');
    await submitButton.click();

    const errorMessage = page.getByText(/ya está registrado/i);
    await expect(errorMessage).toBeVisible();
  });

  test('debe deshabilitar botón durante loading', async ({ page }) => {
    await page.route('**/api/subscribe', async route => {
      // Delay de 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'OK' }),
      });
    });

    const nameInput = page.getByLabel(/nombre/i);
    const emailInput = page.getByLabel(/email/i);
    const submitButton = page.getByRole('button', { name: /suscribirme/i });

    await nameInput.fill('Test User');
    await emailInput.fill('test@example.com');
    await submitButton.click();

    // Botón debe estar deshabilitado
    await expect(submitButton).toBeDisabled();

    // Texto de loading debe estar visible
    await expect(page.getByText(/procesando/i)).toBeVisible();
  });
});
```

5. Actualizar package.json:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

**Validación**:
- Ejecutar `npm run test:e2e` → todos los tests deben pasar
- Tests deben cubrir happy path y edge cases

**Dependencias**: Steps 4 y 5 (API y formulario implementados)

---

### Step 18: Crear Documentación de Componentes

**Prioridad**: 🟢 Baja
**Tiempo estimado**: 4 horas
**Archivos**:
- Varios archivos de componentes (agregar JSDoc)

**Descripción**:
Agregar JSDoc a los componentes principales para mejorar DX.

**Implementación**:

```typescript
// Ejemplo: src/layouts/base/components/header/components/use-algolia-search.ts

import { useState, useRef, useCallback } from 'react';
import { algoliasearch } from 'algoliasearch';
import type { SearchResult, AlgoliaConfig, UseAlgoliaSearchReturn } from './types';

/**
 * Hook personalizado para búsqueda con Algolia
 *
 * Proporciona funcionalidad de búsqueda con gestión de estado,
 * manejo de errores y loading states.
 *
 * @param algolia - Configuración de Algolia (API keys, index name)
 * @returns Objeto con resultados, funciones de búsqueda y estados
 *
 * @example
 * ```tsx
 * const { searchResults, search, isSearching, error } = useAlgoliaSearch({
 *   ALGOLIA_APPLICATION_ID: 'app-id',
 *   ALGOLIA_SEARCH_API_KEY: 'search-key',
 *   ALGOLIA_INDEX_NAME: 'articles'
 * });
 *
 * // Realizar búsqueda
 * await search('react hooks');
 *
 * // Usar resultados
 * {searchResults.map(result => (
 *   <div key={result.objectID}>{result.title}</div>
 * ))}
 * ```
 *
 * @remarks
 * - El cliente de Algolia se inicializa una sola vez y se reutiliza
 * - Las búsquedas son asíncronas y manejan errores automáticamente
 * - El estado de error se limpia en cada nueva búsqueda
 *
 * @see {@link https://www.algolia.com/doc/api-client/getting-started/install/javascript/}
 */
export function useAlgoliaSearch(algolia?: AlgoliaConfig): UseAlgoliaSearchReturn {
  // ... implementación
}

/**
 * Busca artículos en el índice de Algolia
 *
 * @param query - Término de búsqueda
 * @returns Promise que resuelve a `true` si hay resultados, `false` si no
 *
 * @throws {Error} Si la configuración de Algolia es inválida
 *
 * @example
 * ```tsx
 * const hasResults = await search('typescript');
 * if (hasResults) {
 *   console.log('Se encontraron resultados');
 * }
 * ```
 */
const search = useCallback(async (query: string): Promise<boolean> => {
  // ... implementación
}, [algolia]);
```

Template para otros componentes:

```typescript
/**
 * [Descripción breve del componente]
 *
 * [Descripción más detallada si es necesario]
 *
 * @component
 *
 * @param {Props} props - Props del componente
 * @param {string} props.paramName - Descripción del parámetro
 *
 * @returns {JSX.Element} [Qué retorna el componente]
 *
 * @example
 * ```tsx
 * <ComponentName prop1="value" prop2={42} />
 * ```
 *
 * @remarks
 * - Nota importante 1
 * - Nota importante 2
 *
 * @see [Enlace a documentación relacionada]
 */
```

**Validación**:
- VSCode debe mostrar tooltips con la documentación al hacer hover
- TypeDoc puede generar docs automáticamente: `npx typedoc`

**Dependencias**: Ninguna

---

## Resumen de Implementación

### Métricas Totales

| Fase | Steps | Duración | Prioridad |
|------|-------|----------|-----------|
| Fase 1: Seguridad y Estabilidad | 5 | 2 semanas | 🔴 Crítica |
| Fase 2: Testing y Type Safety | 4 | 2 semanas | 🔴🟠 Crítica-Alta |
| Fase 3: Performance y Optimización | 3 | 1.5 semanas | 🟠🟡 Alta-Media |
| Fase 4: Accesibilidad y UX | 6 | 1.5 semanas | 🟢🟡 Baja-Media |
| **Total** | **18** | **7 semanas** | - |

### Orden de Ejecución Recomendado

**Crítico (Hacer primero)**:
1. Step 1: API Keys seguras
2. Step 2: Env vars de Giscus
3. Step 3: Estados de error en búsqueda
4. Step 4: Validación con Zod
5. Step 5: Estados de error en formulario

**Alto (Hacer después)**:
6. Step 6-9: Testing completo
7. Step 10: Optimización de imágenes
8. Step 11: Validación de env

**Medio-Bajo (Después de lo crítico)**:
9. Step 12-18: Resto de mejoras

### Checklist Final

```markdown
- [ ] Fase 1 Completada (5 steps)
- [ ] Fase 2 Completada (4 steps)
- [ ] Fase 3 Completada (3 steps)
- [ ] Fase 4 Completada (6 steps)
- [ ] Tests pasando (> 80% coverage)
- [ ] Lighthouse > 90 en todas las categorías
- [ ] Cero errores de TypeScript
- [ ] Cero vulnerabilidades de seguridad
- [ ] Documentación actualizada
```

---

**Próximos Pasos**: Comenzar con Step 1 y seguir el orden recomendado.
