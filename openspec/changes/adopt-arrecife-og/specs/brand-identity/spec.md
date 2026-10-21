## MODIFIED Requirements

### Requirement: Open Graph default image
The system SHALL have a default OG image for every page that is not an article. It is drawn with `defaultTemplate` from `@eduardoalvarez/arrecife/og` by `npm run brand:og` (`scripts/generate-og-default.mjs`): the fin in biolume with a halo in its own column, a divider at x=290, the wordmark in Geist 72/700 and the tagline in Geist 28/400.

**Spec:**
- Dimensions: 1200×630px
- Template: `defaultTemplate` (title and description default to the wordmark and "Technical Lead · Spec-Driven Development")
- File: `public/images/og-default.png`, served through `brand-assets.ts` with `?v=<hash>` from `brand-asset-versions.json`

#### Scenario: Pages that are not articles use the default
- **WHEN** a page that is not an article renders without its own `image`
- **THEN** the `<meta property="og:image">` SHALL point to the absolute URL of `/images/og-default.png?v=<hash>`

#### Scenario: The default follows the library
- **WHEN** `npm run brand:og` runs
- **THEN** `og-default.png` SHALL be the PNG of `defaultTemplate`, and `brand-asset-versions.json` SHALL get the new hash
