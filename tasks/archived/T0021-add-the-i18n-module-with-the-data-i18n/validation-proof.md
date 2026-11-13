# Walkthrough & Validation

## Failing tests
Command: `npx vitest run tests/unit/i18n.test.js`
Exit code: 1

```text

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0021-add-the-i18n-module-with-the-data-i18n

 ❯ tests/unit/i18n.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/i18n.test.js [ tests/unit/i18n.test.js ]
Error: Cannot find module '../../src/js/i18n.js' imported from C:/Dev-Projects/support.webapp/.plan/work/T0021-add-the-i18n-module-with-the-data-i18n/tests/unit/i18n.test.js
 ❯ tests/unit/i18n.test.js:2:1
      1| import { beforeEach, expect, it } from 'vitest';
      2| import { setCatalog, t } from '../../src/js/i18n.js';
       | ^
      3|
      4| beforeEach(() => setCatalog({}));

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  no tests
   Start at  10:46:03
   Duration  284ms (worker 97%, environment 3%)


```


## green
Command: `npx vitest run tests/unit/i18n.test.js`
Exit code: 0

```text

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0021-add-the-i18n-module-with-the-data-i18n


 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  10:46:38
   Duration  232ms (transform 41%, import 35%, tests 12%, worker 11%)
```

## browser
Command: `npx playwright test tests/e2e/i18n.spec.js`
Exit code: 0

```text
[WebServer] (node:70148) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 4 tests using 4 workers

(node:85784) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:75944) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:66440) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:86752) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:85784) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:66440) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:75944) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:86752) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  3 [desktop-light] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (615ms)
  ✓  4 [desktop-dark] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (611ms)
  ✓  1 [mobile-dark] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (610ms)
  ✓  2 [mobile-light] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (655ms)

  4 passed (3.1s)
```

## check
Command: `python scripts/devops.py check (initial lint failure)`
Exit code: 1

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 52500
All 21 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 10724
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 86456
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 77356
> @gpellicciotta/support.webapp@0.1.0-pre lint
> eslint .
C:\Dev-Projects\support.webapp\.plan\work\T0021-add-the-i18n-module-with-the-data-i18n\tests\unit\i18n.test.js
  29:1  error  Expected indentation of 0 spaces but found 4  @stylistic/indent
  30:1  error  Expected indentation of 4 spaces but found 8  @stylistic/indent
  31:1  error  Expected indentation of 4 spaces but found 8  @stylistic/indent
  32:1  error  Expected indentation of 4 spaces but found 8  @stylistic/indent
  33:1  error  Expected indentation of 0 spaces but found 4  @stylistic/indent
✖ 5 problems (5 errors, 0 warnings)
  5 errors and 0 warnings potentially fixable with the `--fix` option.
**[ERROR]** Finished devops check in 3.7s with status: failed
```

## checkfinal
Command: `python scripts/devops.py check`
Exit code: 0

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 85796
All 21 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 82980
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 58888
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 78248
> @gpellicciotta/support.webapp@0.1.0-pre lint
> eslint .
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m pytest
Process ID: 82316
============================= test session starts =============================
platform win32 -- Python 3.12.8, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0021-add-the-i18n-module-with-the-data-i18n
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [3 items]
...                                                                      [100%]
============================== 3 passed in 1.77s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 7356
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0021-add-the-i18n-module-with-the-data-i18n
 Test Files  3 passed (3)
      Tests  454 passed (454)
   Start at  10:47:02
   Duration  517ms (import 47%, transform 26%, tests 21%, worker 5%)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 80248
> @gpellicciotta/support.webapp@0.1.0-pre test:slow
```

```text
> playwright test
[WebServer] (node:73584) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
Running 8 tests using 4 workers
(node:72948) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:88004) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:81048) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:17848) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:72948) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:88004) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:81048) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:17848) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  2 [desktop-light] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (374ms)
  ✓  1 [desktop-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (432ms)
  ✓  4 [desktop-dark] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (453ms)
  ✓  3 [desktop-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (444ms)
(node:75144) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:80300) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:86392) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:75144) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:508) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:86392) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:80300) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:508) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
```

