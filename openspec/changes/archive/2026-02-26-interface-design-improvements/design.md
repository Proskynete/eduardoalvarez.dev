# Design: Interface Design Improvements

## Context

El sitio `eduardoalvarez.dev` es un blog/portfolio personal con una identidad visual bien definida: tema oscuro (`bg-black/95`), fuentes personalizadas (Hero, Avenir), acento principal `pink-500`/`#ec4899`, y una firma terminal en la navegación (`cd ./artículos`). Sin embargo, una auditoría reveló que varios componentes se implementaron con valores que no pertenecen al sistema de diseño establecido (`teal-700` en el progress bar, `font-weight: 300` en artículos), y que la metadata disponible en el frontmatter (categorías) no está siendo surfaced al usuario en las vistas de listado.

Los cambios en este documento son todos **aditivos o correctivos** — no introducen nuevos patrones arquitectónicos ni dependencias externas. Ningún cambio afecta APIs, datos, o lógica de negocio.

## Goals / Non-Goals

**Goals:**
- Corregir inconsistencias donde el código se desvía del sistema de diseño establecido
- Surfacear datos ya disponibles (categorías) en componentes que aún no los muestran
- Mejorar micro-interacciones (hover states, estados activos) que actualmente están ausentes
- Mantener la coherencia 100% con el stack existente (Tailwind, Astro, React)

**Non-Goals:**
- Rediseño de la identidad visual (colores, fuentes, o layout principal)
- Introducción de animaciones complejas o librerías de UI
- Cambios en la lógica de backend o APIs
- Modificación del sistema de categorías (solo presentación, no nueva lógica)

## Decisions

### 1. Formato de fecha en artículos → `toLocaleDateString('es-CL', { ... })`

**Problema actual:** `src/layouts/article/components/head.astro` usa `new Date(date).toLocaleDateString()` sin especificar locale, lo que produce `9/29/2024` en sistemas con locale US.

**Decisión:** Usar `toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })` para producir `29 de septiembre de 2024`, consistente con el resto del sitio.

**Alternativa considerada:** Usar `date-fns` con locale es. Rechazada — añadir una dependencia para formatear una sola fecha es over-engineering. La API nativa del browser es suficiente y ya se usa en `src/utils/date.ts`.

---

### 2. Barra de progreso → clase Tailwind del sistema de diseño

**Problema actual:** `src/components/scrolling-progress-bar/index.tsx` tiene hardcodeado `bg-teal-700`, un color que no existe en la paleta del sitio.

**Decisión:** Reemplazar `bg-teal-700` por `bg-primary-500` (que en `tailwind.config.mjs` mapea a `pink-500`). Un solo cambio de clase, sin refactor.

**Alternativa considerada:** Crear una variable CSS `--progress-bar-color`. Rechazada — no hay casos de uso donde el progress bar deba tener un color diferente al acento principal.

---

### 3. Chips de categoría en tarjetas → render condicional en el componente existente

**Problema actual:** `src/components/article/index.astro` recibe la prop `categories` pero no la renderiza.

**Decisión:** Agregar un bloque condicional dentro del componente que mapee `categories` a chips con el mismo estilo de badges que ya existe en el sidebar del artículo (`src/layouts/article/components/aside.astro`). Reusar las clases existentes: `text-xs rounded-full px-2 py-0.5` con colores de la paleta `gray`.

**Consideración:** Las categorías usan slugs (`web-development`, `javascript`). Se necesita un mapeo a etiquetas legibles. Aprovechar la función/mapa que ya existe en `src/utils/categories.ts`.

---

### 4. Estado activo en navegación → comparación de `Astro.url.pathname`

**Problema actual:** Todos los links de la nav tienen el mismo estilo visual sin importar la página activa.

**Decisión:** En `src/layouts/base/components/header/index.astro`, usar `Astro.url.pathname` para comparar con el `href` de cada link. Al link activo, aplicar `text-white` + subrayado o un indicador consistente con la estética terminal (ej. cursor `_` parpadeante vía CSS, o simplemente `border-b border-primary-500`).

**Alternativa considerada:** Agregar `aria-current="page"` y usar CSS attribute selectors. Incluida como complemento (accesibilidad), no como reemplazo del cambio visual.

---

### 5. Botón `⋮` en Charlas/Talleres → hover state + tooltip accesible

**Problema actual:** `src/components/dropdown/index.tsx` renderiza el trigger sin hover state visible ni `title`/`aria-label` que indique su función.

**Decisión:**
- Agregar clase de hover al trigger: `hover:bg-gray-700 rounded-md transition-colors`
- Agregar `aria-label="Ver opciones del evento"` y `title="Opciones"`
- Opcional: agregar un tooltip CSS nativo via `title` attribute (sin JS adicional)

