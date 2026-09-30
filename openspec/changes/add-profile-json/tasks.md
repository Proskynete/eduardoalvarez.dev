## 1. Frases en la configuración

- [x] 1.1 Añadir `beliefs` y `lifePhilosophy` a `src/settings/about.ts` con el texto actual
- [x] 1.2 `src/pages/about/index.astro` renderiza ambas listas desde la configuración

## 2. El payload

- [x] 2.1 `src/utils/profile.ts`: `buildProfile()` pura, con los tipos del payload exportados
- [x] 2.2 Excluir charlas con `show: false`; ordenar charlas y artículos del más reciente al más antiguo
- [x] 2.3 Tests unitarios de `buildProfile()`
- [x] 2.4 Dejar fuera `src/settings/projects.ts`: es de una página retirada y no está al día (ver `CLAUDE.md`)

## 3. El endpoint

- [x] 3.1 `src/pages/api/profile.json.ts` prerenderizado, `content-type: application/json`
- [x] 3.2 Verificar el archivo en `dist` después de `npm run build`

## 4. Cierre

- [x] 4.1 Lint, typecheck y unitarios en verde
