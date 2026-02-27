## Context

El sitio actual (`eduardoalvarez.dev`) usa Tailwind CSS con una paleta centrada en rosa (`#ec4899`) sobre fondo casi negro (`bg-black/95`). Las fuentes son Hero (headings) y Avenir (body), ambas cargadas como `.woff` locales. El diseño es funcional pero comunica "blog técnico genérico" — no hay una identidad visual que diferencie el posicionamiento de Engineering Leadership.

El rediseño no cambia la arquitectura técnica (Astro 5, SSR en Vercel, Algolia, Giscus, Mailchimp). Cambia exclusivamente la capa visual y de contenido: tokens de diseño, tipografía, identidad de marca, y páginas nuevas/rediseñadas.

**Constraints:**
- Tailwind CSS 3.4 ya instalado — el design system se implementa como extensión del tema en `tailwind.config.mjs`
- Fuentes actuales (Hero, Avenir) deben ser reemplazadas; las nuevas se cargan igual (`.woff2` locales o Google Fonts con `font-display: swap`)
- Todos los cambios de color deben mantener WCAG AA (ratio ≥ 4.5:1 para texto normal)
- El logo actual es `.webp` — el nuevo debe existir en `.svg` para escalabilidad, con fallback `.webp`

---

## Goals / Non-Goals

**Goals:**
- Definir un design system completo basado en tokens (colores, tipografía, espaciado) implementado como extensión de Tailwind
- Reemplazar la identidad visual completamente: nueva paleta, nuevas fuentes, nuevo logo
- Rediseñar todas las páginas existentes y crear las nuevas usando los nuevos tokens
- Mantener accesibilidad WCAG AA en todos los colores de texto e interactivos
- El isotipo debe funcionar en 16×16px (favicon) y 512×512px sin pérdida de identidad

**Non-Goals:**
- No cambiar la arquitectura técnica (Astro, SSR, Vercel, Algolia)
- No cambiar la lógica de negocio (subscribe API, Giscus, Mailchimp)
- No migrar el CMS ni el sistema de contenido MDX
- No implementar modo claro (dark-only es una decisión de posicionamiento)
- No crear el isotipo como código generativo — se diseña fuera y se importa como SVG

---

## Decisions

### D1 — Paleta de colores: cyan frío sobre dark profundo

**Decisión:** Paleta dark con acento primario en cyan (`#06b6d4` / Tailwind `cyan-500`) sobre fondo `#0a0a0a` (más profundo que el actual `black/95`).

**Tokens principales:**
```
background:     #0a0a0a   (surface base)
surface-raised: #111111   (cards, inputs)
surface-border: #1f1f1f   (bordes sutiles)
text-primary:   #f5f5f5   (texto principal)
text-secondary: #a3a3a3   (texto secundario, metadatos)
text-muted:     #525252   (placeholders, disabled)
accent:         #06b6d4   (cyan-500, acciones, links activos)
accent-hover:   #0891b2   (cyan-600, hover states)
accent-subtle:  #164e63   (cyan-900, fondos de badge/highlight)
```

**Gradientes controlados (solo en hero y elementos clave):**
```
hero-gradient:  linear-gradient(135deg, #0a0a0a 60%, #0c1f26 100%)
accent-glow:    radial-gradient(ellipse at top, #06b6d420 0%, transparent 60%)
```

**Rationale:** Cyan sobre dark profundo tiene ratio de contraste ≥ 4.5:1 para texto secundario y ≥ 7:1 para texto primario. El cyan es semánticamente asociado a tecnología, terminal, precisión — sin ser el azul corporativo genérico.

**Alternativas consideradas:**
- Verde (`#10b981`) — demasiado asociado a "success state", no a liderazgo
- Amber/gold — interesante pero evoca Bloomberg, demasiado financiero
- Violeta — ya usado por Linear/Vercel, pierde diferenciación

---

### D2 — Tipografía: Geist Sans + Geist Mono

**Decisión:** Reemplazar Hero + Avenir por **Geist Sans** (body y UI) y **Geist Mono** (código), ambas de Vercel, disponibles como npm package (`geist`).

