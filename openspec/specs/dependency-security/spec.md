# dependency-security Specification

## Purpose
TBD - created by archiving change fix-dependency-vulnerabilities. Update Purpose after archive.
## Requirements
### Requirement: No critical or high vulnerabilities in production dependencies

The project's dependency tree SHALL have zero critical or high severity vulnerabilities as reported by `npm audit` for packages that affect the production build (i.e., non-devDependencies or devDependencies that ship code to the browser/server).

#### Scenario: Audit passes after Wave 1 (non-breaking fixes)
- **WHEN** `npm audit fix` is executed
- **THEN** all transitively-resolved vulnerabilities with an automatic non-breaking fix are patched in `package-lock.json`
- **THEN** `npm audit` no longer reports `basic-ftp` as critical

#### Scenario: Audit passes after Wave 2 (fast-xml-parser upgrade)
- **WHEN** `fast-xml-parser` is updated to `^5.4.1` in `package.json` and `npm install` is run
- **THEN** `npm audit` no longer reports `fast-xml-parser` as critical
- **THEN** the override `"fast-xml-parser": "^5.4.1"` in the `overrides` field ensures all nested copies use the safe version

#### Scenario: Audit reports 0 critical and 0 high vulnerabilities
- **WHEN** all three waves are applied and `npm audit` is executed
- **THEN** the summary line shows `0 vulnerabilities` at critical and high severity levels

---

### Requirement: Production build succeeds after dependency updates

The Astro production build SHALL complete successfully with no errors after each wave of dependency updates.

#### Scenario: Build passes after Wave 1
- **WHEN** `npm run build` is executed after `npm audit fix`
- **THEN** the build exits with code 0
- **THEN** the `dist/` directory is populated with all expected static assets

#### Scenario: Build passes after Wave 2 (fast-xml-parser v5)
- **WHEN** `npm run build` is executed after upgrading `fast-xml-parser` to `^5.4.1`
- **THEN** the build exits with code 0
- **THEN** `dist/rss.xml` is present and contains valid RSS 2.0 markup

#### Scenario: RSS feed is valid after fast-xml-parser major upgrade
- **WHEN** `dist/rss.xml` is inspected after the build
- **THEN** the file is well-formed XML
- **THEN** the feed contains at least one `<item>` element
- **THEN** each `<item>` has `<title>`, `<link>`, `<description>`, and `<pubDate>`

---

### Requirement: Unit test suite passes after dependency updates

All existing unit tests SHALL continue to pass after each wave of dependency updates, with no test regressions introduced by the dependency changes.

#### Scenario: Unit tests pass after all waves
- **WHEN** `npm run test:unit` is executed after completing all three waves
- **THEN** all 160 unit tests pass
- **THEN** code coverage remains at or above the configured thresholds (80% statements, branches, functions, lines)

---

### Requirement: Moderate vulnerabilities in devDependency tooling are documented and risk-accepted

For vulnerabilities that cannot be resolved without downgrading active tooling (e.g., `lodash` via `@astrojs/check → volar-service-yaml → yaml-language-server`), the project SHALL document them as accepted risk since they are confined to the development-time language server and do not affect the production runtime.

#### Scenario: lodash moderate vulnerability is addressed via override
- **WHEN** the `overrides` field in `package.json` pins `"lodash": "^4.17.21"`
- **THEN** npm installs the latest available patch of lodash 4.x across all nested copies
- **THEN** the residual advisory (if any) is for the dev-only language server toolchain, not for any runtime code

#### Scenario: Remaining advisory count is documented in PR
- **WHEN** `npm audit` is executed after all waves
- **THEN** any remaining advisories are at moderate or low severity only
- **THEN** each remaining advisory is annotated as "devDependency tooling only — no runtime impact"

---

### Requirement: npm overrides are applied for packages with nested vulnerable copies

Where a dependency ships its own nested copy of a vulnerable package (e.g., `@astrojs/rss` bundling `fast-xml-parser@4.x`), the project SHALL use the `overrides` field in `package.json` to force the safe version across the entire dependency graph.

#### Scenario: Override resolves nested copy of fast-xml-parser
- **WHEN** `"fast-xml-parser": "^5.4.1"` is set under `overrides` in `package.json`
- **THEN** `npm install` resolves all nested occurrences of `fast-xml-parser` to `^5.4.1`
- **THEN** `npm audit` no longer reports `node_modules/@astrojs/rss/node_modules/fast-xml-parser` as vulnerable

