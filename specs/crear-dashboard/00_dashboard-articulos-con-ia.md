# Dashboard de Artículos con IA - Especificación General

**Fecha**: 2025-12-02
**Prioridad**: 🟡 Media
**Complejidad**: 🔴 Alta
**Tiempo estimado**: 40-50 horas

---

## Resumen Ejecutivo

Desarrollo de un dashboard privado para la creación de artículos de blog con capacidades de IA integradas. El sistema permitirá escribir contenido en markdown, generar descripciones SEO automáticamente y crear imágenes de portada usando inteligencia artificial.

## Objetivos del Proyecto

### Funcionalidades Core

1. **Autenticación y Seguridad**
   - Ruta privada protegida con autenticación
   - Sistema de sesiones seguro
   - Middleware de protección de rutas

2. **Editor de Artículos**
   - Editor de markdown con vista previa en tiempo real
   - Sintaxis highlighting
   - Autocompletado de frontmatter
   - Validación de campos requeridos

3. **Generación con IA**
   - Descripción SEO optimizada basada en el contenido
   - Generación de imagen de portada contextual
   - Sugerencias de títulos alternativos
   - Generación de tags/categorías relevantes

4. **Gestión de Artículos**
   - Crear nuevos artículos
   - Editar artículos existentes
   - Previsualizar antes de publicar
   - Guardar borradores
   - Publicar/despublicar

## Stack Tecnológico Propuesto

### Backend & Auth
- **Astro API Routes** - Endpoints serverless
- **Auth.js (NextAuth)** - Autenticación
- **Bcrypt** - Hashing de passwords
- **Zod** - Validación de schemas

### Editor & UI
- **React** - Componentes interactivos
- **CodeMirror 6** o **Monaco Editor** - Editor de código
- **react-markdown** - Preview de markdown
- **Tailwind CSS** - Estilos
- **Headless UI** - Componentes accesibles

### IA & Generación de Contenido
- **OpenAI GPT-4** - Generación de texto SEO
- **DALL-E 3** o **Midjourney API** - Generación de imágenes
- **Anthropic Claude** (alternativa) - Generación de contenido

### Almacenamiento
- **Sistema de archivos** - Archivos .mdx
- **Sharp** - Optimización de imágenes
- **Gray Matter** - Procesamiento de frontmatter

## Arquitectura del Sistema

```
src/
├── pages/
│   ├── dashboard/
│   │   ├── index.astro                 # Dashboard principal
│   │   ├── articulos/
│   │   │   ├── nuevo.astro             # Crear artículo
│   │   │   ├── editar/[slug].astro     # Editar artículo
│   │   │   └── preview/[slug].astro    # Preview artículo
│   │   └── login.astro                 # Login
│   └── api/
│       ├── auth/
│       │   ├── login.ts                # POST login
│       │   ├── logout.ts               # POST logout
│       │   └── session.ts              # GET session actual
│       ├── articulos/
│       │   ├── list.ts                 # GET lista de artículos
│       │   ├── create.ts               # POST crear artículo
│       │   ├── update.ts               # PUT actualizar artículo
│       │   ├── delete.ts               # DELETE eliminar artículo
│       │   └── [slug].ts               # GET artículo por slug
│       └── ai/
│           ├── generate-description.ts # POST generar SEO
│           ├── generate-image.ts       # POST generar imagen
│           ├── suggest-title.ts        # POST sugerir títulos
│           └── suggest-tags.ts         # POST sugerir tags
├── components/
│   └── dashboard/
│       ├── ArticleEditor.tsx           # Editor principal
│       ├── MarkdownPreview.tsx         # Preview en tiempo real
│       ├── FrontmatterForm.tsx         # Formulario metadata
│       ├── AIAssistant.tsx             # Panel de IA
│       ├── ImageGenerator.tsx          # Generador de imágenes
│       ├── ArticleList.tsx             # Lista de artículos
│       └── ProtectedRoute.tsx          # HOC de protección
├── middleware/
│   └── auth.ts                         # Middleware de autenticación
├── lib/
│   ├── auth/
│   │   ├── session.ts                  # Manejo de sesiones
│   │   └── password.ts                 # Hashing/verificación
│   ├── ai/
│   │   ├── openai.ts                   # Cliente OpenAI
│   │   ├── prompts.ts                  # Templates de prompts
│   │   └── image-generator.ts          # Generación de imágenes
│   └── articles/
│       ├── file-manager.ts             # CRUD de archivos .mdx
│       ├── validator.ts                # Validación de artículos
│       └── slug-generator.ts           # Generación de slugs
└── types/
    └── dashboard.ts                    # TypeScript types
```

