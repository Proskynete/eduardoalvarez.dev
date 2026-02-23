# Proposal: Interface Design Improvements

## Why

Una auditoría de diseño del sitio reveló un conjunto de inconsistencias visuales, bugs de UI y oportunidades de mejora que degradan la coherencia y la credibilidad del sitio como portfolio profesional. Los problemas van desde bugs críticos (formato de fecha incorrecto visible al usuario) hasta inconsistencias sistemáticas de diseño que rompen la identidad visual establecida.

## What Changes

### Crítico

- **Bug**: Corregir el formato de fecha en el header de artículos individuales — actualmente muestra `9/29/2024` (formato US) en lugar de `29 de septiembre de 2024` (español, consistente con el resto del sitio)
- **Bug**: Cambiar el color de la barra de progreso de lectura de `teal-700` a `primary-500` (pink) — actualmente usa un color de acento que no existe en el sistema de diseño del sitio

### Alto impacto

- **Feature**: Agregar chips de categoría a las tarjetas de artículos en la lista y en la home — la metadata `categories` existe en el frontmatter pero no se muestra, impidiendo el escaneo por tema
- **Fix**: Mejorar la visibilidad e indicación del botón dropdown `⋮` en las cards de Charlas/Talleres — actualmente no tiene hover state ni indicación visual de que es interactivo
- **Fix**: Agregar estado activo visible en los links de la navegación principal — la página actual no tiene diferenciación visual clara respecto a los otros links

### Medio impacto

- **Fix**: Corregir la alineación del link "Ver todos los artículos →" en la home — actualmente está alineado a la derecha (`text-right`) mientras todo el contenido circundante está alineado a la izquierda
- **Fix**: Aumentar el `font-weight` de los párrafos en artículos de `300` a `400` — el texto fino sobre fondo negro reduce el contraste perceptual y la legibilidad
- **Improvement**: Mejorar el diseño visual de la sección de suscripción — el bloque carece de jerarquía tipográfica clara (el texto descriptivo no tiene tratamiento de heading real) y se ve desconectado del resto del contenido

### Bajo impacto

- **Improvement**: Enriquecer el footer con copyright y enlace de vuelta al inicio — actualmente solo contiene redes sociales + string terminal, sin información básica esperada
- **Fix**: Mostrar la duración real del episodio en el audio player del podcast en estado idle — actualmente muestra `0:00` hasta que el audio carga, cuando debería mostrar la duración del episodio desde el metadata

## Capabilities

### New Capabilities

- `article-card-categories`: Visualización de categorías en las tarjetas de artículos, tanto en la lista `/articulos` como en la sección de "Últimos artículos" de la home. Incluye chips con etiquetas legibles (ej. "Desarrollo Web", "JavaScript").
- `navigation-active-state`: Indicador visual del link activo en la navegación principal, coherente con el estilo terminal existente del sitio.

### Modified Capabilities

_(No existen specs previas en el proyecto — no hay capabilities existentes que modificar)_

## Impact

**Archivos afectados:**

- `src/layouts/article/components/head.astro` — fix de formato de fecha con locale `es-CL`
- `src/components/scrolling-progress-bar/index.tsx` — cambio de clase `bg-teal-700` a `bg-primary-500`
- `src/components/article/index.astro` — agregar chips de categoría en las tarjetas
- `src/pages/charlas-talleres/index.astro` — mejorar visibilidad del botón dropdown
- `src/components/dropdown/index.tsx` — mejorar indicación visual de interactividad
- `src/layouts/base/components/header/index.astro` — agregar estado activo en navegación
- `src/pages/index.astro` — corregir alineación de "Ver todos los artículos"
- `src/assets/styles/article.css` — cambiar `font-weight: 300` a `font-weight: 400`
- `src/components/subscribe/index.astro` — mejorar jerarquía visual del bloque
- `src/layouts/base/components/footer/index.astro` — agregar copyright y back-to-top
- `src/pages/podcasts/index.astro` + `src/components/audio-player/index.tsx` — mostrar duración real desde metadata

**Dependencias:** Ninguna nueva dependencia requerida. Todos los cambios son CSS/HTML/TSX sobre el stack existente.

**APIs / Breaking Changes:** Ninguno. Los cambios son puramente de presentación.

<success_criteria>

- El header de cada artículo muestra la fecha en formato `DD de MMMM de YYYY` en español
- La barra de progreso de lectura usa el mismo color pink del sistema de diseño (`#ec4899`)
- Las tarjetas de artículos muestran los chips de categorías tanto en `/articulos` como en la home
- El botón `⋮` en Charlas/Talleres tiene un estado hover visible y un `aria-label` descriptivo
- La navegación principal muestra visualmente cuál es la página activa
- El link "Ver todos los artículos →" está alineado a la izquierda o al centro, coherente con el contenido circundante
- El texto de los párrafos en artículos es legible sin parecer demasiado delgado sobre fondo oscuro
- La sección de suscripción tiene un heading real y jerarquía tipográfica clara
- El footer incluye año de copyright y un enlace funcional de vuelta al inicio
- El audio player en estado idle muestra la duración del episodio, no `0:00`

</success_criteria>

<unlocks>
Completing this artifact enables: design, specs
</unlocks>
