## Walkthrough & Validation
Added the `view-header` component promoted from Auth's SPA and admin console:
- Created [view-header.css](../../../src/css/components/view-header.css) with `.view-header`, `.view-header__title`, and `.view-header__text` using semantic tokens only, collapsing empty summary lines via `.view-header:has(> .view-header__text:empty)` so live `role="status"` regions stay mounted without taking vertical space.
- Registered `view-header` in [contract.json](../../../src/contract.json) and imported `components/view-header.css` before `components/toolbar.css` in [style.css](../../../src/css/style.css).
- Added the `#view-header` gallery section with polite status, title-only, and empty-status specimens in [visual-style-gallery.html](../../../src/demo/visual-style-gallery.html).
- Updated [components.md](../../../docs/specs/components.md) with the catalog entry, skeleton, and upgrade note, recorded the decision in [ADR-0003-components-and-patterns.md](../../../docs/adrs/ADR-0003-components-and-patterns.md), and added a bullet to [CHANGELOG.md](../../../CHANGELOG.md).

### Red-Phase Proof
Command: `npx.cmd vitest run tests/unit/view-header.test.js` (exit code 1)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0284-add-a-view-header-component-for-a-screen

 ❯ tests/unit/view-header.test.js (4 tests | 4 failed) 276ms
   ❯ view-header component contract (4)
     × registers view-header in contract.json, imports its partial before toolbar.css, and catalogs it with the containers 13ms
     × records the sharing decision in ADR-0003 4ms
     × styles the title, muted summary, and empty summary collapse with contract tokens only 3ms
     × shows status summary, title-only, and empty summary specimens in the gallery 253ms
[... 78 lines omitted ...]
 Test Files  1 failed (1)
      Tests  4 failed (4)
   Start at  20:32:27
   Duration  2.33s (import 82%, tests 14%, transform 3%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/view-header.spec.js --project=desktop-light --grep "neutral view header"` (exit code 1)

```text
Running 1 test using 1 worker

  ✘  1 [desktop-light] › tests\e2e\view-header.spec.js:37:5 › neutral view header renders title, muted summary, and zero-height empty summary (2.3s)


  1) [desktop-light] › tests\e2e\view-header.spec.js:37:5 › neutral view header renders title, muted summary, and zero-height empty summary 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#view-header')
    Expected: visible
    Timeout: 1000ms
    Error: element(s) not found
[... 14 lines omitted ...]
  1 failed
    [desktop-light] › tests\e2e\view-header.spec.js:37:5 › neutral view header renders title, muted summary, and zero-height empty summary 
```

### Green-Phase Proof
Command: `npx.cmd vitest run tests/unit/view-header.test.js tests/unit/tokens.test.js tests/unit/gallery.test.js` (exit code 0)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0284-add-a-view-header-component-for-a-screen

 ✓ tests/unit/gallery.test.js (25 tests) 40ms
 ✓ tests/unit/tokens.test.js (1890 tests) 897ms
 ✓ tests/unit/view-header.test.js (4 tests) 273ms

 Test Files  3 passed (3)
      Tests  1919 passed (1919)
   Start at  20:34:15
   Duration  2.47s (import 53%, tests 33%, transform 13%, worker 1%)
```

Command: `$env:VIEW_HEADER_PROOF='C:\Dev-Projects\support.webapp\.plan\tasks\T0284-add-a-view-header-component-for-a-screen'; npx.cmd playwright test tests/e2e/view-header.spec.js` (exit code 0)

```text
Running 16 tests using 4 workers

  ✓   1 [desktop-light] › tests\e2e\view-header.spec.js:117:1 › view header preserves page title sizing when page-base is opted out (1.7s)
  ✓   3 [desktop-light] › tests\e2e\view-header.spec.js:37:5 › neutral view header renders title, muted summary, and zero-height empty summary (2.2s)
  ✓   2 [desktop-light] › tests\e2e\view-header.spec.js:37:5 › bright view header renders title, muted summary, and zero-height empty summary (2.8s)
  ✓   4 [desktop-light] › tests\e2e\view-header.spec.js:37:5 › warm view header renders title, muted summary, and zero-height empty summary (2.8s)
  ✓   5 [desktop-dark] › tests\e2e\view-header.spec.js:37:5 › neutral view header renders title, muted summary, and zero-height empty summary (2.3s)
  ✓   6 [desktop-dark] › tests\e2e\view-header.spec.js:37:5 › warm view header renders title, muted summary, and zero-height empty summary (2.6s)
  ✓   8 [desktop-dark] › tests\e2e\view-header.spec.js:117:1 › view header preserves page title sizing when page-base is opted out (1.7s)
  ✓   7 [desktop-dark] › tests\e2e\view-header.spec.js:37:5 › bright view header renders title, muted summary, and zero-height empty summary (2.6s)
  ✓   9 [mobile-light] › tests\e2e\view-header.spec.js:37:5 › neutral view header renders title, muted summary, and zero-height empty summary (1.9s)
  ✓  12 [mobile-light] › tests\e2e\view-header.spec.js:117:1 › view header preserves page title sizing when page-base is opted out (1.5s)
  ✓  10 [mobile-light] › tests\e2e\view-header.spec.js:37:5 › bright view header renders title, muted summary, and zero-height empty summary (2.4s)
  ✓  11 [mobile-light] › tests\e2e\view-header.spec.js:37:5 › warm view header renders title, muted summary, and zero-height empty summary (2.5s)
  ✓  13 [mobile-dark] › tests\e2e\view-header.spec.js:37:5 › neutral view header renders title, muted summary, and zero-height empty summary (2.2s)
  ✓  14 [mobile-dark] › tests\e2e\view-header.spec.js:37:5 › warm view header renders title, muted summary, and zero-height empty summary (2.6s)
  ✓  15 [mobile-dark] › tests\e2e\view-header.spec.js:117:1 › view header preserves page title sizing when page-base is opted out (1.5s)
  ✓  16 [mobile-dark] › tests\e2e\view-header.spec.js:37:5 › bright view header renders title, muted summary, and zero-height empty summary (2.4s)

  16 passed (20.9s)
```

