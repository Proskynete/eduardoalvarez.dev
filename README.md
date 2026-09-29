<div align="center">

  <h1><a href="https://www.eduardoalvarez.dev">eduardoalvarez.dev</a></h1>

  <p>Technical Lead · Spec-Driven Development — Entender antes de construir.</p>

![Astro](https://img.shields.io/badge/Developed%20with-Astro-e73bba?logo=astro) ![Vercel](https://img.shields.io/badge/Hosted%20in-Vercel-000000?logo=vercel) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript) ![Node](https://img.shields.io/badge/Node-24.x-5FA04E?logo=nodedotjs&logoColor=white) ![!PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

</div>

---

Sitio personal de Eduardo Álvarez, Technical Lead · Spec-Driven Development. Enseño a construir software con IA sin dejar de entender lo que hacemos: artículos, charlas y la newsletter.

El sistema de diseño vive en su propio paquete, [`@eduardoalvarez/arrecife`](https://www.npmjs.com/package/@eduardoalvarez/arrecife): tokens, componentes, iconos y el tema de Shiki. Este sitio lo consume igual que los demás proyectos (links, resume, cursos, blog-content-manager).

## Entornos

| Entorno | Rama | URL |
|---|---|---|
| **Producción** | `main` | [www.eduardoalvarez.dev](https://www.eduardoalvarez.dev) |
| **Desarrollo** | `develop` | [website-git-develop-eduardoalvarez-dev.vercel.app](https://website-git-develop-eduardoalvarez-dev.vercel.app) |

Cada rama de trabajo genera además su propio preview automático en Vercel. El flujo es `feat/*` → `develop` → `main`.

## Identidad de marca

La marca gira en torno a **Tiburoncín**, un tiburón ballena. La paleta nace de ahí: azules profundos de fondo, bioluminiscencia como acento y arena como color cálido de apoyo.

| Token | Nombre | Oscuro | Claro |
|---|---|---|---|
| `background` | abismo / paper | `#091319` | `#f6f2ea` |
| `surface` | fosa | `#10202b` | `#ffffff` |
| `surface-raised` | corriente | `#17303e` | `#ede7db` |
| `text-primary` | espuma / casco | `#edf4f3` | `#0b1524` |
| `text-secondary` | bruma | `#a7bcc4` | `#3d4b58` |
| `text-muted` | plancton | `#71919c` | `#6b7480` |
| `accent` | bioluz | `#35d6c0` | `#0d7c6f` |
| `warm` | arena | `#f2a65a` | `#a65b27` |

> En modo claro los acentos usan variantes oscurecidas a propósito: bioluz y arena plenos miden 3.57:1 y 3.95:1 sobre papel, por debajo del mínimo AA de 4.5:1. Las variantes conservan el tono y llegan a 4.55:1 y 4.54:1.

Los tokens llegan desde `@eduardoalvarez/arrecife/tokens/theme.css`, que `src/assets/styles/base.css` importa. La librería trae sus propios bloques `[data-theme]`, así que `data-theme="light"` en `<html>` cambia todas las utilidades de Tailwind de una vez. El sitio arranca en modo oscuro por defecto.

## Stack principal

| Tecnología | Uso |
|---|---|
| **Astro 7** | Páginas prerenderizadas + render bajo demanda en Vercel |
| **React 19** | Componentes interactivos (búsqueda, audio player, nav mobile) |
| **TypeScript 5.9** | Strict mode, sin `any` |
| **Tailwind CSS 4** | Vía `@tailwindcss/vite`, con los tokens de arrecife |
| **@eduardoalvarez/arrecife** | Sistema de diseño: tokens, componentes, iconos |
| **MDX** | Artículos con componentes embebidos |
| **Algolia v5** | Búsqueda full-text, indexada en build |
| **Giscus** | Comentarios vía GitHub Discussions |
| **Mailchimp** | Newsletter |
| **Shiki** | Resaltado de código con el tema de arrecife |
| **Sentry** | Seguimiento de errores |
| **Vercel** | Deploy, serverless functions |
| **Workbox** | Service worker de la PWA |
| **Vitest + Playwright** | Unit + E2E tests |

## Requisitos

Node según `.nvmrc` (hoy `v24.18.0`). Con fnm o nvm el cambio es automático al entrar al directorio. Las herramientas instaladas de forma global, como `openspec`, existen solo en la versión de Node donde se instalaron: si `openspec` no aparece, revisa que `.nvmrc` apunte a una versión que la tenga.

## Comandos

```bash
npm run dev                 # Servidor de desarrollo
npm run build               # astro check + build de producción
npm run preview             # Preview del build local

npm run lint                # Lint TypeScript/JSX
npm run lint:fix            # Auto-fix lint

npm test                    # Unit + E2E en secuencia
npm run test:unit           # Vitest en watch
npm run test:unit:run       # Vitest una vez (CI)
npm run test:unit:coverage  # Reporte de cobertura
npm run test:e2e            # Playwright
npm run test:e2e:ui         # Playwright con interfaz

npm run brand:icons         # Regenera favicons y iconos del manifest
npm run brand:og            # Regenera la imagen Open Graph por defecto
npm run brand:assets        # Ambos
npm run a11y:audit          # Auditoría axe contra localhost:4321
```

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Home con hero, últimos artículos y charlas recientes |
| `/articles` | Listado paginado de artículos |
| `/articles/[slug]` | Detalle con TOC, comentarios y compartir |
| `/speaking` | Charlas y talleres agrupados por año |
| `/about` | Sobre mí, incluido en qué estoy ahora |
| `/newsletter` | Suscripción al newsletter |
| `/offline` | Respaldo del service worker sin conexión (`noindex`) |
| `/podcasts` | Episodios con reproductor. **Apagada** mientras `podcastsEnabled` sea `false` (redirige a `/`) |

Redirecciones en `vercel.json`: `/articulos` → `/articles`, `/charlas-talleres` → `/speaking`, y las páginas retiradas `/stack`, `/projects` y `/working-with-me` → `/about`.

## PWA

El sitio se puede instalar. El manifiesto sale de `src/settings/manifest-config.ts` y los iconos, de `public/images/manifest/` (se regeneran con `npm run brand:icons`). `head.astro` escribe el `<link rel="manifest">` en todas las páginas, también en los artículos que se renderizan bajo demanda. El service worker (Workbox, configurado en `astro.config.mjs`) guarda de antemano solo lo esencial: JS, CSS, fuentes, iconos y las páginas prerenderizadas. Los artículos y las imágenes se guardan a medida que se visitan, y una página nunca abierta sin conexión muestra `/offline`. Al abrir la app instalada, iOS muestra una imagen de arranque por modelo (`src/settings/apple-startup-images.json`) y luego el splash animado continúa desde la misma aleta.

## Variables de entorno

```bash
# Algolia (búsqueda)
PUBLIC_ALGOLIA_APPLICATION_ID=
PUBLIC_ALGOLIA_INDEX_NAME=
PUBLIC_ALGOLIA_SEARCH_API_KEY=   # Solo lectura, cliente
ALGOLIA_ADMIN_API_KEY=           # Admin, solo servidor/build

# Giscus (comentarios)
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY_ID=

# Mailchimp (newsletter)
MAILCHIMP_API_KEY=
MAILCHIMP_LIST_ID=

# Opcionales
SENTRY_AUTH_TOKEN=              # Sube source maps a Sentry en el build
SKIP_ENV_VALIDATION=true        # Build local sin las variables anteriores
ALGOLIA_FORCE_INDEX=true         # Indexar en Algolia desde un build local
```

## Calidad

- **186 tests unitarios** en 12 archivos (Vitest)
- **Tests E2E** en 5 archivos (Playwright): accesibilidad, sistema de diseño, podcasts, búsqueda y suscripción
- 0 errores de TypeScript en strict mode (`astro check` corre dentro del build)
- Contraste verificado contra WCAG 2.2 AA en ambos temas
- CI: lint, tests, build, escaneo de seguridad y revisión ortográfica

> **Nota sobre la revisión ortográfica:** el CI usa [`typos`](https://github.com/crate-ci/typos) y solo escanea `./src` y `./tests`. La herramienta corrige palabras en español dentro de identificadores sin romper la compilación, así que los nombres de clases, variables y comentarios del código se mantienen **en inglés** a propósito. El texto visible para el usuario sigue en español.

## Documentación relacionada

- [`BRAND.md`](BRAND.md) — registro de implementación del sistema de diseño: correcciones de contraste, ubicación de tokens por proyecto, pipeline de regeneración de assets y pendientes.
- [`CLAUDE.md`](CLAUDE.md) — guía de arquitectura y convenciones del repositorio.
- [`openspec/`](openspec/) — specs de las capacidades del sitio y los cambios en curso (`openspec list`).
