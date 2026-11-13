# T0016 Validation Proof

## Walkthrough & Validation
Command: `npx playwright test tests/e2e/empty-state.spec.js tests/e2e/row.spec.js tests/e2e/verify-ui.spec.js`

Exit code: 1. Missing specimens caused the expected failures before implementation.

```text
  ✓  20 [mobile-dark] › tests\e2e\verify-ui.spec.js:377:1 › reports unresolved sprite references (774ms)
[neutral light 390px] 16 stylesheets, 521 texts, 89 targets, 89 focus records, 64 sprite references, overflow 0px, errors 0
  ✓  18 [mobile-dark] › tests\e2e\verify-ui.spec.js:320:9 › gallery passes every verifier check in the neutral look (3.0s)
  ✘  16 [mobile-dark] › tests\e2e\empty-state.spec.js:4:1 › empty states offer zero, one, or two actions with readable content (5.9s)
  ✘  17 [mobile-dark] › tests\e2e\row.spec.js:4:1 › rows respond to their container and preserve keyboard actions (5.8s)


  1) [desktop-light] › tests\e2e\empty-state.spec.js:4:1 › empty states offer zero, one, or two actions with readable content 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('#empty-state .empty-state')
    Expected: 3
    Received: 0
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" locator('#empty-state .empty-state') with timeout 5000ms
      - waiting for locator('#empty-state .empty-state')
        14 × locator resolved to 0 elements
[... 191 lines omitted ...]
        at C:\Dev-Projects\support.webapp\.plan\work\T0016-extract-the-empty-state-row-base-collapsible-and\tests\e2e\row.spec.js:9:23

    Error Context: test-results\row-rows-respond-to-their--aad3f-d-preserve-keyboard-actions-mobile-dark\error-context.md

  8 failed
    [desktop-light] › tests\e2e\empty-state.spec.js:4:1 › empty states offer zero, one, or two actions with readable content 
    [desktop-light] › tests\e2e\row.spec.js:4:1 › rows respond to their container and preserve keyboard actions 
    [desktop-dark] › tests\e2e\empty-state.spec.js:4:1 › empty states offer zero, one, or two actions with readable content 
    [desktop-dark] › tests\e2e\row.spec.js:4:1 › rows respond to their container and preserve keyboard actions 
    [mobile-light] › tests\e2e\empty-state.spec.js:4:1 › empty states offer zero, one, or two actions with readable content 
    [mobile-light] › tests\e2e\row.spec.js:4:1 › rows respond to their container and preserve keyboard actions 
    [mobile-dark] › tests\e2e\empty-state.spec.js:4:1 › empty states offer zero, one, or two actions with readable content 
    [mobile-dark] › tests\e2e\row.spec.js:4:1 › rows respond to their container and preserve keyboard actions 
  12 passed (24.6s)
```

Command: `python scripts/devops.py check`

Exit code: 0. Verbatim excerpts follow, including fast tests, browser checks, integration tests, and package validation.

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 83332
All 22 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 77832
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 27600
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 20672
> @gpellicciotta/support.webapp@0.1.0-pre lint
> eslint .
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m pytest
Process ID: 69360
============================= test session starts =============================
platform win32 -- Python 3.12.8, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0016-extract-the-empty-state-row-base-collapsible-and
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [3 items]
...                                                                      [100%]
============================== 3 passed in 1.53s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 9472
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0016-extract-the-empty-state-row-base-collapsible-and
 Test Files  7 passed (7)
      Tests  552 passed (552)
   Start at  14:30:31
   Duration  670ms (import 44%, tests 38%, transform 10%, worker 8%)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
```

```text
[... 234 lines omitted ...]
  156 passed (45.6s)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 84868
> @gpellicciotta/support.webapp@0.1.0-pre test:integration
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0016-extract-the-empty-state-row-base-collapsible-and
 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  14:31:20
   Duration  4.05s (tests 98%, import 1%, transform 1%)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 78360
> @gpellicciotta/support.webapp@0.1.0-pre prepack
> node bin/manifest.mjs
> @gpellicciotta/support.webapp@0.1.0-pre postpack
> node bin/manifest.mjs --remove
```

```text
[... 26 lines omitted ...]
npm notice 2.1kB src/js/i18n.js
npm notice 3.0kB src/js/icon.js
npm notice 447B src/looks/neutral/fonts.css
npm notice 352.2kB src/looks/neutral/fonts/InterVariable.woff2
npm notice 4.4kB src/looks/neutral/fonts/OFL.txt
npm notice 5.8kB src/looks/neutral/icons.svg
npm notice 184B src/looks/neutral/index.css
npm notice 4.9kB src/looks/neutral/look.css
npm notice 1.3kB src/looks/neutral/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 375.5 kB
npm notice unpacked size: 440.9 kB
npm notice shasum: 5d4e26dbb52232007602e36a3c4cae037d36cf7e
npm notice integrity: sha512-iC7b2gtd8lEvh[...]6pG65kMkMxCDw==
npm notice total files: 32
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```

## Visual Verification
Task completion validation: `plan tasks validate T0016 --completion`, exit code 0.

```text
All 1 task file passed validation.
```

Inspected both components in light and dark themes at 390 and 1440 px.
The gallery returned HTTP 200; the verifier found no loading, console, contrast, focus, target, or overflow failures.
Narrow rows retain visible actions below wrapping content.
The two-action limit is an authoring contract, checked across the three gallery specimens.

- light, 390px: [before](before-light-390.png), [empty state](after-empty-state-light-390.png), [row](after-row-light-390.png).
- dark, 390px: [before](before-dark-390.png), [empty state](after-empty-state-dark-390.png), [row](after-row-dark-390.png).
- light, 1440px: [before](before-light-1440.png), [empty state](after-empty-state-light-1440.png), [row](after-row-light-1440.png).
- dark, 1440px: [before](before-dark-1440.png), [empty state](after-empty-state-dark-1440.png), [row](after-row-dark-1440.png).
