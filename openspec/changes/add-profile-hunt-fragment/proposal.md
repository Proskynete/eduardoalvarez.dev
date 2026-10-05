## Why

terminal.eduardoalvarez.dev tiene una búsqueda final: una frase en seis fragmentos repartidos por los sitios de Eduardo. El del blog va en `/api/profile.json`, el perfil que la propia terminal ya lee, para quien curiosee la API.

## What Changes

- `/api/profile.json` suma el campo `tiburoncin` con el quinto fragmento (`🦈 5/6 «…»`).
- Es un campo nuevo: no rompe a ningún consumidor, así que `version` sigue en `1`.

## Capabilities

### New Capabilities

### Modified Capabilities

- `profile-api`: el payload suma el campo `tiburoncin`. Se apoya en `add-profile-json`, que conviene archivar antes que este cambio.

## Impact

- **Código:** `src/utils/profile.ts` y su test.
- **Consumidores:** ninguno lee el campo; la terminal guarda solo su hash. Cambiar el texto rompe la búsqueda.
