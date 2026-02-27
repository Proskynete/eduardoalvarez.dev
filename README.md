<div align="center">

  <h1><a href="https://eduardoalvarez.dev">eduardoalvarez.dev</a></h1>

  <p>Engineering Leadership & Platform Thinking in the AI Era</p>

![Astro](https://img.shields.io/badge/Developed%20with-Astro-e73bba?logo=astro) ![Vercel](https://img.shields.io/badge/Hosted%20in-Vercel-000000?logo=vercel) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript) ![!PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

</div>

---

Sitio personal de Eduardo Álvarez: artículos, charlas, stack, podcasts y recursos sobre liderazgo de ingeniería, arquitectura de plataformas y desarrollo de software en la era de la IA.

## Stack principal

| Tecnología | Uso |
|---|---|
| **Astro 5** | SSG + rutas serverless |
| **React 19** | Componentes interactivos (búsqueda, audio player, nav mobile) |
| **TypeScript 5** | Strict mode, sin `any` |
| **Tailwind CSS** | Design system con tokens personalizados (Geist, cyan/dark) |
| **MDX** | Artículos con componentes embebidos |
| **Algolia v5** | Búsqueda full-text, indexada en build |
| **Giscus** | Comentarios via GitHub Discussions |
| **Mailchimp** | Newsletter |
| **Vercel** | Deploy, serverless functions |
| **Vitest + Playwright** | Unit + E2E tests |

## Comandos

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build local
npm run lint       # Lint TypeScript/JSX
npm run lint:fix   # Auto-fix lint
npm test           # Tests en modo watch
npm run test:run   # Tests una vez (CI)
npm run test:coverage  # Coverage report
```

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Home con hero, últimos artículos y charlas recientes |
| `/articles` | Listado de artículos con filtro por categoría |
| `/articles/[slug]` | Detalle de artículo con TOC, comentarios y compartir |
| `/speaking` | Charlas y talleres agrupados por año |
| `/now` | Qué estoy haciendo ahora |
| `/stack` | Herramientas y tecnologías que uso |
| `/about` | Sobre mí |
| `/working-with-me` | Formas de trabajar juntos |
| `/newsletter` | Suscripción al newsletter |
| `/projects` | Proyectos con filtro por estado |
| `/podcasts` | Episodios de podcast con reproductor integrado |
| `/podcasts/[slug]` | Detalle de episodio |

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
```

## Métricas de calidad

- ✅ 55 unit tests + 11 E2E tests (100% passing)
- ✅ Coverage: >93% statements, >86% branches, 100% functions
- ✅ 0 errores TypeScript (strict mode)
- ✅ WCAG 2.1 AA (contraste verificado)
- ✅ Lighthouse: performance, a11y, SEO
