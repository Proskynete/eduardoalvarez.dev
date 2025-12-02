# Fase 3: Editor de Markdown

**Tiempo estimado**: 10-12 horas
**Prioridad**: 🔴 Crítica
**Dependencias**: Fase 1, Fase 2

---

## Objetivos

Implementar un editor de markdown completo con preview en tiempo real, validación de frontmatter, auto-save y una experiencia de usuario fluida para la creación y edición de artículos.

## Stack Técnico

- **CodeMirror 6** - Editor de código moderno
- **react-markdown** - Renderizado de preview
- **rehype-highlight** - Syntax highlighting en preview
- **react-hook-form** - Gestión de formularios
- **Zod** - Validación de datos

## Instalación de Dependencias

```bash
npm install @codemirror/state @codemirror/view @codemirror/lang-markdown @codemirror/theme-one-dark
npm install @uiw/react-codemirror
npm install react-markdown rehype-highlight remark-gfm
npm install react-hook-form @hookform/resolvers
npm install react-hot-toast
```

## Estructura de Archivos

```
src/
├── components/
│   └── dashboard/
│       ├── editor/
│       │   ├── ArticleEditor.tsx          # Componente principal
│       │   ├── MarkdownEditor.tsx         # Editor CodeMirror
│       │   ├── MarkdownPreview.tsx        # Preview en tiempo real
│       │   ├── FrontmatterForm.tsx        # Formulario metadata
│       │   ├── EditorToolbar.tsx          # Barra de herramientas
│       │   ├── SectionManager.tsx         # Gestión de sections
│       │   └── AutoSave.tsx               # Indicador auto-save
│       └── ai/
│           └── AIAssistantPanel.tsx       # Panel IA (placeholder)
├── lib/
│   └── editor/
│       ├── markdown-utils.ts              # Utilidades markdown
│       ├── validation.ts                  # Schemas Zod
│       └── auto-save.ts                   # Lógica auto-save
└── pages/
    └── api/
        └── articulos/
            └── save-draft.ts              # Guardar borrador
```

## Paso 1: Validation Schemas

### src/lib/editor/validation.ts
```typescript
import { z } from 'zod';
import type { CategoryAllowed } from '@/interfaces';

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

export const SectionSchema = z.object({
  title: z.string().min(1, 'El título de la sección es requerido'),
  anchor: z.string().min(1, 'El anchor es requerido').regex(
    /^[a-z0-9-]+$/,
    'El anchor solo puede contener letras minúsculas, números y guiones'
  ),
});

export const ArticleSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100),
  slug: z.string().min(5, 'El slug debe tener al menos 5 caracteres').regex(
    /^[a-z0-9-]+$/,
    'El slug solo puede contener letras minúsculas, números y guiones'
  ),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres').max(160),
  date: z.string().datetime(),
  categories: z.array(z.enum(ALLOWED_CATEGORIES as [CategoryAllowed, ...CategoryAllowed[]])).min(1).max(3),
  seo_image: z.string().optional(),
  sections: z.array(SectionSchema).min(1, 'Debe haber al menos una sección'),
  content: z.string().min(100, 'El contenido debe tener al menos 100 caracteres'),
  status: z.enum(['draft', 'published']),
});

export type ArticleFormData = z.infer<typeof ArticleSchema>;
```

## Paso 2: Editor Principal

