## Walkthrough & Validation

### Red-Phase TDD Proof

Command: `npx.cmd vitest run tests/unit/admin-console.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0293-add-an-admin-console-frame-with-hash-router

 ❯ tests/unit/admin-console.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/admin-console.test.js [ tests/unit/admin-console.test.js ]
Error: Failed to resolve import "../../src/js/admin-console.js" from "tests/unit/admin-console.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0293-add-an-admin-console-frame-with-hash-router/tests/unit/admin-console.test.js:12:8
[... 14 lines omitted ...]

 Test Files  1 failed (1)
      Tests  no tests
   Start at  02:48:47
   Duration  1.03s (environment 99%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/admin-console.spec.js --project=desktop-light --reporter=line`
Exit code: `1`

```text
Running 5 tests using 4 workers

  1) [desktop-light] › tests\e2e\admin-console.spec.js:47:1 › admin console demo moves between screens by hash and back button, updates marks and titles, and preserves route on skip link 

    Error: expect(locator).toHaveText(expected) failed

    Locator: locator('[data-admin-console-title]')
    Expected: "Accounts"
    Timeout: 5000ms
    Error: element(s) not found
[... 88 lines omitted ...]
  5 failed
    [desktop-light] › tests\e2e\admin-console.spec.js:47:1 › admin console demo moves between screens by hash and back button, updates marks and titles, and preserves route on skip link 
    [desktop-light] › tests\e2e\admin-console.spec.js:107:1 › admin console demo shows the forbidden gate, transitions to signed-out shell, and returns cleanly 
    [desktop-light] › tests\e2e\admin-console.spec.js:148:5 › neutral admin console frame and forbidden gate pass layout and target checks 
    [desktop-light] › tests\e2e\admin-console.spec.js:148:5 › warm admin console frame and forbidden gate pass layout and target checks 
    [desktop-light] › tests\e2e\admin-console.spec.js:148:5 › bright admin console frame and forbidden gate pass layout and target checks 
```

### Green-Phase Verification Proof

Command: `python scripts/devops.py lint`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 2752
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 24692
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 33908
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 39392
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
```

Command: `python scripts/devops.py tests`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 20080
[... 10 lines omitted ...]
======================== 61 passed, 1 skipped in 3.10s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 31592
> @gpellicciotta/support.webapp@0.4.1-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0293-add-an-admin-console-frame-with-hash-router
 ✓ tests/unit/tokens.test.js (1896 tests) 924ms
 ✓ tests/unit/admin-console.test.js (11 tests) 237ms
 ✓ tests/unit/shell.test.js (6 tests) 21ms
[... 54 lines omitted ...]
 Test Files  54 passed (54)
      Tests  2469 passed (2469)
   Start at  03:16:06
   Duration  16.93s (environment 53%, import 29%, tests 12%, transform 4%, worker 1%)
```

Command: `$env:T0293_CAPTURE_DIR='C:/Dev-Projects/support.webapp/.plan/tasks/T0293-add-an-admin-console-frame-with-hash-router'; npx.cmd playwright test tests/e2e/admin-console.spec.js --reporter=line`
Exit code: `0`

```text
Running 20 tests using 4 workers

[1/20] [desktop-light] › tests\e2e\admin-console.spec.js:109:1 › admin console demo shows the forbidden gate, transitions to signed-out shell, and returns cleanly
[2/20] [desktop-light] › tests\e2e\admin-console.spec.js:47:1 › admin console demo moves between screens by hash and back button, updates marks and titles, and preserves route on skip link
[3/20] [desktop-light] › tests\e2e\admin-console.spec.js:150:5 › neutral admin console frame and forbidden gate pass layout and target checks
[... 14 lines omitted ...]
[18/20] [mobile-dark] › tests\e2e\admin-console.spec.js:150:5 › neutral admin console frame and forbidden gate pass layout and target checks
[19/20] [mobile-dark] › tests\e2e\admin-console.spec.js:150:5 › bright admin console frame and forbidden gate pass layout and target checks
[20/20] [mobile-dark] › tests\e2e\admin-console.spec.js:150:5 › warm admin console frame and forbidden gate pass layout and target checks
  20 passed (17.4s)
```

Command: `python scripts/devops.py check` (Playwright full e2e suite stage)
Exit code: `0` (Playwright stage; worktree `generate-app.test.js` needed `npm ci`, verified below)

```text
[... 1412 lines omitted ...]
  ✓  1078 [mobile-dark] › tests\e2e\view.spec.js:20:5 › sample view › shows the error page after a failed load, and Try again loads the data (1.2s)
  1032 passed (9.0m)
```

Command: `npm.cmd run test:integration`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0293-add-an-admin-console-frame-with-hash-router

 ✓ tests/integration/vendor.test.js (1 test) 7293ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 7291ms
 ✓ tests/integration/pack.test.js (3 tests) 1645ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 1641ms
 ✓ tests/integration/generate-app.test.js (3 tests) 57219ms
   ✓ generates a neutral app that passes its own checks and the conformance check 23041ms
   ✓ generates a warm app that passes its own checks and the conformance check 19518ms
   ✓ generates a bright app that passes its own checks and the conformance check 14656ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  03:14:03
   Duration  67.15s (tests 100%)
```

Command: `npm.cmd pack --dry-run`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs

> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove

npm notice 📦  @gpellicciotta/support.webapp@0.4.1-pre
[... 125 lines omitted ...]
npm notice 46.8kB src/js/admin-console.js
[... 25 lines omitted ...]
npm notice total files: 133
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

### Visual Verification Screenshots
- Before: [before-admin-console-neutral-desktop-light.png](before-admin-console-neutral-desktop-light.png), [before-admin-console-neutral-desktop-dark.png](before-admin-console-neutral-desktop-dark.png), [before-admin-console-neutral-mobile-light.png](before-admin-console-neutral-mobile-light.png), [before-admin-console-neutral-mobile-dark.png](before-admin-console-neutral-mobile-dark.png).
- After (overview): [after-admin-console-overview-neutral-desktop-light.png](after-admin-console-overview-neutral-desktop-light.png), [after-admin-console-overview-warm-desktop-dark.png](after-admin-console-overview-warm-desktop-dark.png), [after-admin-console-overview-bright-mobile-light.png](after-admin-console-overview-bright-mobile-light.png), [after-admin-console-overview-bright-mobile-dark.png](after-admin-console-overview-bright-mobile-dark.png).
- After (forbidden gate): [after-admin-console-gate-neutral-desktop-light.png](after-admin-console-gate-neutral-desktop-light.png), [after-admin-console-gate-warm-desktop-dark.png](after-admin-console-gate-warm-desktop-dark.png), [after-admin-console-gate-bright-mobile-light.png](after-admin-console-gate-bright-mobile-light.png), [after-admin-console-gate-bright-mobile-dark.png](after-admin-console-gate-bright-mobile-dark.png).
