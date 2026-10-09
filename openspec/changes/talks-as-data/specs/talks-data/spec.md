## ADDED Requirements

### Requirement: Cada charla es un archivo JSON

Cada charla SHALL vivir en su propio archivo `src/data/talks/<slug>.json`, donde `<slug>` es kebab-case (`^[a-z0-9]+(-[a-z0-9]+)*$`) e identifica la charla. El archivo SHALL tener esta forma:

```json
{
  "title": "string, obligatorio",
  "description": "string, obligatorio",
  "show": true,
  "date": ["inicio ISO 8601, obligatorio", "fin ISO 8601, opcional"],
  "attendance": "in-person | online | hybrid (opcional, por defecto in-person)",
  "image": "/images/talks/... (opcional, ruta pública)",
  "location": { "name": "string", "url": "URL" },
  "organizations": [{ "name": "string", "url": "URL", "logo": "/images/organizations/... (opcional)" }],
  "options": {
    "repo": "URL (opcional)",
    "presentation": "URL (opcional)",
    "resources": [{ "label": "string", "url": "URL o ruta pública" }]
  }
}
```

`organizations` SHALL poder ser un arreglo vacío y `options` SHALL ser opcional.

#### Scenario: Charla mínima válida
- **WHEN** un archivo trae sólo `title`, `description`, `show`, `date` con un elemento, `location` y `organizations: []`
- **THEN** la charla SHALL cargarse con `attendance` igual a `in-person`

#### Scenario: Archivo con un campo obligatorio faltante
- **WHEN** `src/data/talks/x.json` no trae `title`
- **THEN** el build SHALL fallar con un error que nombra `x.json` y el campo

#### Scenario: Nombre de archivo inválido
- **WHEN** existe `src/data/talks/Mi Charla.json`
- **THEN** el build SHALL fallar con un error que nombra el archivo

### Requirement: Las charlas se exponen ordenadas

`src/settings/talks.ts` SHALL exportar `talks`, el arreglo de todas las charlas (visibles y ocultas), ordenado por fecha de inicio de la más reciente a la más antigua, y el tipo `Talk`. Cada charla SHALL incluir su `slug`.

#### Scenario: Orden independiente del nombre del archivo
- **WHEN** existen `a-antigua.json` (2019) y `z-reciente.json` (2026)
- **THEN** `talks[0]` SHALL ser la de 2026

#### Scenario: La home muestra las más recientes
- **WHEN** se renderiza la home
- **THEN** las charlas destacadas SHALL ser las 4 visibles más recientes

### Requirement: La modalidad alimenta el JSON-LD

El JSON-LD de `/speaking` SHALL derivar `eventAttendanceMode` de `attendance`: `in-person` → `OfflineEventAttendanceMode`, `online` → `OnlineEventAttendanceMode`, `hybrid` → `MixedEventAttendanceMode`. Si la charla tiene `image`, el JSON-LD SHALL usar su URL absoluta.

#### Scenario: Charla online
- **WHEN** una charla visible tiene `"attendance": "online"`
- **THEN** su `Event` en el JSON-LD SHALL tener `eventAttendanceMode` `https://schema.org/OnlineEventAttendanceMode`

#### Scenario: Charla con imagen
- **WHEN** una charla tiene `"image": "/images/talks/astro-pokemon/final.webp"`
- **THEN** su `Event` SHALL tener `image` `https://eduardoalvarez.dev/images/talks/astro-pokemon/final.webp`

### Requirement: La migración no cambia lo que se ve

Pasar las charlas a JSON SHALL NO cambiar el contenido visible de `/speaking` ni de la home, ni la forma de `/api/profile.json` (que se mantiene en versión 1).

#### Scenario: Perfil público estable
- **WHEN** se compara `/api/profile.json` antes y después del cambio
- **THEN** `talks` SHALL ser idéntico (mismos campos, valores y orden)
