# Proposal: Accesibilidad con Screen Readers

## Goal

Implementar accesibilidad completa para lectores de pantalla en todas las vistas del sitio web, permitiendo navegación coherente mediante landmarks, headings y estructura semántica.

## Problem

Actualmente, el sitio carece de landmarks claros, jerarquía de headings consistente y etiquetas ARIA descriptivas, lo que dificulta la navegación para usuarios de tecnologías de asistencia.

## Solution

Reestructurar el HTML semántico, implementar landmarks ARIA, corregir la jerarquía de headings y asegurar que todos los elementos interactivos sean accesibles por teclado y screen readers.

## Goals / Non-goals

### Goals

- **Navegación**: Estructura semántica completa con landmarks y headings correctos.
- **Teclado**: Navegación por teclado 100% funcional sin focus traps.
- **Contexto**: ARIA labels descriptivos en elementos interactivos y regiones.
- **Compliance**: Cumplimiento de criterios WCAG 2.1 relevantes (A y AA).

### Non-goals

- Rediseño visual completo (solo cambios estructurales/semánticos).
- Soporte para navegadores obsoletos (IE11).

## What Changes

Se modificarán componentes base (`Layout`, `Header`, `Footer`) y páginas específicas (`Home`, `Artículos`, `Charlas`, `Proyectos`, `Stack`, `Now`, `Podcasts`, `Artículo`) para mejorar su estructura HTML y atributos ARIA.

> **Contexto post-rebranding**: El sitio fue completamente rediseñado. Las URLs cambiaron (`/articulos` → `/articles`, `/charlas-talleres` → `/speaking`). La página de charlas ahora usa una lista agrupada por año sin dropdown. No hay paginación en la lista de artículos (reemplazada por filtro client-side). El skip link ya está implementado en `src/layouts/base/index.astro`. Se añadieron nuevas páginas: `/now`, `/stack`, `/about`, `/working-with-me`, `/newsletter`, `/projects`.

## Capabilities

### New Capabilities

- `screen-reader-nav`: Navegación optimizada mediante landmarks (banner, main, navigation, contentinfo) y headings jerárquicos en todas las páginas existentes y las nuevas (`/now`, `/stack`, `/about`, `/working-with-me`, `/newsletter`, `/projects`).
- `keyboard-nav`: Flujo de foco lógico y visible en todos los elementos interactivos.

### Modified Capabilities

- `layout-structure`: Modificación de layouts para incluir landmarks semánticos.
- `article-components`: Actualización de tarjetas de artículos para incluir contexto semántico.
- `article-aside`: El sidebar del artículo (`aside.astro`) ya tiene `<nav>` para secciones pero le falta `aria-label="Tabla de contenidos"` y estructura ARIA en las tarjetas de categorías/tags.

## Impact

- **Frontend**: Cambios en HTML/Astro components. No afecta lógica de negocio ni backend.
- **CSS**: Asegurar visibilidad del foco.

</template>

<success_criteria>

- 0 violaciones en auditoría axe-core.
- Navegación por landmarks funcional en VoiceOver/NVDA.
- Jerarquía de headings lógica (h1 -> h2 -> h3).
  </success_criteria>

<unlocks>
Completing this artifact enables: design, specs
</unlocks>