**Escala tipográfica:**
```
--font-sans:  'Geist', system-ui, sans-serif
--font-mono:  'Geist Mono', 'Fira Code', monospace

text-xs:    12px / 1.5   (metadatos, labels)
text-sm:    14px / 1.5   (body small, captions)
text-base:  16px / 1.6   (body principal)
text-lg:    18px / 1.5   (intro párrafos)
text-xl:    20px / 1.4
text-2xl:   24px / 1.3
text-3xl:   30px / 1.2   (h3 artículos)
text-4xl:   36px / 1.15  (h2 secciones)
text-5xl:   48px / 1.1   (h1 páginas)
text-6xl:   60px / 1.05  (hero headline)
```

**Font weights usados:** 300 (light, body), 400 (regular), 500 (medium, labels), 600 (semibold, h3-h4), 700 (bold, h1-h2).

**Rationale:** Geist es open source, diseñada para legibilidad en pantallas, tiene excelente kerning en tamaños grandes. La versión mono es visualmente consistente con la sans — esencial para sitios técnicos donde los bloques de código deben sentirse parte del mismo sistema.

**Instalación:** `npm install geist` — se importa en `astro.config.mjs` o directamente en el layout base.

**Alternativas consideradas:**
- Inter — excelente pero sobreusada, no diferencia
- DM Sans — elegante pero demasiado ligera para headlines fuertes
- Custom font (como Hero actual) — dificulta el mantenimiento sin ganancia diferenciadora

---

### D3 — Sistema de tokens como extensión de Tailwind

**Decisión:** Definir todos los tokens en `tailwind.config.mjs` como extensiones del tema, no como CSS custom properties sueltas.

```js
// tailwind.config.mjs (estructura)
theme: {
  extend: {
    colors: {
      background: '#0a0a0a',
      surface: { DEFAULT: '#111111', raised: '#161616', border: '#1f1f1f' },
      text: { primary: '#f5f5f5', secondary: '#a3a3a3', muted: '#525252' },
      accent: { DEFAULT: '#06b6d4', hover: '#0891b2', subtle: '#164e63' },
    },
    fontFamily: {
      sans: ['Geist', 'system-ui', 'sans-serif'],
      mono: ['Geist Mono', 'Fira Code', 'monospace'],
    },
    // ... spacing, shadows, etc.
  }
}
```

**Rationale:** Mantener los tokens en Tailwind permite usar las clases utilitarias directamente en componentes sin escribir CSS custom. Todos los componentes existentes solo necesitan cambiar clases (ej: `text-pink-500` → `text-accent`).

---

### D4 — Logo e Isotipo: SVG vectorial

**Decisión:** El nuevo logo es SVG. El wordmark usa Geist Sans Bold (mismo que el sitio). El isotipo es un símbolo geométrico abstracto que evoca: red de nodos / grafo de dependencias / estructura de plataforma.

**Concepto del isotipo:**
- Tres nodos conectados en forma de triángulo asimétrico
- Trazo único, sin relleno, 2px stroke
- El nodo superior (líder) ligeramente más grande
- Color: `#06b6d4` (accent) sobre fondo transparente
- Funciona invertido en blanco para usar sobre fondos oscuros

**Archivos a generar:**
```
public/images/logo.svg           — wordmark completo (horizontal)
public/images/logo-mark.svg      — solo isotipo
public/images/favicon/           — set completo (16, 32, 180, 192, 512)
public/images/manifest/          — PWA icons actualizados
```

**Nota:** El diseño del isotipo requiere trabajo en herramienta vectorial (Figma, Illustrator). El spec define el concepto; el asset final se importa como SVG optimizado con `svgo`.

---

### D5 — Estructura de páginas y routing

**Nuevas rutas a crear:**
```
/                   → src/pages/index.astro         (rediseñada)
/articles           → src/pages/articles/index.astro (renombrado de /articulos)
/articles/[slug]    → individual MDX articles
/speaking           → src/pages/speaking/index.astro (renombrado de /charlas-talleres)
/now                → src/pages/now/index.astro      (nueva)
/stack              → src/pages/stack/index.astro    (nueva)
/about              → src/pages/about/index.astro    (nueva)
/working-with-me    → src/pages/working-with-me/index.astro (nueva)
/newsletter         → src/pages/newsletter/index.astro (nueva)
/projects           → src/pages/projects/index.astro (nueva, era hidden)
/podcast            → src/pages/podcast/index.astro  (mantener hidden/no-index)
/admin              → src/pages/admin/index.astro    (sin cambios)
/api/subscribe      → src/pages/api/subscribe.ts     (sin cambios)
```

