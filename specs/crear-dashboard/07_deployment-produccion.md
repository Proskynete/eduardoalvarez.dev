# Fase 7: Deployment y Producción

**Tiempo estimado**: 4-6 horas
**Prioridad**: 🟡 Alta
**Dependencias**: Todas las fases anteriores

---

## Objetivos

Preparar el dashboard para producción con configuración segura, optimizaciones de performance, monitoreo de costos de IA y documentación completa.

## Checklist de Pre-deployment

### 1. Seguridad

- [ ] **Variables de entorno en Vercel**
  ```
  AUTH_SECRET
  AUTH_USERNAME
  AUTH_PASSWORD_HASH
  OPENAI_API_KEY
  DALLE_MODEL
  DALLE_QUALITY
  ```

- [ ] **Cookies seguras**
  - `secure: true` en producción
  - `sameSite: 'strict'`
  - `httpOnly: true`

- [ ] **Rate Limiting configurado**
  - Límite de requests por minuto
  - Límite de requests por día
  - Tracking por usuario/IP

- [ ] **Validación estricta**
  - Zod en todos los endpoints
  - Sanitización de inputs
  - Validación de tamaños de archivo

### 2. Performance

- [ ] **Build optimization**
  ```bash
  npm run build
  ```

- [ ] **Lazy loading de componentes pesados**
  - CodeMirror
  - MarkdownPreview
  - ImageGenerator

- [ ] **Debouncing optimizado**
  - Auto-save: 30s
  - Preview update: 500ms
  - Search: 300ms

- [ ] **Compresión de imágenes**
  - WebP format
  - Quality 85
  - Max 2MB

### 3. Monitoreo

- [ ] **Logging de errores**
  ```typescript
  // src/lib/logger.ts
  export function logError(context: string, error: unknown) {
    console.error(`[${context}]`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
  ```

- [ ] **Tracking de uso de IA**
  ```typescript
  // src/lib/ai/usage-tracker.ts
  interface AIUsage {
    date: string;
    operation: 'description' | 'title' | 'tags' | 'image';
    tokens?: number;
    cost: number;
  }

  export function trackAIUsage(operation: AIUsage['operation'], cost: number) {
    // Guardar en DB o file
    console.log(`[AI Usage] ${operation}: $${cost.toFixed(4)}`);
  }
  ```

- [ ] **Vercel Analytics**
  - Ya configurado en astro.config.mjs

## Configuración de Vercel

### 1. Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```env
# Authentication
AUTH_SECRET=your-production-secret-min-32-chars
AUTH_USERNAME=admin
AUTH_PASSWORD_HASH=$2b$12$...
SESSION_MAX_AGE=1800000
SESSION_COOKIE_NAME=dashboard_session

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7

# DALL-E
DALLE_MODEL=dall-e-3
DALLE_SIZE=1792x1024
DALLE_QUALITY=standard  # o 'hd' si el presupuesto lo permite
DALLE_STYLE=natural

# Rate Limiting
AI_REQUESTS_PER_MINUTE=10
AI_REQUESTS_PER_DAY=100

# Images
IMAGES_DIR=public/images/articulos
MAX_IMAGE_SIZE_MB=2

# Node environment
NODE_ENV=production
```

### 2. Build Settings

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

### 3. Redirects y Headers

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/dashboard/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## Estructura de Costos

### OpenAI Pricing

| Operación | Tokens | Costo/operación | Uso mensual (50 artículos) |
|-----------|--------|-----------------|----------------------------|
| Descripción SEO | ~2,500 | $0.03 | $1.50 |
| Sugerencia de títulos | ~2,500 | $0.03 | $1.50 |
| Sugerencia de tags | ~2,500 | $0.03 | $1.50 |
| **Subtotal texto** | - | - | **$4.50** |

### DALL-E Pricing

| Quality | Size | Costo/imagen | Uso mensual (50 artículos) |
|---------|------|--------------|----------------------------|
| Standard | 1792x1024 | $0.040 | $2.00 |
| HD | 1792x1024 | $0.080 | $4.00 |

### Total Estimado

- **Con Standard**: ~$6.50/mes (50 artículos)
- **Con HD**: ~$8.50/mes (50 artículos)

**Recomendación**: Comenzar con Standard, cambiar a HD solo si es necesario.

## Monitoring Dashboard

### src/pages/dashboard/stats.astro
```astro
---
import DashboardLayout from '@/components/dashboard/DashboardLayout.astro';
import UserMenu from '@/components/dashboard/UserMenu';
import { getSession } from '@/lib/auth/session';

