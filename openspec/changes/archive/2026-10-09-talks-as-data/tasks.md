## 1. Red de seguridad

- [x] 1.1 Guardar una instantánea de `buildProfile(...).talks` con los datos actuales en `tests/units/utils/__fixtures__/profile-talks.json`

## 2. Carga y validación

- [x] 2.1 `src/utils/talks.ts`: `talkSchema` (Zod), `parseTalks()` (valida, agrega `slug`, `attendance` por defecto, ordena) y el tipo `Talk`
- [x] 2.2 `tests/units/utils/talks.test.ts`: charla mínima, campo faltante con nombre de archivo, nombre inválido, orden por fecha, `attendance` por defecto

## 3. Migración de datos

- [x] 3.1 Mover `src/assets/images/talks/**` y `src/assets/images/organizations/**` a `public/images/` (mismos nombres)
- [x] 3.2 Crear los 7 `src/data/talks/<slug>.json` con los datos de `talks.ts` y las rutas públicas
- [x] 3.3 `src/settings/talks.ts` pasa a `import.meta.glob` + `parseTalks`, reexportando `Talk`

## 4. Consumidores

- [x] 4.1 `/speaking`: JSON-LD con `image` como ruta absoluta y `eventAttendanceMode` desde `attendance`
- [x] 4.2 Home: las destacadas siguen siendo las 4 visibles más recientes
- [x] 4.3 `tests/units/utils/profile.test.ts`: `logo` como ruta; test que compara el perfil migrado con la instantánea de 1.1

## 5. Verificación

- [x] 5.1 Lint, `astro check` y unitarios en verde
- [x] 5.2 `npm run build` y revisar `dist`: `/api/profile.json` igual a la instantánea, JSON-LD de `/speaking` con imágenes absolutas
- [x] 5.3 Revisar `/speaking` y la home en el navegador contra producción