## Flujo de Usuario

### 1. Autenticación
```
Usuario → /dashboard → Middleware → ¿Autenticado?
                                    │
                        No ─────────┴────────→ /dashboard/login
                                    │
                        Sí ─────────┴────────→ /dashboard (Dashboard)
```

### 2. Creación de Artículo
```
Dashboard → Nuevo Artículo → Editor
                              │
                              ├─→ Escribir contenido markdown
                              ├─→ Completar frontmatter
                              ├─→ Generar descripción SEO (IA)
                              ├─→ Generar imagen (IA)
                              ├─→ Preview
                              └─→ Guardar/Publicar
```

### 3. Generación con IA
```
Contenido del artículo
    │
    ├─→ API: /api/ai/generate-description
    │   └─→ GPT-4 analiza contenido
    │       └─→ Retorna descripción SEO optimizada
    │
    ├─→ API: /api/ai/generate-image
    │   └─→ Analiza tema del artículo
    │       └─→ DALL-E 3 genera imagen
    │           └─→ Optimiza con Sharp
    │               └─→ Guarda en /images/articulos/
    │
    └─→ API: /api/ai/suggest-tags
        └─→ GPT-4 analiza contenido
            └─→ Retorna categorías relevantes
```

## Características de Seguridad

### Autenticación
- Contraseña hasheada con bcrypt (12 rounds)
- Sesiones con tokens JWT
- HttpOnly cookies
- CSRF protection
- Rate limiting en endpoints

