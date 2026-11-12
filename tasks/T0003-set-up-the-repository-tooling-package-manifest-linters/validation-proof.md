# Verification Evidence

## Walkthrough & Validation

### Verification

Command: `npm test`; exit code: 1.

```text

> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0003-set-up-the-repository-tooling-package-manifest-linters

 ❯ tests/unit/smoke.test.js (3 tests | 1 failed) 18ms
   ❯ repository tooling (3)
     × uses portable JavaScript and CSS media types 9ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/smoke.test.js > repository tooling > uses portable JavaScript and CSS media types
TypeError: contentType is not a function
 ❯ tests/unit/smoke.test.js:8:16
      6| describe('repository tooling', () => {
      7|     it('uses portable JavaScript and CSS media types', () => {
      8|         expect(contentType('module.js')).toBe('text/javascript; charse…
       |                ^
      9|         expect(contentType('module.mjs')).toBe('text/javascript; chars…
     10|         expect(contentType('style.css')).toBe('text/css; charset=utf-8…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  10:06:40
   Duration  1.06s (import 84%, transform 10%, tests 3%, worker 3%)
```


Command: `python -m unittest discover -s tests -p test_markdown_links.py`; exit code: 1.

```text
E
======================================================================
ERROR: test_markdown_links (unittest.loader._FailedTest.test_markdown_links)
----------------------------------------------------------------------
ImportError: Failed to import test module: test_markdown_links
Traceback (most recent call last):
  File "C:\Program Files\Python312\Lib\unittest\loader.py", line 396, in _find_test_path
    module = self._get_module_from_name(name)
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Program Files\Python312\Lib\unittest\loader.py", line 339, in _get_module_from_name
    __import__(name)
  File "C:\Dev-Projects\support.webapp\.plan\work\T0003-set-up-the-repository-tooling-package-manifest-linters\tests\test_markdown_links.py", line 10, in <module>
    SPEC.loader.exec_module(LINKS)
  File "<frozen importlib._bootstrap_external>", line 995, in exec_module
  File "<frozen importlib._bootstrap_external>", line 1132, in get_code
  File "<frozen importlib._bootstrap_external>", line 1190, in get_data
FileNotFoundError: [Errno 2] No such file or directory: 'C:\\Dev-Projects\\support.webapp\\.plan\\work\\T0003-set-up-the-repository-tooling-package-manifest-linters\\scripts\\markdown-links.py'


----------------------------------------------------------------------
Ran 1 test in 0.001s

FAILED (errors=1)
```


Command: `python -m pytest tests/test_markdown_links.py -n 0`; exit code: 1.

```text
============================= test session starts =============================
platform win32 -- Python 3.12.8, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0003-set-up-the-repository-tooling-package-manifest-linters
configfile: pyproject.toml
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
collected 3 items

tests\test_markdown_links.py ..F                                         [100%]

================================== FAILURES ===================================
___________ PortableLinksTests.test_root_relative_links_still_fail ____________

self = <test_markdown_links.PortableLinksTests testMethod=test_root_relative_links_still_fail>

    def test_root_relative_links_still_fail(self):
        """Root-relative paths must remain internal repository links."""
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            issues = LINKS.PortableLinks().lint("[Missing](/docs/missing.md)", root / "README.md", project_root=root)
>           self.assertEqual(len(issues), 1)
E           AssertionError: 0 != 1

tests\test_markdown_links.py:37: AssertionError
=========================== short test summary info ===========================
FAILED tests/test_markdown_links.py::PortableLinksTests::test_root_relative_links_still_fail
========================= 1 failed, 2 passed in 0.41s =========================
```


Command: `py -3.15 scripts/bootstrap-dev-environment.py`; exit code: 0.

