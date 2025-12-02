# Fase 5: Generación de Imágenes con IA

**Tiempo estimado**: 6-8 horas
**Prioridad**: 🟡 Media
**Dependencias**: Fase 3, Fase 4

---

## Objetivos

Generar imágenes de portada para artículos usando DALL-E 3, optimizarlas con Sharp, y almacenarlas en el directorio correcto con nombres apropiados.

## Stack Técnico

- **DALL-E 3** - Generación de imágenes
- **Sharp** - Optimización de imágenes
- **OpenAI SDK** - Cliente (ya instalado)

## Instalación

```bash
npm install sharp
npm install @types/sharp -D
```

## Variables de Entorno

```env
# DALL-E
DALLE_MODEL=dall-e-3
DALLE_SIZE=1792x1024  # Horizontal 16:9
DALLE_QUALITY=hd
DALLE_STYLE=natural    # natural o vivid

# Storage
IMAGES_DIR=public/images/articulos
MAX_IMAGE_SIZE_MB=2
```

## Estructura

```
src/
├── lib/
│   └── ai/
│       ├── image-generator.ts         # Generador de imágenes
│       ├── image-optimizer.ts         # Optimización Sharp
│       └── image-prompts.ts           # Prompts para DALL-E
├── pages/
│   └── api/
│       └── ai/
│           └── generate-image.ts      # POST generar imagen
└── components/
    └── dashboard/
        └── ai/
            └── ImageGenerator.tsx     # UI generador
```

## Paso 1: Prompts para DALL-E

### src/lib/ai/image-prompts.ts
```typescript
export interface ImagePromptConfig {
  title: string;
  description: string;
  categories: string[];
  style?: 'minimalist' | 'tech' | 'abstract' | 'illustrative';
}

export function buildImagePrompt(config: ImagePromptConfig): string {
  const { title, description, categories, style = 'tech' } = config;

  const styleGuides = {
    minimalist: 'estilo minimalista con geometría simple, colores sólidos y mucho espacio en blanco',
    tech: 'estilo moderno tech-oriented, gradientes suaves, iconografía de tecnología',
    abstract: 'formas abstractas fluidas, colores vibrantes, composición dinámica',
    illustrative: 'ilustración digital moderna, colores planos, estilo vector',
  };

  const categoryThemes: Record<string, string> = {
    'javascript': 'elementos de código JavaScript, logos JS sutiles',
    'react': 'componentes modulares, flujo de datos',
    'vue': 'interfaz reactiva, componentes Vue',
    'astro': 'cohetes espaciales, estrellas, tema espacial moderno',
    'node': 'servidor backend, arquitectura de red',
    'web-development': 'navegadores web, HTML/CSS abstracto',
  };

  const categoryTheme = categories
    .map(cat => categoryThemes[cat])
    .filter(Boolean)
    .join(', ') || 'tecnología moderna';

  return `Crea una imagen de portada profesional para un artículo de blog técnico.

Tema: ${title}
Contexto: ${description}

Estilo visual: ${styleGuides[style]}
Elementos temáticos: ${categoryTheme}

