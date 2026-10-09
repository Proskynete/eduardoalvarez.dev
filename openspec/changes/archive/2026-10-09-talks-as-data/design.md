## Context

`src/settings/talks.ts` mezcla el tipo `Talk`, los datos de 7 charlas y 11 `import` de imágenes (`ImageMetadata`). Lo consumen tres lugares: `/speaking` (lista por año + JSON-LD), la home (4 destacadas) y `utils/profile.ts` (`/api/profile.json`). Las imágenes de charla sólo se usan para `image` en el JSON-LD (`talk.image.src`); los logos de organización no se renderizan en ninguna parte.

El Blog Content Manager (otro repo) va a crear y editar charlas abriendo un PR aquí, igual que hace con los artículos. Necesita un formato que pueda escribir sin generar código.

## Goals / Non-Goals

**Goals**
- Un formato de datos estable, validado y fácil de escribir por otra app.
- Cero cambios visibles y en `/api/profile.json`.
- Modalidad de la charla para el JSON-LD.

**Non-Goals**
- Rediseñar `/speaking` o mostrar imágenes y logos.
- Gestionar charlas desde el CMS (es el cambio siguiente, en el otro repo).
- Subir la versión del perfil público.

## Decisions

### 1. Un JSON por charla en `src/data/talks/`
Un archivo por charla, nombrado por su slug. Cada PR del CMS toca un solo archivo, así que dos charlas nuevas no chocan entre sí.
- *Alternativa: un único `talks.json`.* Más simple de leer, pero cada PR reescribe el mismo archivo y los conflictos son seguros.
- *Alternativa: MDX con frontmatter.* Las charlas no tienen cuerpo; sería formato sin uso.
- *¿Por qué `src/data` y no `src/content`?* En Astro `src/content` sugiere una content collection. Aquí basta un `import.meta.glob` síncrono que mantiene `talks` como export de módulo, sin tocar a los consumidores. Se puede migrar a una collection después sin cambiar el formato.

### 2. Carga con `import.meta.glob` + validación con Zod en una función pura
`src/utils/talks.ts` exporta `talkSchema`, `parseTalks(files: Record<path, unknown>)` y el tipo. `parseTalks` valida cada archivo, valida el slug del nombre, agrega `slug`, aplica `attendance` por defecto y ordena. `src/settings/talks.ts` sólo hace el glob (`eager: true, import: "default"`) y llama a `parseTalks`. Al ser pura, se prueba con Vitest sin Astro.
- Un error lanza `Error("src/data/talks/<archivo>: <campo> <motivo>")`, lo que hace fallar el build.

### 3. La forma del JSON sigue la del `Talk` actual
Se mantienen `date: [inicio, fin?]` y `options: { repo, presentation, resources }`. Así el cambio en los consumidores es mínimo (sólo `image` y `logo` pasan de `ImageMetadata` a `string`) y `buildProfile` no cambia.
- *Alternativa: la forma del perfil (`start`, `end`, `links`).* Más limpia, pero obliga a reescribir los tres consumidores sin un beneficio visible.

### 4. Imágenes en `public/images/`
`src/assets/images/talks/**` → `public/images/talks/**` y `organizations/**` → `public/images/organizations/**`, con los mismos nombres. El JSON guarda la ruta pública. Se pierde el hash de Astro en esas URLs, pero hoy sólo se usan en el JSON-LD (que ya pedía una URL absoluta) y el CMS puede subir una imagen con el PR sin tocar código.

### 5. `attendance` opcional con valor por defecto
Las 7 charlas actuales son presenciales; no hace falta tocarlas. El valor por defecto vive en el esquema, no en los consumidores.

## Risks / Trade-offs

- **[Riesgo] Un JSON mal escrito por el CMS rompe el deploy** → el build falla con el archivo y el campo; el PR del CMS se revisa antes del merge, y Vercel no publica un build fallido.
- **[Riesgo] Diferencias sutiles al migrar los datos a mano** → test que compara `buildProfile` con las charlas migradas contra una instantánea tomada antes del cambio (títulos, fechas, enlaces, orden).
- **[Trade-off] Imágenes sin optimización de Astro** → aceptable: no se muestran en la página.
- **[Riesgo] Imágenes cacheadas por el service worker con las rutas viejas** → las rutas viejas tenían hash y no las referencia nada nuevo; las nuevas se cachean con `CacheFirst` como cualquier imagen.

## Migration Plan

1. Tomar una instantánea de `buildProfile(...).talks` con los datos actuales (fixture del test).
2. Mover imágenes y crear los 7 JSON.
3. Cambiar `talks.ts` a la carga, ajustar `/speaking` y los tests.
4. Comparar el perfil con la instantánea, `npm run build`, revisar `/speaking` y la home.

Rollback: revertir el PR. No hay datos fuera del repo.

## Open Questions

Ninguna.
