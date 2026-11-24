## Walkthrough & Validation
### Summary
- Added `src/js/admin-system-events.js` implementing the shared admin System events screen (`attachAdminSystemEvents`, `createAdminSystemEvents`, `createAdminSystemEventsScreen`, `formatMetadata`, `formatEventTime`, `normalizeSystemEvents`, `filterSystemEvents`).
- Registered `admin-system-events` in `src/contract.json` and mounted the screen with sample audit records and state previews in `src/demo/shell-admin-console.js`.
- Added unit tests in `tests/unit/admin-system-events.test.js` (17 tests) and browser tests in `tests/e2e/admin-system-events.spec.js` (16 tests across desktop/mobile and light/dark).
- Updated `docs/specs/components.md`, `docs/adrs/ADR-0003-components-and-patterns.md`, and `CHANGELOG.md`.

### Visual Verification
- Before (neutral desktop light): [before-admin-system-events-neutral-desktop-light.png](before-admin-system-events-neutral-desktop-light.png)
- Before (neutral mobile light): [before-admin-system-events-neutral-mobile-light.png](before-admin-system-events-neutral-mobile-light.png)
- After (neutral desktop light): [after-admin-system-events-neutral-desktop-light.png](after-admin-system-events-neutral-desktop-light.png)
- After (neutral desktop dark): [after-admin-system-events-neutral-desktop-dark.png](after-admin-system-events-neutral-desktop-dark.png)
- After (neutral mobile light): [after-admin-system-events-neutral-mobile-light.png](after-admin-system-events-neutral-mobile-light.png)
- After (neutral mobile dark): [after-admin-system-events-neutral-mobile-dark.png](after-admin-system-events-neutral-mobile-dark.png)
- After (warm desktop light): [after-admin-system-events-warm-desktop-light.png](after-admin-system-events-warm-desktop-light.png)
- After (warm desktop dark): [after-admin-system-events-warm-desktop-dark.png](after-admin-system-events-warm-desktop-dark.png)
- After (warm mobile light): [after-admin-system-events-warm-mobile-light.png](after-admin-system-events-warm-mobile-light.png)
- After (warm mobile dark): [after-admin-system-events-warm-mobile-dark.png](after-admin-system-events-warm-mobile-dark.png)
- After (bright desktop light): [after-admin-system-events-bright-desktop-light.png](after-admin-system-events-bright-desktop-light.png)
- After (bright desktop dark): [after-admin-system-events-bright-desktop-dark.png](after-admin-system-events-bright-desktop-dark.png)
- After (bright mobile light): [after-admin-system-events-bright-mobile-light.png](after-admin-system-events-bright-mobile-light.png)
- After (bright mobile dark): [after-admin-system-events-bright-mobile-dark.png](after-admin-system-events-bright-mobile-dark.png)

### Red-Phase Proof (Unit)
Command: `npx.cmd vitest run tests/unit/admin-system-events.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0298-add-the-shared-admin-system-events-screen-with

 ❯ tests/unit/admin-system-events.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/admin-system-events.test.js [ tests/unit/admin-system-events.test.js ]
Error: Failed to resolve import "../../src/js/admin-system-events.js" from "tests/unit/admin-system-events.test.js". Does the file exist?
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  05:16:48
   Duration  1.09s (environment 99%, worker 1%)
```

### Red-Phase Proof (Browser)
Command: `npx.cmd playwright test tests/e2e/admin-system-events.spec.js --project=desktop-light`
Exit code: `1`

```text
Running 4 tests using 4 workers

  ✘  2 [desktop-light] › tests\e2e\admin-system-events.spec.js:125:5 › neutral admin system events screen passes layout and target checks (6.3s)
  ✘  4 [desktop-light] › tests\e2e\admin-system-events.spec.js:125:5 › warm admin system events screen passes layout and target checks (6.5s)
  ✘  3 [desktop-light] › tests\e2e\admin-system-events.spec.js:25:1 › admin console demo expands and collapses event JSON details, filters, pages, and handles empty and failure states (6.0s)
  ✘  1 [desktop-light] › tests\e2e\admin-system-events.spec.js:125:5 › bright admin system events screen passes layout and target checks (6.5s)

  1) [desktop-light] › tests\e2e\admin-system-events.spec.js:25:1 › admin console demo expands and collapses event JSON details, filters, pages, and handles empty and failure states 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('[data-admin-system-events]')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found
[... 88 lines omitted ...]
  4 failed
```