Requisitos:
- Relación de aspecto 16:9 horizontal
- Sin texto ni letras en la imagen
- Paleta de colores: tonos de azul (#0ea5e9, #1e40af), púrpura (#8b5cf6), y negro (#0f172a)
- Diseño moderno, limpio y profesional
- Alta calidad, apto para web
- Enfoque visual claro y directo
- Background degradado o sólido oscuro

NO incluir: texto, palabras, letras, números, logos de marcas específicas.`;
}

export function buildSimplePrompt(topic: string): string {
  return `Create a modern, professional blog header image about ${topic}.

Style: tech-oriented, minimalist, clean
Colors: blue (#0ea5e9), purple (#8b5cf6), dark (#0f172a)
Aspect ratio: 16:9 horizontal
NO text, NO words, NO letters in the image
High quality, web-ready`;
}
```

## Paso 2: Generador de Imágenes

### src/lib/ai/image-generator.ts
```typescript
import OpenAI from 'openai';
import type { ImagePromptConfig } from './image-prompts';
import { buildImagePrompt } from './image-prompts';

const client = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

const dalleConfig = {
  model: (import.meta.env.DALLE_MODEL || 'dall-e-3') as 'dall-e-2' | 'dall-e-3',
  size: (import.meta.env.DALLE_SIZE || '1792x1024') as '1024x1024' | '1792x1024' | '1024x1792',
  quality: (import.meta.env.DALLE_QUALITY || 'hd') as 'standard' | 'hd',
  style: (import.meta.env.DALLE_STYLE || 'natural') as 'natural' | 'vivid',
};

export interface ImageGenerationResult {
  url: string;
  revisedPrompt?: string;
}

/**
 * Generar imagen con DALL-E 3
 */
export async function generateImage(
  config: ImagePromptConfig
): Promise<ImageGenerationResult> {
  const prompt = buildImagePrompt(config);

  console.log('[DALL-E] Generating image with prompt:', prompt.slice(0, 100) + '...');

  const response = await client.images.generate({
    model: dalleConfig.model,
    prompt,
    n: 1,
    size: dalleConfig.size,
    quality: dalleConfig.quality,
    style: dalleConfig.style,
  });

  const imageUrl = response.data[0]?.url;

  if (!imageUrl) {
    throw new Error('No se generó ninguna imagen');
  }

  return {
    url: imageUrl,
    revisedPrompt: response.data[0]?.revised_prompt,
  };
}

/**
 * Descargar imagen desde URL
 */
export async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al descargar imagen: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
```

## Paso 3: Optimización de Imágenes

### src/lib/ai/image-optimizer.ts
```typescript
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const IMAGES_DIR = import.meta.env.IMAGES_DIR || 'public/images/articulos';
const MAX_SIZE_MB = Number(import.meta.env.MAX_IMAGE_SIZE_MB) || 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Optimizar imagen con Sharp
 */
export async function optimizeImage(
  buffer: Buffer,
  options: OptimizeOptions = {}
): Promise<Buffer> {
  const {
    width = 1792,
    height = 1024,
    quality = 85,
  } = options;

  let optimized = sharp(buffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality });

  let result = await optimized.toBuffer();

  // Si es muy grande, reducir calidad
  if (result.length > MAX_SIZE_BYTES) {
    console.log(`[Sharp] Image too large (${(result.length / 1024 / 1024).toFixed(2)}MB), reducing quality...`);

    optimized = sharp(buffer)
      .resize(width, height, { fit: 'cover' })
      .webp({ quality: 75 });

    result = await optimized.toBuffer();
  }

  console.log(`[Sharp] Optimized image: ${(result.length / 1024).toFixed(2)}KB`);

  return result;
}

/**
 * Guardar imagen en directorio público
 */
export function saveImage(
  buffer: Buffer,
  slug: string,
  filename: string = 'cover.webp'
): string {
  const articleDir = join(process.cwd(), IMAGES_DIR, slug);

  // Crear directorio si no existe
  mkdirSync(articleDir, { recursive: true });

  const filePath = join(articleDir, filename);

  writeFileSync(filePath, buffer);

  // Retornar path relativo para frontmatter
  return `/images/articulos/${slug}/${filename}`;
}

/**
 * Pipeline completo: descargar -> optimizar -> guardar
 */
export async function processAndSaveImage(
  imageUrl: string,
  slug: string
): Promise<string> {
  console.log('[Image Processing] Starting pipeline...');

  // Descargar
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Optimizar
  const optimized = await optimizeImage(buffer);

  // Guardar
  const savedPath = saveImage(optimized, slug);

  console.log(`[Image Processing] Saved to: ${savedPath}`);

  return savedPath;
}
```

## Paso 4: API Endpoint

### src/pages/api/ai/generate-image.ts
```typescript
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { generateImage } from '@/lib/ai/image-generator';
import { processAndSaveImage } from '@/lib/ai/image-optimizer';
import { executeWithRateLimit } from '@/lib/ai/rate-limiter';

const RequestSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  categories: z.array(z.string()).min(1),
  slug: z.string().min(3),
  style: z.enum(['minimalist', 'tech', 'abstract', 'illustrative']).optional(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data = RequestSchema.parse(body);

    // Generar imagen con rate limiting
    const result = await executeWithRateLimit(async () => {
      return await generateImage({
        title: data.title,
        description: data.description,
        categories: data.categories,
        style: data.style || 'tech',
      });
    });

    console.log('[API] Image generated:', result.url);

    // Procesar y guardar
    const savedPath = await processAndSaveImage(result.url, data.slug);

    return new Response(
      JSON.stringify({
        success: true,
        imagePath: savedPath,
        revisedPrompt: result.revisedPrompt,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[API] Image Generation Error:', error);

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
        message: error instanceof Error ? error.message : 'Error al generar imagen',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

## Paso 5: Componente UI

### src/components/dashboard/ai/ImageGenerator.tsx
```tsx
import { useState } from 'react';

interface Props {
  title: string;
  description: string;
  categories: string[];
  slug: string;
  onGenerated: (imagePath: string) => void;
}

export default function ImageGenerator({
  title,
  description,
  categories,
  slug,
  onGenerated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [style, setStyle] = useState<'minimalist' | 'tech' | 'abstract' | 'illustrative'>('tech');

  async function generate() {
    if (!title || !slug) {
      setError('Completa el título y slug primero');
      return;
    }

    setLoading(true);
    setError('');
    setPreview('');

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          categories,
          slug,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al generar imagen');
      }

      setPreview(data.imagePath);
      onGenerated(data.imagePath);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Estilo de imagen
        </label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as any)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          disabled={loading}
        >
          <option value="tech">Tech moderno</option>
          <option value="minimalist">Minimalista</option>
          <option value="abstract">Abstracto</option>
          <option value="illustrative">Ilustrativo</option>
        </select>
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generando imagen con DALL-E...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <span className="mr-2">🎨</span>
            Generar imagen con IA
          </span>
        )}
      </button>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {preview && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Vista previa:</p>
          <img
            src={preview}
            alt="Vista previa"
            className="w-full rounded border border-gray-700"
          />
          <p className="text-xs text-green-400 mt-2">
            ✅ Imagen generada y guardada en {preview}
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>💡 La generación tarda ~10-30 segundos</p>
        <p>💰 Costo aproximado: $0.04 USD</p>
      </div>
    </div>
  );
}
```

## Costos

| Operación | Precio |
|-----------|--------|
| DALL-E 3 HD (1792x1024) | $0.080 |
| DALL-E 3 Standard | $0.040 |

**Recomendación**: Usar `quality: 'standard'` en desarrollo, `hd` en producción.

## Optimización

- Imágenes guardadas como WebP
- Compresión con Sharp (quality 85)
- Tamaño máximo 2MB
- Dimensiones fijas 1792x1024

## Fallbacks

Si falla la generación:
1. Mostrar error al usuario
2. Permitir subir imagen manualmente
3. Usar imagen placeholder default

## Checklist

- [ ] Crear prompts para DALL-E
- [ ] Implementar image-generator.ts
- [ ] Crear image-optimizer.ts con Sharp
- [ ] Implementar API endpoint
- [ ] Crear componente ImageGenerator
- [ ] Integrar en editor
- [ ] Testing con imágenes reales
- [ ] Verificar calidad y tamaño
- [ ] Configurar fallbacks

**Siguiente fase**: `06_gestion-archivos.md`
