<div align="center">

  <h1>Bienvenido a <a href="https://eduardoalvarez.dev">mi sitio web</a></h1>

![Astro](https://img.shields.io/badge/Developed%20with-Astro-e73bba?logo=astro) ![Vercel](https://img.shields.io/badge/Hosted%20in-Vercel-000000?logo=vercel) ![!PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

</div>

---

<img   align="right" src="https://eduardoalvarez.dev/images/eduardoalvarez.gif?raw=true" width="400" />

### Roadmap

#### Completado ✅

- [x] Agregar iconos
- [x] Agregar proyectos en la vista principal
- [x] Agregar y configurar linters, prettier & husky
- [x] Mostrar botón para compartir artículo
- [x] Crear vista - Charlas y talleres
- [x] **Fase 1: Seguridad y Estabilidad** (5/5 Steps - 100%)
  - [x] Migración a API keys de solo lectura para Algolia
  - [x] Mover secretos de Giscus a variables de entorno
  - [x] Agregar estados de error al hook de búsqueda
  - [x] Validación de inputs con Zod en API Subscribe
  - [x] Manejo de errores en formulario de suscripción
- [x] **Fase 2: Testing y Type Safety** (4/4 Steps - 100%)
  - [x] Infraestructura de testing con Vitest + React Testing Library
  - [x] Tests para hook useAlgoliaSearch (18 tests)
  - [x] Mejorar definiciones TypeScript (eliminar `any` types)
  - [x] Tests para utility functions (37 tests)
  - [x] **Métricas**: 55/55 tests pasando, coverage >93%

- [x] **Fase 3: Performance y Optimización** (1/3 Steps - Completa ✅)
  - [x] Optimización de imágenes (Fases 1 y 2 completadas)
    - [x] Homepage + 404 con responsive widths y formato WebP
    - [x] Charlas images + logos con soporte retina
    - [~] Article component + MDX images (DEPRECATED - optimización actual suficiente)
  - [x] Validación de variables de entorno con Zod
  - [~] Rate limiting para API endpoints (SKIPPED - Cloudflare lo maneja)
- [x] **Fase 4: Accesibilidad y UX** (6/6 Steps - 100% ✅)
  - [x] Skip navigation links
  - [x] Mejorar navegación por teclado en búsqueda (ArrowUp, ArrowDown, Enter, Escape)
  - [x] Auditoría de contraste de colores (WCAG 2.1 AA)
  - [x] Crear utilidad de respuestas API (ApiResponseBuilder)
  - [x] Tests E2E con Playwright (search & subscribe flows)
  - [x] Documentación de componentes con JSDoc

#### Pendiente ⏸️

- [ ] Crear nueva vista - Podcast
- [ ] Crear nueva vista - Cursos

---

**Progreso Total del Plan**: 15/16 Steps completados (93.75%) 🎉

**Métricas de Calidad**:
- ✅ 55 unit tests + 11 E2E tests pasando (100%)
- ✅ Coverage: >93% statements, 86.95% branches, 100% functions
- ✅ 0 errores de TypeScript (strict mode)
- ✅ Todas las fases críticas completadas
