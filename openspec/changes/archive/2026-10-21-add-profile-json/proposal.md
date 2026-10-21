## Why

`terminal.eduardoalvarez.dev` va a reemplazar a `resume.eduardoalvarez.dev`: un CV que se consulta con comandos (`talks`, `now`, `projects`, `grep`…). Parte de lo que muestra ya vive en este repo — las charlas, el «ahora», las frases del about y los artículos — pero sólo como archivos TypeScript o como texto escrito a mano dentro de `about/index.astro`.

La única salida pública hoy es el RSS, y trae sólo artículos. Copiar el resto al repo de la terminal dejaría dos fuentes de verdad que se separan la primera vez que se actualiza una. El blog sigue siendo el dueño de estos datos; la terminal los lee.

## What Changes

- **Un endpoint estático**: `GET /api/profile.json`, prerenderizado en el build. Expone charlas visibles, el «ahora» con su fecha, frases y artículos, con un `version` para que el consumidor sepa qué forma esperar.
- **Las frases salen del markup**: «Cómo pienso» y «Filosofía de vida» pasan de `about/index.astro` a `src/settings/about.ts`. La página las lee de ahí y se ve igual que antes.
- **Sin proyectos**: `src/settings/projects.ts` quedó de una página retirada y no está al día. Los proyectos de la terminal salen del CV.
- **Nada de imágenes ni campos internos**: el payload lleva texto y URLs; las imágenes de charlas y el flag `show` se quedan en el sitio.

## Capabilities

### New Capabilities

- `profile-api`: datos públicos del perfil en JSON, para otros sitios del ecosistema.

## Impact

**Archivos nuevos:**
- `src/pages/api/profile.json.ts` — el endpoint
- `src/utils/profile.ts` — arma el payload a partir de la configuración (función pura, testeable)
- `tests/units/utils/profile.test.ts`

**Archivos modificados:**
- `src/settings/about.ts` — `beliefs` y `lifePhilosophy`
- `src/pages/about/index.astro` — renderiza las frases desde la configuración

**Sin efecto en el service worker**: `/api/` ya está excluido del runtime caching.

## Success Criteria

- `curl https://eduardoalvarez.dev/api/profile.json` responde 200 con `content-type: application/json` y los cuatro bloques.
- Una charla con `show: false` no aparece.
- `/about` se ve igual que antes del cambio.
- Unitarios en verde y `npm run build` sin errores.
