# T0004 Validation Proof

## Walkthrough & Validation

### Failing first
Command: `npx vitest run tests/unit/tokens.test.js`. Exit code: 1.

```text

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0004-extract-the-shared-base-tokens-and-the-todos

 ❯ tests/unit/tokens.test.js (4 tests | 1 failed) 18ms
   ❯ token contract (4)
     × defines the contract and resolves every complete look import chain 11ms

[... 2 lines omitted ...]
 FAIL  tests/unit/tokens.test.js > token contract > defines the contract and resolves every complete look import chain
Error: ENOENT: no such file or directory, open 'C:\Dev-Projects\support.webapp\.plan\work\T0004-extract-the-shared-base-tokens-and-the-todos\src\contract.json'

[... 12 lines omitted ...]
 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
[... 2 lines omitted ...]
```

Failure output above preserves the command summary and missing-contract error; stack frames are omitted.

### Completion check
Command: `npx vitest run tests/unit/tokens.test.js`. Exit code: 0.

```text

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0004-extract-the-shared-base-tokens-and-the-todos


 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  10:30:39
   Duration  277ms (tests 49%, import 30%, transform 12%, worker 8%)
```

### Full check
Command: `python scripts/devops.py check`. Exit code: 0.

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 84472
All 20 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 85124
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 86640
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 20204
> @gpellicciotta/support.webapp@0.1.0-pre lint
> eslint .
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m pytest
Process ID: 13304
============================= test session starts =============================
platform win32 -- Python 3.12.8, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0004-extract-the-shared-base-tokens-and-the-todos
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [3 items]
...                                                                      [100%]
============================== 3 passed in 2.10s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 75820
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0004-extract-the-shared-base-tokens-and-the-todos
 Test Files  2 passed (2)
      Tests  8 passed (8)
   Start at  10:30:08
   Duration  488ms (import 72%, tests 15%, transform 8%, worker 5%)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 62796
> @gpellicciotta/support.webapp@0.1.0-pre test:slow
```

```text
> playwright test
[WebServer] (node:63952) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
Running 4 tests using 4 workers
(node:69892) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:80272) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:84100) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:13996) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:69892) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:80272) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:84100) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:13996) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  4 [mobile-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (1.0s)
  ✓  3 [desktop-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (1.0s)
  ✓  1 [desktop-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (1.1s)
  ✓  2 [mobile-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (1.1s)
  4 passed (3.5s)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 65972
npm notice
npm notice 📦  @gpellicciotta/support.webapp@0.1.0-pre
npm notice Tarball Contents
npm notice 1.7kB CHANGELOG.md
npm notice 1.1kB LICENSE.md
npm notice 895B README.md
npm notice 678B package.json
npm notice 17.1kB src/contract.json
npm notice 1.1kB src/css/base.css
npm notice 227B src/css/deprecated.css
npm notice 196B src/css/reset.css
npm notice 161B src/css/style.css
npm notice 371B src/index.html
```

```text
npm notice 432B src/looks/neutral/fonts.css
npm notice 352.2kB src/looks/neutral/fonts/InterVariable.woff2
npm notice 4.4kB src/looks/neutral/fonts/OFL.txt
npm notice 179B src/looks/neutral/index.css
npm notice 4.7kB src/looks/neutral/look.css
npm notice 1.2kB src/looks/neutral/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 361.0 kB
npm notice unpacked size: 386.7 kB
npm notice shasum: d06c96cee8c942fa2f6b6a9cbce8f7c85bec8f2d
npm notice integrity: sha512-+faLdtSRkREI2[...]Nugfc4rfET1OQ==
npm notice total files: 16
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```

### Final documentation check
Command: `lint-markdown check --offline`. Exit code: 0.

```text
All 20 markdown files passed linting.
```

### Scope and provenance
Completion validation: `plan tasks validate C:/Dev-Projects/support.webapp/.plan/tasks/T0004-extract-the-shared-base-tokens-and-the-todos.md --completion`, exit code 0.

```text
All 1 task file passed validation.
```

The unchanged landing page does not import these new stylesheets; no rendered visual change requires screenshots.
The full check covered desktop and mobile, light and dark, without browser errors.
The checksum test pins the unchanged Inter font and OFL license read from todos.webapp commit `0cf4981`.
The neutral look page lists every added look token and its source.
Core sprite implementation remains assigned to the icon extraction task, as ADR-0002 specifies.

