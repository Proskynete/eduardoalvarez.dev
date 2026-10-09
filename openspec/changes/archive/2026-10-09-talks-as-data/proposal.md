## Why

Las charlas viven en `src/settings/talks.ts`, un archivo TypeScript que importa sus imágenes con `import`. Sólo se puede editar a mano. El Blog Content Manager va a gestionar las charlas igual que los artículos (crearlas y publicarlas con un PR a este repo), y para eso necesita escribir **datos**, no código: generar TypeScript con imports desde otra app es frágil y un error rompe el build.

Hay además una razón de contenido: el plan para ser GDE en Web Technologies suma charlas online y meetups, y hoy el JSON-LD asume que toda charla es presencial («add a field to Talk before the first remote one»).

## What Changes

- **Una charla, un archivo JSON**: cada charla pasa a `src/data/talks/<slug>.json`. Es el formato que escribirá el CMS, y un archivo por charla evita conflictos entre PRs.
- **`src/settings/talks.ts` deja de tener datos**: lee y valida esos archivos y sigue exportando `talks` y `Talk`, ordenadas de la más reciente a la más antigua. Un archivo inválido detiene el build y nombra el archivo culpable.
- **Imágenes como rutas públicas**: las imágenes de charlas y los logos de organizaciones se mueven a `public/images/`, y los JSON las referencian por ruta. Hoy sólo la imagen de la charla se usa (en el JSON-LD) y los logos no se muestran en ninguna parte, así que no se pierde optimización visible.
- **Modalidad de la charla**: campo opcional `attendance` (`in-person` | `online` | `hybrid`, por defecto `in-person`) que alimenta `eventAttendanceMode` del JSON-LD.
- **Sin cambios visibles**: `/speaking`, la home y `/api/profile.json` (versión 1) se ven y responden igual.

## Capabilities

### New Capabilities

- `talks-data`: formato, ubicación, validación y orden de los datos de charlas; es el contrato que usa el CMS para escribirlas.

### Modified Capabilities

(ninguna: `page-speaking` y el perfil público no cambian de comportamiento)

## Impact

**Archivos nuevos:**
- `src/data/talks/*.json` — una por charla (las 7 actuales)
- `src/utils/talks.ts` — esquema Zod, parseo y orden (funciones puras)
- `tests/units/utils/talks.test.ts`

**Archivos modificados:**
- `src/settings/talks.ts` — carga los JSON
- `src/pages/speaking/index.astro` — JSON-LD con imagen como ruta y modalidad
- `tests/units/utils/profile.test.ts` — el logo pasa a ser una ruta

**Archivos movidos:** `src/assets/images/talks/**` → `public/images/talks/**`, `src/assets/images/organizations/**` → `public/images/organizations/**`.

**Sin dependencias nuevas** (Zod ya está). **Sin variables de entorno nuevas.** No hay breaking changes para consumidores externos: `/api/profile.json` mantiene su forma.

## Success Criteria

- `/speaking` y la home muestran las mismas charlas, en el mismo orden y con los mismos enlaces que antes.
- `/api/profile.json` es idéntico al anterior, salvo `generatedAt`.
- Un JSON con un campo obligatorio faltante hace fallar el build con el nombre del archivo.
- Una charla con `"attendance": "online"` produce `OnlineEventAttendanceMode` en el JSON-LD.
- Lint, `astro check`, unitarios y `npm run build` en verde.
