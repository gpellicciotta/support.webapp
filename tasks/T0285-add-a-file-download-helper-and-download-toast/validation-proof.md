## Walkthrough & Validation
### Red-Phase Proof
Command: `npx.cmd vitest run tests/unit/file-download.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0285-add-a-file-download-helper-and-download-toast

 ❯ tests/unit/file-download.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/file-download.test.js [ tests/unit/file-download.test.js ]
Error: Failed to resolve import "../../src/js/file-download.js" from "tests/unit/file-download.test.js". Does the file exist?
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
   Start at  21:07:04
   Duration  2.32s (environment 99%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/file-download.spec.js --project=desktop-light --timeout=8000`
Exit code: `1`

```text
Running 2 tests using 2 workers

  ✘  1 [desktop-light] › tests\e2e\file-download.spec.js:27:5 › file download › offers a persistent download toast action that downloads the named file and dismisses on Escape (8.4s)
  ✘  2 [desktop-light] › tests\e2e\file-download.spec.js:7:5 › file download › downloads formatted JSON with the given file name from a gallery button (8.4s)

    Error: locator.scrollIntoViewIfNeeded: Test timeout of 8000ms exceeded.
    Call log:
      - waiting for locator('#file-download')
[... 29 lines omitted ...]
  2 failed
    [desktop-light] › tests\e2e\file-download.spec.js:7:5 › file download › downloads formatted JSON with the given file name from a gallery button 
    [desktop-light] › tests\e2e\file-download.spec.js:27:5 › file download › offers a persistent download toast action that downloads the named file and dismisses on Escape 
```

### Green-Phase Proof
Command: `python scripts/devops.py lint`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 26116
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 23996
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 37696
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 37296
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
```

Command: `python scripts/devops.py tests`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 37360
[... 9 lines omitted ...]
....................................s.........................           [100%]
======================== 61 passed, 1 skipped in 3.57s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 30612
> @gpellicciotta/support.webapp@0.4.1-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0285-add-a-file-download-helper-and-download-toast
[... 50 lines omitted ...]
 ✓ tests/unit/toast.test.js (25 tests) 157ms
 ✓ tests/unit/file-download.test.js (10 tests) 104ms
[... 24 lines omitted ...]
 Test Files  45 passed (45)
      Tests  2334 passed (2334)
   Start at  21:24:46
   Duration  12.86s (environment 45%, import 37%, tests 15%, worker 1%, transform 1%)
```

Command: `npx.cmd playwright test tests/e2e/file-download.spec.js tests/e2e/toast.spec.js`
Exit code: `0`

```text
Running 12 tests using 4 workers

  ✓   3 [desktop-dark] › tests\e2e\file-download.spec.js:7:5 › file download › downloads formatted JSON with the given file name from a gallery button (2.1s)
  ✓   2 [desktop-light] › tests\e2e\file-download.spec.js:7:5 › file download › downloads formatted JSON with the given file name from a gallery button (2.0s)
  ✓   1 [desktop-light] › tests\e2e\file-download.spec.js:27:5 › file download › offers a persistent download toast action that downloads the named file and dismisses on Escape (2.4s)
  ✓   4 [desktop-light] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding (3.0s)
  ✓   5 [desktop-dark] › tests\e2e\file-download.spec.js:27:5 › file download › offers a persistent download toast action that downloads the named file and dismisses on Escape (1.8s)
  ✓   7 [mobile-light] › tests\e2e\file-download.spec.js:7:5 › file download › downloads formatted JSON with the given file name from a gallery button (1.9s)
  ✓   6 [desktop-dark] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding (2.9s)
  ✓   8 [mobile-light] › tests\e2e\file-download.spec.js:27:5 › file download › offers a persistent download toast action that downloads the named file and dismisses on Escape (2.0s)
  ✓   9 [mobile-light] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding (3.1s)
  ✓  10 [mobile-dark] › tests\e2e\file-download.spec.js:7:5 › file download › downloads formatted JSON with the given file name from a gallery button (1.6s)
  ✓  11 [mobile-dark] › tests\e2e\file-download.spec.js:27:5 › file download › offers a persistent download toast action that downloads the named file and dismisses on Escape (1.9s)
  ✓  12 [mobile-dark] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding (2.5s)

  12 passed (16.6s)
```

Command: `npm.cmd run test:integration`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0285-add-a-file-download-helper-and-download-toast

 ✓ tests/integration/vendor.test.js (1 test) 7706ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 7703ms
 ✓ tests/integration/pack.test.js (3 tests) 2883ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2875ms
 ✓ tests/integration/generate-app.test.js (3 tests) 55194ms
   ✓ generates a neutral app that passes its own checks and the conformance check 22987ms
   ✓ generates a warm app that passes its own checks and the conformance check 16183ms
   ✓ generates a bright app that passes its own checks and the conformance check 16019ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  21:27:21
   Duration  67.08s (tests 100%)
```

Command: `npm.cmd pack --dry-run`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs
> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove
[... 72 lines omitted ...]
npm notice 9.9kB src/js/file-download.js
[... 49 lines omitted ...]
npm notice total files: 122
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

Full Playwright suite (`python scripts/devops.py check` slow phase prior to comment-only tightening): 970 passed, 42 skipped, 0 failed in 8.7m.

### Visual Verification
- Before: [before-gallery.png](before-gallery.png)
- After (light): [after-gallery-light.png](after-gallery-light.png)
- After (dark): [after-gallery-dark.png](after-gallery-dark.png)
