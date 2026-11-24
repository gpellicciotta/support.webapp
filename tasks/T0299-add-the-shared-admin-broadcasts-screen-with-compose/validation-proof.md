## Walkthrough & Validation
### Summary
- Added `src/js/admin-broadcasts.js` implementing the shared admin Broadcasts screen (`attachAdminBroadcasts`, `createAdminBroadcasts`, `createAdminBroadcastsScreen`, `buildBroadcastHistory`, `normalizeBroadcastHistory`, `formatAudience`, `formatBroadcastTime`, `toUtcTime`, `filterBroadcastHistory`).
- Added `.app__split`, `.app__section`, `.app__slot`, `.app__status`, and `.app__scroll-list` layout rules to `src/css/shell.css`, stacking compose and preview below `64rem` and splitting `3fr 2fr` at `64rem` and above.
- Registered `admin-broadcasts` in `src/contract.json` and mounted the Broadcasts screen in `src/demo/shell-admin-console.html` and `src/demo/shell-admin-console.js` with sample broadcasts, recipient selection, live publish/retract, and state previews.
- Added unit tests in `tests/unit/admin-broadcasts.test.js` (13 tests) and browser tests in `tests/e2e/admin-broadcasts.spec.js` (16 tests across desktop/mobile and light/dark).
- Updated `docs/specs/components.md`, `docs/adrs/ADR-0003-components-and-patterns.md`, and `CHANGELOG.md`.

### Visual Verification
- Before (neutral desktop light): [before-admin-console-neutral-desktop-light.png](before-admin-console-neutral-desktop-light.png)
- After (neutral desktop light): [after-admin-broadcasts-neutral-desktop-light.png](after-admin-broadcasts-neutral-desktop-light.png)
- After (neutral desktop dark): [after-admin-broadcasts-neutral-desktop-dark.png](after-admin-broadcasts-neutral-desktop-dark.png)
- After (neutral mobile light): [after-admin-broadcasts-neutral-mobile-light.png](after-admin-broadcasts-neutral-mobile-light.png)
- After (neutral mobile dark): [after-admin-broadcasts-neutral-mobile-dark.png](after-admin-broadcasts-neutral-mobile-dark.png)
- After (warm desktop light): [after-admin-broadcasts-warm-desktop-light.png](after-admin-broadcasts-warm-desktop-light.png)
- After (warm desktop dark): [after-admin-broadcasts-warm-desktop-dark.png](after-admin-broadcasts-warm-desktop-dark.png)
- After (warm mobile light): [after-admin-broadcasts-warm-mobile-light.png](after-admin-broadcasts-warm-mobile-light.png)
- After (warm mobile dark): [after-admin-broadcasts-warm-mobile-dark.png](after-admin-broadcasts-warm-mobile-dark.png)
- After (bright desktop light): [after-admin-broadcasts-bright-desktop-light.png](after-admin-broadcasts-bright-desktop-light.png)
- After (bright desktop dark): [after-admin-broadcasts-bright-desktop-dark.png](after-admin-broadcasts-bright-desktop-dark.png)
- After (bright mobile light): [after-admin-broadcasts-bright-mobile-light.png](after-admin-broadcasts-bright-mobile-light.png)
- After (bright mobile dark): [after-admin-broadcasts-bright-mobile-dark.png](after-admin-broadcasts-bright-mobile-dark.png)

### Red-Phase Proof (Unit)
Command: `npx.cmd vitest run tests/unit/admin-broadcasts.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0299-add-the-shared-admin-broadcasts-screen-with-compose

 ❯ tests/unit/admin-broadcasts.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/admin-broadcasts.test.js [ tests/unit/admin-broadcasts.test.js ]
Error: Failed to resolve import "../../src/js/admin-broadcasts.js" from "tests/unit/admin-broadcasts.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0299-add-the-shared-admin-broadcasts-screen-with-compose/tests/unit/admin-broadcasts.test.js:29:8
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  05:51:27
   Duration  1.42s (environment 99%, worker 1%)
```

### Red-Phase Proof (Browser)
Command: `npx.cmd playwright test tests/e2e/admin-broadcasts.spec.js --project=desktop-light`
Exit code: `1`

