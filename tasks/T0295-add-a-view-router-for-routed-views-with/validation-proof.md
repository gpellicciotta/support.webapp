## Walkthrough & Validation
Added `src/js/view-router.js` (`createViewRouter`, `attachViewRouter`, and Auth view event constants), registered `view-router` in `src/contract.json`, wired two routed views (`SampleView` and `SampleNotesView`) plus a fallback view into `src/demo/shell-portal.html` and `src/demo/shell-demo.js`, and documented the module in `docs/specs/components.md`, `docs/adrs/ADR-0004-app-shell.md`, and `CHANGELOG.md`.

### Visual Verification
- Before: [before-portal-view-router.png](before-portal-view-router.png) (HTTP 200, 0 errors).
- After (Sample view): [after-portal-view-router.png](after-portal-view-router.png) (HTTP 200, 0 errors).
- After (Notes view): [after-portal-view-router-notes.png](after-portal-view-router-notes.png) (HTTP 200, 0 errors).

### Red Phase (Failing Tests Before Implementation)
Command: `npx.cmd vitest run tests/unit/view-router.test.js`
Exit code: `1`
```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0295-add-a-view-router-for-routed-views-with

 ❯ tests/unit/view-router.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/view-router.test.js [ tests/unit/view-router.test.js ]
Error: Failed to resolve import "../../src/js/view-router.js" from "tests/unit/view-router.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0295-add-a-view-router-for-routed-views-with/tests/unit/view-router.test.js:16:8
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  03:31:29
   Duration  1.83s (environment 99%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/view-router.spec.js --project=desktop-light`
Exit code: `1`
```text
Running 1 test using 1 worker

  ✘  1 [desktop-light] › tests\e2e\view-router.spec.js:20:5 › view router › moves between two routed views with links and the browser back and forward buttons (6.0s)

  1) [desktop-light] › tests\e2e\view-router.spec.js:20:5 › view router › moves between two routed views with links and the browser back and forward buttons 

    Error: expect(locator).toHaveText(expected) failed

    Locator: locator('[data-view-router-title]')
    Expected: "Sample"
    Timeout: 5000ms
    Error: element(s) not found
[... 16 lines omitted ...]
  1 failed
    [desktop-light] › tests\e2e\view-router.spec.js:20:5 › view router › moves between two routed views with links and the browser back and forward buttons
```

### Green Phase Verification
Command: `python scripts/devops.py lint`
Exit code: `0`
```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 33824
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 31000
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 18660
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 38028
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
```

Command: `npx.cmd vitest run`
Exit code: `0`
```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0295-add-a-view-router-for-routed-views-with

 ✓ tests/unit/tokens.test.js (1896 tests) 966ms
 ✓ tests/unit/view-router.test.js (8 tests) 174ms
 ✓ tests/unit/action-registry.test.js (14 tests) 87ms
 ✓ tests/unit/view.test.js (32 tests) 240ms
 ✓ tests/unit/screen-action-bar.test.js (12 tests) 87ms
[... 54 lines omitted ...]
 Test Files  55 passed (55)
      Tests  2477 passed (2477)
   Start at  03:38:13
   Duration  16.04s (environment 53%, import 28%, tests 13%, transform 4%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/view-router.spec.js tests/e2e/view.spec.js tests/e2e/action-registry.spec.js tests/e2e/screen-action-bar.spec.js tests/e2e/shell-additions.spec.js tests/e2e/verify-ui.spec.js -g "view router|sample view|action registry|screen action bar|shell-portal|portal"`
Exit code: `0`
```text
Running 44 tests using 4 workers

  ✓   2 [desktop-light] › tests\e2e\shell-additions.spec.js:146:1 › portal brand logo renders at --space-7 with --space-2 gap and banner dismiss sits at the end (1.9s)
  ✓   1 [desktop-light] › tests\e2e\screen-action-bar.spec.js:20:5 › screen action bar › shows the routed view screen actions, updates them on state change, and removes the bar on detach (2.4s)
  ✓   3 [desktop-light] › tests\e2e\action-registry.spec.js:20:5 › action registry › registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks (2.7s)
  ✓   9 [desktop-light] › tests\e2e\view-router.spec.js:20:5 › view router › moves between two routed views with links and the browser back and forward buttons (5.2s)
[... 72 lines omitted ...]
  ✓  41 [mobile-dark] › tests\e2e\view-router.spec.js:20:5 › view router › moves between two routed views with links and the browser back and forward buttons (1.7s)
  ✓  42 [mobile-dark] › tests\e2e\view.spec.js:20:5 › sample view › shows the error page after a failed load, and Try again loads the data (1.4s)
  ✓  40 [mobile-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-portal passes every verifier check in the bright look red (4.3s)
  ✓  44 [mobile-dark] › tests\e2e\shell-additions.spec.js:146:1 › portal brand logo renders at --space-7 with --space-2 gap and banner dismiss sits at the end (1.3s)

  44 passed (1.0m)
```

Command: `python scripts/devops.py check` (pytest + vitest + full Playwright slow suite)
Exit code: `1` (before `npm ci` populated worktree `node_modules` for `generate-app.test.js`; re-verified below)
```text
All 28 markdown files passed linting.
All checks passed!
9 files already formatted
======================== 61 passed, 1 skipped in 3.46s ========================
[... 1412 lines omitted ...]
  1036 passed (8.8m)
```

Command: `npm run test:integration` (after `npm ci` in worktree)
Exit code: `0`
```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0295-add-a-view-router-for-routed-views-with

 ✓ tests/integration/vendor.test.js (1 test) 7355ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 7352ms
 ✓ tests/integration/pack.test.js (3 tests) 2713ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2706ms
 ✓ tests/integration/generate-app.test.js (3 tests) 51235ms
   ✓ generates a neutral app that passes its own checks and the conformance check 21733ms
   ✓ generates a warm app that passes its own checks and the conformance check 14936ms
   ✓ generates a bright app that passes its own checks and the conformance check 14562ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  03:49:53
   Duration  62.45s (tests 100%)
```

Command: `python scripts/devops.py build`
Exit code: `0`
```text
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 21632
[... 102 lines omitted ...]
npm notice 38.0kB src/js/view-router.js
npm notice 17.3kB src/js/view.js
[... 35 lines omitted ...]
npm notice total files: 134
gpellicciotta-support.webapp-0.4.1-pre.tgz
```
