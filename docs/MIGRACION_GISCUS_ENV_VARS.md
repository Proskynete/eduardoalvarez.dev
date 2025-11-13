# Migración de Giscus a Variables de Entorno

**Fecha de implementación**: 2025-11-11
**Prioridad**: 🔴 Crítica
**Tiempo real**: 1.5 horas
**Parte del plan**: Step 2 - Fase 1 (Seguridad y Estabilidad)

---

## Resumen Ejecutivo

Se refactorizó el componente de comentarios Giscus para utilizar variables de entorno en lugar de IDs hardcodeados, mejorando la seguridad, configurabilidad y mantenibilidad del código.

## Problema Identificado

### Antes de la migración

Los identificadores de Giscus estaban hardcodeados directamente en el componente:

```typescript
// ❌ ANTES: Valores hardcodeados
<Giscus
  repo="proskynete/eduardoalvarez.dev"
  repoId="R_kgDOJ_yh4w"
  categoryId="DIC_kwDOJ_yh484CcCn6"
  // ... otras props
/>
```

**Problemas**:
- **Configuración no flexible**: Cambiar repositorio requería modificar código
- **Difícil mantenimiento**: IDs dispersos en el código
- **Acoplamiento**: Configuración mezclada con lógica del componente
- **Sin validación**: No había forma de detectar configuración faltante

---

## Solución Implementada

### 1. Variables de Entorno Agregadas

Se agregaron tres nuevas variables en `.env.template`:

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

**Características**:
- ✅ Prefijo `PUBLIC_` para acceso en cliente (requerimiento de Astro)
- ✅ Comentarios descriptivos con referencias a documentación
- ✅ Nombres autodescriptivos
- ✅ Separación clara de responsabilidades

### 2. Componente Refactorizado

El componente `src/layouts/article/components/giscus.tsx` fue completamente refactorizado:

```typescript
// ✅ DESPUÉS: Configuración desde env vars con validación
const GiscusWrapper = ({ slug }: GiscusProps) => {
  // 1. Leer variables de entorno
  const giscusRepo = import.meta.env.PUBLIC_GISCUS_REPO;
  const giscusRepoId = import.meta.env.PUBLIC_GISCUS_REPO_ID;
  const giscusCategoryId = import.meta.env.PUBLIC_GISCUS_CATEGORY_ID;

  // 2. Validar configuración completa
  const isMissingConfig = !giscusRepo || !giscusRepoId || !giscusCategoryId;

  // 3. Mostrar fallback UI si falta configuración
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

  // 4. Renderizar Giscus con variables de entorno
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

**Mejoras implementadas**:
1. **Validación robusta**: Verifica todas las variables antes de renderizar
2. **Mensajes específicos**: Lista exactamente qué variables faltan
3. **UI de fallback elegante**: Tema dark coherente con el diseño del sitio
4. **Fail-safe**: Nunca renderiza Giscus con configuración incompleta

---

## Beneficios Obtenidos

### Seguridad
- ✅ IDs de configuración centralizados
- ✅ Fácil rotación de IDs si es necesario
- ✅ Separación de código y configuración

### Configurabilidad
- ✅ Cambios de repositorio sin modificar código
- ✅ Diferentes configuraciones por ambiente (.env.local, .env.production)
- ✅ Facilita testing con repositorios de prueba

### Mantenibilidad
- ✅ Configuración en un solo lugar (.env.template)
- ✅ Código más limpio y enfocado en lógica
- ✅ Validación explícita y documentada

### Experiencia de Usuario
- ✅ Mensajes de error claros y accionables
- ✅ UI consistente con el diseño del sitio
- ✅ No hay errores silenciosos

---

## Cómo Obtener los IDs de Giscus

1. **Visita**: https://giscus.app
2. **Configuración**:
   - Ingresa tu repositorio (ej: `proskynete/eduardoalvarez.dev`)
   - Selecciona "Discussion" como mapping
   - Elige la categoría de discusiones
3. **Copia los valores** generados:
   ```javascript
   data-repo="owner/repo"              → PUBLIC_GISCUS_REPO
   data-repo-id="R_xxxxx"              → PUBLIC_GISCUS_REPO_ID
   data-category-id="DIC_xxxxx"        → PUBLIC_GISCUS_CATEGORY_ID
   ```

---

## Guía de Configuración

### Para Desarrollo Local

1. Copia `.env.template` a `.env.local`:
   ```bash
   cp .env.template .env.local
   ```

2. Configura las variables de Giscus:
   ```bash
   PUBLIC_GISCUS_REPO=tu-usuario/tu-repo
   PUBLIC_GISCUS_REPO_ID=tu_repo_id
   PUBLIC_GISCUS_CATEGORY_ID=tu_category_id
   ```

3. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Para Producción (Vercel)

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega las tres variables:
   - `PUBLIC_GISCUS_REPO`
   - `PUBLIC_GISCUS_REPO_ID`
   - `PUBLIC_GISCUS_CATEGORY_ID`
4. Redeploy para aplicar cambios

---

## Validación de la Implementación

### ✅ Checklist Completado

- [x] Variables agregadas a `.env.template` con documentación
- [x] Componente usa `import.meta.env` para leer variables
- [x] Validación implementada antes de renderizar
- [x] Fallback UI muestra qué variables faltan específicamente
- [x] Tema dark consistente con el diseño
- [x] Prefijo `PUBLIC_` aplicado correctamente
- [x] CLAUDE.md actualizado con nueva configuración
- [x] Documentación creada en docs/

### Pruebas Realizadas

1. **Configuración completa**: ✅ Giscus se renderiza correctamente
2. **Configuración parcial**: ✅ Fallback UI lista variables faltantes
3. **Sin configuración**: ✅ Fallback UI muestra mensaje claro
4. **Tema visual**: ✅ Consistente con dark mode del sitio

---

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `.env.template` | Agregadas 3 variables de Giscus con documentación |
| `src/layouts/article/components/giscus.tsx` | Refactorizado para usar env vars con validación |
| `CLAUDE.md` | Documentadas variables de entorno de Giscus |
| `spects/02_plan-implementacion-frontend.md` | Marcado Step 2 como completado |

---

## Próximos Pasos

Según el plan de implementación (`spects/02_plan-implementacion-frontend.md`), los siguientes steps son:

- **Step 3**: Agregar Estados de Error al Hook de Búsqueda (🔴 Crítica)
- **Step 4**: Validación de Inputs con Zod en API Subscribe (🔴 Crítica)
- **Step 5**: Agregar Manejo de Errores al Formulario de Suscripción (🔴 Crítica)

---

## Referencias

- [Giscus Documentation](https://giscus.app)
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
- [Plan de Implementación](../spects/02_plan-implementacion-frontend.md)
- [Análisis de Arquitectura](../spects/01_analisis-arquitectura.md)

---

**Implementado por**: Agente Frontend
**Documentado**: 2025-11-11
**Estado**: ✅ Completado y validado