### src/components/dashboard/editor/ArticleEditor.tsx
```tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { ArticleSchema, type ArticleFormData } from '@/lib/editor/validation';
import FrontmatterForm from './FrontmatterForm';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';
import EditorToolbar from './EditorToolbar';
import AutoSave from './AutoSave';

interface Props {
  initialData?: Partial<ArticleFormData>;
  mode: 'create' | 'edit';
}

export default function ArticleEditor({ initialData, mode }: Props) {
  const [content, setContent] = useState(initialData?.content || '');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      date: initialData?.date || new Date().toISOString(),
      categories: initialData?.categories || [],
      seo_image: initialData?.seo_image || '',
      sections: initialData?.sections || [{ title: 'Introducción', anchor: 'introduccion' }],
      content: initialData?.content || '',
      status: initialData?.status || 'draft',
    },
  });

  // Auto-save cada 30 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      handleAutoSave();
    }, 30000);

    return () => clearInterval(timer);
  }, [content]);

  // Sincronizar content con form
  useEffect(() => {
    form.setValue('content', content);
  }, [content]);

  async function handleAutoSave() {
    if (!content || saving) return;

    setSaving(true);
    try {
      const formData = form.getValues();

      await fetch('/api/articulos/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setSaving(false);
    }
  }

  async function onSubmit(data: ArticleFormData) {
    setSaving(true);

    try {
      const endpoint = mode === 'create'
        ? '/api/articulos/create'
        : '/api/articulos/update';

      const response = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al guardar');
      }

      toast.success(
        data.status === 'published'
          ? 'Artículo publicado exitosamente'
          : 'Borrador guardado'
      );

      // Redirigir al dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
      <Toaster position="top-right" />

      {/* Toolbar */}
      <EditorToolbar
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onSave={() => form.handleSubmit(onSubmit)()}
        saving={saving}
      />

      {/* Auto-save indicator */}
      <AutoSave saving={saving} lastSaved={lastSaved} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Frontmatter */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto p-6">
          <FrontmatterForm form={form} />
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 flex">
          {!showPreview || showPreview === false ? (
            <div className="flex-1">
              <MarkdownEditor
                value={content}
                onChange={setContent}
              />
            </div>
          ) : null}

          {showPreview && (
            <div className="flex-1 border-l border-gray-700">
              <MarkdownPreview content={content} />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
```

## Paso 3: Editor de Markdown con CodeMirror

### src/components/dashboard/editor/MarkdownEditor.tsx
```tsx
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: Props) {
  return (
    <div className="h-full">
      <CodeMirror
        value={value}
        height="100%"
        theme={oneDark}
        extensions={[markdown()]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
        }}
        className="text-base"
      />
    </div>
  );
}
```

## Paso 4: Preview de Markdown

### src/components/dashboard/editor/MarkdownPreview.tsx
```tsx
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/monokai.css';

interface Props {
  content: string;
}

export default function MarkdownPreview({ content }: Props) {
  return (
    <div className="h-full overflow-y-auto bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto prose prose-invert prose-blue">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
```

## Paso 5: Formulario de Frontmatter

### src/components/dashboard/editor/FrontmatterForm.tsx
```tsx
import { UseFormReturn } from 'react-hook-form';
import type { ArticleFormData } from '@/lib/editor/validation';
import SectionManager from './SectionManager';

interface Props {
  form: UseFormReturn<ArticleFormData>;
}

const CATEGORIES = [
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

export default function FrontmatterForm({ form }: Props) {
  const { register, formState: { errors }, watch, setValue } = form;

  // Auto-generar slug desde título
  function handleTitleChange(title: string) {
    setValue('title', title);

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    setValue('slug', slug);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Metadata</h2>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Título *
        </label>
        <input
          type="text"
          {...register('title')}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="Mi Artículo Increíble"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Slug *
        </label>
        <input
          type="text"
          {...register('slug')}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="mi-articulo-increible"
        />
        {errors.slug && (
          <p className="text-red-400 text-sm mt-1">{errors.slug.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Descripción SEO * (50-160 caracteres)
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="Descripción optimizada para SEO..."
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && (
            <p className="text-red-400 text-sm">{errors.description.message}</p>
          )}
          <span className="text-gray-500 text-sm">
            {watch('description')?.length || 0}/160
          </span>
        </div>
      </div>

      {/* Categorías */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Categorías * (máx 3)
        </label>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={cat}
                {...register('categories')}
                className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">{cat}</span>
            </label>
          ))}
        </div>
        {errors.categories && (
          <p className="text-red-400 text-sm mt-1">{errors.categories.message}</p>
        )}
      </div>

      {/* Secciones */}
      <SectionManager form={form} />

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Estado
        </label>
        <select
          {...register('status')}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
        >
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
      </div>
    </div>
  );
}
```

