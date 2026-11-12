# T0023 Validation Proof

## Walkthrough & Validation
Command: `npx vitest run tests/unit/bright.test.js`; exit code: 1.
Dependencies were installed with `npm ci` before this feature failure.

```text
[... surrounding runner output omitted ...]
 FAIL  tests/unit/bright.test.js > registers bright with three bare accent variants and no downloaded fonts
AssertionError: expected [ 'neutral', 'warm' ] to include 'bright'
```

The static matrix subsequently exposed fallback parsing, yellow link hover, and dark surface contrast failures.
Fallback tests now read root declarations separately from wrapper variants.
Every accent checks the applicable contrast matrix in both themes and its explicit light fallback.

## Visual Inspection
Baseline captures preceded implementation; after captures show all three accents in both themes and viewport sizes.
The affected browser verifier passed 32 checks, including system preference and explicit theme overrides.
Visual inspection confirmed actual gallery content, rendered components, and visible yellow and red controls.
Browser checks rejected console errors, exceptions, request failures, HTTP errors, unresolved glyphs, and horizontal overflow.

- [Before mobile light](before-mobile-light.png)
- [After yellow mobile light](after-yellow-mobile-light.png)
- [Before desktop dark](before-desktop-dark.png)
- [After red desktop dark](after-red-desktop-dark.png)

## Environment
The first full check stopped because the system Python lacked Ruff.
A worktree-local virtual environment installed the declared Ruff, pytest, pytest-xdist, and pytest-timeout ranges.
No dependency manifests changed.

## Final Check
Command: `python scripts/devops.py check > bright-check.log 2>&1`; exit code: 0.

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
[... 1 lines omitted ...]
All 25 markdown files passed linting.
Command: C:\Dev-Projects\support.webapp\.plan\work\T0023-add-the-meteo-look-with-its-accent-variant\.venv\Scripts\python.exe -m ruff check scripts tests
[... 1 lines omitted ...]
All checks passed!
Command: C:\Dev-Projects\support.webapp\.plan\work\T0023-add-the-meteo-look-with-its-accent-variant\.venv\Scripts\python.exe -m ruff format --check scripts tests
[... 1 lines omitted ...]
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
[... 3 lines omitted ...]
Command: C:\Dev-Projects\support.webapp\.plan\work\T0023-add-the-meteo-look-with-its-accent-variant\.venv\Scripts\python.exe -m pytest
[... 13 lines omitted ...]
============================== 3 passed in 2.47s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
[... 4 lines omitted ...]
 Test Files  14 passed (14)
      Tests  1915 passed (1915)
[... 4 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
[... 346 lines omitted ...]
  236 passed (2.8m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
[... 4 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 2 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
[... 84 lines omitted ...]
npm notice total files: 68
[... 2 lines omitted ...]
```

Command: `$env:BRIGHT_PROOF="{{task-companion}}"; npx playwright test tests/e2e/bright.spec.js tests/e2e/verify-ui.spec.js --workers 2 > bright-browser.log 2>&1`; exit code: 0.

```text
[... 108 lines omitted ...]
  ok 32 [mobile-dark] › tests\e2e\verify-ui.spec.js:381:1 › reports unresolved sprite references (937ms)

  32 passed (1.1m)
```
