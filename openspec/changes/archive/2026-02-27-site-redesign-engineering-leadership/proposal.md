## Why

El sitio actual comunica "desarrollador que escribe sobre código" — útil, pero genérico y saturado. El nuevo posicionamiento es **Engineering Leadership & Platform Thinking in the AI Era**: un espacio para Engineering Managers, Staff/Principal Engineers y Technical Founders que toman decisiones de arquitectura, liderazgo y cultura en la era de la IA. Este reposicionamiento requiere una identidad visual y de contenido completamente coherente, no solo un cambio de colores.

## What Changes

- **BREAKING** — Paleta de colores completa: eliminar rosa (`primary-500: #ec4899`) y reemplazar con sistema cyan/azul frío como acento principal sobre dark profundo
- **BREAKING** — Identidad de marca: reemplazar `logo.webp` con nuevo wordmark tipográfico + isotipo geométrico minimalista (funcional desde 16px hasta 512px)
- **BREAKING** — Estructura de navegación: pasar de `[Artículos, Charlas, Donaciones]` a `[Articles, Speaking, Now, Stack, About, Working with Me]`
- Nuevo design system documentado con tokens: colores, tipografía, espaciado, sombras, radio de borde
- Nueva voz y tono: primera persona, opiniones explícitas, sin relleno académico
- Rediseño completo de todas las páginas visibles: Home, Articles, Speaking, Now, Stack & Tools, About, Working with Me, Newsletter, Projects
- Páginas ocultas/futuras mantenidas: Podcast (sin publicar), Admin (interno)
- Idioma: español por defecto; artículos clave pueden estar en inglés

## Capabilities

### New Capabilities

- `design-system`: Token system completo — paleta dark/cyan, escala tipográfica (fuente principal sans-serif geométrica + monospace para código), espaciado, sombras, radios. Base de todos los demás componentes.
- `brand-identity`: Wordmark tipográfico "Eduardo Álvarez" + isotipo geométrico minimalista que represente liderazgo/sistemas sin ser literal. Debe funcionar en favicon (16px), avatar (512px) y header.
- `site-navigation`: Nueva estructura de nav con secciones: Articles, Speaking, Now, Stack, About, Working with Me. Incluye mobile nav y layout header rediseñado.
- `page-home`: Homepage con hero (intro breve + tagline) + trabajo reciente destacado inmediatamente debajo. Primera impresión: nombre, territorio, prueba de trabajo.
- `page-articles`: Listado de artículos rediseñado. Grid o lista con filtros por categoría. Sin paginación numérica — scroll o load more.
- `page-article-detail`: Layout de artículo individual: tipografía editorial, TOC lateral, sin sidebar recargado. Giscus comments mantenidos.
- `page-speaking`: Nueva página que reemplaza charlas-talleres. Lista de charlas, conferencias, talleres con año, evento, slides/video cuando disponible.
- `page-now`: Página `/now` — qué estoy haciendo ahora mismo (proyectos activos, libros, foco del trimestre). Actualización manual periódica.
- `page-stack-tools`: Página de herramientas y stack personal. Organizado por categorías: lenguajes, frameworks, infra, hardware, apps. Sin afiliados — solo recomendaciones reales.
- `page-about`: Página about rediseñada. Historia profesional, posicionamiento, qué construyo, con quién trabajo. Sin lista de tecnologías aburrida.
- `page-working-with-me`: Página de colaboración/consultoría. Para quién, qué tipo de trabajo, cómo contactar. CTA claro.
- `page-newsletter`: Página dedicada a la newsletter. Propuesta de valor, archivo de ediciones anteriores (cuando existan), formulario de suscripción.
- `page-projects`: Página de proyectos OSS y trabajo personal. Cards con descripción, stack, estado (activo/archivado), links.

### Modified Capabilities

- `base-layout`: Requiere actualización completa para nuevo design system (colores, tipografía, header, footer). Comportamiento idéntico, apariencia completamente nueva.
- `article-layout`: Rediseño editorial — más espacio negativo, tipografía más fuerte, sidebar simplificado.

## Impact

- **Tailwind config** (`tailwind.config.mjs`): Nueva paleta completa, nuevas fuentes, nuevos tokens custom
- **CSS base** (`src/assets/styles/base.css`, `src/assets/styles/article.css`): Reemplazar variables de color, fuentes, focus styles
- **Fuentes** (`public/fonts/`): Reemplazar Hero + Avenir por nueva fuente principal (Inter, Geist, o similar) + monospace
- **Assets de marca** (`public/images/`): Nuevo logo.webp/svg, nuevo favicon set completo, nuevo og:image template
- **Layouts** (`src/layouts/`): Base, Article y Main requieren rediseño visual completo
- **Componentes** (`src/components/`): Todos los componentes deben adoptar los nuevos tokens
- **Páginas nuevas** (`src/pages/`): `/now`, `/stack`, `/about`, `/working-with-me`, `/newsletter`, `/projects`
- **Settings** (`src/settings/index.ts`): Actualizar descripción del sitio, keywords, metadatos
- **Scroll progress bar**: Cambiar de teal a cyan del nuevo design system
- **Sin cambios en**: lógica de API subscribe, integración Algolia, Giscus, Mailchimp, RSS, Vercel config