### Autorización
- Middleware en todas las rutas /dashboard/*
- Validación de sesión en cada request
- Timeout de sesión (30 minutos inactividad)

### Validación
- Zod schemas en todos los endpoints
- Sanitización de inputs
- Validación de archivos subidos
- Límites de tamaño de contenido

## Integración con IA

### OpenAI GPT-4 - Generación de SEO
**Prompt Template:**
```typescript
Analiza el siguiente artículo de blog sobre [TEMA]:

[CONTENIDO]

Genera una descripción SEO optimizada de máximo 160 caracteres que:
1. Incluya palabras clave relevantes
2. Sea atractiva para clicks
3. Resuma el valor del contenido
4. Use voz activa
```

### DALL-E 3 - Generación de Imágenes
**Prompt Template:**
```typescript
Crea una imagen de portada para un artículo de blog sobre [TEMA].
La imagen debe:
- Ser profesional y moderna
- Usar colores [PALETA]
- Estilo: minimalista, tech-oriented
- Relación de aspecto: 16:9
- Sin texto en la imagen

Contexto del artículo:
[RESUMEN]
```

## Consideraciones Técnicas

### Performance
- Lazy loading de editor
- Debounce en preview (500ms)
- Caché de artículos en memoria
- Optimización de imágenes automática

### UX/UI
- Loading states en generación IA
- Indicadores de progreso
- Auto-save cada 30 segundos
- Confirmación antes de salir con cambios sin guardar

### Costos de IA
- GPT-4: ~$0.03 por descripción
- DALL-E 3: ~$0.04 por imagen HD
- Límite de generaciones por día
- Cache de resultados similares

## Estructura de Datos

### Article Schema
```typescript
interface Article {
  title: string;
  slug: string;
  description: string;
  date: string;
  categories: CategoryAllowed[];
  seo_image: string;
  sections: Section[];
  content: string;
  status: 'draft' | 'published';
  aiGenerated?: {
    description: boolean;
    image: boolean;
    tags: boolean;
  };
}
```

### Frontmatter Example
```yaml
---
layout: ../../layouts/article/index.astro
title: "Mi Nuevo Artículo"
slug: "mi-nuevo-articulo"
description: "Descripción generada por IA optimizada para SEO"
date: 2025-12-02T10:00:00-03:00
categories: ["javascript", "react"]
seo_image: /images/articulos/mi-nuevo-articulo/cover.webp
status: published
aiGenerated:
  description: true
  image: true
  tags: true
sections:
  - { title: 'Introducción', anchor: 'introduccion' }
  - { title: 'Desarrollo', anchor: 'desarrollo' }
  - { title: 'Conclusión', anchor: 'conclusion' }
---
```

## Plan de Implementación

Este proyecto se divide en **7 fases principales**:

1. **Fase 1: Autenticación y Seguridad** (8-10 horas)
   - Setup de Auth.js
   - Sistema de login
   - Middleware de protección
   - Gestión de sesiones

2. **Fase 2: Dashboard Base** (6-8 horas)
   - Layout del dashboard
   - Lista de artículos
   - Navegación
   - Estados vacíos

3. **Fase 3: Editor de Artículos** (10-12 horas)
   - Integración de CodeMirror/Monaco
   - Preview de markdown
   - Formulario de frontmatter
   - Auto-save

4. **Fase 4: Integración OpenAI** (8-10 horas)
   - Cliente de OpenAI
   - Generación de descripción SEO
   - Sugerencia de títulos/tags
   - Manejo de errores

5. **Fase 5: Generación de Imágenes** (6-8 horas)
   - Integración DALL-E 3
   - Optimización de imágenes
   - Sistema de almacenamiento
   - Fallbacks

6. **Fase 6: Gestión de Archivos** (4-6 horas)
   - CRUD de archivos .mdx
   - Validación de contenido
   - Generación de slugs
   - Backup automático

7. **Fase 7: Testing y Refinamiento** (4-6 horas)
   - Tests de integración
   - UX improvements
   - Manejo de errores
   - Documentación

## Variables de Entorno Requeridas

```env
# Autenticación
AUTH_SECRET=your-secret-key-min-32-chars
AUTH_USERNAME=admin
AUTH_PASSWORD_HASH=$2b$12$...
SESSION_MAX_AGE=1800000

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=500

# DALL-E
DALLE_MODEL=dall-e-3
DALLE_SIZE=1792x1024
DALLE_QUALITY=hd

# Rate Limiting
AI_REQUESTS_PER_DAY=50
```

## Riesgos y Mitigaciones

### Riesgo 1: Costos de IA elevados
**Mitigación:**
- Límite diario de requests
- Cache de generaciones
- Opción de usar descripciones manuales

### Riesgo 2: Fallos en generación de IA
**Mitigación:**
- Fallbacks a valores por defecto
- Retry logic con exponential backoff
- Mensajes de error claros

### Riesgo 3: Seguridad del dashboard
**Mitigación:**
- Autenticación robusta
- Rate limiting
- CSRF protection
- Validación estricta de inputs

### Riesgo 4: Performance del editor
**Mitigación:**
- Lazy loading de componentes
- Debouncing de preview
- Virtual scrolling en lista de artículos

## Métricas de Éxito

- ✅ Tiempo de creación de artículo < 10 minutos
- ✅ Tasa de éxito de generación IA > 95%
- ✅ Calidad de descripción SEO (score > 80/100)
- ✅ Zero vulnerabilidades de seguridad
- ✅ Uptime del dashboard > 99%

## Próximos Pasos

Ver archivos de especificación detallada:
- `01_autenticacion-seguridad.md` - Sistema de autenticación
- `02_arquitectura-dashboard.md` - Arquitectura del dashboard
- `03_editor-markdown.md` - Editor de markdown
- `04_integracion-openai.md` - Integración con OpenAI
- `05_generacion-imagenes.md` - Sistema de generación de imágenes
- `06_gestion-archivos.md` - CRUD de archivos MDX
- `07_deployment-produccion.md` - Deploy y configuración

---

**Nota**: Esta es una iniciativa compleja que requiere planificación cuidadosa. Cada fase debe completarse y validarse antes de pasar a la siguiente.
