## Why

El aviso de cookies era un sí o no a Google Analytics, igual para todo el mundo. Fuera de Europa eso deja sin medir a casi toda la gente que no toca el aviso, aunque la ley no exige pedir permiso antes. Además, no había forma de ver qué guarda el sitio en el navegador ni de elegir por categoría.

## What Changes

- **Panel de preferencias** con categorías e interruptores: «Necesarias» (siempre activas, bloqueado), «Preferencias» (el tema) y «Estadísticas» (GA4). Cada categoría muestra qué guarda: nombre, proveedor, propósito y duración. Botones «Rechazar opcionales», «Guardar selección» y «Aceptar todas». Lo abre «Configurar» en el aviso y «./cookies» en el pie.
- **Valor por defecto según la región**, por la zona horaria del navegador: fuera de Europa las estadísticas parten activas (opt-out) y un aviso lo informa con «Entendido» y «Configurar»; en Europa (EEE, Reino Unido, Suiza, o si la zona horaria no se puede leer) parten apagadas (opt-in) con «Rechazar», «Configurar» y «Aceptar», del mismo peso.
- **Decisión versionada** en `localStorage` bajo `cookie-consent` como JSON (`v: 2`). Los valores antiguos (`granted` / `denied`) se migran al leer. Sin decisión guardada se aplica el valor de la región sin persistirlo.
- **Inventario** de cookies y claves de almacenamiento en `src/settings/cookies.ts`, la única fuente para el panel.
- **Vercel Web Analytics** con `@vercel/analytics/astro` (sin cookies, anónimo) en vez de la opción `webAnalytics` del adaptador.
- Reemplaza el requisito «Google Analytics solo con consentimiento» de `add-observability`.

## Capabilities

### New Capabilities

- `cookie-preferences`: decisión de cookies por categoría, valor por defecto por región y panel de preferencias.

## Impact

**Archivos nuevos:** `src/components/analytics/cookie-preferences.tsx`, `src/settings/cookies.ts`, `tests/units/components/cookie-preferences.test.tsx`.

**Archivos modificados:** `src/utils/consent.ts` (la tienda de la decisión), `src/components/analytics/index.astro`, el pie, `site-nav.tsx` (el tema no se recuerda sin «Preferencias»), el layout base (Vercel Web Analytics), `astro.config.mjs`, `sentry.client.config.js`. Se elimina `cookie-banner.astro`.

**Sin página de privacidad:** el sitio no tiene una; el inventario queda listo para cuando exista.

## Success Criteria

- Fuera de Europa, en la primera visita GA carga y el aviso informa; nada se guarda hasta que la persona actúa.
- En Europa, sin aceptar, la página no pide nada a `googletagmanager.com`.
- Apagar «Estadísticas» fija `ga-disable-<ID>` y borra las cookies `_ga*`.
- Quien había aceptado o rechazado con el aviso anterior conserva su decisión.
- Unitarios, lint y `npm run build` en verde, con y sin `PUBLIC_GA_ID`.
