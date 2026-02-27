## 1. Branch Setup

- [ ] 1.1 Create branch `fix/dependency-vulnerabilities` from current working branch
- [ ] 1.2 Run `npm audit` and save baseline output for comparison: `npm audit 2>&1 | tee audit-before.txt`

## 2. Wave 1 — Non-breaking fixes (`npm audit fix`)

- [ ] 2.1 Run `npm audit fix` to patch all transitively-resolvable vulnerabilities without breaking changes
- [ ] 2.2 Review `git diff package-lock.json` to verify only expected packages were updated (no unexpected major bumps)
- [ ] 2.3 Run `npm run build` and confirm exit code 0
- [ ] 2.4 Run `npm run test:unit` and confirm all 160 tests pass
- [ ] 2.5 Commit: `🔒️ fix(deps): apply non-breaking security audit fixes`

## 3. Wave 2 — Upgrade `fast-xml-parser` to v5 (critical, breaking)

- [ ] 3.1 In `package.json`, update `"fast-xml-parser": "^4.3.2"` → `"^5.4.1"`
- [ ] 3.2 Add `overrides` field to `package.json` to force the safe version in all nested copies:
  ```json
  "overrides": {
    "fast-xml-parser": "^5.4.1"
  }
  ```
- [ ] 3.3 Run `npm install` and verify `package-lock.json` shows `fast-xml-parser@5.x` everywhere
- [ ] 3.4 Run `npm run build` and confirm exit code 0
- [ ] 3.5 Inspect `dist/rss.xml`: verify it is well-formed XML with at least one `<item>` containing `<title>`, `<link>`, `<description>`, and `<pubDate>`
- [ ] 3.6 Run `npm run test:unit` and confirm all tests pass
- [ ] 3.7 Commit: `🔒️ fix(deps)!: upgrade fast-xml-parser to v5 and add overrides`

## 4. Wave 3 — Override `lodash` to mitigate moderate vulnerability in devDependency chain

- [ ] 4.1 Add `"lodash": "^4.17.21"` under the existing `overrides` field in `package.json`:
  ```json
  "overrides": {
    "fast-xml-parser": "^5.4.1",
    "lodash": "^4.17.21"
  }
  ```
- [ ] 4.2 Run `npm install` and verify the override is applied
- [ ] 4.3 Run `npm run build` and confirm exit code 0
- [ ] 4.4 Commit: `🔒️ fix(deps): override lodash to latest 4.x to reduce moderate advisory surface`

## 5. Final Verification

- [ ] 5.1 Run `npm audit 2>&1 | tee audit-after.txt` and confirm 0 critical and 0 high vulnerabilities
- [ ] 5.2 Compare `audit-before.txt` vs `audit-after.txt` and document remaining advisories (expected: moderate/low devDependency tooling only)
- [ ] 5.3 Run `npm run test:unit` and confirm all 160 tests pass with coverage ≥ 80% on all metrics
- [ ] 5.4 Run `npm run test:e2e` and confirm all E2E tests pass
- [ ] 5.5 Delete `audit-before.txt` and `audit-after.txt` (temporary files, not to be committed)
- [ ] 5.6 Open a PR describing: critical/high vulnerabilities resolved, CVEs fixed, remaining moderate advisories with risk-accepted justification
