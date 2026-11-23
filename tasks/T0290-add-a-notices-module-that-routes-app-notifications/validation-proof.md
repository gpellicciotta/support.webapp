## Walkthrough & Validation
### Summary of Changes
- Added [notices.js](../../../src/js/notices.js) exporting `createNotices`, `attachNotices`, `noticeKind`, `bannerVariant`, `bannerRole`, `pickBanner`, `safeUrl`, and `NOTIFICATION_ADDED_EVENT`, `NOTIFICATION_DELETED_EVENT`, `NOTIFICATIONS_CLEARED_EVENT`, `NOTIFICATIONS_UPDATED_EVENT`.
- Registered `notices` in [contract.json](../../../src/contract.json) and wired a live notices demo into [shell-portal.html](../../../src/demo/shell-portal.html) and [shell-demo.js](../../../src/demo/shell-demo.js).
- Added unit tests in [notices.test.js](../../../tests/unit/notices.test.js) and browser tests in [notices.spec.js](../../../tests/e2e/notices.spec.js).
- Updated [components.md](../../../docs/specs/components.md), [ADR-0003-components-and-patterns.md](../../../docs/adrs/ADR-0003-components-and-patterns.md), [ADR-0004-app-shell.md](../../../docs/adrs/ADR-0004-app-shell.md), and [CHANGELOG.md](../../../CHANGELOG.md).

### Red-Phase Proof
Command: `npx.cmd vitest run tests/unit/notices.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0290-add-a-notices-module-that-routes-app-notifications

 ❯ tests/unit/notices.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/notices.test.js [ tests/unit/notices.test.js ]
Error: Failed to resolve import "../../src/js/notices.js" from "tests/unit/notices.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0290-add-a-notices-module-that-routes-app-notifications/tests/unit/notices.test.js:20:8
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  22:56:50
   Duration  1.91s (environment 99%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/notices.spec.js --project=desktop-light`
Exit code: `1`

```text
Running 2 tests using 2 workers

  ✘  2 [desktop-light] › tests\e2e\notices.spec.js:20:5 › notices › routes an error notice to a banner and an info notice to a toast, and dismissal removes both (6.1s)
  ✘  1 [desktop-light] › tests\e2e\notices.spec.js:65:5 › notices › caps visible app banners at three and reveals waiting banners on dismissal (2.0m)


  1) [desktop-light] › tests\e2e\notices.spec.js:20:5 › notices › routes an error notice to a banner and an info notice to a toast, and dismissal removes both 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('body > .app__banners').locator('[data-notices-banner][data-notices-source="inbox"]')
    Expected: 1
    Received: 0
    Timeout:  5000ms
[... 32 lines omitted ...]
  2 failed
    [desktop-light] › tests\e2e\notices.spec.js:20:5 › notices › routes an error notice to a banner and an info notice to a toast, and dismissal removes both 
    [desktop-light] › tests\e2e\notices.spec.js:65:5 › notices › caps visible app banners at three and reveals waiting banners on dismissal 
```

### Green-Phase Proof
Command: `python scripts/devops.py lint`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 12632
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 31544
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 34940
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 9380
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
```

Command: `python scripts/devops.py tests`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 37612
[... 10 lines omitted ...]
======================== 61 passed, 1 skipped in 6.50s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 35460
> @gpellicciotta/support.webapp@0.4.1-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0290-add-a-notices-module-that-routes-app-notifications
[... 27 lines omitted ...]
 ✓ tests/unit/notices.test.js (15 tests) 138ms
[... 21 lines omitted ...]
 Test Files  48 passed (48)
      Tests  2375 passed (2375)
   Start at  23:05:34
   Duration  17.62s (environment 50%, import 34%, tests 13%, worker 2%, transform 1%)
```

Command: `npx.cmd playwright test tests/e2e/notices.spec.js tests/e2e/shell-additions.spec.js tests/e2e/shell.spec.js --grep "notices|portal|banner dismiss"`
Exit code: `0`

```text
Running 36 tests using 4 workers

  ✓   3 [desktop-light] › tests\e2e\shell.spec.js:109:9 › portal shell demo › renders its areas and drops the absent ones (1.3s)
  ✓   1 [desktop-light] › tests\e2e\notices.spec.js:65:5 › notices › caps visible app banners at three and reveals waiting banners on dismissal (1.6s)
  ✓   2 [desktop-light] › tests\e2e\shell-additions.spec.js:146:1 › portal brand logo renders at --space-7 with --space-2 gap and banner dismiss sits at the end (1.2s)
  ✓   4 [desktop-light] › tests\e2e\notices.spec.js:20:5 › notices › routes an error notice to a banner and an info notice to a toast, and dismissal removes both (1.8s)
[... 30 lines omitted ...]
  ✓  35 [mobile-dark] › tests\e2e\shell.spec.js:228:9 › portal shell demo › marks one current entry in each navigation (1.1s)
  ✓  36 [mobile-dark] › tests\e2e\shell.spec.js:239:9 › portal shell demo › aligns the top bar edge text and glyphs with the content column (987ms)

  36 passed (18.3s)
```

Command: `npx.cmd playwright test tests/e2e/verify-ui.spec.js --grep "shell-portal"`
Exit code: `0`

```text
Running 20 tests using 4 workers

[bright system 1440px] 53 stylesheets, 34 texts, 24 targets, 24 focus records, 6 sprite references, overflow 0px, errors 0
[neutral system 1440px] 53 stylesheets, 33 texts, 23 targets, 23 focus records, 6 sprite references, overflow 0px, errors 0
[warm system 1440px] 53 stylesheets, 34 texts, 24 targets, 24 focus records, 6 sprite references, overflow 0px, errors 0
[... 54 lines omitted ...]
  ✓  20 [mobile-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-portal passes every verifier check in the bright look yellow (2.8s)

  20 passed (23.4s)
```

Command: `npm.cmd run test:integration`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0290-add-a-notices-module-that-routes-app-notifications

 ✓ tests/integration/vendor.test.js (1 test) 4823ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 4821ms
 ✓ tests/integration/pack.test.js (3 tests) 1391ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 1387ms
 ✓ tests/integration/generate-app.test.js (3 tests) 49716ms
   ✓ generates a neutral app that passes its own checks and the conformance check 16231ms
   ✓ generates a warm app that passes its own checks and the conformance check 17600ms
   ✓ generates a bright app that passes its own checks and the conformance check 15882ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  23:07:41
   Duration  56.56s (tests 100%)
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
[... 67 lines omitted ...]
npm notice 32.5kB src/js/notices.js
[... 58 lines omitted ...]
npm notice total files: 125
npm notice
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

### Visual Verification
- Before: [before-shell-portal.png](before-shell-portal.png), [before-shell-portal-mobile.png](before-shell-portal-mobile.png)
- After (neutral, light/dark, desktop/mobile): [after-neutral-light-desktop.png](after-neutral-light-desktop.png), [after-neutral-dark-desktop.png](after-neutral-dark-desktop.png), [after-neutral-light-mobile.png](after-neutral-light-mobile.png)
- After (warm, light/dark, desktop/mobile): [after-warm-light-desktop.png](after-warm-light-desktop.png), [after-warm-dark-mobile.png](after-warm-dark-mobile.png)
- After (bright, light/dark, desktop/mobile): [after-bright-light-desktop.png](after-bright-light-desktop.png), [after-bright-dark-mobile.png](after-bright-dark-mobile.png)
