## Walkthrough & Validation
### Visual Verification
Rebuilt the admin console demo (`src/demo/shell-admin-console.js`) with `createDomBuilders` from `src/js/dom-builders.js` and captured light and dark desktop screenshots before and after the change:
- Light before: [before-admin-console-light.png](before-admin-console-light.png)
- Light after: [after-admin-console-neutral-desktop-light.png](after-admin-console-neutral-desktop-light.png)
- Dark before: [before-admin-console-dark.png](before-admin-console-dark.png)
- Dark after: [after-admin-console-neutral-desktop-dark.png](after-admin-console-neutral-desktop-dark.png)

### Red-Phase Proof (Failing Tests Before Implementation)
Command: `npx.cmd vitest run tests/unit/dom-builders.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0294-add-dom-builders-for-package-components-promoted-from

 ❯ tests/unit/dom-builders.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/dom-builders.test.js [ tests/unit/dom-builders.test.js ]
Error: Failed to resolve import "../../src/js/dom-builders.js" from "tests/unit/dom-builders.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0294-add-dom-builders-for-package-components-promoted-from/tests/unit/dom-builders.test.js:21:8
[... 15 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
```

Command: `npx.cmd playwright test tests/e2e/dom-builders.spec.js --project=desktop-light`
Exit code: `1`

```text
Running 1 test using 1 worker

  ✘  1 [desktop-light] › tests\e2e\dom-builders.spec.js:5:1 › admin console demo filters rows and renders builder empty state, facts, and inline confirm without errors (6.1s)

  1) [desktop-light] › tests\e2e\dom-builders.spec.js:5:1 › admin console demo filters rows and renders builder empty state, facts, and inline confirm without errors 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('.table__frame[role="region"]').locator('.chip--status[data-severity="ok"]')
    Expected: 2
    Received: 0
    Timeout:  5000ms
[... 18 lines omitted ...]
  1 failed
    [desktop-light] › tests\e2e\dom-builders.spec.js:5:1 › admin console demo filters rows and renders builder empty state, facts, and inline confirm without errors 
```

### Green-Phase Verification (After Final Edit)
Command: `python scripts/devops.py lint`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 33276
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 25300
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 26780
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 25640
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
```

Command: `python scripts/devops.py tests`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 36480
[... 11 lines omitted ...]
======================== 61 passed, 1 skipped in 2.38s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 28164
> @gpellicciotta/support.webapp@0.4.1-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0294-add-dom-builders-for-package-components-promoted-from
 ✓ tests/unit/tokens.test.js (1896 tests) 971ms
[... 29 lines omitted ...]
 ✓ tests/unit/dom-builders.test.js (17 tests) 109ms
[... 24 lines omitted ...]
 Test Files  51 passed (51)
      Tests  2425 passed (2425)
   Start at  01:17:37
   Duration  13.57s (environment 52%, import 32%, tests 14%, worker 1%, transform 1%)
```

Command: `npx.cmd playwright test tests/e2e/dom-builders.spec.js tests/e2e/detail-panel.spec.js tests/e2e/shell.spec.js --project=desktop-light --project=desktop-dark --project=mobile-light`
Exit code: `0`

```text
Running 156 tests using 4 workers

  ✓    1 [desktop-light] › tests\e2e\detail-panel.spec.js:5:5 › neutral detail panel scrolls its body beneath a fixed header and separates its danger zone (1.9s)
  ✓    4 [desktop-light] › tests\e2e\detail-panel.spec.js:58:5 › neutral admin console shell example integrates toolbar, selected row, pager, and open detail panel at 1440 px (2.2s)
  ✓    7 [desktop-light] › tests\e2e\dom-builders.spec.js:5:1 › admin console demo filters rows and renders builder empty state, facts, and inline confirm without errors (1.7s)
[... 152 lines omitted ...]
  ✓  151 [mobile-light] › tests\e2e\shell.spec.js:416:1 › admin-console opens its navigation as a drawer under the bar below 64rem (1.5s)
  ✓  155 [mobile-light] › tests\e2e\shell.spec.js:507:1 › the gallery links to every shell demo page (1.3s)

  17 skipped
  139 passed (46.8s)
```

Command: `npx.cmd playwright test tests/e2e/verify-ui.spec.js -g "shell-admin-console" --project=desktop-light --project=desktop-dark`
Exit code: `0`

```text
Running 10 tests using 4 workers

[neutral system 1440px] 55 stylesheets, 87 texts, 30 targets, 30 focus records, 13 sprite references, overflow 0px, errors 0
  ✓   3 [desktop-light] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the neutral look (3.0s)
  ✓   4 [desktop-light] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the bright look blue (3.6s)
  ✓   1 [desktop-light] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the bright look yellow (3.7s)
  ✓   2 [desktop-light] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the warm look (3.9s)
  ✓   5 [desktop-light] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the bright look red (3.3s)
  ✓   6 [desktop-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the neutral look (2.9s)
  ✓   7 [desktop-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the warm look (3.5s)
  ✓   8 [desktop-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the bright look blue (3.5s)
  ✓  10 [desktop-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the bright look red (3.4s)
  ✓   9 [desktop-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the bright look yellow (3.5s)

  10 passed (15.2s)
```

Command: `npx.cmd vitest run --config vitest.integration.config.js tests/integration/pack.test.js tests/integration/vendor.test.js`
Exit code: `0`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0294-add-dom-builders-for-package-components-promoted-from

 ✓ tests/integration/vendor.test.js (1 test) 7738ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 7735ms
 ✓ tests/integration/pack.test.js (3 tests) 2609ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2601ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  01:19:33
   Duration  11.25s (tests 99%, import 1%)
```

Command: `npm.cmd pack --dry-run`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs

> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove

npm notice 📦  @gpellicciotta/support.webapp@0.4.1-pre
[... 72 lines omitted ...]
npm notice 25.9kB src/js/dom-builders.js
[... 64 lines omitted ...]
npm notice total files: 130
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

Note on worktree integration test environment: `tests/integration/generate-app.test.js` symlinks `resolve('node_modules')` from the working directory, which lives in the primary checkout rather than the isolated `.plan/work/` worktree. Every package check touching `src/` and `bin/` (`pack.test.js`, `vendor.test.js`, `npm pack --dry-run`, `lint`, `pytest`, `vitest`, and Playwright) passed cleanly.
