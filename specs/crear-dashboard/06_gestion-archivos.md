# Fase 6: Gestión de Archivos MDX

**Tiempo estimado**: 4-6 horas
**Prioridad**: 🔴 Crítica
**Dependencias**: Todas las fases anteriores

---

## Objetivos

Implementar el sistema completo de CRUD para archivos .mdx: crear nuevos artículos, actualizar existentes, eliminar y gestionar backups automáticos.

## Estructura

```
src/
├── lib/
│   └── articles/
│       ├── file-manager.ts            # CRUD de archivos
│       ├── file-writer.ts             # Escritura de MDX
│       ├── frontmatter-builder.ts     # Construcción de YAML
│       ├── backup-manager.ts          # Sistema de backups
│       └── validator.ts               # Validación completa
└── pages/
    └── api/
        └── articulos/
            ├── create.ts              # POST crear
            ├── update.ts              # PUT actualizar
            ├── delete.ts              # DELETE eliminar
            └── save-draft.ts          # POST guardar borrador
```

## Paso 1: File Writer

### src/lib/articles/file-writer.ts
```typescript
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { ArticleFormData } from '@/lib/editor/validation';

const ARTICLES_DIR = 'src/pages/articulos';

export interface WriteResult {
  filePath: string;
  success: boolean;
  error?: string;
}

/**
 * Construir frontmatter YAML
 */
function buildFrontmatter(data: ArticleFormData): string {
  const frontmatter = `---
layout: ../../layouts/article/index.astro
title: "${data.title.replace(/"/g, '\\"')}"
slug: "${data.slug}"
description: "${data.description.replace(/"/g, '\\"')}"
date: ${data.date}
categories: [${data.categories.map(c => `"${c}"`).join(', ')}]
seo_image: ${data.seo_image || ''}
status: ${data.status}
sections:
${data.sections.map(s => `  - { title: '${s.title}', anchor: '${s.anchor}' }`).join('\n')}
---`;

  return frontmatter;
}

/**
 * Escribir archivo MDX completo
 */
export function writeArticleFile(data: ArticleFormData): WriteResult {
  try {
    const frontmatter = buildFrontmatter(data);
    const fullContent = `${frontmatter}\n\n${data.content}`;

    const fileName = `${data.slug}.mdx`;
    const filePath = join(process.cwd(), ARTICLES_DIR, fileName);

    // Crear directorio si no existe
    const dir = join(process.cwd(), ARTICLES_DIR);
    mkdirSync(dir, { recursive: true });

    // Escribir archivo
    writeFileSync(filePath, fullContent, 'utf-8');

    console.log(`[File Writer] Created: ${filePath}`);

    return {
      filePath,
      success: true,
    };

  } catch (error) {
    console.error('[File Writer] Error:', error);

    return {
      filePath: '',
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualizar archivo existente
 */
export function updateArticleFile(
  oldSlug: string,
  data: ArticleFormData
): WriteResult {
  try {
    // Si el slug cambió, eliminar archivo anterior
    if (oldSlug !== data.slug) {
      const oldPath = join(process.cwd(), ARTICLES_DIR, `${oldSlug}.mdx`);

      try {
        const { unlinkSync } = require('fs');
        unlinkSync(oldPath);
        console.log(`[File Writer] Deleted old file: ${oldPath}`);
      } catch (err) {
        console.warn(`[File Writer] Could not delete old file: ${oldPath}`);
      }
    }

    // Escribir nuevo archivo
    return writeArticleFile(data);

  } catch (error) {
    return {
      filePath: '',
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar',
    };
  }
}
```

## Paso 2: Backup Manager

