## Walkthrough & Validation
### Summary
- Added `src/js/admin-sessions.js` implementing the shared admin Sessions screen (`attachAdminSessions`, `createAdminSessions`, `createAdminSessionsScreen`, `isTokenExpired`, `isOwnToken`, `tokenUserName`, `tokenUserEmail`, `formatSessionTime`, `normalizeTokensResult`).
- Added the table multi-select CSS variant (`.selection--table`, `.selection__count`, `.selection__cell`) to `src/css/components/selection.css`.
- Registered `admin-sessions` in `src/contract.json` and mounted the live Sessions screen in `src/demo/shell-admin-console.js` with own-session protection, bulk selection, single/bulk/expired revocation, filters, paging, and state previews.
- Added unit tests in `tests/unit/admin-sessions.test.js` (17 tests) and browser tests in `tests/e2e/admin-sessions.spec.js` (16 tests across desktop/mobile and light/dark).
- Updated `docs/specs/components.md`, `docs/adrs/ADR-0003-components-and-patterns.md`, and `CHANGELOG.md`.

### Visual Verification
- Before (neutral desktop light): [before-admin-sessions-neutral-desktop-light.png](before-admin-sessions-neutral-desktop-light.png)
- After (neutral desktop light): [after-admin-sessions-neutral-desktop-light.png](after-admin-sessions-neutral-desktop-light.png)
- After (neutral desktop dark): [after-admin-sessions-neutral-desktop-dark.png](after-admin-sessions-neutral-desktop-dark.png)
- After (neutral mobile light): [after-admin-sessions-neutral-mobile-light.png](after-admin-sessions-neutral-mobile-light.png)
- After (neutral mobile dark): [after-admin-sessions-neutral-mobile-dark.png](after-admin-sessions-neutral-mobile-dark.png)
- After (warm desktop light): [after-admin-sessions-warm-desktop-light.png](after-admin-sessions-warm-desktop-light.png)
- After (warm desktop dark): [after-admin-sessions-warm-desktop-dark.png](after-admin-sessions-warm-desktop-dark.png)
- After (warm mobile light): [after-admin-sessions-warm-mobile-light.png](after-admin-sessions-warm-mobile-light.png)
- After (warm mobile dark): [after-admin-sessions-warm-mobile-dark.png](after-admin-sessions-warm-mobile-dark.png)
- After (bright desktop light): [after-admin-sessions-bright-desktop-light.png](after-admin-sessions-bright-desktop-light.png)
- After (bright desktop dark): [after-admin-sessions-bright-desktop-dark.png](after-admin-sessions-bright-desktop-dark.png)
- After (bright mobile light): [after-admin-sessions-bright-mobile-light.png](after-admin-sessions-bright-mobile-light.png)
- After (bright mobile dark): [after-admin-sessions-bright-mobile-dark.png](after-admin-sessions-bright-mobile-dark.png)

### Red-Phase Proof (Unit)
Command: `npx.cmd vitest run tests/unit/admin-sessions.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0301-add-the-shared-admin-sessions-screen-with-single

 ❯ tests/unit/admin-sessions.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/admin-sessions.test.js [ tests/unit/admin-sessions.test.js ]
Error: Failed to resolve import "../../src/js/admin-sessions.js" from "tests/unit/admin-sessions.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0301-add-the-shared-admin-sessions-screen-with-single/tests/unit/admin-sessions.test.js:17:8
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  07:08:12
   Duration  1.01s (environment 99%, worker 1%)
```

### Red-Phase Proof (Browser)
Command: `npx.cmd playwright test tests/e2e/admin-sessions.spec.js --project=desktop-light`
Exit code: `1`

