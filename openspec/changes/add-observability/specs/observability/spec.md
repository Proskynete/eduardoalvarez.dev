## ADDED Requirements

### Requirement: Google Analytics solo con consentimiento

El sitio SHALL cargar gtag.js únicamente después de que la persona acepte en el aviso de cookies, en builds de producción y con `PUBLIC_GA_ID` definido. La decisión SHALL guardarse en `localStorage` bajo `cookie-consent` (`granted` | `denied`).

#### Scenario: Sin decisión
- **WHEN** alguien visita el sitio por primera vez
- **THEN** el aviso SHALL mostrarse
- **THEN** la página SHALL NO pedir nada a `googletagmanager.com`

#### Scenario: Acepta
- **WHEN** la persona pulsa «Aceptar»
- **THEN** gtag.js SHALL cargarse y el aviso SHALL ocultarse
- **THEN** en las visitas siguientes GA SHALL cargarse sin volver a mostrar el aviso

#### Scenario: Rechaza
- **WHEN** la persona pulsa «No, gracias», también después de haber aceptado
- **THEN** SHALL fijarse `window['ga-disable-<ID>'] = true` y SHALL borrarse las cookies `_ga*`

#### Scenario: Cambia de opinión
- **WHEN** la persona pulsa «./cookies» en el pie
- **THEN** el aviso SHALL volver a mostrarse

#### Scenario: Sin ID o fuera de producción
- **WHEN** falta `PUBLIC_GA_ID` o el build no es de producción
- **THEN** SHALL NO renderizarse ni el cargador, ni el aviso, ni el enlace «./cookies»

### Requirement: Eventos clave sin datos personales

Los eventos SHALL enviarse con `trackEvent`, que SHALL descartarlos mientras GA no esté cargado con consentimiento. Ningún parámetro SHALL contener correos, nombres ni texto libre.

#### Scenario: Suscripción
- **WHEN** la API confirma una suscripción a la newsletter
- **THEN** SHALL enviarse `sign_up` con `method: "newsletter"`

#### Scenario: Compartir
- **WHEN** se pulsa compartir en X o LinkedIn desde un artículo
- **THEN** SHALL enviarse `share` con `method`, `content_type: "article"` e `item_id` (el slug)

#### Scenario: Copiar código
- **WHEN** se copia un bloque de código de un artículo
- **THEN** SHALL enviarse `copy_code` con `item_id` (el slug) y `language`

#### Scenario: Ir a cursos
- **WHEN** se pulsa el enlace a `cursos.eduardoalvarez.dev` en la navegación
- **THEN** SHALL enviarse `select_content` con `content_type: "course_link"`, `item_id: "cursos"` y `location`

### Requirement: Monitoreo de errores y rendimiento con Sentry

Sentry SHALL capturar errores del navegador y del servidor, trazar cargas, navegaciones y requests al 100 %, y grabar la sesión solo cuando ocurre un error, con el texto enmascarado y los medios bloqueados. Sin DSN SHALL no hacer nada.

#### Scenario: Prueba en el navegador
- **WHEN** se abre cualquier página con `?sentry-test=1`
- **THEN** SHALL lanzarse `Error("Sentry test error (client)")` sin capturar

#### Scenario: Prueba en el servidor
- **WHEN** se pide `GET /api/sentry-test` con `x-sentry-test` igual a `SENTRY_TEST_TOKEN`
- **THEN** SHALL lanzarse `Error("Sentry test error (server)")` y la respuesta SHALL ser 500

#### Scenario: Prueba sin secreto
- **WHEN** falta `SENTRY_TEST_TOKEN` o el header no coincide
- **THEN** la respuesta SHALL ser 404

#### Scenario: Sin datos personales
- **WHEN** Sentry envía un evento del servidor
- **THEN** SHALL NO incluir cookies ni el cuerpo de la request
