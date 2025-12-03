# Especificación: Accesibilidad con Screen Readers

## Descripción

Especificación completa para implementar accesibilidad con lectores de pantalla en todas las vistas del sitio web, permitiendo navegación coherente mediante landmarks, headings y estructura semántica.

## Objetivo

Que usuarios de lectores de pantalla puedan:
- ✅ Comprender inmediatamente la estructura de cada vista
- ✅ Navegar eficientemente usando Tab y atajos de screen readers
- ✅ Acceder a secciones y subsecciones de manera lógica
- ✅ Recibir contexto completo en cada elemento

## Documentos

### 1. Análisis Técnico
**Archivo**: `01_analisis-tecnico.md`
**Tamaño**: 19KB
**Contenido**:
- Conceptos fundamentales (Landmarks, Headings, ARIA, Focus)
- Diagnóstico del estado actual
- Arquitectura de navegación por teclado
- Jerarquía semántica
- Referencias WCAG 2.1
- Herramientas de testing (VoiceOver, NVDA, axe-core)
- Glosario completo

### 2. Plan de Implementación
**Archivo**: `02_plan-implementacion.md`
**Tamaño**: 22KB
**Contenido**:
- Estrategia incremental en 4 fases
- Detalle de tareas por fase
- Checklist por vista
- 7 patrones comunes reutilizables
- Guía de testing (manual y automático)
- Criterios de aceptación
- Formato de commits sugeridos

### 3. Guía: Home
**Archivo**: `03_guia-home.md`
**Tamaño**: 20KB
**Fase**: 1
**Estimado**: 2-3 horas
**Contenido**:
- Mejoras en sección de perfil
- Redes sociales como navegación con lista
- Sección de artículos identificada
- Formulario de newsletter accesible
- Testing completo
- Experiencia antes/después

### 4. Guía: Artículos Listing
**Archivo**: `04_guia-articulos-listing.md`
**Tamaño**: 18KB
**Fase**: 2
**Estimado**: 1-2 horas
**Contenido**:
- Simplificación de estructura
- Paginación como navegación
- Lista semántica de artículos
- ARIA labels descriptivos
- Casos especiales (primera/última página)
- Testing completo

### 5. Guía: Charlas y Talleres
**Archivo**: `05_guia-charlas-talleres.md`
**Tamaño**: 28KB
**Fase**: 3
**Estimado**: 2-3 horas
**Contenido**:
- Corrección de jerarquía de headings (h3 → h2)
- Dropdown completamente accesible
- Metadata con definition lists
- Organizaciones como lista semántica
- Manejo de imágenes decorativas vs informativas
- Testing extensivo de dropdown

### 6. Guía: Artículo Individual
**Archivo**: `06_guia-articulo-individual.md`
**Tamaño**: 26KB
**Fase**: 4
**Estimado**: 3-4 horas
**Contenido**:
- Article con aria-labelledby
- Aside reestructurado como navegación
- TOC con nav y lista semántica
- Secciones de contenido y comentarios identificadas
- Artículos relacionados como navegación
- Botón de compartir accesible
- Testing completo

## Resumen Técnico

### Vistas Cubiertas
1. ✅ Home (/)
2. ✅ Artículos Listing (/articulos)
3. ✅ Charlas y Talleres (/charlas-talleres)
4. ✅ Artículo Individual (/articulos/[slug])

### Landmarks Implementados
- `<header>` → Banner
- `<nav>` → Navigation (múltiples)
- `<main>` → Main content
- `<aside>` → Complementary
- `<section>` → Regions (con aria-label)
- `<article>` → Articles
- `<footer>` → Contentinfo

### Jerarquía de Headings

```
Home:
h1 → h2 → h3

Artículos Listing:
h1 → h3 (en tarjetas)

Charlas y Talleres:
h1 → h2 → h3

Artículo Individual:
h1 → h2 (sidebar) → h3 (relacionados)
  → h2 (contenido) → h3 → h4
```

### Patrones Reutilizables
1. Section con heading identificado
2. Lista de items (`<ul><li><article>`)
3. Navegación de links (`<nav><ul><li>`)
4. Metadata accesible (`<time>`, `<dl>`)
5. Imágenes (decorativas vs informativas)
6. Formulario accesible
7. Dropdown accesible

### Criterios WCAG 2.1 Cumplidos
- ✅ 1.3.1 Info and Relationships (Level A)
- ✅ 1.3.2 Meaningful Sequence (Level A)
- ✅ 2.1.1 Keyboard (Level A)
- ✅ 2.4.1 Bypass Blocks (Level A)
- ✅ 2.4.3 Focus Order (Level A)
- ✅ 2.4.6 Headings and Labels (Level AA)
- ✅ 2.4.7 Focus Visible (Level AA)
- ✅ 4.1.2 Name, Role, Value (Level A)
- ✅ 4.1.3 Status Messages (Level AA)

## Testing

### Manual
- ✅ Navegación por teclado (Tab, Shift+Tab)
- ✅ VoiceOver (macOS): Landmarks, Headings, Listas
- ✅ NVDA (Windows): Navegación completa
- ✅ TalkBack (Android): Opcional

### Automático
```bash
# Por vista
npm run test:a11y:home
npm run test:a11y:articles
npm run test:a11y:talks
npm run test:a11y:article

# Todas las vistas
npm run test:a11y:all
```

### Herramientas
- axe DevTools (extensión navegador)
- axe-core CLI (npm)
- Pa11y (opcional)
- WAVE (opcional)

## Implementación

### Orden Sugerido
1. **Fase 1**: Home → Testing → Commit
2. **Fase 2**: Artículos Listing → Testing → Commit
3. **Fase 3**: Charlas y Talleres → Testing → Commit
4. **Fase 4**: Artículo Individual → Testing → Commit

### Commits Sugeridos
Cada fase debe tener su propio commit siguiendo este formato:

```bash
feat(a11y): improve screen reader accessibility on [vista] ♿️

[Descripción de cambios]

Screen reader navigation:
- Landmarks: [lista]
- Headings: [jerarquía]
- [Características específicas]

Testing:
- VoiceOver: [resultado]
- Tab order: [resultado]
- axe-core: 0 violations

Documentation: specs/accesibilidad-screen-readers/[guía].md
```

## Métricas de Éxito

### Antes
- ❌ Estructura confusa
- ❌ Landmarks faltantes
- ❌ Headings desordenados
- ❌ ARIA labels genéricos o ausentes
- ❌ Navegación por teclado incompleta

### Después
- ✅ Estructura semántica completa
- ✅ Todos los landmarks identificados
- ✅ Jerarquía de headings correcta
- ✅ ARIA labels descriptivos
- ✅ Navegación por teclado 100% funcional
- ✅ 0 violaciones en axe-core
- ✅ Experiencia coherente con screen readers

## Referencias

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WebAIM: Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Deque axe DevTools](https://www.deque.com/axe/devtools/)

## Contacto

**Autor**: Eduardo Álvarez
**Fecha de creación**: 2025-12-03
**Versión**: 1.0.0
**Estado**: ✅ Completo y listo para implementación

---

Para comenzar la implementación, empieza por la **Fase 1: Home** siguiendo la guía `03_guia-home.md`.