```text
Running 4 tests using 4 workers

  ✘  2 [desktop-light] › tests\e2e\admin-broadcasts.spec.js:25:1 › admin console demo composes with live preview, selects recipients, publishes, filters, and retracts history rows (6.3s)
  ✘  1 [desktop-light] › tests\e2e\admin-broadcasts.spec.js:129:5 › bright admin broadcasts screen stacks compose and preview below 64rem and splits on desktop (6.4s)
  ✘  3 [desktop-light] › tests\e2e\admin-broadcasts.spec.js:129:5 › warm admin broadcasts screen stacks compose and preview below 64rem and splits on desktop (6.4s)
  ✘  4 [desktop-light] › tests\e2e\admin-broadcasts.spec.js:129:5 › neutral admin broadcasts screen stacks compose and preview below 64rem and splits on desktop (6.1s)

  1) [desktop-light] › tests\e2e\admin-broadcasts.spec.js:25:1 › admin console demo composes with live preview, selects recipients, publishes, filters, and retracts history rows 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('[data-admin-broadcasts]')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found
[... 82 lines omitted ...]
  4 failed
```

### Green-Phase Proof (Unit)
Command: `npx.cmd vitest run tests/unit/admin-broadcasts.test.js tests/unit/shell.test.js tests/unit/tokens.test.js`
Exit code: `0`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0299-add-the-shared-admin-broadcasts-screen-with-compose

 ✓ tests/unit/shell.test.js (6 tests) 23ms
 ✓ tests/unit/tokens.test.js (1896 tests) 789ms
 ✓ tests/unit/admin-broadcasts.test.js (13 tests) 384ms

 Test Files  3 passed (3)
      Tests  1915 passed (1915)
   Start at  05:55:06
   Duration  2.68s (environment 42%, tests 34%, transform 15%, import 9%, worker 1%)
```

### Green-Phase Proof (Browser)
Command: `$env:T0299_CAPTURE_DIR='C:/Dev-Projects/support.webapp/.plan/tasks/T0299-add-the-shared-admin-broadcasts-screen-with-compose'; npx.cmd playwright test tests/e2e/admin-broadcasts.spec.js`
Exit code: `0`

```text
Running 16 tests using 4 workers

  ✓   1 [desktop-light] › tests\e2e\admin-broadcasts.spec.js:129:5 › warm admin broadcasts screen stacks compose and preview below 64rem and splits on desktop (2.0s)
  ✓   3 [desktop-light] › tests\e2e\admin-broadcasts.spec.js:129:5 › neutral admin broadcasts screen stacks compose and preview below 64rem and splits on desktop (1.8s)
  ✓   4 [desktop-light] › tests\e2e\admin-broadcasts.spec.js:129:5 › bright admin broadcasts screen stacks compose and preview below 64rem and splits on desktop (2.0s)
  ✓   2 [desktop-light] › tests\e2e\admin-broadcasts.spec.js:25:1 › admin console demo composes with live preview, selects recipients, publishes, filters, and retracts history rows (2.7s)
[... 11 lines omitted ...]
  ✓  13 [mobile-dark] › tests\e2e\admin-broadcasts.spec.js:25:1 › admin console demo composes with live preview, selects recipients, publishes, filters, and retracts history rows (2.7s)

  16 passed (17.3s)
```

### Full Check Suite
Command: `python scripts/devops.py check` (lint-markdown, ruff, eslint, pytest, full unit suite, and full Playwright suite passed; `generate-app.test.js` failed before `npm.cmd ci` populated worktree `node_modules`, then passed in the runs below)
Exit code: `1` (before `npm.cmd ci`), then `0` on the remaining checks below

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 37344
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 20864
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 8228
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 31816
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 37824
[... 11 lines omitted ...]
======================== 61 passed, 1 skipped in 3.42s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 12460
[... 79 lines omitted ...]
 Test Files  59 passed (59)
      Tests  2537 passed (2537)
   Start at  05:57:46
   Duration  18.47s (environment 55%, import 26%, tests 13%, transform 4%, worker 1%)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 6440
[... 1373 lines omitted ...]
  48 skipped
  1100 passed (9.2m)
```

### Integration Tests (after `npm.cmd ci`)
Command: `npm.cmd run test:integration`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0299-add-the-shared-admin-broadcasts-screen-with-compose

 ✓ tests/integration/vendor.test.js (1 test) 7890ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 7886ms
 ✓ tests/integration/pack.test.js (3 tests) 2779ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2771ms
 ✓ tests/integration/generate-app.test.js (3 tests) 53974ms
   ✓ generates a neutral app that passes its own checks and the conformance check 24151ms
   ✓ generates a warm app that passes its own checks and the conformance check 15361ms
   ✓ generates a bright app that passes its own checks and the conformance check 14459ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  06:08:34
   Duration  65.89s (tests 100%)
```

### Package Dry-Run Validation
Command: `npm.cmd pack --dry-run`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs

> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove
[... 142 lines omitted ...]
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.4.1-pre
npm notice filename: gpellicciotta-support.webapp-0.4.1-pre.tgz
npm notice package size: 1.2 MB
npm notice unpacked size: 1.9 MB
npm notice total files: 138
gpellicciotta-support.webapp-0.4.1-pre.tgz
```
