## Walkthrough & Validation
### Summary of Changes
- Added [screen-action-bar.js](../../../src/js/screen-action-bar.js) exporting `attachScreenActionBar` and `ACTION_STATE_CHANGED_EVENT` to draw routed-view screen actions in `.app__action-bar`, block disabled link clicks, expose disabled hints via `title` and `aria-description`, redraw on state change, escape all text/attributes via DOM APIs, and remove empty bars.
- Registered `screen-action-bar` in [contract.json](../../../src/contract.json).
- Wired `SampleView` and `attachScreenActionBar` into [shell-portal.html](../../../src/demo/shell-portal.html) and [shell-demo.js](../../../src/demo/shell-demo.js) with an attach/detach toggle.
- Added unit tests in [screen-action-bar.test.js](../../../tests/unit/screen-action-bar.test.js) and browser integration tests in [screen-action-bar.spec.js](../../../tests/e2e/screen-action-bar.spec.js).
- Updated [components.md](../../../docs/specs/components.md), [ADR-0003-components-and-patterns.md](../../../docs/adrs/ADR-0003-components-and-patterns.md), [ADR-0004-app-shell.md](../../../docs/adrs/ADR-0004-app-shell.md), and [CHANGELOG.md](../../../CHANGELOG.md).

### Red-Phase Proof
Command: `npx.cmd vitest run tests/unit/screen-action-bar.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0286-add-a-screen-action-bar-renderer-for-the

 ❯ tests/unit/screen-action-bar.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/screen-action-bar.test.js [ tests/unit/screen-action-bar.test.js ]
Error: Failed to resolve import "../../src/js/screen-action-bar.js" from "tests/unit/screen-action-bar.test.js". Does the file exist?
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  21:49:00
   Duration  1.96s (environment 99%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/screen-action-bar.spec.js --project=desktop-light`
Exit code: `1`

```text
Running 1 test using 1 worker

  ✘  1 [desktop-light] › tests\e2e\screen-action-bar.spec.js:20:5 › screen action bar › shows the routed view screen actions, updates them on state change, and removes the bar on detach (5.9s)


  1) [desktop-light] › tests\e2e\screen-action-bar.spec.js:20:5 › screen action bar › shows the routed view screen actions, updates them on state change, and removes the bar on detach 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('body > .app__action-bar[data-screen-action-bar]')
    Expected: 1
    Received: 0
    Timeout:  5000ms
[... 15 lines omitted ...]
  1 failed
    [desktop-light] › tests\e2e\screen-action-bar.spec.js:20:5 › screen action bar › shows the routed view screen actions, updates them on state change, and removes the bar on detach 
```

### Green-Phase Proof
Command: `python scripts/devops.py check` (lint, pytest, full Vitest unit suite, full Playwright e2e suite)
Exit code: `1` (worktree lacked `node_modules` for `generate-app.test.js`; fixed with `npm ci` and re-verified below)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 35060
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 11456
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 35028
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 34372
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 36712
[... 12 lines omitted ...]
======================== 61 passed, 1 skipped in 3.16s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 36308
> @gpellicciotta/support.webapp@0.4.1-pre test
> vitest run
[... 60 lines omitted ...]
 ✓ tests/unit/screen-action-bar.test.js (12 tests) 79ms
[... 36 lines omitted ...]
 Test Files  46 passed (46)
      Tests  2346 passed (2346)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
[... 1240 lines omitted ...]
  42 skipped
  974 passed (9.6m)
```

Command: `npx.cmd playwright test tests/e2e/screen-action-bar.spec.js tests/e2e/shell.spec.js --grep "screen action bar|portal shell demo"`
Exit code: `0`

```text
Running 28 tests using 4 workers

  ✓   2 [desktop-light] › tests\e2e\shell.spec.js:109:9 › portal shell demo › renders its areas and drops the absent ones (1.2s)
  ✓   3 [desktop-light] › tests\e2e\shell.spec.js:198:9 › portal shell demo › puts the toast region in the overlay layer above the bottom bars (1.2s)
  ✓   1 [desktop-light] › tests\e2e\screen-action-bar.spec.js:20:5 › screen action bar › shows the routed view screen actions, updates them on state change, and removes the bar on detach (1.6s)
[... 24 lines omitted ...]
  ✓  28 [mobile-dark] › tests\e2e\shell.spec.js:239:9 › portal shell demo › aligns the top bar edge text and glyphs with the content column (1.0s)

  28 passed (17.6s)
```

Command: `npx.cmd playwright test tests/e2e/verify-ui.spec.js --grep "shell-portal"`
Exit code: `0`

```text
Running 20 tests using 4 workers

[neutral system 1440px] 53 stylesheets, 26 texts, 18 targets, 18 focus records, 6 sprite references, overflow 0px, errors 0
[... 54 lines omitted ...]
  ✓  20 [mobile-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-portal passes every verifier check in the bright look yellow (4.3s)

  20 passed (3.3m)
```

Command: `npm.cmd run test:integration` (after `npm.cmd ci`)
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0286-add-a-screen-action-bar-renderer-for-the

 ✓ tests/integration/vendor.test.js (1 test) 7792ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 7789ms
 ✓ tests/integration/pack.test.js (3 tests) 2487ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2479ms
 ✓ tests/integration/generate-app.test.js (3 tests) 62952ms
   ✓ generates a neutral app that passes its own checks and the conformance check 25091ms
   ✓ generates a warm app that passes its own checks and the conformance check 19672ms
   ✓ generates a bright app that passes its own checks and the conformance check 18185ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  22:08:12
   Duration  74.39s (tests 100%)
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
npm notice 8.8kB src/js/screen-action-bar.js
[... 48 lines omitted ...]
npm notice total files: 123
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

### Visual Verification
- Before: [before-shell-portal.png](before-shell-portal.png)
- After (neutral, light/dark, desktop/mobile): [after-neutral-light-desktop.png](after-neutral-light-desktop.png), [after-neutral-dark-desktop.png](after-neutral-dark-desktop.png), [after-neutral-light-mobile.png](after-neutral-light-mobile.png)
- After (warm, light/dark, desktop/mobile): [after-warm-light-desktop.png](after-warm-light-desktop.png), [after-warm-dark-mobile.png](after-warm-dark-mobile.png)
- After (bright, light/dark, desktop/mobile): [after-bright-light-desktop.png](after-bright-light-desktop.png), [after-bright-dark-mobile.png](after-bright-dark-mobile.png)