const session = await getSession(Astro.cookies);

// TODO: Leer de archivo o DB
const stats = {
  totalArticles: 45,
  published: 38,
  drafts: 7,
  aiUsageThisMonth: {
    descriptions: 12,
    images: 8,
    titles: 5,
    totalCost: 2.45,
  },
};
---

<DashboardLayout title="Estadísticas">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-gray-800 rounded-lg p-6">
      <h3 class="text-sm text-gray-400 mb-2">Total Artículos</h3>
      <p class="text-3xl font-bold text-white">{stats.totalArticles}</p>
    </div>

    <div class="bg-gray-800 rounded-lg p-6">
      <h3 class="text-sm text-gray-400 mb-2">Publicados</h3>
      <p class="text-3xl font-bold text-green-400">{stats.published}</p>
    </div>

    <div class="bg-gray-800 rounded-lg p-6">
      <h3 class="text-sm text-gray-400 mb-2">Borradores</h3>
      <p class="text-3xl font-bold text-yellow-400">{stats.drafts}</p>
    </div>
  </div>

  <div class="bg-gray-800 rounded-lg p-6">
    <h2 class="text-lg font-semibold text-white mb-4">Uso de IA (este mes)</h2>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div>
        <p class="text-sm text-gray-400">Descripciones</p>
        <p class="text-2xl font-bold text-white">{stats.aiUsageThisMonth.descriptions}</p>
      </div>

      <div>
        <p class="text-sm text-gray-400">Imágenes</p>
        <p class="text-2xl font-bold text-white">{stats.aiUsageThisMonth.images}</p>
      </div>

      <div>
        <p class="text-sm text-gray-400">Títulos</p>
        <p class="text-2xl font-bold text-white">{stats.aiUsageThisMonth.titles}</p>
      </div>

      <div>
        <p class="text-sm text-gray-400">Costo total</p>
        <p class="text-2xl font-bold text-purple-400">
          ${stats.aiUsageThisMonth.totalCost.toFixed(2)}
        </p>
      </div>
    </div>

    <div class="text-xs text-gray-500">
      <p>💡 Límite mensual estimado: $10.00</p>
      <p>📊 Proyección fin de mes: ${(stats.aiUsageThisMonth.totalCost * 2).toFixed(2)}</p>
    </div>
  </div>

  <UserMenu slot="user-menu" username={session?.username || 'Usuario'} client:load />
</DashboardLayout>
```

## Backup Strategy

### 1. Backups Locales

```bash
# Script de backup manual
#!/bin/bash

# backup-articles.sh
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR=".backups/manual"

mkdir -p $BACKUP_DIR

# Backup de artículos
tar -czf "$BACKUP_DIR/articles_$DATE.tar.gz" src/pages/articulos/

# Backup de imágenes
tar -czf "$BACKUP_DIR/images_$DATE.tar.gz" public/images/articulos/

echo "Backup creado: $BACKUP_DIR/"
```

### 2. Git como Backup

Todos los archivos .mdx están en Git, por lo que cada commit es un backup automático.

### 3. Vercel Backups

Vercel mantiene histórico de deployments, permitiendo rollback instantáneo.

## Testing en Producción

### 1. Smoke Tests

```bash
# Después del deploy
curl -I https://tu-dominio.com/dashboard
# Debe redirigir a /dashboard/login

