## Walkthrough & Validation
### Summary
- Added `src/js/admin-users.js` implementing the shared admin Users screen (`attachAdminUsers`, `createAdminUsers`, `createAdminUsersScreen`, `isUserMarked`, `userDisplayName`, `formatUserTime`, `normalizeUsersResult`).
- Registered `admin-users` in `src/contract.json` and mounted the Users screen in `src/demo/shell-admin-console.html` and `src/demo/shell-admin-console.js` with sample accounts, creation, editing, inline-confirmed mark-for-deletion/restore/permanent deletion, `extraFacts`, and state previews.
- Added unit tests in `tests/unit/admin-users.test.js` (18 tests) and browser tests in `tests/e2e/admin-users.spec.js` (16 tests across desktop/mobile and light/dark).
- Updated `docs/specs/components.md`, `docs/adrs/ADR-0003-components-and-patterns.md`, and `CHANGELOG.md`.

### Visual Verification
- Before (neutral desktop light): [before-admin-console-neutral-desktop-light.png](before-admin-console-neutral-desktop-light.png)
- After (neutral desktop light): [after-admin-users-neutral-desktop-light.png](after-admin-users-neutral-desktop-light.png)
- After (neutral desktop dark): [after-admin-users-neutral-desktop-dark.png](after-admin-users-neutral-desktop-dark.png)
- After (neutral mobile light): [after-admin-users-neutral-mobile-light.png](after-admin-users-neutral-mobile-light.png)
- After (neutral mobile dark): [after-admin-users-neutral-mobile-dark.png](after-admin-users-neutral-mobile-dark.png)
- After (warm desktop light): [after-admin-users-warm-desktop-light.png](after-admin-users-warm-desktop-light.png)
- After (warm desktop dark): [after-admin-users-warm-desktop-dark.png](after-admin-users-warm-desktop-dark.png)
- After (warm mobile light): [after-admin-users-warm-mobile-light.png](after-admin-users-warm-mobile-light.png)
- After (warm mobile dark): [after-admin-users-warm-mobile-dark.png](after-admin-users-warm-mobile-dark.png)
- After (bright desktop light): [after-admin-users-bright-desktop-light.png](after-admin-users-bright-desktop-light.png)
- After (bright desktop dark): [after-admin-users-bright-desktop-dark.png](after-admin-users-bright-desktop-dark.png)
- After (bright mobile light): [after-admin-users-bright-mobile-light.png](after-admin-users-bright-mobile-light.png)
- After (bright mobile dark): [after-admin-users-bright-mobile-dark.png](after-admin-users-bright-mobile-dark.png)

### Red-Phase Proof (Unit)
Command: `npx.cmd vitest run tests/unit/admin-users.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0300-add-the-shared-admin-users-screen-with-table

 ❯ tests/unit/admin-users.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/admin-users.test.js [ tests/unit/admin-users.test.js ]
Error: Failed to resolve import "../../src/js/admin-users.js" from "tests/unit/admin-users.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0300-add-the-shared-admin-users-screen-with-table/tests/unit/admin-users.test.js:25:8
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  06:29:00
   Duration  926ms (environment 99%, worker 1%)
```

### Red-Phase Proof (Browser)
Command: `npx.cmd playwright test tests/e2e/admin-users.spec.js --project=desktop-light --grep "admin console demo filters"`
Exit code: `1`

```text
Running 1 test using 1 worker

  ✘  1 [desktop-light] › tests\e2e\admin-users.spec.js:26:1 › admin console demo filters, pages, opens user detail panel, creates a user, and deletes with inline confirmations (5.8s)

  1) [desktop-light] › tests\e2e\admin-users.spec.js:26:1 › admin console demo filters, pages, opens user detail panel, creates a user, and deletes with inline confirmations 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('[data-admin-users]')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found
[... 14 lines omitted ...]
  1 failed
    [desktop-light] › tests\e2e\admin-users.spec.js:26:1 › admin console demo filters, pages, opens user detail panel, creates a user, and deletes with inline confirmations 
```

### Green-Phase Proof (Unit)
Command: `npx.cmd vitest run tests/unit/admin-users.test.js`
Exit code: `0`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0300-add-the-shared-admin-users-screen-with-table

 ✓ tests/unit/admin-users.test.js (18 tests) 302ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  06:34:51
   Duration  1.33s (environment 57%, tests 26%, transform 11%, import 5%, worker 1%)
```

### Green-Phase Proof (Browser)
Command: `$env:T0300_CAPTURE_DIR='C:/Dev-Projects/support.webapp/.plan/tasks/T0300-add-the-shared-admin-users-screen-with-table'; npx.cmd playwright test tests/e2e/admin-users.spec.js`
Exit code: `0`

```text
Running 16 tests using 4 workers

  ✓   1 [desktop-light] › tests\e2e\admin-users.spec.js:124:5 › neutral admin users screen renders table and detail panel without overflow or small targets (1.7s)
  ✓   2 [desktop-light] › tests\e2e\admin-users.spec.js:124:5 › warm admin users screen renders table and detail panel without overflow or small targets (1.6s)
  ✓   4 [desktop-light] › tests\e2e\admin-users.spec.js:124:5 › bright admin users screen renders table and detail panel without overflow or small targets (1.6s)
  ✓   3 [desktop-light] › tests\e2e\admin-users.spec.js:26:1 › admin console demo filters, pages, opens user detail panel, creates a user, and deletes with inline confirmations (2.3s)
[... 11 lines omitted ...]
  ✓  16 [mobile-dark] › tests\e2e\admin-users.spec.js:124:5 › bright admin users screen renders table and detail panel without overflow or small targets (1.3s)

  16 passed (12.5s)
```

### Full Check Suite
Command: `python scripts/devops.py check` (lint-markdown, ruff, eslint, pytest, full Vitest unit suite, and full Playwright suite passed; `generate-app.test.js` failed before `npm.cmd ci` populated worktree `node_modules`, then passed in the integration run below)
Exit code: `1` (before `npm.cmd ci`), then `0` on the remaining checks below

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 39512
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 26128
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 24704
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 12132
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 36652
[... 11 lines omitted ...]
======================== 61 passed, 1 skipped in 2.15s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 28924
[... 80 lines omitted ...]
 Test Files  60 passed (60)
      Tests  2555 passed (2555)
   Start at  06:37:08
   Duration  15.28s (environment 55%, import 25%, tests 14%, transform 4%, worker 1%)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 27436
[... 1386 lines omitted ...]
  48 skipped
  1116 passed (7.3m)
```

### Integration Tests (after `npm.cmd ci`)
Command: `npm.cmd run test:integration`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0300-add-the-shared-admin-users-screen-with-table

 ✓ tests/integration/vendor.test.js (1 test) 4008ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 4006ms
 ✓ tests/integration/pack.test.js (3 tests) 1360ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 1357ms
 ✓ tests/integration/generate-app.test.js (3 tests) 44517ms
   ✓ generates a neutral app that passes its own checks and the conformance check 15481ms
   ✓ generates a warm app that passes its own checks and the conformance check 14554ms
   ✓ generates a bright app that passes its own checks and the conformance check 14479ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  06:46:17
   Duration  50.53s (tests 100%)
```

### Package Dry-Run Validation
Command: `npm.cmd pack --dry-run`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs

> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove
[... 143 lines omitted ...]
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.4.1-pre
npm notice filename: gpellicciotta-support.webapp-0.4.1-pre.tgz
npm notice package size: 1.2 MB
npm notice unpacked size: 1.9 MB
npm notice total files: 139
gpellicciotta-support.webapp-0.4.1-pre.tgz
```