```text
Running 4 tests using 4 workers

  ✘  1 [desktop-light] › tests\e2e\admin-sessions.spec.js:25:1 › admin console demo protects own session, bulk revokes two sessions, revokes single and expired tokens, filters, and pages (6.3s)
  ✘  4 [desktop-light] › tests\e2e\admin-sessions.spec.js:117:5 › neutral admin sessions screen renders table and bulk bar without overflow or small targets (6.4s)
  ✘  2 [desktop-light] › tests\e2e\admin-sessions.spec.js:117:5 › bright admin sessions screen renders table and bulk bar without overflow or small targets (6.5s)
  ✘  3 [desktop-light] › tests\e2e\admin-sessions.spec.js:117:5 › warm admin sessions screen renders table and bulk bar without overflow or small targets (6.7s)

  1) [desktop-light] › tests\e2e\admin-sessions.spec.js:25:1 › admin console demo protects own session, bulk revokes two sessions, revokes single and expired tokens, filters, and pages 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('[data-admin-sessions]')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found
[... 60 lines omitted ...]
  4 failed
```

### Green-Phase Proof (Browser and Screenshot Capture)
Command: `$env:T0301_CAPTURE_DIR='C:/Dev-Projects/support.webapp/.plan/tasks/T0301-add-the-shared-admin-sessions-screen-with-single'; npx.cmd playwright test tests/e2e/admin-sessions.spec.js`
Exit code: `0`

```text
Running 16 tests using 4 workers

  ✓   3 [desktop-light] › tests\e2e\admin-sessions.spec.js:117:5 › neutral admin sessions screen renders table and bulk bar without overflow or small targets (1.6s)
  ✓   1 [desktop-light] › tests\e2e\admin-sessions.spec.js:117:5 › warm admin sessions screen renders table and bulk bar without overflow or small targets (1.8s)
  ✓   4 [desktop-light] › tests\e2e\admin-sessions.spec.js:117:5 › bright admin sessions screen renders table and bulk bar without overflow or small targets (1.9s)
  ✓   2 [desktop-light] › tests\e2e\admin-sessions.spec.js:25:1 › admin console demo protects own session, bulk revokes two sessions, revokes single and expired tokens, filters, and pages (2.8s)
[... 11 lines omitted ...]
  ✓  16 [mobile-dark] › tests\e2e\admin-sessions.spec.js:117:5 › bright admin sessions screen renders table and bulk bar without overflow or small targets (1.5s)

  16 passed (16.6s)
```

### Full Check Suite
Command: `python scripts/devops.py check` (lint-markdown, ruff, eslint, pytest, full Vitest unit suite, and full Playwright suite passed; `generate-app.test.js` failed before `npm.cmd ci` populated worktree `node_modules`, then passed in the integration run below)
Exit code: `1` (before `npm.cmd ci`), then `0` on the remaining integration run below

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 34432
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 5820
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 17280
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 33488
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 30724
[... 11 lines omitted ...]
======================== 61 passed, 1 skipped in 3.25s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 9576
[... 75 lines omitted ...]
 Test Files  61 passed (61)
      Tests  2572 passed (2572)
   Start at  07:15:21
   Duration  18.66s (environment 56%, import 25%, tests 14%, transform 4%, worker 1%)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 32020
[... 1403 lines omitted ...]
  48 skipped
  1132 passed (9.4m)
```

### Integration Tests (after `npm.cmd ci`)
Command: `npm.cmd run test:integration`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0301-add-the-shared-admin-sessions-screen-with-single

 ✓ tests/integration/vendor.test.js (1 test) 8197ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 8194ms
 ✓ tests/integration/pack.test.js (3 tests) 2255ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2248ms
 ✓ tests/integration/generate-app.test.js (3 tests) 52199ms
   ✓ generates a neutral app that passes its own checks and the conformance check 22111ms
   ✓ generates a warm app that passes its own checks and the conformance check 15438ms
   ✓ generates a bright app that passes its own checks and the conformance check 14646ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  07:26:21
   Duration  64.10s (tests 99%)
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
npm notice unpacked size: 2.0 MB
npm notice total files: 139
gpellicciotta-support.webapp-0.4.1-pre.tgz
```