```text
  ✓  7 [mobile-dark] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (224ms)
  ✓  5 [mobile-light] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (368ms)
  ✓  6 [mobile-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (365ms)
  ✓  8 [mobile-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (262ms)
  8 passed (4.0s)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 86380
npm notice
npm notice 📦  @gpellicciotta/support.webapp@0.1.0-pre
npm notice Tarball Contents
npm notice 1.9kB CHANGELOG.md
npm notice 1.1kB LICENSE.md
npm notice 895B README.md
npm notice 678B package.json
npm notice 19.1kB src/contract.json
npm notice 1.2kB src/css/base.css
npm notice 230B src/css/deprecated.css
npm notice 200B src/css/reset.css
npm notice 165B src/css/style.css
npm notice 371B src/index.html
npm notice 2.1kB src/js/i18n.js
npm notice 447B src/looks/neutral/fonts.css
npm notice 352.2kB src/looks/neutral/fonts/InterVariable.woff2
npm notice 4.4kB src/looks/neutral/fonts/OFL.txt
npm notice 184B src/looks/neutral/index.css
npm notice 4.9kB src/looks/neutral/look.css
npm notice 1.3kB src/looks/neutral/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 362.0 kB
npm notice unpacked size: 391.2 kB
npm notice shasum: 1e6f04d3b466e0ff41bf396edda55b4e6c048a95
npm notice integrity: sha512-LUx+Oby9Ckced[...]sBpdu/t+m6pHQ==
npm notice total files: 17
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```


## Review round one rework

Command: `python scripts/devops.py check`
Exit code: 1

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 81880
docs\specs\naming.md:93:1: MD017 [aligned-tables] Markdown table columns and delimiter pipes are not vertically aligned
docs\specs\naming.md:94:1: MD017 [aligned-tables] Markdown table columns and delimiter pipes are not vertically aligned
docs\specs\naming.md:95:1: MD017 [aligned-tables] Markdown table columns and delimiter pipes are not vertically aligned
docs\specs\naming.md:96:1: MD017 [aligned-tables] Markdown table columns and delimiter pipes are not vertically aligned
**[WARN]**  Found 4 lint issues across 21 files.
**[ERROR]** Finished lint-markdown check in 1.1s with status: failed
**[ERROR]** Finished devops check in 1.6s with status: failed
```

Command: `python scripts/devops.py check`
Exit code: 0

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 81280
All 21 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 61848
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 51356
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 2540
> @gpellicciotta/support.webapp@0.1.0-pre lint
> eslint .
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m pytest
Process ID: 31952
============================= test session starts =============================
platform win32 -- Python 3.12.8, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0021-add-the-i18n-module-with-the-data-i18n
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [3 items]
...                                                                      [100%]
============================== 3 passed in 3.52s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 77244
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0021-add-the-i18n-module-with-the-data-i18n
 Test Files  3 passed (3)
      Tests  454 passed (454)
   Start at  10:52:34
   Duration  968ms (import 59%, tests 29%, transform 8%, worker 4%)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 67052
> @gpellicciotta/support.webapp@0.1.0-pre test:slow
```

```text
> playwright test
[WebServer] (node:43740) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
Running 8 tests using 4 workers
(node:70368) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:70444) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:87984) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:51872) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:70368) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:70444) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:87984) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:51872) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  2 [desktop-dark] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (834ms)
  ✓  3 [desktop-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (839ms)
  ✓  4 [desktop-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (934ms)
  ✓  1 [desktop-light] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (1.0s)
(node:8400) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:83504) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:8400) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:83504) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  5 [mobile-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (475ms)
  ✓  6 [mobile-dark] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (332ms)
(node:78696) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:84248) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:78696) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
```

```text
(node:84248) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  8 [mobile-light] › tests\e2e\i18n.spec.js:3:1 › translates scoped markup and switches catalogs safely (215ms)
  ✓  7 [mobile-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (879ms)
  8 passed (16.1s)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 87788
npm notice
npm notice 📦  @gpellicciotta/support.webapp@0.1.0-pre
npm notice Tarball Contents
npm notice 1.9kB CHANGELOG.md
npm notice 1.1kB LICENSE.md
npm notice 895B README.md
npm notice 678B package.json
npm notice 19.1kB src/contract.json
npm notice 1.2kB src/css/base.css
npm notice 230B src/css/deprecated.css
npm notice 200B src/css/reset.css
npm notice 165B src/css/style.css
npm notice 371B src/index.html
npm notice 2.1kB src/js/i18n.js
npm notice 447B src/looks/neutral/fonts.css
npm notice 352.2kB src/looks/neutral/fonts/InterVariable.woff2
npm notice 4.4kB src/looks/neutral/fonts/OFL.txt
npm notice 184B src/looks/neutral/index.css
npm notice 4.9kB src/looks/neutral/look.css
npm notice 1.3kB src/looks/neutral/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 362.0 kB
npm notice unpacked size: 391.2 kB
npm notice shasum: 1e6f04d3b466e0ff41bf396edda55b4e6c048a95
npm notice integrity: sha512-LUx+Oby9Ckced[...]sBpdu/t+m6pHQ==
npm notice total files: 17
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```