**Redirecciones necesarias** (en `vercel.json`):
```json
"/articulos/:path*" → "/articles/:path*"
"/charlas-talleres" → "/speaking"
```

---

### D6 — Arquitectura de páginas nuevas

**`/now`:** Página estática Astro. Datos en `src/settings/now.ts` (array de items con `category`, `title`, `description`, `url?`). Sin fecha visible — se actualiza cuando cambia. Muestra: proyectos activos, libros, foco del quarter.

**`/stack`:** Página estática Astro. Datos en `src/settings/stack.ts`. Categorías: Languages, Frameworks, Infrastructure, Hardware, Apps. Cada item: `name`, `description`, `url`, `category`.

**`/about`:** Página MDX o Astro con contenido semi-estático. Secciones: quién soy, qué construyo, con quién trabajo, foto.

**`/working-with-me`:** Página Astro. Define: tipos de colaboración (advisory, consulting, talks), para quién es, proceso, CTA (email o Calendly link).

**`/newsletter`:** Página Astro. Propuesta de valor de la newsletter, formulario de subscribe (reutiliza componente existente), archive (inicialmente vacío).

**`/projects`:** Datos en `src/settings/projects.ts` (ya existe pero oculto). Mostrar cards con: nombre, descripción, stack, estado (`active` | `archived`), links (repo, demo).

---

## Risks / Trade-offs

**[Riesgo] URLs de artículos cambian (`/articulos/` → `/articles/`)** → Mitigación: redirecciones 301 en `vercel.json`. Los artículos en Algolia tienen URLs absolutas — requiere re-indexar post-deploy.

**[Riesgo] Geist requiere npm package** → Mitigación: `npm install geist` es dependencia ligera. Alternativa: descargar `.woff2` y hospedar localmente como las fuentes actuales.

**[Riesgo] El isotipo es un concepto, no un asset** → Mitigación: El spec define el concepto con precisión. El asset SVG final se crea en herramienta de diseño antes de implementar la fase de branding. Bloqueante solo para header/favicon, no para el resto del redesign.

**[Trade-off] Tailwind 3.4 vs Tailwind 4** → Tailwind 4 está disponible pero cambia el sistema de configuración radicalmente. Se mantiene Tailwind 3.4 para no arriesgar migración durante el redesign. Se puede migrar en un cambio posterior separado.

**[Trade-off] Dark-only vs sistema de temas** → Se decide dark-only por coherencia de posicionamiento. Implementar light mode requeriría CSS custom properties en lugar de valores hardcoded en el config, aumentando complejidad ~3x. Se puede añadir en el futuro con refactor del design system.

---

## Migration Plan

1. **Fase 0 — Design tokens y fuentes:** Actualizar `tailwind.config.mjs`, instalar Geist, actualizar `base.css`. Sin tocar páginas aún.
2. **Fase 1 — Identidad de marca:** Importar nuevos SVGs de logo/favicon. Actualizar `src/settings/index.ts`.
3. **Fase 2 — Layouts base:** Rediseñar `src/layouts/base/` (header, footer, nav) y `src/layouts/main/`.
4. **Fase 3 — Páginas existentes:** Home, Articles listing, Article detail, Speaking.
5. **Fase 4 — Páginas nuevas:** Now, Stack, About, Working with Me, Newsletter, Projects.
6. **Fase 5 — Redirecciones y re-indexado:** `vercel.json` redirects, re-run Algolia indexing.

**Rollback:** Cada fase es un PR separado. Si una fase introduce regresiones, se revierte solo ese PR sin afectar las anteriores.

---

## Open Questions

- **OQ1:** ¿El slug de artículos cambia a inglés (`/articles/`) o se mantiene en español (`/articulos/`) para no romper URLs existentes indexadas? *Recomendación: mantener `/articulos/` para URLs de artículos existentes, usar `/articles/` solo para la página de listado.*
- **OQ2:** ¿La página `/working-with-me` tiene formulario de contacto o solo link a email/Calendly? *Impacta si necesita nueva API route.*
- **OQ3:** ¿La newsletter tiene nombre propio (ej: "Platform Pulse", "EA Weekly")? *Impacta copy y diseño de la página.*
- **OQ4:** ¿El isotipo se diseña externamente (Figma) o se define como SVG inline en el spec? *Bloqueante para Fase 1.*
