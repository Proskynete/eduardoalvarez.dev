## Why

Hoy no puedo responder bien qué pasa en el sitio. Google Analytics se carga en cada visita, vía Partytown y sin preguntar, con el ID escrito en el código. Sentry está a medias: muestrea el 10 % de las trazas, no graba nada cuando hay un error, la configuración de source maps usa una opción que la versión 11 del SDK eliminó, y no hay forma de comprobar en producción que los errores llegan.

## What Changes

- **GA4 con consentimiento**: gtag.js no se pide hasta que la persona acepta en un aviso. Rechazar después de aceptar apaga GA y borra las cookies `_ga*`. El enlace «./cookies» del pie reabre el aviso. El ID sale de `PUBLIC_GA_ID`; se retira Partytown.
- **Eventos clave**: suscripción a la newsletter (`sign_up`), compartir un artículo (`share`), copiar un bloque de código (`copy_code`) y clic hacia cursos (`select_content`). Se mantienen `navigation_click`, `article_read`, `audio_play` y `theme_change`. Ninguno lleva datos personales, y ninguno sale antes del consentimiento.
- **Sentry completo**: trazas al 100 % con Web Vitals, replay solo cuando hay un error (cargado en diferido, texto enmascarado y medios bloqueados), `environment` y `release` desde Vercel, sin cookies ni cuerpos de request, y source maps solo cuando hay token.
- **Ganchos de prueba**: `?sentry-test=1` lanza un error en el navegador; `GET /api/sentry-test` con el header `x-sentry-test` lanza uno en el servidor y responde 404 sin el secreto.
- **Dominio**: los enlaces de compartir apuntaban a `www.`; ahora usan el dominio canónico (el apex), como el resto.

## Capabilities

### New Capabilities

- `observability`: analítica con consentimiento, eventos clave y monitoreo de errores y rendimiento.

## Impact

**Archivos nuevos:** `src/components/analytics/` (cargador y aviso), `src/utils/consent.ts`, `src/pages/api/sentry-test.ts`, tests de `analytics` y `consent`.

**Archivos modificados:** `astro.config.mjs` (sin Partytown, `env.schema`, opciones de Sentry v11), `sentry.client.config.js`, `sentry.server.config.js`, `src/middleware/index.ts` (inicia Sentry antes de cualquier ruta), `src/utils/analytics.ts`, el layout base, el pie, el layout de artículo y el formulario de suscripción.

**Variables nuevas:** `PUBLIC_GA_ID` (build) y `SENTRY_TEST_TOKEN` (runtime). Todas opcionales: sin ellas, la pieza correspondiente no hace nada.

## Success Criteria

- Sin aceptar, la página no pide nada a `googletagmanager.com`.
- `?sentry-test=1` y `/api/sentry-test` con el token aparecen como issues en Sentry con el `environment` y el `release` del deploy.
- Unitarios, lint y `npm run build` en verde, con y sin las variables.
