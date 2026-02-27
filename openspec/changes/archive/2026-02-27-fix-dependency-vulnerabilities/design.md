## Context

El proyecto tiene 19 vulnerabilidades detectadas por `npm audit` (2 críticas, 10 altas, 6 moderadas, 1 baja). Existen dos categorías de dependencias afectadas:

**Dependencias directas con vulnerabilidades propias:**
- `fast-xml-parser ^4.3.2` → requiere upgrade a `^5.4.1` (major bump, breaking)
- `@astrojs/vercel ^8.0.4` → afecta transitivamente `h3`, `qs`, `minimatch`, `path-to-regexp` (fix non-breaking)
- `@astrojs/check ^0.9.6` → cadena transitiva: `@astrojs/language-server ≥2.14.0` → `volar-service-yaml ≤0.0.68` → `yaml-language-server` → `lodash 4.x` (prototype pollution moderate)

**Dependencias transitivas con fix automático:**
`basic-ftp`, `rollup`, `axios`, `devalue`, `diff`, `ajv`, `tar` — todas solucionables vía `npm audit fix`.

**Restricción clave:** `@astrojs/check` es un devDependency (solo se usa en el script `astro check`). La cadena `lodash` que expone pasa por su tooling de language server. npm audit fix --force sugiere bajar a `@astrojs/check@0.9.2`, lo cual es un downgrade que además no resuelve la raíz (lodash sigue en la misma cadena transitiva). Se trata como riesgo aceptable + override.

## Goals / Non-Goals

**Goals:**
- Eliminar las 2 vulnerabilidades **críticas** (`basic-ftp`, `fast-xml-parser`)
- Eliminar las 10 vulnerabilidades **altas** (`rollup`, `axios`, `devalue`, `h3`, `minimatch`, `qs`, `tar`, `path-to-regexp`, y dependencias de `@astrojs/vercel`)
- Reducir las **moderadas** al máximo posible sin downgrading
- El sitio debe buildear y los tests deben pasar tras cada wave
- Dejar el resultado verificable con `npm audit` y un audit score mejorado

**Non-Goals:**
- No se actualizarán paquetes sin vulnerabilidades conocidas (e.g., `astro`, `react`, `tailwindcss`) — eso es un cambio separado
- No se elimina la dependencia en `@astrojs/check` — es una herramienta de tipado importante
- No se migra a otro package manager (bun, pnpm)

## Decisions

### D1 — Aplicación en 3 waves ordenadas por riesgo

Aplicar los fixes en orden ascendente de complejidad, ejecutando build + tests entre cada wave:

**Wave 1 — `npm audit fix` (no-breaking)**
Actualiza automáticamente todas las dependencias transitivas que tienen fix disponible sin breaking changes:
- `basic-ftp` (critical) vía bump interno de alguna dep de build tools
- `rollup`, `axios`, `devalue`, `h3`, `minimatch`, `qs`, `tar`, `diff`, `ajv`
- `@astrojs/vercel` puede recibir bump para resolver `h3`, `path-to-regexp`, `qs`, `minimatch`

Verificación: `npm run build && npm run test:unit`

**Wave 2 — Upgrade manual de `fast-xml-parser` (critical, breaking)**
Actualizar `package.json` manualmente: `"fast-xml-parser": "^5.4.1"`.
`fast-xml-parser` es una dependencia directa también usada internamente por `@astrojs/rss`. Hay que verificar que la generación del RSS siga funcionando.

Alternativa descartada: usar `npm audit fix --force` — aplica el upgrade junto con cambios no deseados en otros paquetes de forma no controlada.

Verificación: `npm run build` (incluye generación RSS), inspeccionar `/rss.xml` en preview.

**Wave 3 — npm overrides para `lodash` (moderate, cadena transitiva)**
La cadena `@astrojs/check → @astrojs/language-server → volar-service-yaml → yaml-language-server → lodash@4.x` no tiene fix limpio sin downgrading. Se aplica un **override** en `package.json` para forzar `lodash` a su versión más reciente del minor:

```json
"overrides": {
  "lodash": "^4.17.21"
}
```

> Nota: lodash 4.17.21 ya es la última versión en la rama 4.x. Si npm audit sigue reportando el advisory GHSA-xxjr-mmjv-4gpg (que afecta a toda la rama 4.x sin fix upstream), se marcará como **riesgo aceptado** dado que solo afecta al tooling de dev (language server de Astro), no al runtime del sitio.

Alternativa descartada: downgrader `@astrojs/check@0.9.2` — npm audit fix --force lo sugiere pero (a) ya tenemos 0.9.6 con mejoras de tipos, (b) la raíz del problema (lodash en yaml-language-server) permanece igual en 0.9.2.

### D2 — Verificación de RSS con fast-xml-parser v5

`@astrojs/rss` tiene su propia copia de `fast-xml-parser` como dependencia. La dependencia directa en `package.json` es independiente. El upgrade de la copia directa no afecta a la copia de `@astrojs/rss` automáticamente; se resuelve cuando `@astrojs/rss` publique una actualización propia. Sin embargo, `npm audit` reporta la vulnerabilidad también bajo `node_modules/@astrojs/rss/node_modules/fast-xml-parser`.

Estrategia: agregar también un override específico para que npm use la versión segura en todas las copias:

```json
"overrides": {
  "fast-xml-parser": "^5.4.1",
  "lodash": "^4.17.21"
}
```

### D3 — No usar `npm audit fix --force` de forma global

`npm audit fix --force` aplicaría varios breaking changes simultáneamente de forma no determinista. Se rechaza en favor del control wave-by-wave.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| `fast-xml-parser` v5 tiene API breaking — algún uso interno falla en build | Revisar el output del build (`npm run build`) y el RSS generado en preview |
| El override de `fast-xml-parser@^5.4.1` en `@astrojs/rss` puede romper el parsing del feed | Validar `/rss.xml` con un RSS validator online tras el build |
| `lodash` moderate queda sin resolver si el advisory cubre toda la rama 4.x | Documentar como riesgo aceptado (devDependency de tooling, no runtime) |
| `npm audit fix` actualiza algo inesperado en Wave 1 | Revisar el diff de `package-lock.json` antes de commitear |
| Tests de E2E fallan por cambio en comportamiento de deps | Ejecutar `npm run test:unit` tras cada wave; E2E solo al final |

## Migration Plan

```
1. git checkout -b fix/dependency-vulnerabilities
2. Wave 1: npm audit fix → commit "fix: apply non-breaking security audit fixes"
3. Verificar: npm run build && npm run test:unit
4. Wave 2: editar package.json (fast-xml-parser ^5.4.1) + agregar overrides → npm install
5. Verificar: npm run build + revisar RSS + npm run test:unit
6. Wave 3: agregar override lodash en package.json → npm install
7. Verificar: npm audit (contar vulnerabilidades restantes)
8. npm run test:unit && npm run test:e2e (E2E final)
9. Commit + PR
```

**Rollback**: `git checkout package.json package-lock.json && npm install`

## Open Questions

- ¿`@astrojs/rss` con el override de `fast-xml-parser@^5.4.1` genera un RSS válido? → Se verifica en Wave 2.
- ¿npm reportará 0 vulnerabilidades tras las 3 waves o quedará alguna lodash sin resolver? → Documentar el resultado en el PR.