```text
$ C:\Dev-Projects\support.webapp\.plan\work\T0003-set-up-the-repository-tooling-package-manifest-linters\.venv\Scripts\python.exe -m pip install -r C:\Dev-Projects\support.webapp\.plan\work\T0003-set-up-the-repository-tooling-package-manifest-linters\scripts\requirements.txt
Collecting support-python @ git+https://github.com/gpellicciotta/support.python.git@v3.1.0 (from -r C:\Dev-Projects\support.webapp\.plan\work\T0003-set-up-the-repository-tooling-package-manifest-linters\scripts\requirements.txt (line 2))
  Cloning https://github.com/gpellicciotta/support.python.git (to revision v3.1.0) to C:\Users\giova\AppData\Local\Temp\pip-install-rrj9nmia\support-python_00255b31b39c4953bf4bceca45de5a61
  Running command git clone --filter=blob:none --quiet https://github.com/gpellicciotta/support.python.git 'C:\Users\giova\AppData\Local\Temp\pip-install-rrj9nmia\support-python_00255b31b39c4953bf4bceca45de5a61'
  Running command git checkout -q 2ed6b836070c1bcb750b76340864c4b55f98a1e9
  Resolved https://github.com/gpellicciotta/support.python.git to commit 2ed6b836070c1bcb750b76340864c4b55f98a1e9
  Installing build dependencies: started
  Installing build dependencies: finished with status 'done'
  Getting requirements to build wheel: started
  Getting requirements to build wheel: finished with status 'done'
  Preparing metadata (pyproject.toml): started
  Preparing metadata (pyproject.toml): finished with status 'done'
[... 82 lines omitted ...]
(node:86920) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  2 [mobile-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (857ms)
  ✓  4 [desktop-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (877ms)
  ✓  1 [desktop-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (906ms)
  ✓  3 [mobile-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (888ms)
  4 passed (9.1s)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 76108
npm notice
npm notice 📦  @gpellicciotta/support.webapp@0.1.0-pre
npm notice Tarball Contents
npm notice 1.6kB CHANGELOG.md
npm notice 1.1kB LICENSE.md
npm notice 895B README.md
npm notice 649B package.json
npm notice 356B src/index.html
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 2.4 kB
npm notice unpacked size: 4.6 kB
npm notice shasum: 53727f31c8ff0ab47ad81d3a247c92d00afc2bbf
npm notice integrity: sha512-Hu0NgKDt2LGOZ[...]BT3woLKkU7S9Q==
npm notice total files: 5
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```


Command: `python scripts/devops.py tests`; exit code: 0.

```text
Command: C:\Dev-Projects\support.webapp\.plan\work\T0003-set-up-the-repository-tooling-package-manifest-linters\.venv\Scripts\python.exe -m pytest
Process ID: 19516
============================= test session starts =============================
platform win32 -- Python 3.15.2, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0003-set-up-the-repository-tooling-package-manifest-linters
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [3 items]
...                                                                      [100%]
============================== 3 passed in 3.78s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 32292
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0003-set-up-the-repository-tooling-package-manifest-linters
 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  10:10:06
   Duration  1.52s (import 90%, transform 7%, worker 2%, tests 1%)
```

### Visual Verification
The browser checked HTTP 200 before capturing each page and asserted no console errors, exceptions, or failed requests.

- [Desktop light](desktop-light.png)
- [Desktop dark preference](desktop-dark.png)
- [Mobile light](mobile-light.png)
- [Mobile dark preference](mobile-dark.png)

The landing page is newly added; no prior page existed for a before screenshot.
The unstyled page uses browser defaults in both color preferences.
All four captures were inspected; each displays the heading and description without clipping.
Playwright stopped its server when the run completed.

### Scope and Limitations
Command: `plan tasks validate T0003 --completion`; exit code: 0.

```text
All 1 task file passed validation.
```

CI configuration was added but has not run on GitHub during this turn.
Local bootstrap, dependency installation, full check, and packaging validation ran successfully on Windows with Python 3.15.2.
The standard Node adapter owns release behavior; no release or publishing command was executed.
ESLint 9.39.5 has no reported npm audit vulnerabilities but is marked unsupported by npm.