## Paso 6: Gestor de Secciones

### src/components/dashboard/editor/SectionManager.tsx
```tsx
import { UseFormReturn } from 'react-hook-form';
import type { ArticleFormData } from '@/lib/editor/validation';

interface Props {
  form: UseFormReturn<ArticleFormData>;
}

export default function SectionManager({ form }: Props) {
  const { watch, setValue } = form;
  const sections = watch('sections') || [];

  function addSection() {
    setValue('sections', [
      ...sections,
      { title: '', anchor: '' },
    ]);
  }

  function removeSection(index: number) {
    setValue('sections', sections.filter((_, i) => i !== index));
  }

  function updateSection(index: number, field: 'title' | 'anchor', value: string) {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };

    // Auto-generar anchor desde título
    if (field === 'title') {
      const anchor = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      newSections[index].anchor = anchor;
    }

    setValue('sections', newSections);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-300">
          Secciones *
        </label>
        <button
          type="button"
          onClick={addSection}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          + Agregar
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={index} className="bg-gray-700 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Sección {index + 1}</span>
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Eliminar
                </button>
              )}
            </div>

            <input
              type="text"
              value={section.title}
              onChange={(e) => updateSection(index, 'title', e.target.value)}
              placeholder="Título de la sección"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm mb-2"
            />

            <input
              type="text"
              value={section.anchor}
              onChange={(e) => updateSection(index, 'anchor', e.target.value)}
              placeholder="anchor-auto-generado"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Paso 7: Toolbar y Auto-save

### src/components/dashboard/editor/EditorToolbar.tsx
```tsx
interface Props {
  showPreview: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  saving: boolean;
}

export default function EditorToolbar({ showPreview, onTogglePreview, onSave, saving }: Props) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onTogglePreview}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
        >
          {showPreview ? '📝 Editor' : '👁️ Preview'}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <a
          href="/dashboard"
          className="px-4 py-1.5 text-gray-400 hover:text-white text-sm font-medium transition-colors"
        >
          Cancelar
        </a>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
        >
          {saving ? 'Guardando...' : '💾 Guardar'}
        </button>
      </div>
    </div>
  );
}
```

### src/components/dashboard/editor/AutoSave.tsx
```tsx
interface Props {
  saving: boolean;
  lastSaved: Date | null;
}

export default function AutoSave({ saving, lastSaved }: Props) {
  function formatTime(date: Date): string {
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-2 text-xs text-gray-400">
      {saving && <span>💾 Guardando...</span>}
      {!saving && lastSaved && (
        <span>✅ Guardado automáticamente a las {formatTime(lastSaved)}</span>
      )}
      {!saving && !lastSaved && <span>Sin cambios guardados</span>}
    </div>
  );
}
```

## Testing Manual

1. Navegar a `/dashboard/articulos/nuevo`
2. Completar campos del formulario
3. Escribir contenido en markdown
4. Verificar auto-completado de slug
5. Verificar auto-generación de anchors
6. Alternar entre editor y preview
7. Verificar auto-save cada 30 segundos
8. Guardar borrador
9. Publicar artículo

## Checklist

- [ ] Instalar dependencias
- [ ] Crear validation schemas
- [ ] Implementar ArticleEditor
- [ ] Integrar CodeMirror
- [ ] Crear MarkdownPreview
- [ ] Implementar FrontmatterForm
- [ ] Crear SectionManager
- [ ] Implementar EditorToolbar
- [ ] Crear AutoSave
- [ ] Testing completo

**Siguiente fase**: `04_integracion-openai.md`
