# T0021 Technical Specification

## Contract
**[Decided]** Export setCatalog(catalog), t(key, params), and applyTranslations(root = document).
Accept flat JSON objects with string values; copy catalogs and reject invalid catalogs atomically.
Missing keys return their key. Substitute own parameters using {name}, accepting dashes and underscores.
Unknown parameters remain unchanged. Shells own loading, persistence, events, and document language.
Translate root elements and descendants, including fragments. Text uses textContent; HTML injection is unsupported.
Map aria to aria-label, tooltip to data-tooltip and title, and placeholder to placeholder.
This utility adds no persistent visual specimen; browser tests exercise consumer markup.

### Declared Files
- src/js/i18n.js
- tests/unit/i18n.test.js
- tests/e2e/i18n.spec.js
- docs/specs/i18n.md
- docs/specs/naming.md
- docs/index.md
- CHANGELOG.md

### Tests
- Unit: missing keys, interpolation, own properties, catalog copying, replacement, validation, and atomic rejection.
- Integration: browser imports, all attributes, root inclusion, fragment scope, safe text, and catalog switching.

Completion check: python scripts/devops.py check and npx playwright test tests/e2e/i18n.spec.js.

Size estimate: 2 files, 25 lines
Added files and CHANGELOG.md are excluded from counted size.

## Source
Read ADR-0003, the roadmap, and meteo's js/i18n.js at commit 8937c32fca32a82acc6a15b08901f354284cd14b.
Preserve meteo's four attribute mappings and single-brace interpolation; apps own loading.
