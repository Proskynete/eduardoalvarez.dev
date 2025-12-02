# Fase 4: Integración con Open AI

**Tiempo estimado**: 8-10 horas
**Prioridad**: 🟡 Alta
**Dependencias**: Fase 3 (Editor)

---

## Objetivos

Integrar OpenAI GPT-4 para generar automáticamente descripciones SEO optimizadas, sugerir títulos alternativos y proponer categorías/tags relevantes basados en el contenido del artículo.

## Stack Técnico

- **OpenAI SDK** v4 - Cliente oficial de OpenAI
- **GPT-4 Turbo** - Modelo de lenguaje
- **Zod** - Validación de respuestas
- **Rate Limiting** - Control de uso

## Instalación

```bash
npm install openai
npm install p-queue  # Para rate limiting
```

## Variables de Entorno

```env
# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7

# Rate Limiting
AI_REQUESTS_PER_MINUTE=10
AI_REQUESTS_PER_DAY=100
```

## Estructura de Archivos

```
src/
├── lib/
│   └── ai/
│       ├── openai-client.ts           # Cliente OpenAI
│       ├── prompts.ts                 # Templates de prompts
│       ├── rate-limiter.ts            # Rate limiting
│       └── response-parser.ts         # Parse de respuestas
├── pages/
│   └── api/
│       └── ai/
│           ├── generate-description.ts # POST generar SEO
│           ├── suggest-title.ts        # POST sugerir títulos
│           └── suggest-tags.ts         # POST sugerir tags
└── components/
    └── dashboard/
        └── ai/
            ├── AIAssistantPanel.tsx    # Panel lateral IA
            ├── DescriptionGenerator.tsx # Botón generar desc
            ├── TitleSuggestions.tsx     # Sugerencias de título
            └── TagSuggestions.tsx       # Sugerencias de tags
```

## Paso 1: Cliente OpenAI

### src/lib/ai/openai-client.ts
```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

export const openaiConfig = {
  model: import.meta.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  maxTokens: Number(import.meta.env.OPENAI_MAX_TOKENS) || 500,
  temperature: Number(import.meta.env.OPENAI_TEMPERATURE) || 0.7,
};

export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const completion = await client.chat.completions.create({
    model: openaiConfig.model,
    max_tokens: openaiConfig.maxTokens,
    temperature: openaiConfig.temperature,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  return completion.choices[0]?.message?.content || '';
}

export default client;
```

## Paso 2: Prompts Templates

### src/lib/ai/prompts.ts
```typescript
export const SYSTEM_PROMPTS = {
  seoDescription: `Eres un experto en SEO y marketing de contenidos.
Tu tarea es crear descripciones meta optimizadas para artículos de blog técnico.

Reglas estrictas:
- Máximo 160 caracteres
- Incluir palabras clave relevantes
- Usar voz activa
- Ser atractivo para clicks
- No usar comillas ni caracteres especiales
- Enfocarse en el valor para el lector
- Usar español neutro`,

  titleSuggestions: `Eres un experto en copywriting y engagement.
Tu tarea es sugerir títulos alternativos atractivos para artículos de blog técnico.

Reglas:
- Generar exactamente 5 títulos diferentes
- Máximo 60 caracteres por título
- Usar power words cuando sea apropiado
- Ser específico y claro
- Evitar clickbait excesivo
- Formato: lista numerada simple`,

  tagSuggestions: `Eres un experto en categorización de contenido técnico.
Tu tarea es sugerir categorías/tags relevantes para un artículo.

Categorías permitidas SOLAMENTE:
- web-development
- javascript
- react
- vue
- astro
- node
- express
- sql
- no-sql

Reglas:
- Seleccionar entre 1 y 3 categorías
- Solo usar categorías de la lista permitida
- Priorizar las más relevantes
- Responder en formato JSON: {"categories": ["cat1", "cat2"]}`,
};

export function buildDescriptionPrompt(content: string, title: string): string {
  return `Analiza el siguiente artículo y genera una descripción meta SEO.

Título: ${title}

Contenido:
${content.slice(0, 2000)} ${content.length > 2000 ? '...' : ''}

Genera SOLO la descripción, sin explicaciones adicionales.`;
}

export function buildTitlePrompt(content: string, currentTitle: string): string {
  return `Analiza el siguiente artículo y sugiere 5 títulos alternativos.

Título actual: ${currentTitle}

