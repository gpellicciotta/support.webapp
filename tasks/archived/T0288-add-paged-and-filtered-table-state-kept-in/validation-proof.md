## Walkthrough & Validation

### Red Phase (Failing Tests Before Implementation)

Command: `npx.cmd vitest run tests/unit/table-state.test.js` (exit code 1)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0288-add-paged-and-filtered-table-state-kept-in

 ❯ tests/unit/table-state.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/table-state.test.js [ tests/unit/table-state.test.js ]
Error: Failed to resolve import "../../src/js/table-state.js" from "tests/unit/table-state.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0288-add-paged-and-filtered-table-state-kept-in/tests/unit/table-state.test.js:17:8
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  02:05:30
   Duration  2.21s (environment 99%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/table-state.spec.js --project=desktop-light` (exit code 1)

```text
Running 1 test using 1 worker

  ✘  1 [desktop-light] › tests\e2e\table-state.spec.js:5:1 › admin console demo persists filters and page in the hash without history entries and survives reload (6.0s)


  1) [desktop-light] › tests\e2e\table-state.spec.js:5:1 › admin console demo persists filters and page in the hash without history entries and survives reload 

    Error: expect(locator).toContainText(expected) failed

    Locator: locator('[data-table-state-pager]').locator('[data-table-state-text]')
    Expected substring: "Page 1 of 2"
    Timeout: 5000ms
    Error: element(s) not found
[... 18 lines omitted ...]
  1 failed
    [desktop-light] › tests\e2e\table-state.spec.js:5:1 › admin console demo persists filters and page in the hash without history entries and survives reload 
```

### Green Phase (After Implementation)

Command: `npx.cmd vitest run tests/unit/table-state.test.js` (exit code 0)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0288-add-paged-and-filtered-table-state-kept-in

 ✓ tests/unit/table-state.test.js (18 tests) 91ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  02:12:11
   Duration  2.01s (environment 84%, transform 7%, tests 5%, import 3%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/table-state.spec.js --project=desktop-light --project=desktop-dark` (exit code 0)

```text
Running 2 tests using 2 workers

  ✓  1 [desktop-dark] › tests\e2e\table-state.spec.js:5:1 › admin console demo persists filters and page in the hash without history entries and survives reload (2.1s)
  ✓  2 [desktop-light] › tests\e2e\table-state.spec.js:5:1 › admin console demo persists filters and page in the hash without history entries and survives reload (2.1s)

  2 passed (4.6s)
```

Command: `python scripts/devops.py check` (exit code 1; all package linters, unit, Playwright, pack, and vendor checks passed; `generate-app.test.js` failed only because this git worktree has no local `node_modules` directory for its junction symlink)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
[... 10 lines omitted ...]
======================== 61 passed, 1 skipped in 3.50s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
[... 74 lines omitted ...]
 Test Files  53 passed (53)
      Tests  2456 passed (2456)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
[... 1280 lines omitted ...]
  48 skipped
  1012 passed (8.7m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
 ✓ tests/integration/vendor.test.js (1 test) 4348ms
 ✓ tests/integration/pack.test.js (3 tests) 1906ms
 ❯ tests/integration/generate-app.test.js (3 tests | 3 failed) 11702ms
[... 120 lines omitted ...]
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@stylistic/eslint-plugin' imported from C:\Users\giova\AppData\Local\Temp\design-generate-KX7oJd\sample-bright\eslint.config.js
 Test Files  1 failed | 2 passed (3)
      Tests  3 failed | 4 passed (7)
**[ERROR]** Finished devops check in 575.2s with status: failed
```

### Visual Verification
Verified `shell-admin-console.html` at 1440×900 in light and dark modes (HTTP 200, zero console/page/HTTP errors, zero overflow, all targets >= 44 px, AA contrast verified by `verify-ui.spec.js`):
- Before (light): [before-admin-console-light.png](before-admin-console-light.png)
- Before (dark): [before-admin-console-dark.png](before-admin-console-dark.png)
- After (light): [after-admin-console-light.png](after-admin-console-light.png)
- After (dark): [after-admin-console-dark.png](after-admin-console-dark.png)

### Review Round 1 Rework

#### Red Phase (Regression Tests for Blocking Defects 1 and 2)

Command: `npx.cmd vitest run tests/unit/table-state.test.js` (exit code 1)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0288-add-paged-and-filtered-table-state-kept-in

 ❯ tests/unit/table-state.test.js (20 tests | 2 failed) 149ms
[... 24 lines omitted ...]
 FAIL  tests/unit/table-state.test.js > table-state > createTableState controller > replays the request that produced the envelope on serverParams("current") after applyEnvelope
AssertionError: expected 'page=next&page-size=20&page-bookmark=…' to be 'page=next&page-size=20&page-bookmark=…' // Object.is equality

Expected: "page=next&page-size=20&page-bookmark=b-1"
Received: "page=next&page-size=20&page-bookmark=b-2"

 FAIL  tests/unit/table-state.test.js > table-state > createTableState controller > does not write server bookmark page numbers to the hash and ignores stale page params on reload
AssertionError: expected { filters: { q: 'alex' }, …(5) } to match object { filters: { q: 'alex' }, …(2) }
-   "page": 1,
-   "pageNumber": 1,
+   "page": 2,
+   "pageNumber": 2,

 Test Files  1 failed (1)
      Tests  2 failed | 18 passed (20)
```

#### Green Phase (After Rework Fixes)

Command: `npx.cmd vitest run` (exit code 0)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0288-add-paged-and-filtered-table-state-kept-in
[... 60 lines omitted ...]
 ✓ tests/unit/table-state.test.js (20 tests) 114ms
[... 3 lines omitted ...]
 Test Files  53 passed (53)
      Tests  2458 passed (2458)
   Start at  02:34:24
   Duration  14.12s (environment 55%, import 29%, tests 14%, worker 1%, transform 1%)
```

Command: `npx.cmd eslint .` (exit code 0)

```text
(no output)
```

Command: `lint-markdown check --offline` (exit code 0)

```text
All 28 markdown files passed linting.
```

Command: `npx.cmd playwright test tests/e2e/table-state.spec.js tests/e2e/verify-ui.spec.js --project=desktop-light --project=desktop-dark` (exit code 0)

```text
Running 68 tests using 4 workers

  ✓   1 [desktop-light] › tests\e2e\table-state.spec.js:5:1 › admin console demo persists filters and page in the hash without history entries and survives reload (2.7s)
[... 140 lines omitted ...]
  ✓  62 [desktop-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the neutral look (2.6s)
  ✓  63 [desktop-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the warm look (3.0s)
  ✓  64 [desktop-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the bright look blue (3.2s)
  ✓  65 [desktop-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the bright look yellow (3.5s)
  ✓  66 [desktop-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-admin-console passes every verifier check in the bright look red (3.3s)

  68 passed (1.3m)
```
