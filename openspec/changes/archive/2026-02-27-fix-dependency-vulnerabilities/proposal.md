## Why

El `npm audit` reporta **19 vulnerabilidades** (2 críticas, 10 altas, 6 moderadas, 1 baja) en las dependencias del proyecto. Las vulnerabilidades críticas en `basic-ftp` y `fast-xml-parser` representan riesgos de path traversal y DoS respectivamente, y deben ser resueltas con urgencia. La mayoría tienen fix disponible vía `npm audit fix`; un subconjunto menor requiere `--force` por ser breaking changes.

## What Changes

- Actualizar dependencias con vulnerabilidades via `npm audit fix` (cambios no-breaking)
- Actualizar `fast-xml-parser` a `^5.4.1` vía `npm audit fix --force` (breaking — version mayor)
- Actualizar `@astrojs/check` a `^0.9.2` si `npm audit fix --force` lo requiere (breaking — version mayor)
- Verificar que el build y los tests pasan tras cada grupo de actualizaciones
- Documentar los CVEs resueltos

### Vulnerabilidades cubiertas

| Paquete | Severidad | CVE / Advisory | Fix disponible |
|---|---|---|---|
| `basic-ftp` | **critical** | GHSA-5rq4-664w-9x2c (Path Traversal) | `npm audit fix` |
| `fast-xml-parser` | **critical** | GHSA-37qj-frw5-hhjh, GHSA-jmr7-xgp7-cmfj, GHSA-m7jm-9gc2-mpf2, GHSA-fj3w-jwp8-x2g3 | `npm audit fix --force` (breaking) |
| `rollup` | high | GHSA-mw96-cpmx-2vgc (Arbitrary File Write) | `npm audit fix` |
| `axios` | high | GHSA-43fc-jf86-j433 (DoS) | `npm audit fix` |
| `devalue` | high | GHSA-g2pg-6438-jwpf, GHSA-vw5p-8cq8-m7mv, GHSA-33hq-fvwr-56pm, GHSA-8qm3-746x-r74r | `npm audit fix` |
| `h3` | high | GHSA-mp2g-9vg9-f4cg (Request Smuggling) | `npm audit fix` |
| `minimatch` | high | GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj (ReDoS) | `npm audit fix` |
| `qs` | high | GHSA-6rw7-vpxm-498p, GHSA-w7fw-mjwx-w883 (DoS) | `npm audit fix` |
| `tar` | high | GHSA-r6q2-hw4h-h46w, GHSA-34x7-hfp2-rc4v, GHSA-8qq5-rm4j-mr97, GHSA-83g3-92jg-28cx | `npm audit fix` |
| `ajv` | moderate | GHSA-2g4f-4pwh-qvx6 (ReDoS) | `npm audit fix` |
| `diff` | moderate | GHSA-73rr-hh4g-fpgx (DoS) | `npm audit fix` |
| `lodash` | moderate | GHSA-xxjr-mmjv-4gpg (Prototype Pollution) | `npm audit fix --force` (breaking) |

## Capabilities

### New Capabilities
- `dependency-security`: Mantener las dependencias sin vulnerabilidades conocidas mediante auditoría y actualización controlada.

### Modified Capabilities
<!-- No hay cambios en los specs de comportamiento del sitio — solo actualizaciones de dependencias transitivas y directas. -->

## Impact

- **`package.json` / `package-lock.json`**: Se actualizarán versiones de dependencias directas e indirectas.
- **Build pipeline**: `fast-xml-parser ^5.4.1` es breaking; se debe verificar que `@astrojs/rss` siga funcionando correctamente (generación del feed RSS).
- **`@astrojs/check`**: Si se actualiza a `^0.9.2`, validar que el comando `astro check` siga pasando sin errores de tipos.
- **Tests**: Ejecutar suite completa (`npm run test:unit`, `npm run test:e2e`) tras las actualizaciones para detectar regresiones.
- **Deploy**: Sin cambios en la lógica de negocio ni en la UI — solo actualizaciones de seguridad.