curl -I https://tu-dominio.com/api/auth/session
# Debe retornar 401 (sin autenticación)
```

### 2. Checklist Post-Deploy

- [ ] Login funciona
- [ ] Dashboard carga correctamente
- [ ] Crear artículo funciona
- [ ] Generar descripción IA funciona
- [ ] Generar imagen funciona
- [ ] Auto-save funciona
- [ ] Editar artículo funciona
- [ ] Eliminar artículo funciona
- [ ] Logout funciona

## Optimizaciones Adicionales

### 1. Cache de Artículos

```typescript
// src/lib/articles/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export function getCachedArticles(): DashboardArticle[] | null {
  const cached = cache.get('articles');

  if (!cached) return null;

  const age = Date.now() - cached.timestamp;

  if (age > CACHE_TTL) {
    cache.delete('articles');
    return null;
  }

  return cached.data;
}

export function setCachedArticles(data: DashboardArticle[]): void {
  cache.set('articles', {
    data,
    timestamp: Date.now(),
  });
}
```

### 2. Compresión de Respuestas

Vercel automáticamente comprime con Brotli/Gzip.

### 3. CDN para Imágenes

Las imágenes en `/public` se sirven desde Vercel Edge Network (CDN automático).

## Documentación Final

### README_DASHBOARD.md

```markdown
# Dashboard de Artículos con IA

Dashboard privado para crear y gestionar artículos del blog con asistencia de IA.

## Acceso

URL: `https://tu-dominio.com/dashboard`

Credenciales: Configuradas vía variables de entorno en Vercel.

## Funcionalidades

- ✅ Crear artículos con editor markdown
- ✅ Preview en tiempo real
- ✅ Auto-save cada 30 segundos
- ✅ Generación de descripción SEO con GPT-4
- ✅ Sugerencia de títulos alternativos
- ✅ Sugerencia de categorías
- ✅ Generación de imagen de portada con DALL-E 3
- ✅ Gestión completa (CRUD)
- ✅ Backups automáticos

## Costos Estimados

- GPT-4: ~$0.09 por artículo
- DALL-E 3 Standard: $0.04 por imagen
- **Total**: ~$0.13 por artículo completo

Presupuesto mensual recomendado: $10-15 USD

## Límites

- Rate limiting: 10 requests/minuto, 100 requests/día
- Tamaño máximo de imagen: 2MB
- Auto-save: cada 30 segundos

## Troubleshooting

### Error "Rate limit exceeded"
Espera unos minutos antes de intentar de nuevo.

### Imagen no se genera
Verifica que OPENAI_API_KEY tenga créditos disponibles.

### Auto-save no funciona
Verifica que el slug sea válido (solo lowercase y guiones).
```

## Checklist Final de Deployment

- [ ] Variables de entorno en Vercel
- [ ] Build exitoso local
- [ ] Tests manuales completos
- [ ] Seguridad verificada
- [ ] Rate limiting configurado
- [ ] Backups habilitados
- [ ] Documentación actualizada
- [ ] Deploy a producción
- [ ] Smoke tests post-deploy
- [ ] Monitoreo de costos activado

## Mantenimiento Continuo

### Semanal
- Revisar logs de errores
- Verificar costos de OpenAI

### Mensual
- Limpiar backups antiguos (>30 días)
- Revisar analytics de uso
- Actualizar dependencias

### Trimestral
- Audit de seguridad
- Performance review
- Optimizaciones

---

## Conclusión del Proyecto

Al completar todas las 7 fases, tendrás un **dashboard completo y funcional** con:

✅ Autenticación segura
✅ Editor de markdown profesional
✅ Generación de contenido con IA
✅ Generación de imágenes con IA
✅ Gestión completa de archivos
✅ Backups automáticos
✅ Deploy en producción
✅ Monitoreo de costos

**Tiempo total estimado**: 40-50 horas
**Costo mensual operativo**: $10-15 USD (con uso moderado)

Este sistema te permitirá crear artículos de alta calidad de manera eficiente, ahorrando tiempo en tareas repetitivas y mejorando la consistencia del contenido.