### src/lib/articles/backup-manager.ts
```typescript
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BACKUPS_DIR = '.backups/articles';

export interface BackupResult {
  success: boolean;
  backupPath?: string;
  error?: string;
}

/**
 * Crear backup de un artículo antes de modificarlo
 */
export function createBackup(slug: string): BackupResult {
  try {
    const articlePath = join(process.cwd(), 'src/pages/articulos', `${slug}.mdx`);

    if (!existsSync(articlePath)) {
      return {
        success: false,
        error: 'Artículo no encontrado',
      };
    }

    // Leer contenido original
    const content = readFileSync(articlePath, 'utf-8');

    // Crear directorio de backups
    const backupDir = join(process.cwd(), BACKUPS_DIR);
    mkdirSync(backupDir, { recursive: true });

    // Nombre con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `${slug}_${timestamp}.mdx`;
    const backupPath = join(backupDir, backupFileName);

    // Guardar backup
    writeFileSync(backupPath, content, 'utf-8');

    console.log(`[Backup] Created: ${backupPath}`);

    return {
      success: true,
      backupPath,
    };

  } catch (error) {
    console.error('[Backup] Error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear backup',
    };
  }
}

/**
 * Limpiar backups antiguos (mayores a 30 días)
 */
export function cleanOldBackups(): void {
  try {
    const { readdirSync, statSync, unlinkSync } = require('fs');
    const backupDir = join(process.cwd(), BACKUPS_DIR);

    if (!existsSync(backupDir)) {
      return;
    }

    const files = readdirSync(backupDir);
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    files.forEach((file: string) => {
      const filePath = join(backupDir, file);
      const stats = statSync(filePath);
      const age = now - stats.mtimeMs;

      if (age > thirtyDaysMs) {
        unlinkSync(filePath);
        console.log(`[Backup] Deleted old backup: ${file}`);
      }
    });

  } catch (error) {
    console.error('[Backup] Cleanup error:', error);
  }
}
```

## Paso 3: API Endpoints

### src/pages/api/articulos/create.ts
```typescript
import type { APIRoute } from 'astro';
import { ArticleSchema } from '@/lib/editor/validation';
import { writeArticleFile } from '@/lib/articles/file-writer';
import { z } from 'zod';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validar datos
    const data = ArticleSchema.parse(body);

    // Verificar que no exista ya
    const { existsSync } = require('fs');
    const { join } = require('path');
    const filePath = join(
      process.cwd(),
      'src/pages/articulos',
      `${data.slug}.mdx`
    );

    if (existsSync(filePath)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Ya existe un artículo con este slug',
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Escribir archivo
    const result = writeArticleFile(data);

    if (!result.success) {
      throw new Error(result.error || 'Error al crear archivo');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Artículo creado exitosamente',
        filePath: result.filePath,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[API Create] Error:', error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.errors[0].message,
          errors: error.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear artículo',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### src/pages/api/articulos/update.ts
```typescript
import type { APIRoute } from 'astro';
import { ArticleSchema } from '@/lib/editor/validation';
import { updateArticleFile } from '@/lib/articles/file-writer';
import { createBackup } from '@/lib/articles/backup-manager';
import { z } from 'zod';

