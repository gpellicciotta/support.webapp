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
- `package-lock.json`
- `.gitignore`
- `.lint-markdown.json`
- `AGENTS.md`
- `docs/adrs/ADR-0008-repository-layout.md`
- `scripts/requirements.txt`
- `scripts/docs_project.py` (removed after replacing the documentation-only adapter)
- `scripts/markdown-links.py`
- `tests/test_markdown_links.py`
- `pyproject.toml`

Size estimate: 13 files, 550 lines
Size note: Configuration files are short and only work together; a split would leave runners without a devops or CI entry point.

### Tests
- Unit: `tests/unit/smoke.test.js` imports an ES module and fails until the Vitest configuration exists.
- Unit: Verify traversal rejection, malformed URL rejection, JavaScript/CSS media types, and fast-suite configuration.
- Unit: Python link tests preserve failures for missing internal and root-relative files while permitting external workspace evidence.
- Integration: `tests/e2e/smoke.spec.js` starts `scripts/serve.mjs`, loads `src/index.html`, and asserts HTTP 200 with no console errors.
- Integration: Repeat browser checks in desktop/mobile viewports and light/dark preferences; bootstrap and devops commands run unchanged entry points.

Mechanical command: `python -m ruff format scripts tests`

The source checkout omits sibling repositories and the ignored plan store.
The `SW001` plugin delegates internal link checks to support.python and treats those external artifacts as offline evidence.
ESLint 9.39.5 avoids the dependency advisory reported for ESLint 10.14.0; npm marks this older major unsupported.
Python scripts remain tooling rather than a separately packaged Python product; their metadata stays in the npm manifest.

Completion check: `python scripts/devops.py check`, exit code 0
