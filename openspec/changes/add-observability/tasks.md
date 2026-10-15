## 1. GA4 con consentimiento

- [x] 1.1 `PUBLIC_GA_ID` en `env.schema`; retirar Partytown y el ID escrito en `head.astro`
- [x] 1.2 Cargador en `components/analytics/index.astro`: solo en producción y con ID; carga tras aceptar, apaga y borra cookies al rechazar
- [x] 1.3 Aviso con componentes y tokens de arrecife, dos botones del mismo peso, voz de BRAND.md §14
- [x] 1.4 «./cookies» en el pie reabre el aviso
- [x] 1.5 `trackEvent` descarta los eventos mientras GA no esté cargado

## 2. Eventos clave

- [x] 2.1 `sign_up` al suscribirse a la newsletter
- [x] 2.2 `share` en los botones de compartir del artículo
- [x] 2.3 `copy_code` al copiar un bloque de código
- [x] 2.4 `select_content` al ir a cursos desde la navegación

## 3. Sentry

- [x] 3.1 Cliente: trazas al 100 %, `tracePropagationTargets` del mismo origen, replay solo en error y cargado en diferido
- [x] 3.2 Servidor: iniciado desde el middleware con `handleRequest` (integración con `server: false`), flush antes de que Vercel congele la función, sin cookies ni cuerpos de request
- [x] 3.3 `environment` y `release` desde Vercel; no-op sin DSN
- [x] 3.4 Opciones de build de v11 (`org`/`project`/`authToken` arriba); source maps solo con token
- [x] 3.5 `?sentry-test=1` y `/api/sentry-test`

## 4. Cierre

- [x] 4.1 Enlaces de compartir con el dominio canónico
- [x] 4.2 Lint, unitarios y build con y sin variables