Command: `python scripts/devops.py check` (lint, pytest, vitest, and Playwright stages passed; exited 1 on worktree integration tests before `npm.cmd ci`, then integration and build passed below)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 24556
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 7776
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 36376
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 32140
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 35972
[... 8 lines omitted ...]
======================= 61 passed, 1 skipped in 22.81s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 32524
> @gpellicciotta/support.webapp@0.4.1-pre test
> vitest run
[... 71 lines omitted ...]
 Test Files  44 passed (44)
      Tests  2324 passed (2324)
[... 1226 lines omitted ...]
  ✓   998 [mobile-dark] › tests\e2e\view-header.spec.js:37:5 › neutral view header renders title, muted summary, and zero-height empty summary (2.3s)
  ✓  1001 [mobile-dark] › tests\e2e\view-header.spec.js:117:1 › view header preserves page title sizing when page-base is opted out (1.3s)
  ✓   999 [mobile-dark] › tests\e2e\view-header.spec.js:37:5 › warm view header renders title, muted summary, and zero-height empty summary (2.4s)
  ✓  1000 [mobile-dark] › tests\e2e\view-header.spec.js:37:5 › bright view header renders title, muted summary, and zero-height empty summary (2.3s)
  ✓  1002 [mobile-dark] › tests\e2e\view.spec.js:20:5 › sample view › shows the error page after a failed load, and Try again loads the data (1.3s)
  ✓  1003 [mobile-dark] › tests\e2e\view.spec.js:36:5 › sample view › draws the error page with the look icon and no wait status for a fast load (927ms)
  ✓  1004 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (3.1s)
  42 skipped
  962 passed (8.7m)
```

Command: `npm.cmd run test:integration` (exit code 0, after `npm.cmd ci` in worktree)

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0284-add-a-view-header-component-for-a-screen

 ✓ tests/integration/vendor.test.js (1 test) 8748ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 8741ms
 ✓ tests/integration/pack.test.js (3 tests) 2810ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2803ms
 ✓ tests/integration/generate-app.test.js (3 tests) 50635ms
   ✓ generates a neutral app that passes its own checks and the conformance check 19806ms
   ✓ generates a warm app that passes its own checks and the conformance check 15756ms
   ✓ generates a bright app that passes its own checks and the conformance check 15069ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  20:46:15
   Duration  63.51s (tests 100%)
```

Command: `python scripts/devops.py build` (exit code 0)

```text
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 29724
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs
> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove
[... 54 lines omitted ...]
npm notice 936B src/css/components/view-header.css
[... 67 lines omitted ...]
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.4.1-pre
npm notice filename: gpellicciotta-support.webapp-0.4.1-pre.tgz
npm notice package size: 1.0 MB
npm notice unpacked size: 1.4 MB
npm notice shasum: 9efa8d8fa157eae983b21a8d57f4fe5df5b7f90d
npm notice integrity: sha512-wpZ1UZMsCPsD9[...]8S0z/sFAYqImg==
npm notice total files: 121
npm notice
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

### Visual Verification
Captured before and after screenshots of the gallery across `neutral`, `warm`, and `bright` looks in light and dark themes at 390 px and 1440 px widths with zero console, page, or HTTP errors:
- Before: [before-gallery-desktop-light.png](before-gallery-desktop-light.png), [before-gallery-desktop-dark.png](before-gallery-desktop-dark.png), [before-gallery-mobile-light.png](before-gallery-mobile-light.png), [before-gallery-mobile-dark.png](before-gallery-mobile-dark.png)
- After (neutral): [after-view-header-neutral-desktop-light.png](after-view-header-neutral-desktop-light.png), [after-view-header-neutral-desktop-dark.png](after-view-header-neutral-desktop-dark.png), [after-view-header-neutral-mobile-light.png](after-view-header-neutral-mobile-light.png), [after-view-header-neutral-mobile-dark.png](after-view-header-neutral-mobile-dark.png)
- After (warm): [after-view-header-warm-desktop-light.png](after-view-header-warm-desktop-light.png), [after-view-header-warm-desktop-dark.png](after-view-header-warm-desktop-dark.png), [after-view-header-warm-mobile-light.png](after-view-header-warm-mobile-light.png), [after-view-header-warm-mobile-dark.png](after-view-header-warm-mobile-dark.png)
- After (bright): [after-view-header-bright-desktop-light.png](after-view-header-bright-desktop-light.png), [after-view-header-bright-desktop-dark.png](after-view-header-bright-desktop-dark.png), [after-view-header-bright-mobile-light.png](after-view-header-bright-mobile-light.png), [after-view-header-bright-mobile-dark.png](after-view-header-bright-mobile-dark.png)
