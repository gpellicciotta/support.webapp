# T0022 Technical Specification
Build the Python generate-app devops action and the starter app template.

---

## Sources
- [ADR-0006](../../../docs/adrs/ADR-0006-generator.md) defines the command, flags, generated files, and placeholders.
- [ADR-0004](../../../docs/adrs/ADR-0004-app-shell.md) and the app shell skeletons of `docs/specs/components.md` define the shell markup.
- todos.webapp `v0.5.0` at `d6e46d5764f47ea1ed7d7d7fadd7e436994d425b`: workspace shell, service worker, style entry, project files.
- family-portal `v0.6.0` at `46af15981a55f2b866f9206f8ee943de39bd641c`: brand and breadcrumb top bar, footer as action bar.
- template.python: `.editorconfig`, CI, and project file layout.

---

## Decisions
- **[Decided]** `scripts/generate_app.py` holds the generator; `devops.py` registers it as the `generate-app` action.
- **[Decided]** The generator writes into a temporary folder beside the output and renames it on success.
  A failure removes only that temporary folder, so no partial app remains.
- **[Decided]** `node bin/cli.mjs vendor --look {{look}} --to src/vendor/design --styles src/css` runs inside the new app.
  `vendor` resolves `--to` and writes `design.json` relative to its working folder, so ADR-0006's absolute form cannot work.
- **[Decided]** `index.html` marks optional areas with `<!-- if:{{condition}} -->` and `<!-- end:{{condition}} -->` lines.
  Conditions: `sidebar`, `bottom`, `menu`, `breadcrumb`, `action-bar`, `side-panel`; a `!` prefix negates one.
- **[Decided]** One internal placeholder, `{{shell-classes}}`, joins ADR-0006's six for the body classes.
  A new `--title` flag sets `{{app-title}}`; it defaults to the app name in title case.
- **[Decided]** A backslash before `{{` keeps a documentation placeholder literal in the generated app.
  Every other `{{name}}` left after filling fails the generation.
- **[Decided]** A pre-release checkout version only warns, so tests and previews can generate from `main`.
- **[Decided]** The service worker precaches app files from a list and vendored files from the vendored `manifest.json`.
  Re-vendoring then needs no list edit, only a `VERSION` bump.
- **[Decided]** The generated `devops.py` lint runs Markdown lint, Ruff, ESLint, and the design conformance check.
- **[Decided]** `--nav none` cannot combine with other values; all other navigation values combine freely.
- Combined task: the template cannot be verified without the generator, and the generator has nothing to copy without it.

---

### Declared Files
Counted files, modified:
- `scripts/devops.py`: register the `generate-app` action.
- `.lint-markdown.json`: exclude `template/`, whose links resolve only in a generated app.
- `README.md`: name the generator.
- `docs/devops.md`: a Generator section with the command, flags, and next steps.
- `docs/adrs/ADR-0006-generator.md`: the vendor working folder, `--title`, internal placeholders, escapes.

Added files, not counted:
- `scripts/generate_app.py`.
- `tests/test_generate_app.py`: fast unit tests.
- `tests/integration/generate-app.test.js`: the integration scenario.
- `template/`: the starter app, listed in ADR-0006.

Size estimate: 6 files, 160 lines

---

### Tests
- Unit: `tests/test_generate_app.py`, written before the code:
  - Fills all six ADR placeholders and the internal ones in every template file.
  - Keeps escaped `\{{task-id}}` literal and fails on an unknown or unfilled placeholder, naming file and name.
  - Keeps and drops `index.html` area blocks per option, including negated conditions; fails on an unclosed marker.
  - Maps scroll and width to body classes; `full` adds no width class.
  - Rejects a bad app name, unknown look, `none` combined with another `--nav`, and an existing output folder.
  - Falls back to the Git user name for `--owner`, and fails without either.
  - Removes the temporary folder when vendoring fails, leaving no output folder.
  - Never creates `.git/` or `.plan/` in the output.
  - Keeps the template's support.python pin equal to this repository's pin.
- Integration: `tests/integration/generate-app.test.js` generates one app per look through `devops.py generate-app`.
  Each app runs its own `python scripts/devops.py check`: Markdown lint, Ruff, ESLint, conformance, Vitest, Playwright.
  Its Playwright smoke test loads the app at 390 and 1440 px, light and dark, with zero console errors or failed requests.

Completion check: `python scripts/devops.py check`, exit code 0