const UpdateSchema = ArticleSchema.extend({
  originalSlug: z.string(),
});

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { originalSlug, ...data } = UpdateSchema.parse(body);

    // Crear backup antes de modificar
    const backup = createBackup(originalSlug);

    if (!backup.success) {
      console.warn('[API Update] Backup failed:', backup.error);
    }

    // Actualizar archivo
    const result = updateArticleFile(originalSlug, data);

    if (!result.success) {
      throw new Error(result.error || 'Error al actualizar archivo');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Artículo actualizado exitosamente',
        filePath: result.filePath,
        backup: backup.backupPath,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[API Update] Error:', error);

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
        message: error instanceof Error ? error.message : 'Error al actualizar',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### src/pages/api/articulos/delete.ts
```typescript
import type { APIRoute } from 'astro';
import { createBackup } from '@/lib/articles/backup-manager';
import { z } from 'zod';

const DeleteSchema = z.object({
  slug: z.string().min(1),
});

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { slug } = DeleteSchema.parse(body);

    // Crear backup antes de eliminar
    const backup = createBackup(slug);

    if (!backup.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No se pudo crear backup del artículo',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Eliminar archivo
    const { unlinkSync } = require('fs');
    const { join } = require('path');

    const filePath = join(
      process.cwd(),
      'src/pages/articulos',
      `${slug}.mdx`
    );

    unlinkSync(filePath);

    console.log(`[API Delete] Deleted: ${filePath}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Artículo eliminado (backup creado)',
        backup: backup.backupPath,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[API Delete] Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Error al eliminar',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### src/pages/api/articulos/save-draft.ts
```typescript
import type { APIRoute } from 'astro';
import { ArticleSchema } from '@/lib/editor/validation';
import { writeArticleFile, updateArticleFile } from '@/lib/articles/file-writer';

// Schema más flexible para borradores
const DraftSchema = ArticleSchema.partial().extend({
  slug: ArticleSchema.shape.slug,
  status: ArticleSchema.shape.status.default('draft'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data = DraftSchema.parse(body);

    // Verificar si existe
    const { existsSync } = require('fs');
    const { join } = require('path');
    const filePath = join(
      process.cwd(),
      'src/pages/articulos',
      `${data.slug}.mdx`
    );

    const exists = existsSync(filePath);
    const result = exists
      ? updateArticleFile(data.slug, data as any)
      : writeArticleFile(data as any);

    if (!result.success) {
      throw new Error(result.error || 'Error al guardar borrador');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Borrador guardado',
        isNew: !exists,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[API Draft] Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al guardar borrador',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

## Paso 4: Botón de Eliminar

### src/components/dashboard/DeleteButton.tsx
```tsx
import { useState } from 'react';

interface Props {
  slug: string;
  title: string;
}

export default function DeleteButton({ slug, title }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const response = await fetch('/api/articulos/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar');
      }

      // Redirigir al dashboard
      window.location.href = '/dashboard';

    } catch (error) {
      alert('Error al eliminar artículo');
      setDeleting(false);
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
      >
        🗑️ Eliminar
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-400">¿Seguro?</span>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded text-sm"
      >
        {deleting ? '...' : 'Sí, eliminar'}
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={deleting}
        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
      >
        Cancelar
      </button>
    </div>
  );
}
```

## Consideraciones Importantes

### 1. Validación de Slug
- Solo lowercase
- Solo letras, números y guiones
- Único en el sistema

### 2. Backups Automáticos
- Backup antes de modificar
- Backup antes de eliminar
- Limpieza automática > 30 días

### 3. Manejo de Errores
- Validación Zod en todos los endpoints
- Mensajes de error descriptivos
- Rollback en caso de fallo

### 4. Permisos de Archivos
- Verificar permisos de escritura
- Manejo de errores de filesystem

## Testing Manual

1. **Crear artículo**:
   - Completar formulario
   - Guardar
   - Verificar archivo en `src/pages/articulos/`

2. **Editar artículo**:
   - Modificar contenido
   - Guardar
   - Verificar backup en `.backups/`

3. **Cambiar slug**:
   - Modificar slug
   - Guardar
   - Verificar que archivo anterior se eliminó

4. **Eliminar artículo**:
   - Confirmar eliminación
   - Verificar backup creado
   - Verificar archivo eliminado

5. **Auto-save**:
   - Escribir contenido
   - Esperar 30 segundos
   - Verificar guardado automático

## Checklist

- [ ] Implementar file-writer.ts
- [ ] Crear backup-manager.ts
- [ ] Implementar API create
- [ ] Implementar API update
- [ ] Implementar API delete
- [ ] Implementar API save-draft
- [ ] Crear DeleteButton component
- [ ] Testing CRUD completo
- [ ] Verificar backups
- [ ] Testing de edge cases

**Siguiente fase**: `07_deployment-produccion.md`