---

### 6. Alineación "Ver todos los artículos" → remover `text-right`

**Problema actual:** `src/pages/index.astro` tiene el link con `class="text-right"` mientras el contenido de la sección está alineado a la izquierda.

**Decisión:** Cambiar a `text-left` o simplemente remover la clase, dejando que el flujo natural del documento lo alinee. No requiere cambios en el componente, solo en la clase del wrapper en la página.

---

### 7. Font-weight en artículos → `font-weight: 400`

**Problema actual:** `src/assets/styles/article.css` define `p { font-weight: 300; line-height: 1.2; }`. El peso 300 (light) sobre fondo oscuro reduce el contraste perceptual.

**Decisión:** Cambiar a `font-weight: 400` (regular). Mantener el `line-height` actual. No tocar `h2`, `h3`, ni otros selectores.

**Nota:** El `line-height: 1.2` en párrafos también es bajo para lectura larga — se sugiere cambiarlo a `1.6` o `1.7` como mejora adicional. Se incluye en el mismo cambio dado que está en la misma regla CSS.

---

### 8. Sección subscribe → heading real + mejor jerarquía visual

**Problema actual:** `src/components/subscribe/index.astro` usa `<p>` para el texto principal "Recibe mensualmente..." sin tratamiento de heading, lo que hace que visualmente parezca texto corrido.

**Decisión:** Cambiar el primer `<p>` a `<h2>` con clases de tamaño adecuado (`text-lg font-semibold font-hero`) y mantener el segundo párrafo de apoyo como `<p class="text-sm text-gray-400">`. Esto también mejora accesibilidad (heading semántico en la sección).

---

### 9. Footer → copyright + enlace back-to-top

**Problema actual:** `src/layouts/base/components/footer/index.astro` solo tiene redes sociales + string terminal `$ cd ~/eduardoalvarez.dev/{year}`.

**Decisión:** Agregar debajo del string terminal:
- Un texto de copyright: `© {currentYear} Eduardo Álvarez` con clase `text-xs text-gray-500`
- El año se calcula dinámicamente con `new Date().getFullYear()` en el template Astro

**Sobre back-to-top:** Se omite — la página no tiene scroll suficientemente largo en la mayoría de vistas para justificarlo, y añadir el botón rompería la estética terminal del footer.

---

### 10. Audio player → duración desde metadata del episodio

**Problema actual:** `src/components/audio-player/index.tsx` muestra `0:00` para la duración hasta que el audio carga, porque solo lee la duración del elemento `<audio>`.

**Decisión:** El componente ya recibe props. Agregar una prop opcional `duration?: string` (formato `"1h 18min"` o segundos) que se muestre en estado idle. Cuando el audio carga y tiene `audioDuration`, usar ese valor. En la página de podcasts, el frontmatter de cada episodio incluye `duration` — pasarlo como prop.

**Alternativa considerada:** Pre-cargar el metadata del audio con `preload="metadata"`. Rechazada — añade una request de red innecesaria por episodio en la página de listado.

## Risks / Trade-offs

- **[Locale de fecha]** → `es-CL` es correcto para el autor (Chile), pero podría diferir en servidores con timezone diferente. Mitigation: el formato es solo de display, no afecta el valor de la fecha.
- **[Categories label map]** → Si `src/utils/categories.ts` no tiene todas las categorías mapeadas a etiquetas legibles, algunas podrían mostrarse en formato slug (`web-development`). Mitigation: verificar y completar el mapa antes de implementar.
- **[Subscribe heading]** → Cambiar de `<p>` a `<h2>` podría afectar el outline de headings de la página home si ya hay un `<h2>` para "Últimos artículos". Mitigation: verificar la jerarquía y usar `<h2>` o `<h3>` según corresponda.

## Migration Plan

1. Los cambios son todos en el frontend estático — no requieren migraciones de datos ni coordination con backend.
2. Cada cambio es independiente y puede mergearse por separado si se desea.
3. Rollback: cualquier cambio se revierte con `git revert` del commit correspondiente.
4. No hay feature flags necesarios — todos los cambios son visualmente obvios y verificables en desarrollo local.

## Open Questions

- ¿El componente `article/index.astro` que se usa en la home es el mismo que en `/articulos`? (Si son el mismo, la categoría aparece en ambos lugares automáticamente. Si son diferentes, hay que actualizar ambos.)
- ¿Hay un mapa completo de `CategoryAllowed` → etiqueta en español en `src/utils/categories.ts` o hay que crearlo?
