## Walkthrough & Validation
Red-phase and green-phase evidence for T0014, captured on 2026-11-12.
The earlier turn checked the red-phase step without writing this file.
This turn captured red output for the added tests against the inherited implementation.

### Red Phase: Unit Tests
The relative-root `inside()` case hung until `timeout` stopped it, exposing an infinite loop.

Command: `timeout 120 npx vitest run tests/unit/check.test.js tests/unit/manifest.test.js`, exit code 124.

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0014-add-the-vendor-and-check-commands-of-the
 ❯ tests/unit/manifest.test.js (2 tests | 1 failed) 79ms
   ❯ package manifest (2)
     × uses the shipped manifest only while it matches the package files 13ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  tests/unit/manifest.test.js > package manifest > uses the shipped manifest only while it matches the package files
TypeError: packageManifest is not a function
[... 7 lines omitted ...]
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯
Vitest caught 1 unhandled error during the test run.
[... 6 lines omitted ...]
 ❯ ChildProcess.emit node:events:518:28
 ❯ ChildProcess._handle.onexit node:internal/child_process:293:12
Caused by: Error: Worker exited unexpectedly with exit code 143 during started state while running test file C:/Dev-Projects/support.webapp/.plan/work/T0014-add-the-vendor-and-check-commands-of-the/tests/unit/check.test.js
 ❯ ChildProcess.emitUnexpectedExit node_modules/vitest/dist/chunks/index.Di8au7q4.js:5399:33
 ❯ ChildProcess.emit node:events:518:28
 ❯ ChildProcess._handle.onexit node:internal/child_process:293:12
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
 Test Files  1 failed (2)
      Tests  1 failed | 12 passed (15)
     Errors  1 error
```

### Red Phase: Integration Test
Command: `npx vitest run --config vitest.integration.config.js`, exit code 1.

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0014-add-the-vendor-and-check-commands-of-the
 ❯ tests/integration/vendor.test.js (1 test | 1 failed) 2731ms
   × packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 2729ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  tests/integration/vendor.test.js > packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments
AssertionError: postpack removes the generated manifest: expected true to be false // Object.is equality
- Expected
+ Received
- false
[... 10 lines omitted ...]
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  11:06:26
   Duration  3.35s (tests 96%, transform 2%, import 1%)
exit 1
```

### Green Phase: Unit Tests
Command: `npx vitest run`, exit code 0.

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0014-add-the-vendor-and-check-commands-of-the
 Test Files  5 passed (5)
      Tests  469 passed (469)
   Start at  11:09:25
   Duration  966ms (import 37%, tests 30%, transform 29%, worker 4%)
exit 0
```

### Green Phase: Integration Test (Completion Check)
Command: `npx vitest run --config vitest.integration.config.js`, exit code 0.

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0014-add-the-vendor-and-check-commands-of-the
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  11:09:29
   Duration  7.92s (tests 96%, transform 2%, import 1%)
exit 0
```

### Full Project Check
Command: `python scripts/devops.py check`, exit code 0.

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 80624
All 21 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 8336
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 71212
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 9756
> @gpellicciotta/support.webapp@0.1.0-pre lint
> eslint .
[... 14 lines omitted ...]
============================== 3 passed in 3.89s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 70568
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0014-add-the-vendor-and-check-commands-of-the
 Test Files  5 passed (5)
      Tests  469 passed (469)
[... 15 lines omitted ...]
  8 passed (5.1s)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 18304
> @gpellicciotta/support.webapp@0.1.0-pre test:integration
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0014-add-the-vendor-and-check-commands-of-the
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  11:10:28
   Duration  3.86s (tests 98%, import 1%)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 81728
