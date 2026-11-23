## Walkthrough & Validation
Deferred blur validation in `src/js/field.js` until after pointer release via a document-scoped `WeakMap` pointer state with reference-counted listener cleanup.
`attachForm` needs no changes because its submit handler calls `field.validate()` synchronously during `click`, dropping any held blur check before the release task runs.
No CSS or markup changed, so visual rendering of field and form states is unchanged; Playwright verified layout stability and submit behavior across all four desktop/mobile light/dark viewports.

### Red-Phase Unit Test Failure
Command: `npx.cmd vitest run tests/unit/field.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0282-defer-field-validation-on-blur-until-a-pointer

 ❯ tests/unit/field.test.js (20 tests | 3 failed) 361ms
[... 17 lines omitted ...]
   ❯ pointer blur deferral (3)
     × holds blur validation during a pointer press until after pointerup or pointercancel 20ms
     × drops a held blur check when validate, clear, or setError runs before the release task 12ms
     × validates a keyboard blur immediately and skips held checks if refocused, removed, or destroyed 14ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/field.test.js > pointer blur deferral > holds blur validation during a pointer press until after pointerup or pointercancel
AssertionError: expected 'Enter a name.' to be null // Object.is equality
[... 22 lines omitted ...]
 FAIL  tests/unit/field.test.js > pointer blur deferral > drops a held blur check when validate, clear, or setError runs before the release task
AssertionError: expected "vi.fn()" to be called 1 times, but got 2 times
[... 12 lines omitted ...]
 FAIL  tests/unit/field.test.js > pointer blur deferral > validates a keyboard blur immediately and skips held checks if refocused, removed, or destroyed
AssertionError: expected 'Enter a name.' to be null // Object.is equality
[... 15 lines omitted ...]
 Test Files  1 failed (1)
      Tests  3 failed | 17 passed (20)
   Start at  19:06:11
   Duration  2.52s (import 78%, tests 17%, transform 4%, worker 1%)
```

### Red-Phase Browser Test Failure
Command: `npx.cmd playwright test tests/e2e/field.spec.js -g "clicking submit from an empty required field"`
Exit code: `1`

```text
Running 4 tests using 4 workers

  ✘  1 [desktop-dark] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error (6.6s)
  ✘  4 [mobile-dark] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error (6.6s)
  ✘  3 [mobile-light] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error (6.6s)
  ✘  2 [desktop-light] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error (6.8s)

  1) [desktop-light] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error 

    Error: expect(locator).toBeHidden() failed

    Locator:  locator('#form form[data-form]').locator('#form-name-error')
    Expected: hidden
    Received: visible
    Timeout:  5000ms
[... 95 lines omitted ...]
  4 failed
    [desktop-light] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error 
    [desktop-dark] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error 
    [mobile-light] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error 
    [mobile-dark] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error 
```

### Affected Browser Tests (Field and Form)
Command: `npx.cmd playwright test tests/e2e/field.spec.js tests/e2e/form.spec.js`
Exit code: `0`

```text
Running 52 tests using 4 workers

  ✓   1 [desktop-light] › tests\e2e\field.spec.js:60:1 › a live field announces its error on blur and clears it once fixed (1.6s)
[... 4 lines omitted ...]
  ✓   6 [desktop-light] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error (1.6s)
[... 12 lines omitted ...]
  ✓  19 [desktop-dark] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error (1.5s)
[... 12 lines omitted ...]
  ✓  32 [mobile-light] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error (1.5s)
[... 12 lines omitted ...]
  ✓  45 [mobile-dark] › tests\e2e\field.spec.js:117:1 › clicking submit from an empty required field still submits and then shows the error (1.4s)
[... 7 lines omitted ...]
  52 passed (29.7s)
```

### Repository Linting
Command: `python scripts/devops.py lint`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 25996
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 28772
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 21888
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 9848
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
```

### Fast Test Suites (Pytest and Vitest)
Command: `python scripts/devops.py tests`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 29240
============================= test session starts =============================
platform win32 -- Python 3.15.2, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0282-defer-field-validation-on-blur-until-a-pointer
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [62 items]
...........................s..................................           [100%]
======================== 61 passed, 1 skipped in 3.81s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 4996
> @gpellicciotta/support.webapp@0.4.1-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0282-defer-field-validation-on-blur-until-a-pointer
[... 3 lines omitted ...]
 ✓ tests/unit/field.test.js (20 tests) 438ms
[... 1 lines omitted ...]
 ✓ tests/unit/form.test.js (12 tests) 536ms
[... 46 lines omitted ...]
 Test Files  42 passed (42)
      Tests  2311 passed (2311)
   Start at  19:33:31
   Duration  13.72s (environment 46%, import 39%, tests 13%, worker 1%, transform 1%)
```

### Full Slow Suite (Playwright and Integration) and Package Check
Full `python scripts/devops.py check` completed all 930 Playwright browser tests before the 30-minute loop checkpoint interrupted it at integration start; the remaining stages (`npm run test:integration` and `npm pack --dry-run`) passed separately on the identical working tree.

Command: `python scripts/devops.py check` (Playwright stage completed prior to loop checkpoint)
Exit code: `interrupted after Playwright passed`

```text
[... 1289 lines omitted ...]
  ✓  970 [mobile-dark] › tests\e2e\view.spec.js:20:5 › sample view › shows the error page after a failed load, and Try again loads the data (1.2s)
  ✓  968 [mobile-dark] › tests\e2e\verify-ui.spec.js:427:1 › reports injected overflow, contrast, target, and focus violations (2.1s)
  ✓  971 [mobile-dark] › tests\e2e\view.spec.js:36:5 › sample view › draws the error page with the look icon and no wait status for a fast load (958ms)
  ✓  972 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (3.3s)
  42 skipped
  930 passed (8.6m)
```

Command: `npm.cmd run test:integration`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0282-defer-field-validation-on-blur-until-a-pointer

 ✓ tests/integration/vendor.test.js (1 test) 6641ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 6638ms
 ✓ tests/integration/pack.test.js (3 tests) 2147ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2143ms
 ✓ tests/integration/generate-app.test.js (3 tests) 48790ms
   ✓ generates a neutral app that passes its own checks and the conformance check 20373ms
   ✓ generates a warm app that passes its own checks and the conformance check 14236ms
   ✓ generates a bright app that passes its own checks and the conformance check 14177ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  19:20:04
   Duration  58.56s (tests 100%)
```

Command: `npm.cmd pack --dry-run`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs

> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove

[... 122 lines omitted ...]
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.4.1-pre
npm notice filename: gpellicciotta-support.webapp-0.4.1-pre.tgz
npm notice package size: 1.0 MB
npm notice unpacked size: 1.4 MB
npm notice shasum: f20309e7b64a34566280dd5130a2366b8aef2686
npm notice integrity: sha512-c/35WZZy3kWaT[...]tD7QF4WyA8cCw==
npm notice total files: 120
npm notice
gpellicciotta-support.webapp-0.4.1-pre.tgz
```