Contenido:
${content.slice(0, 2000)}

Genera SOLO la lista de 5 títulos, uno por línea, sin números ni viñetas.`;
}

export function buildTagsPrompt(content: string, title: string): string {
  return `Analiza el siguiente artículo y sugiere categorías relevantes.

Título: ${title}

Contenido:
${content.slice(0, 2000)}

Responde SOLO con el JSON, sin explicaciones.`;
}
```

## Paso 3: Rate Limiter

### src/lib/ai/rate-limiter.ts
```typescript
import PQueue from 'p-queue';

// Queue para rate limiting
const queue = new PQueue({
  intervalCap: Number(import.meta.env.AI_REQUESTS_PER_MINUTE) || 10,
  interval: 60 * 1000, // 1 minuto
  concurrency: 1,
});

// Almacenamiento simple de requests por día (en producción usar Redis)
const dailyRequests = new Map<string, { count: number; date: string }>();

const MAX_DAILY_REQUESTS = Number(import.meta.env.AI_REQUESTS_PER_DAY) || 100;

export async function checkRateLimit(userId: string = 'default'): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];
  const userRequests = dailyRequests.get(userId);

  if (!userRequests || userRequests.date !== today) {
    dailyRequests.set(userId, { count: 1, date: today });
    return true;
  }

  if (userRequests.count >= MAX_DAILY_REQUESTS) {
    return false;
  }

  userRequests.count++;
  return true;
}

export async function executeWithRateLimit<T>(
  fn: () => Promise<T>,
  userId?: string
): Promise<T> {
  const canProceed = await checkRateLimit(userId);

  if (!canProceed) {
    throw new Error('Límite diario de requests de IA alcanzado');
  }

  return queue.add(fn) as Promise<T>;
}
```

## Paso 4: API Endpoints

### src/pages/api/ai/generate-description.ts
```typescript
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { generateCompletion } from '@/lib/ai/openai-client';
import { SYSTEM_PROMPTS, buildDescriptionPrompt } from '@/lib/ai/prompts';
import { executeWithRateLimit } from '@/lib/ai/rate-limiter';

const RequestSchema = z.object({
  content: z.string().min(100, 'El contenido debe tener al menos 100 caracteres'),
  title: z.string().min(5, 'El título es requerido'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { content, title } = RequestSchema.parse(body);

    const description = await executeWithRateLimit(async () => {
      const prompt = buildDescriptionPrompt(content, title);
      return await generateCompletion(SYSTEM_PROMPTS.seoDescription, prompt);
    });

    // Validar longitud
    const trimmedDescription = description.trim().slice(0, 160);

    return new Response(
      JSON.stringify({
        success: true,
        description: trimmedDescription,
        length: trimmedDescription.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('AI Description Error:', error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.errors[0].message,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Error al generar descripción',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### src/pages/api/ai/suggest-title.ts
```typescript
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { generateCompletion } from '@/lib/ai/openai-client';
import { SYSTEM_PROMPTS, buildTitlePrompt } from '@/lib/ai/prompts';
import { executeWithRateLimit } from '@/lib/ai/rate-limiter';