### Review Rework
The developer server held port 4173 throughout the failing-first, corrected, concurrent, and full-check runs.
Its launcher PID was 82988; operational logs are stored beside this evidence.

Command: `npm run test:slow`; exit code: 1.

```text

> @gpellicciotta/support.webapp@0.1.0-pre test:slow
> playwright test

Error: http://127.0.0.1:4173 is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true in config.webServer.
```

Command: `npm run test:slow`; exit code: 0.

```text

> @gpellicciotta/support.webapp@0.1.0-pre test:slow
> playwright test

[WebServer] (node:78588) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 4 tests using 4 workers

(node:59412) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:39484) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:74508) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:78196) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:39484) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:74508) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:59412) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:78196) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  1 [mobile-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (429ms)
  ✓  3 [desktop-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (481ms)
  ✓  2 [desktop-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (437ms)
  ✓  4 [mobile-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (436ms)

  4 passed (2.4s)
```

Command: `npx playwright test --output=test-results/parallel-a`; exit code: 0.

```text
[WebServer] (node:10792) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 4 tests using 4 workers

(node:80720) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:70972) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:86852) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:14096) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:80720) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:70972) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:86852) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:14096) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  2 [desktop-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (619ms)
  ✓  1 [mobile-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (910ms)
  ✓  3 [mobile-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (1.0s)
  ✓  4 [desktop-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (674ms)

  4 passed (4.2s)
```

Command: `npx playwright test --output=test-results/parallel-b`; exit code: 0.

```text
[WebServer] (node:86116) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 4 tests using 4 workers

(node:83212) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:83440) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:63852) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:16304) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:83440) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:83212) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:63852) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:16304) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  1 [mobile-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (819ms)
  ✓  2 [desktop-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (654ms)
  ✓  3 [desktop-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (858ms)
  ✓  4 [mobile-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (390ms)

  4 passed (4.2s)
```

Command: `python scripts/devops.py check`; exit code: 0.

```text
Command: C:\Dev-Projects\support.webapp\.plan\work\T0003-set-up-the-repository-tooling-package-manifest-linters\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 59060
All 19 markdown files passed linting.
Command: C:\Dev-Projects\support.webapp\.plan\work\T0003-set-up-the-repository-tooling-package-manifest-linters\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 5876
All checks passed!
Command: C:\Dev-Projects\support.webapp\.plan\work\T0003-set-up-the-repository-tooling-package-manifest-linters\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 10740
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 80624
> @gpellicciotta/support.webapp@0.1.0-pre lint
[... 46 lines omitted ...]
(node:78708) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  3 [mobile-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (415ms)
  ✓  2 [mobile-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (421ms)
  ✓  1 [desktop-dark] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (654ms)
  ✓  4 [desktop-light] › tests\e2e\smoke.spec.js:3:1 › serves the landing page without browser errors (486ms)
  4 passed (2.3s)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 87976
npm notice
npm notice 📦  @gpellicciotta/support.webapp@0.1.0-pre
npm notice Tarball Contents
npm notice 1.6kB CHANGELOG.md
npm notice 1.1kB LICENSE.md
npm notice 895B README.md
npm notice 649B package.json
npm notice 356B src/index.html
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 2.5 kB
npm notice unpacked size: 4.6 kB
npm notice shasum: e54f69cb7fe3625a86b43b17834df63557cb6ebb
npm notice integrity: sha512-XTiDsMFk4KdyA[...]6+cmvc/Hrbprw==
npm notice total files: 5
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```

Command: `processes kill 82988 --yes`; exit code: 0.

```text
Killed PID 82988
```

The two concurrent browser runs each passed four cases without using the developer server.
Earlier configuration-specific Vitest and original Playwright red evidence was not captured; this round records the port regression explicitly.


