# T0014 Technical Specification
Add the vendor and check commands of the command line tool, with the package manifest.

---

## Approach
- A `prepack` script writes `manifest.json` with the version, each file's look, and each file's SHA-256 hash.
- `check.mjs` is self-contained, with its own hashing code, since `vendor` copies only that file of `bin/`.
- `design.json` holds `version`, `look`, `target`, and `styles`; `check` scans the `styles` folders.
- `check` fails on edited, missing, or unlisted files, and warns on fixed or sticky positions in app styles.
- Output, flags, and exit codes follow the cli-guidelines.

---

## Declared Files
- `bin/cli.mjs`
- `bin/vendor.mjs`
- `bin/check.mjs`
- `bin/manifest.mjs`
- `package.json`
- `tests/unit/manifest.test.js`
- `tests/unit/check.test.js`
- `tests/integration/vendor.test.js`
- `vitest.integration.config.js`
- `scripts/devops.py`
- `.gitignore`
- `docs/devops.md`
- `CHANGELOG.md`

Size estimate: 10 files, 750 lines
Size note: `vendor` and `check` share the manifest format, and the integration test needs all three parts.

### Tests
- Unit: `manifest.test.js` and `check.test.js` cover hashing, pin mismatch, edited files, and each token rule.
- Integration: `vendor.test.js` packs the package, vendors the neutral look into a temporary app, and runs `check` there.

Completion check: `npx vitest run --config vitest.integration.config.js`, exit code 0

The fast suite holds only unit tests, so the integration test has its own config.
`python scripts/devops.py check` runs it after the browser tests.