> @gpellicciotta/support.webapp@0.1.0-pre prepack
> node bin/manifest.mjs
> @gpellicciotta/support.webapp@0.1.0-pre postpack
> node bin/manifest.mjs --remove
[... 36 lines omitted ...]
exit 0
```

### Command Line End-to-End Run
Each command ran in a fresh temporary app folder; `{{checkout}}` is this worktree.

```text
$ node {{checkout}}/bin/cli.mjs vendor --look neutral --to web/vendor/design --styles css --format json
{"version":"0.1.0-pre","look":"neutral","target":"web/vendor/design","styles":["css"],"dryRun":false,"replaced":false,"changes":["web/vendor/design/contract.json","web/vendor/design/css/base.css","web
exit 0
$ node web/vendor/design/bin/check.mjs
integrity: PASS
conformance: PASS
exit 0
$ node web/vendor/design/bin/check.mjs  # after adding css/app.css with a raw color and fixed position
integrity: PASS
conformance: FAIL
css/app.css: raw color in color
css/app.css: fixed or sticky position outside shell
exit 1
$ node {{checkout}}/bin/cli.mjs vendor --look neutral --to web/vendor/design
web/vendor/design/manifest.json
design.json
exit 0
$ node {{checkout}}/bin/cli.mjs vendor --to x
vendor requires --look <name> and --to <folder>
exit 2
```

## Review Round 1 Rework
Evidence for the fixes of [review-findings-1.md](review-findings-1.md), captured on 2026-11-12.

### Red Phase: Unit Tests
Command: `npx vitest run tests/unit/check.test.js`, exit code 1.

```text
     × ignores double dashes inside BEM class names 17ms
     × skips the vendored copy when a styles folder contains it 31ms
     × reports a missing styles folder as a conformance error 28ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  tests/unit/check.test.js > app style conformance > ignores double dashes inside BEM class names
AssertionError: expected [ Array(1) ] to deeply equal []
 FAIL  tests/unit/check.test.js > vendored copy integrity > skips the vendored copy when a styles folder contains it
AssertionError: expected [ Array(1) ] to deeply equal []
 FAIL  tests/unit/check.test.js > vendored copy integrity > reports a missing styles folder as a conformance error
Error: ENOENT: no such file or directory, scandir 'C:\Users\giova\AppData\Local\Temp\design-check-XSPAOK\nope'
 Test Files  1 failed (1)
      Tests  3 failed | 13 passed (16)
exit 1
[... 44 non-matching lines omitted ...]
```

### Red Phase: Integration Test
The checker run through a junction exited 0 instead of 1.

Command: `npx vitest run --config vitest.integration.config.js`, exit code 1.

```text
   × packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 4376ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  tests/integration/vendor.test.js > packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments
AssertionError: expected +0 to be 1 // Object.is equality
 ❯ tests/integration/vendor.test.js:44:42
 Test Files  1 failed (1)
      Tests  1 failed (1)
exit 1
[... 15 non-matching lines omitted ...]
```

After the guard fix, the added `--styles nope` assertion failed until `vendor` validated folders:

```text
   × packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 2250ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected 1 to be 2 // Object.is equality
 ❯ tests/integration/vendor.test.js:72:103
      Tests  1 failed (1)
exit 1
[... 17 non-matching lines omitted ...]
```

### Green Phase: Full Project Check
Command: `python scripts/devops.py check`, exit code 0.

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 66376
All 21 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 75808
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 80596
4 files already formatted
[... 18 lines omitted ...]
============================== 3 passed in 2.24s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 73276
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0014-add-the-vendor-and-check-commands-of-the
 Test Files  5 passed (5)
      Tests  472 passed (472)
[... 15 lines omitted ...]
  8 passed (3.9s)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 73020
> @gpellicciotta/support.webapp@0.1.0-pre test:integration
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0014-add-the-vendor-and-check-commands-of-the
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  11:17:25
   Duration  2.77s (tests 99%, import 1%)
[... 42 lines omitted ...]
exit 0
```

### Command Line End-to-End Run of the Reviewer Scenarios
The app vendors into `src/vendor/design` and lists `src` in `styles`; `{{app}}-link` is a junction to it.

```text
$ node {{checkout}}/bin/cli.mjs vendor --look neutral --to src/vendor/design --styles src
design.json
exit 0
$ node {{app}}/src/vendor/design/bin/check.mjs  # styles folder src contains the vendored copy
integrity: PASS
conformance: PASS
exit 0
$ node {{app}}/src/vendor/design/bin/check.mjs  # after src/css/app.css gets color: red
integrity: PASS
conformance: FAIL
src/css/app.css: raw color in color
exit 1
$ node {{app}}-link/src/vendor/design/bin/check.mjs  # same app through a junction
integrity: PASS
conformance: FAIL
src/css/app.css: raw color in color
exit 1
$ node {{checkout}}/bin/cli.mjs vendor --look neutral --to src/vendor/design --styles nope
Styles folder not found: nope
exit 2
```
