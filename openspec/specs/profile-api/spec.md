# profile-api Specification

## Purpose
Perfil público en `/api/profile.json`, prerenderizado y versionado, que terminal.eduardoalvarez.dev lee en su build.
## Requirements
### Requirement: El perfil público se expone como JSON estático

El sitio SHALL publicar `GET /api/profile.json`, generado en el build a partir de `src/settings/` y de los artículos, sin lógica en tiempo de request.

#### Scenario: Respuesta completa
- **WHEN** se pide `/api/profile.json`
- **THEN** la respuesta SHALL ser 200 con `content-type: application/json`
- **THEN** el cuerpo SHALL contener `version`, `generatedAt`, `talks`, `now`, `quotes` y `articles`

#### Scenario: Las charlas ocultas no se publican
- **WHEN** una charla en `src/settings/talks.ts` tiene `show: false`
- **THEN** SHALL NO aparecer en `talks`

#### Scenario: Orden cronológico inverso
- **WHEN** se leen `talks` o `articles`
- **THEN** el primer elemento SHALL ser el más reciente

#### Scenario: Sólo texto y enlaces
- **WHEN** se serializa una charla
- **THEN** SHALL NO incluir imágenes ni el flag `show`; los enlaces a presentación, repositorio y recursos SHALL mantenerse

### Requirement: La forma del payload es versionada

El payload SHALL declarar `version`. Un cambio que rompa la forma SHALL subir ese número.

#### Scenario: Versión inicial
- **WHEN** se publica este cambio
- **THEN** `version` SHALL ser `1`

### Requirement: El perfil lleva el fragmento de la búsqueda de la terminal

El payload de `/api/profile.json` SHALL incluir el campo `tiburoncin` con el quinto de los seis fragmentos de la búsqueda final de terminal.eduardoalvarez.dev. Agregarlo SHALL NO cambiar `version`.

#### Scenario: Leer el perfil
- **WHEN** se pide `/api/profile.json`
- **THEN** el cuerpo SHALL contener `tiburoncin` con un texto que empieza por `🦈 5/6`
- **THEN** `version` SHALL seguir siendo `1`

