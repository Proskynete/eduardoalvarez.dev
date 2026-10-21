## Why

Las specs principales todavía describen el sitio del rediseño de febrero. `/now`, `/projects` y `/stack` se retiraron y redirigen a `/about`, pero sus specs siguen diciendo que esas rutas SHALL existir. La navegación, el pie y la home también cambiaron desde entonces. Una spec que contradice el código deja de servir como contrato: quien la lee (persona o agente) construye contra algo que ya no existe.

## What Changes

- **Retirar** `page-now`, `page-projects` y `page-stack-tools`. Lo vigente de «now» vive en `/about` (`src/settings/now.ts`).
- **`site-navigation`**: la barra es Artículos, Charlas, Cursos (externo) y Sobre_mí, con Podcast detrás de `podcastsEnabled`. Sin `/admin`, `/now`, `/stack`, `/projects` ni `/working-with-me`. El pie trae las redes y la newsletter, y «./cookies» cuando existe el panel. Las redirecciones incluyen las páginas retiradas.
- **`page-home`**: hasta cuatro artículos y cuatro charlas, en rejilla de dos columnas, con los títulos en español.

Solo documentación: no cambia código.

## Capabilities

### Modified Capabilities

- `site-navigation`, `page-home`.

### Removed Capabilities

- `page-now`, `page-projects`, `page-stack-tools`.

## Success Criteria

- `openspec validate --specs` en verde.
- Ninguna spec principal exige una ruta que hoy redirige.

## Nota del archivo

`openspec archive` no deja una spec sin requisitos, así que las tres capacidades retiradas se borraron a mano de `openspec/specs/`. Sus deltas `REMOVED` quedan aquí como registro del motivo.