const RequestSchema = z.object({
  content: z.string().min(100),
  currentTitle: z.string(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { content, currentTitle } = RequestSchema.parse(body);

    const response = await executeWithRateLimit(async () => {
      const prompt = buildTitlePrompt(content, currentTitle);
      return await generateCompletion(SYSTEM_PROMPTS.titleSuggestions, prompt);
    });

    // Parsear títulos (cada línea es un título)
    const titles = response
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0 && t.length <= 100)
      .slice(0, 5);

    return new Response(
      JSON.stringify({
        success: true,
        titles,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('AI Title Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Error al generar títulos',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### src/pages/api/ai/suggest-tags.ts
```typescript
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { generateCompletion } from '@/lib/ai/openai-client';
import { SYSTEM_PROMPTS, buildTagsPrompt } from '@/lib/ai/prompts';
import { executeWithRateLimit } from '@/lib/ai/rate-limiter';
import type { CategoryAllowed } from '@/interfaces';

const RequestSchema = z.object({
  content: z.string().min(100),
  title: z.string(),
});

const ALLOWED_CATEGORIES: CategoryAllowed[] = [
  'web-development',
  'javascript',
  'react',
  'vue',
  'astro',
  'node',
  'express',
  'sql',
  'no-sql',
];

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { content, title } = RequestSchema.parse(body);

    const response = await executeWithRateLimit(async () => {
      const prompt = buildTagsPrompt(content, title);
      return await generateCompletion(SYSTEM_PROMPTS.tagSuggestions, prompt);
    });

    // Parsear JSON
    const parsed = JSON.parse(response);
    const suggestedCategories = parsed.categories || [];

    // Filtrar solo categorías permitidas
    const validCategories = suggestedCategories.filter((cat: string) =>
      ALLOWED_CATEGORIES.includes(cat as CategoryAllowed)
    );

    return new Response(
      JSON.stringify({
        success: true,
        categories: validCategories.slice(0, 3),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('AI Tags Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Error al generar tags',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

## Paso 5: Componentes UI

### src/components/dashboard/ai/DescriptionGenerator.tsx
```tsx
import { useState } from 'react';

interface Props {
  content: string;
  title: string;
  onGenerated: (description: string) => void;
}

export default function DescriptionGenerator({ content, title, onGenerated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    if (!content || content.length < 100) {
      setError('Escribe al menos 100 caracteres antes de generar');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al generar');
      }

      onGenerated(data.description);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm font-medium rounded transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2">⚡</span>
            Generando con IA...
          </>
        ) : (
          <>
            <span className="mr-2">🤖</span>
            Generar con IA
          </>
        )}
      </button>

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}
```

## Paso 6: Panel de Asistente IA

### src/components/dashboard/ai/AIAssistantPanel.tsx
```tsx
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ArticleFormData } from '@/lib/editor/validation';

interface Props {
  form: UseFormReturn<ArticleFormData>;
  content: string;
}

export default function AIAssistantPanel({ form, content }: Props) {
  const [activeTab, setActiveTab] = useState<'description' | 'titles' | 'tags'>('description');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function generateDescription() {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          title: form.getValues('title'),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        form.setValue('description', data.description);
      }
    } finally {
      setLoading(false);
    }
  }

  async function generateTitles() {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          currentTitle: form.getValues('title'),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuggestions(data.titles);
      }
    } finally {
      setLoading(false);
    }
  }

  async function generateTags() {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          title: form.getValues('title'),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        form.setValue('categories', data.categories);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-white mb-3">🤖 Asistente IA</h3>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-3 py-1 rounded text-xs ${
            activeTab === 'description'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          Descripción
        </button>
        <button
          onClick={() => setActiveTab('titles')}
          className={`px-3 py-1 rounded text-xs ${
            activeTab === 'titles'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          Títulos
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`px-3 py-1 rounded text-xs ${
            activeTab === 'tags'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          Tags
        </button>
      </div>

      {/* Content */}
      {activeTab === 'description' && (
        <button
          onClick={generateDescription}
          disabled={loading}
          className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm rounded"
        >
          {loading ? 'Generando...' : 'Generar descripción SEO'}
        </button>
      )}

      {activeTab === 'titles' && (
        <div>
          <button
            onClick={generateTitles}
            disabled={loading}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm rounded mb-3"
          >
            {loading ? 'Generando...' : 'Sugerir títulos'}
          </button>

          {suggestions.length > 0 && (
            <div className="space-y-2">
              {suggestions.map((title, i) => (
                <button
                  key={i}
                  onClick={() => form.setValue('title', title)}
                  className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-left text-sm rounded"
                >
                  {title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'tags' && (
        <button
          onClick={generateTags}
          disabled={loading}
          className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm rounded"
        >
          {loading ? 'Generando...' : 'Sugerir categorías'}
        </button>
      )}
    </div>
  );
}
```

## Costos Estimados

| Operación | Tokens (aprox) | Costo |
|-----------|---------------|--------|
| Descripción SEO | 2,500 | $0.03 |
| Títulos (5x) | 2,500 | $0.03 |
| Tags | 2,500 | $0.03 |
| **Total por artículo** | - | **~$0.09** |

Con 100 artículos/mes: **~$9/mes**

## Checklist

- [ ] Instalar OpenAI SDK
- [ ] Configurar variables de entorno
- [ ] Crear cliente OpenAI
- [ ] Implementar prompts
- [ ] Crear rate limiter
- [ ] Implementar API endpoints
- [ ] Crear componentes UI
- [ ] Integrar en editor
- [ ] Testing completo
- [ ] Monitorear costos

**Siguiente fase**: `05_generacion-imagenes.md`
