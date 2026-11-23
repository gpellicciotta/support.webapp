## Walkthrough & Validation

### Summary of Changes
- Added [action-registry.js](../../../src/js/action-registry.js) exporting `createActionRegistry`, `attachActionRegistry`, and `ACTION_ADDED_EVENT`, `ACTION_REMOVED_EVENT`, `ACTION_STATE_CHANGED_EVENT`, `ACTION_RUN_EVENT`.
- Registered `action-registry` in [contract.json](../../../src/contract.json) and replaced the inline stub in [shell-demo.js](../../../src/demo/shell-demo.js) with `attachActionRegistry`.
- Added unit tests in [action-registry.test.js](../../../tests/unit/action-registry.test.js) and browser tests in [action-registry.spec.js](../../../tests/e2e/action-registry.spec.js).
- Updated [components.md](../../../docs/specs/components.md), [ADR-0003-components-and-patterns.md](../../../docs/adrs/ADR-0003-components-and-patterns.md), [ADR-0004-app-shell.md](../../../docs/adrs/ADR-0004-app-shell.md), and [CHANGELOG.md](../../../CHANGELOG.md).

### Red-Phase Proof (Before Implementation)
Command: `npx.cmd vitest run tests/unit/action-registry.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0289-add-an-action-registry-for-app-actions-with

 ❯ tests/unit/action-registry.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/action-registry.test.js [ tests/unit/action-registry.test.js ]
Error: Failed to resolve import "../../src/js/action-registry.js" from "tests/unit/action-registry.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0289-add-an-action-registry-for-app-actions-with/tests/unit/action-registry.test.js:13:8
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  22:30:33
   Duration  2.01s (environment 99%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/action-registry.spec.js`
Exit code: `1`

```text
Running 4 tests using 4 workers

  ✘  2 [mobile-light] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks (6.4s)
  ✘  3 [mobile-dark] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks (6.4s)
  ✘  4 [desktop-dark] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks (6.4s)
  ✘  1 [desktop-light] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks (6.7s)

  1) [desktop-light] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks 

    Error: expect(locator).toContainText(expected) failed

    Locator: locator('.toast-region .toast__text')
    Timeout: 5000ms
    - Expected  - 3
    + Received  + 1

    - Array [
    -   "Sample summary exported.",
    - ]
    + Array []
[... 95 lines omitted ...]
  4 failed
    [desktop-light] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks 
    [desktop-dark] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks 
    [mobile-light] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks 
    [mobile-dark] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks 
```

### Green-Phase Proof (After Implementation)
Command: `npx.cmd vitest run tests/unit/action-registry.test.js tests/unit/screen-action-bar.test.js`
Exit code: `0`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0289-add-an-action-registry-for-app-actions-with

 ✓ tests/unit/screen-action-bar.test.js (12 tests) 92ms
 ✓ tests/unit/action-registry.test.js (14 tests) 94ms

 Test Files  2 passed (2)
      Tests  26 passed (26)
   Start at  22:32:04
   Duration  2.14s (environment 84%, transform 7%, tests 5%, import 3%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/action-registry.spec.js`
Exit code: `0`

```text
Running 4 tests using 4 workers

  ✓  1 [desktop-light] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks (1.9s)
  ✓  4 [mobile-light] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks (1.8s)
  ✓  2 [desktop-dark] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks (2.0s)
  ✓  3 [mobile-dark] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks (2.0s)

  4 passed (4.7s)
```

Command: `python scripts/devops.py check`
Exit code: `1` (All linters, pytest, 2360 unit tests, 978 Playwright tests, `vendor.test.js`, and `pack.test.js` passed; `tests/integration/generate-app.test.js` failed in this isolated worktree because Vitest created a cache-only `node_modules/` in the worktree instead of resolving the repository root's `node_modules/`.)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 35952
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 34464
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 36788
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 8996
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 28564
[... 8 lines omitted ...]
======================== 61 passed, 1 skipped in 2.34s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 31188
[... 60 lines omitted ...]
 Test Files  47 passed (47)
      Tests  2360 passed (2360)
[... 1260 lines omitted ...]
  42 skipped
  978 passed (8.3m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
[... 4 lines omitted ...]
 ✓ tests/integration/vendor.test.js (1 test) 7613ms
 ✓ tests/integration/pack.test.js (3 tests) 2621ms
 ❯ tests/integration/generate-app.test.js (3 tests | 3 failed) 11928ms
[... 25 lines omitted ...]
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@stylistic/eslint-plugin' imported from C:\Users\giova\AppData\Local\Temp\design-generate-gtGKUL\sample-neutral\eslint.config.js
[... 95 lines omitted ...]
 Test Files  1 failed | 2 passed (3)
      Tests  3 failed | 4 passed (7)
**[ERROR]** Finished devops check in 550.2s with status: failed
```

Command: `python scripts/devops.py build`
Exit code: `0`

```text
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 30172
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs
> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove
npm notice
npm notice 📦  @gpellicciotta/support.webapp@0.4.1-pre
npm notice Tarball Contents
[... 50 lines omitted ...]
npm notice 16.1kB src/js/action-registry.js
[... 68 lines omitted ...]
npm notice total files: 124
npm notice
gpellicciotta-support.webapp-0.4.1-pre.tgz
```
