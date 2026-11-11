# T0015 Technical Specification
Add the GitHub Packages publish workflow and document the release flow of the package.

---

## Approach
- Model the workflow on support.js, authenticating with the workflow's own token.
- `pack.test.js` runs `npm pack --dry-run --json` and compares the file list with ADR-0008.

---

## Declared Files
- `.github/workflows/publish.yml`
- `package.json`
- `tests/integration/pack.test.js`
- `docs/devops.md`
- `README.md`
- `CHANGELOG.md`

Size estimate: 6 files, 200 lines

### Tests
- Unit test: none (workflow configuration; the pack test covers the shipped file list)
- Integration: `pack.test.js` asserts that the packed file list matches the layout of ADR-0008 and excludes the gallery.

Completion check: `npx vitest run tests/integration/pack.test.js`, exit code 0
