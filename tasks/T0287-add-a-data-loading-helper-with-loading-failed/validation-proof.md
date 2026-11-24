## Walkthrough & Validation

### Red Phase (Failing Tests Before Implementation)

Command: `npx.cmd vitest run tests/unit/data-loader.test.js` (exit code 1)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0287-add-a-data-loading-helper-with-loading-failed

 ❯ tests/unit/data-loader.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/data-loader.test.js [ tests/unit/data-loader.test.js ]
Error: Failed to resolve import "../../src/js/data-loader.js" from "tests/unit/data-loader.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0287-add-a-data-loading-helper-with-loading-failed/tests/unit/data-loader.test.js:7:62
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  01:37:41
   Duration  1.74s (environment 99%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/data-loader.spec.js --project=desktop-light --timeout=15000` (exit code 1)

```text
Running 1 test using 1 worker

  ✘  1 [desktop-light] › tests\e2e\data-loader.spec.js:5:1 › admin console demo screen fails once and recovers through Retry, handles 401 Sign in, and supports quiet refresh (5.9s)


  1) [desktop-light] › tests\e2e\data-loader.spec.js:5:1 › admin console demo screen fails once and recovers through Retry, handles 401 Sign in, and supports quiet refresh 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('[data-admin-loader-demo]')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found
[... 15 lines omitted ...]
  1 failed
    [desktop-light] › tests\e2e\data-loader.spec.js:5:1 › admin console demo screen fails once and recovers through Retry, handles 401 Sign in, and supports quiet refresh 
```

### Green Phase (After Implementation)

Command: `npx.cmd vitest run tests/unit/data-loader.test.js` (exit code 0)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0287-add-a-data-loading-helper-with-loading-failed

 ✓ tests/unit/data-loader.test.js (13 tests) 148ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  01:40:54
   Duration  1.80s (environment 80%, tests 9%, transform 6%, import 4%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/data-loader.spec.js tests/e2e/dom-builders.spec.js --project=desktop-light --project=desktop-dark` (exit code 0)

```text
Running 4 tests using 4 workers

  ✓  2 [desktop-light] › tests\e2e\data-loader.spec.js:5:1 › admin console demo screen fails once and recovers through Retry, handles 401 Sign in, and supports quiet refresh (1.5s)
  ✓  1 [desktop-light] › tests\e2e\dom-builders.spec.js:5:1 › admin console demo filters rows and renders builder empty state, facts, and inline confirm without errors (1.7s)
  ✓  3 [desktop-dark] › tests\e2e\data-loader.spec.js:5:1 › admin console demo screen fails once and recovers through Retry, handles 401 Sign in, and supports quiet refresh (1.8s)
  ✓  4 [desktop-dark] › tests\e2e\dom-builders.spec.js:5:1 › admin console demo filters rows and renders builder empty state, facts, and inline confirm without errors (1.7s)

  4 passed (4.8s)
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
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
[... 10 lines omitted ...]
======================== 61 passed, 1 skipped in 3.26s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
[... 72 lines omitted ...]
 Test Files  52 passed (52)
      Tests  2438 passed (2438)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
[... 1280 lines omitted ...]
  46 skipped
  1010 passed (8.5m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
 ✓ tests/integration/vendor.test.js (1 test) 7711ms
 ✓ tests/integration/pack.test.js (3 tests) 2565ms
 ❯ tests/integration/generate-app.test.js (3 tests | 3 failed) 11392ms
[... 120 lines omitted ...]
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@stylistic/eslint-plugin' imported from C:\Users\giova\AppData\Local\Temp\design-generate-RjV3tn\sample-bright\eslint.config.js
 Test Files  1 failed | 2 passed (3)
      Tests  3 failed | 4 passed (7)
**[ERROR]** Finished devops check in 561.3s with status: failed
```

### Visual Verification
Verified `shell-admin-console.html` at 1440×900 in light and dark modes (HTTP 200, zero console/page/HTTP errors, zero overflow, all targets >= 44 px, AA contrast verified by `verify-ui.spec.js`):
- Before (light): [before-admin-console-light.png](before-admin-console-light.png)
- Before (dark): [before-admin-console-dark.png](before-admin-console-dark.png)
- After (light): [after-admin-console-light.png](after-admin-console-light.png)
- After (dark): [after-admin-console-dark.png](after-admin-console-dark.png)
