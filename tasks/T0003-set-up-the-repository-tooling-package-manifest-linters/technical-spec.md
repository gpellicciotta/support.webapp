# T0003 Technical Specification
Set up the repository tooling: package manifest, linters, unit and browser test runners, devops scripts, and CI.

---

## Approach
- Model `devops.py` and `bootstrap-dev-environment.py` on the template.java scripts and the cli-guidelines.
- The static server serves `src/` with correct JavaScript and CSS media types on Windows.
- `src/index.html` is a minimal landing page that later links the gallery and shell demos.
- CI runs `python scripts/devops.py tests` and `python scripts/devops.py check` on push and pull requests.

---

## Declared Files
- `package.json`
- `eslint.config.js`
- `vitest.config.js`
- `playwright.config.js`
- `scripts/devops.py`
- `scripts/bootstrap-dev-environment.py`
- `scripts/serve.mjs`
- `.github/workflows/ci.yml`
- `src/index.html`
- `tests/unit/smoke.test.js`
- `tests/e2e/smoke.spec.js`
- `docs/devops.md`
- `CHANGELOG.md`

Size estimate: 13 files, 550 lines
Size note: Configuration files are short and only work together; a split would leave runners without a devops or CI entry point.

### Tests
- Unit: `tests/unit/smoke.test.js` imports an ES module and fails until the Vitest configuration exists.
- Integration: `tests/e2e/smoke.spec.js` starts `scripts/serve.mjs`, loads `src/index.html`, and asserts HTTP 200 with no console errors.

Completion check: `python scripts/devops.py check`, exit code 0
