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

Se modificarán componentes base (`Layout`, `Header`, `Footer`) y páginas específicas (`Home`, `Artículos`, `Charlas`, `Artículo`) para mejorar su estructura HTML y atributos ARIA.

## Capabilities

### New Capabilities

- `screen-reader-nav`: Navegación optimizada mediante landmarks (banner, main, navigation, contentinfo) y headings jerárquicos.
- `keyboard-nav`: Flujo de foco lógico y visible en todos los elementos interactivos.

### Modified Capabilities

- `layout-structure`: Modificación de layouts para incluir landmarks semánticos.
- `article-components`: Actualización de tarjetas de artículos para incluir contexto semántico.

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
