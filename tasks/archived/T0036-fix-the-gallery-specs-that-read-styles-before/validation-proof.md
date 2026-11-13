# Validation Proof
## Walkthrough & Validation
Command: `npx playwright test bright.spec.js --grep 'pending color' --project desktop-light --reporter line`

Exit code: 1, before implementation. Relevant verbatim failure output:

```text
    Error: expect(received).toBe(expected) // Object.is equality

    Expected: "rgb(255, 0, 0)"
    Received: "rgb(17, 0, 0)"
```

Command: `npx playwright test bright.spec.js --grep 'pending color' --project desktop-light --reporter line`

Exit code: 0, after implementation. Verbatim summary:

```text
  1 passed (3.7s)
```

No rendered output changed; screenshots are not required for this test synchronization change.

Command: `python scripts/devops.py check` (first run)

Exit code: 0. Verbatim output excerpts:

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 68172
All 25 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 88724
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 15856
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 6532
> @gpellicciotta/support.webapp@0.1.0-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 72948
============================= test session starts =============================
platform win32 -- Python 3.15.2, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0036-fix-the-gallery-specs-that-read-styles-before
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [3 items]
...                                                                      [100%]
============================== 3 passed in 8.43s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 77924
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0036-fix-the-gallery-specs-that-read-styles-before
 Test Files  25 passed (25)
      Tests  2062 passed (2062)
   Start at  00:52:43
   Duration  8.15s (environment 55%, import 29%, tests 12%, transform 3%, worker 1%)
    Isolate  25 workers spawned · ~1.32s startup each (spawn + environment, per file)
[... middle output omitted; full verbatim output retained in companion log ...]
```

```text
  ok 536 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (3.0s)
  2 skipped
  534 passed (5.2m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 19724
> @gpellicciotta/support.webapp@0.1.0-pre test:integration
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0036-fix-the-gallery-specs-that-read-styles-before
 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  00:58:09
   Duration  13.68s (tests 99%, import 1%)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
```

Command: `npx playwright test bright.spec.js card.spec.js --repeat-each 20 --reporter line`

Exit code: 0. Verbatim final summary:

```text
[400/400] [mobile-dark] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars
  400 passed (10.4m)
```

Command: `python scripts/devops.py check` (second consecutive run)

Exit code: 0. Verbatim output excerpts:

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 85672
All 25 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 44216
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 9640
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 81388
> @gpellicciotta/support.webapp@0.1.0-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 88372
============================= test session starts =============================
platform win32 -- Python 3.15.2, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0036-fix-the-gallery-specs-that-read-styles-before
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [3 items]
...                                                                      [100%]
============================= 3 passed in 40.44s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 52472
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0036-fix-the-gallery-specs-that-read-styles-before
 Test Files  25 passed (25)
      Tests  2062 passed (2062)
   Start at  00:59:25
   Duration  9.09s (environment 54%, import 31%, tests 11%, worker 2%, transform 1%)
    Isolate  25 workers spawned · ~1.51s startup each (spawn + environment, per file)
[... middle output omitted; full verbatim output retained in companion log ...]
```

```text
  2 skipped
  534 passed (5.3m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 80604
> @gpellicciotta/support.webapp@0.1.0-pre test:integration
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0036-fix-the-gallery-specs-that-read-styles-before
 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  01:04:57
   Duration  8.13s (tests 99%, import 1%)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 32072
```
