## Walkthrough & Validation

### Summary of Changes
- Added `src/js/install-prompt.js` exporting `attachInstallPrompt({ window, matchMedia, onChange })` with `{ getState, isInstallable, isInstalled, prompt, destroy }`.
- Registered `install-prompt` in `src/contract.json`.
- Wired a hidden `[data-install-prompt-action]` button in `src/demo/shell-portal.html` and `src/demo/shell-demo.js`.
- Added unit tests in `tests/unit/install-prompt.test.js` and browser tests in `tests/e2e/install-prompt.spec.js`.
- Updated `docs/specs/components.md`, `docs/adrs/ADR-0003-components-and-patterns.md`, and `CHANGELOG.md`.

### Red-Phase Proof

Command: `npx.cmd vitest run tests/unit/install-prompt.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0281-add-an-install-prompt-module-for-installable-apps

 ❯ tests/unit/install-prompt.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/install-prompt.test.js [ tests/unit/install-prompt.test.js ]
Error: Cannot find module '../../src/js/install-prompt.js' imported from C:/Dev-Projects/support.webapp/.plan/work/T0281-add-an-install-prompt-module-for-installable-apps/tests/unit/install-prompt.test.js
 ❯ tests/unit/install-prompt.test.js:3:1
      1| // Covers the install prompt module: beforeinstallprompt, appinstalled…
      2| import { describe, expect, it, vi } from 'vitest';
      3| import { attachInstallPrompt } from '../../src/js/install-prompt.js';
       | ^
      4| import { readContract } from './contract.js';
      5|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  no tests
   Start at  18:40:49
   Duration  740ms (worker 95%, environment 5%)
```

Command: `npx.cmd playwright test tests/e2e/install-prompt.spec.js --project=desktop-light`
Exit code: `1`

```text
Running 4 tests using 4 workers

  ✓  4 [desktop-light] › tests\e2e\install-prompt.spec.js:100:5 › install prompt › stays hidden when running in standalone display mode (1.4s)
  ✘  2 [desktop-light] › tests\e2e\install-prompt.spec.js:58:5 › install prompt › stays hidden until beforeinstallprompt arrives, then prompts and hides on click (1.7s)
  ✘  1 [desktop-light] › tests\e2e\install-prompt.spec.js:89:5 › install prompt › hides the install action when appinstalled fires (6.5s)
  ✘  3 [desktop-light] › tests\e2e\install-prompt.spec.js:74:5 › install prompt › reports a dismissed choice and shows the action again on a new beforeinstallprompt (6.6s)

[... 54 lines omitted ...]

  3 failed
    [desktop-light] › tests\e2e\install-prompt.spec.js:58:5 › install prompt › stays hidden until beforeinstallprompt arrives, then prompts and hides on click 
    [desktop-light] › tests\e2e\install-prompt.spec.js:74:5 › install prompt › reports a dismissed choice and shows the action again on a new beforeinstallprompt 
    [desktop-light] › tests\e2e\install-prompt.spec.js:89:5 › install prompt › hides the install action when appinstalled fires 
  1 passed (9.0s)
```

### Green-Phase and Full Suite Verification

Command: `npx.cmd vitest run tests/unit/install-prompt.test.js`
Exit code: `0`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0281-add-an-install-prompt-module-for-installable-apps

 ✓ tests/unit/install-prompt.test.js (12 tests) 28ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  18:42:34
   Duration  432ms (transform 43%, import 30%, tests 20%, worker 8%)
```

Command: `npx.cmd playwright test tests/e2e/install-prompt.spec.js`
Exit code: `0`

```text
Running 16 tests using 4 workers

  ✓   1 [desktop-light] › tests\e2e\install-prompt.spec.js:74:5 › install prompt › reports a dismissed choice and shows the action again on a new beforeinstallprompt (1.2s)
  ✓   3 [desktop-light] › tests\e2e\install-prompt.spec.js:89:5 › install prompt › hides the install action when appinstalled fires (1.2s)
  ✓   4 [desktop-light] › tests\e2e\install-prompt.spec.js:100:5 › install prompt › stays hidden when running in standalone display mode (1.1s)
  ✓   2 [desktop-light] › tests\e2e\install-prompt.spec.js:58:5 › install prompt › stays hidden until beforeinstallprompt arrives, then prompts and hides on click (1.5s)
[... 10 lines omitted ...]
  ✓  15 [mobile-dark] › tests\e2e\install-prompt.spec.js:74:5 › install prompt › reports a dismissed choice and shows the action again on a new beforeinstallprompt (1.1s)
  ✓  16 [mobile-dark] › tests\e2e\install-prompt.spec.js:100:5 › install prompt › stays hidden when running in standalone display mode (999ms)

  16 passed (13.7s)
```

Command: `python scripts/devops.py check` (lint, pytest, full vitest, and full playwright passed; `generate-app.test.js` failed only because worktree lacked local `node_modules` for its junction, resolved below with `npm ci --prefer-offline`)
Exit code: `1`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 21068
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 2436
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 28284
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 32464
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 35720
[... 10 lines omitted ...]
======================== 61 passed, 1 skipped in 3.25s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 25804
[... 53 lines omitted ...]
 Test Files  42 passed (42)
      Tests  2308 passed (2308)
[... 1205 lines omitted ...]
  42 skipped
  926 passed (8.5m)
```

Command: `npm.cmd run test:integration` (after `npm.cmd ci --prefer-offline` populated gitignored worktree `node_modules`)
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0281-add-an-install-prompt-module-for-installable-apps

 ✓ tests/integration/vendor.test.js (1 test) 7773ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 7770ms
 ✓ tests/integration/pack.test.js (3 tests) 2988ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2981ms
 ✓ tests/integration/generate-app.test.js (3 tests) 59041ms
   ✓ generates a neutral app that passes its own checks and the conformance check 25521ms
   ✓ generates a warm app that passes its own checks and the conformance check 18326ms
   ✓ generates a bright app that passes its own checks and the conformance check 15191ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  18:55:15
   Duration  71.03s (tests 100%)
```

Command: `npm.cmd pack --dry-run`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs


> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove

npm notice
npm notice 📦  @gpellicciotta/support.webapp@0.4.1-pre
npm notice Tarball Contents
[... 67 lines omitted ...]
npm notice 5.1kB src/js/install-prompt.js
[... 47 lines omitted ...]
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.4.1-pre
npm notice filename: gpellicciotta-support.webapp-0.4.1-pre.tgz
npm notice package size: 1.0 MB
npm notice unpacked size: 1.4 MB
npm notice total files: 120
npm notice
gpellicciotta-support.webapp-0.4.1-pre.tgz
```
