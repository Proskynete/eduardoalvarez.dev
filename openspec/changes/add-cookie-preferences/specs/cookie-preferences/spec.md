## ADDED Requirements

### Requirement: Valor por defecto según la región

El sitio SHALL decidir si la persona está en Europa (EEE, Reino Unido o Suiza) por la zona horaria del navegador: las que empiezan por `Europe/` y `Atlantic/Canary`, `Atlantic/Madeira`, `Atlantic/Azores`, `Atlantic/Reykjavik`, `Atlantic/Faroe` y `Arctic/Longyearbyen`. Si la zona horaria no se puede leer, SHALL tratarla como Europa. Mientras no haya una decisión guardada, «Estadísticas» SHALL estar activa fuera de Europa y apagada en Europa, y ese valor SHALL NO guardarse.

#### Scenario: Primera visita fuera de Europa
- **WHEN** alguien sin decisión guardada visita el sitio con zona horaria `America/Santiago`
- **THEN** gtag.js SHALL cargarse
- **THEN** SHALL mostrarse un aviso con «Entendido» y «Configurar»
- **THEN** `cookie-consent` SHALL NO existir en `localStorage`

#### Scenario: Primera visita en Europa
- **WHEN** alguien sin decisión guardada visita el sitio con zona horaria `Europe/Madrid`
- **THEN** la página SHALL NO pedir nada a `googletagmanager.com`
- **THEN** SHALL mostrarse un aviso con «Rechazar», «Configurar» y «Aceptar», del mismo peso visual

### Requirement: Decisión guardada y migrada

La decisión SHALL guardarse solo cuando la persona actúa, en `localStorage` bajo `cookie-consent` como `{"v":2,"statistics":boolean,"preferences":boolean,"ts":number}`. Los valores de la versión anterior SHALL migrarse al leer: `granted` como estadísticas activas y `denied` como apagadas.

#### Scenario: Decisión anterior
- **WHEN** `cookie-consent` vale `granted`
- **THEN** GA SHALL cargarse y el aviso SHALL NO mostrarse, en cualquier región

#### Scenario: Almacenamiento bloqueado
- **WHEN** `localStorage` lanza un error
- **THEN** SHALL tratarse como sin decisión, sin errores en la página

### Requirement: Panel de preferencias por categoría

El panel SHALL ser un diálogo modal accesible (título, foco atrapado y devuelto, Esc cierra) con las categorías que tengan elementos reales: «Necesarias» (interruptor activo y deshabilitado, «Siempre activas»), «Preferencias» y «Estadísticas». Cada categoría SHALL poder desplegar sus elementos con nombre, proveedor, propósito y duración, leídos de `src/settings/cookies.ts`.

#### Scenario: Abrir desde el pie
- **WHEN** la persona pulsa «./cookies» en el pie
- **THEN** SHALL abrirse el panel con los interruptores en el estado vigente

#### Scenario: Apagar estadísticas
- **WHEN** la persona apaga «Estadísticas» y pulsa «Guardar selección», o pulsa «Rechazar opcionales»
- **THEN** SHALL fijarse `window['ga-disable-<ID>'] = true` y SHALL borrarse las cookies `_ga*` del host y del dominio registrable

#### Scenario: Apagar preferencias
- **WHEN** «Preferencias» queda apagada
- **THEN** SHALL borrarse `arrecife-theme` y el tema elegido SHALL NO recordarse en la siguiente visita

#### Scenario: Sin ID o fuera de producción
- **WHEN** falta `PUBLIC_GA_ID` o el build no es de producción
- **THEN** SHALL NO renderizarse ni el cargador, ni el aviso, ni el panel, ni el enlace «./cookies»

### Requirement: Visitas contadas sin cookies

El sitio SHALL incluir Vercel Web Analytics en todas las páginas, sin cookies y sin depender de la decisión de cookies, solo con páginas vistas.

#### Scenario: Estadísticas rechazadas
- **WHEN** la persona rechaza «Estadísticas»
- **THEN** la visita SHALL seguir contándose en Vercel Web Analytics