### Green-Phase Proof (Unit)
Command: `npx.cmd vitest run tests/unit/admin-system-events.test.js`
Exit code: `0`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0298-add-the-shared-admin-system-events-screen-with

 ✓ tests/unit/admin-system-events.test.js (17 tests) 167ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  05:20:51
   Duration  1.13s (environment 69%, tests 17%, transform 8%, import 5%, worker 1%)
```

### Green-Phase Proof (Browser)
Command: `$env:T0298_CAPTURE_DIR='C:/Dev-Projects/support.webapp/.plan/tasks/T0298-add-the-shared-admin-system-events-screen-with'; npx.cmd playwright test tests/e2e/admin-system-events.spec.js`
Exit code: `0`

```text
Running 16 tests using 4 workers

  ✓   2 [desktop-light] › tests\e2e\admin-system-events.spec.js:125:5 › neutral admin system events screen passes layout and target checks (1.3s)
  ✓   3 [desktop-light] › tests\e2e\admin-system-events.spec.js:125:5 › warm admin system events screen passes layout and target checks (1.8s)
  ✓   4 [desktop-light] › tests\e2e\admin-system-events.spec.js:125:5 › bright admin system events screen passes layout and target checks (1.7s)
  ✓   1 [desktop-light] › tests\e2e\admin-system-events.spec.js:25:1 › admin console demo expands and collapses event JSON details, filters, pages, and handles empty and failure states (3.0s)
[... 11 lines omitted ...]
  ✓  16 [mobile-dark] › tests\e2e\admin-system-events.spec.js:125:5 › bright admin system events screen passes layout and target checks (1.3s)

  16 passed (12.7s)
```

### Full Check Suite
Command: `$env:T0298_CAPTURE_DIR='C:/Dev-Projects/support.webapp/.plan/tasks/T0298-add-the-shared-admin-system-events-screen-with'; python scripts/devops.py check` (lint-markdown, ruff, eslint, pytest, full unit suite, and full Playwright suite passed; `generate-app.test.js` initially failed before `npm ci` populated worktree `node_modules`, then passed cleanly in the subsequent `npm.cmd run test:integration` and `npm.cmd pack --dry-run` runs below)
Exit code: `1` (before `npm ci`), then `0` on the remaining checks below

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 32524
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 27904
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 36488
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 31188
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 32928
[... 8 lines omitted ...]
======================== 61 passed, 1 skipped in 2.26s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 25064
[... 82 lines omitted ...]
 Test Files  58 passed (58)
      Tests  2524 passed (2524)
   Start at  05:22:51
   Duration  14.46s (environment 55%, import 26%, tests 14%, transform 4%, worker 1%)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 39252
[... 1353 lines omitted ...]
  48 skipped
  1084 passed (7.2m)
```

### Integration Tests (after `npm.cmd ci`)
Command: `npm.cmd run test:integration`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0298-add-the-shared-admin-system-events-screen-with

 ✓ tests/integration/vendor.test.js (1 test) 4001ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 3999ms
 ✓ tests/integration/pack.test.js (3 tests) 1348ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 1344ms
 ✓ tests/integration/generate-app.test.js (3 tests) 44729ms
   ✓ generates a neutral app that passes its own checks and the conformance check 15582ms
   ✓ generates a warm app that passes its own checks and the conformance check 14670ms
   ✓ generates a bright app that passes its own checks and the conformance check 14475ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  05:31:25
   Duration  50.72s (tests 100%)
```

### Package Dry-Run Validation
Command: `npm.cmd pack --dry-run`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs

> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove
[... 141 lines omitted ...]
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.4.1-pre
npm notice filename: gpellicciotta-support.webapp-0.4.1-pre.tgz
npm notice package size: 1.1 MB
npm notice unpacked size: 1.8 MB
npm notice total files: 137
gpellicciotta-support.webapp-0.4.1-pre.tgz
```
