# observability Specification

## Purpose
Eventos clave de GA4 sin datos personales y monitoreo de errores y rendimiento con Sentry (trazas, replay en error y ganchos de prueba). Cuándo carga GA lo define `cookie-preferences`.
## Requirements
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

