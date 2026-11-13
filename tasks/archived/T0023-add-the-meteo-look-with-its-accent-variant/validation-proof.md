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

## Review Round One Rework
Forced-fallback browser coverage reproduced the root cascade failure before the CSS change.
The expanded static fallback matrix independently reproduced yellow icon contrast below 3:1 on the active ground.

Command: `npx playwright test tests/e2e/bright.spec.js --grep 'forced fallback' --project desktop-light --workers 1`; exit code: 1.

```text
[WebServer] (node:49576) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 1 test using 1 worker

(node:40512) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:40512) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  x  1 [desktop-light] › tests\e2e\bright.spec.js:5:1 › forced fallback preserves root accents and every contrast pair (1.3s)


  1) [desktop-light] › tests\e2e\bright.spec.js:5:1 › forced fallback preserves root accents and every contrast pair 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: "rgb(184, 128, 0)"
    Received: "rgb(26, 86, 219)"

      18 |             await page.locator('#accent-select').selectOption(accent);
      19 |             const expected = { blue: 'rgb(26, 86, 219)', yellow: 'rgb(184, 128, 0)', red: 'rgb(220, 38, 38)' };
    > 20 |             expect(await tokenColor(page, '--color-primary')).toBe(expected[accent]);
         |                                                               ^
      21 |             const ratios = await page.evaluate(pairs => {
      22 |                 const probe = document.createElement('span');
      23 |                 document.body.append(probe);
        at C:\Dev-Projects\support.webapp\.plan\work\T0023-add-the-meteo-look-with-its-accent-variant\tests\e2e\bright.spec.js:20:63

    Error Context: test-results\bright-forced-fallback-pre-d8dfc-nts-and-every-contrast-pair-desktop-light\error-context.md

  1 failed
    [desktop-light] › tests\e2e\bright.spec.js:5:1 › forced fallback preserves root accents and every contrast pair 
```

Command: `npx vitest run tests/unit/tokens.test.js`; exit code: 1.

```text

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0023-add-the-meteo-look-with-its-accent-variant

 ❯ tests/unit/tokens.test.js (1784 tests | 2 failed) 314ms
   ❯ token contract (1729)
     ❯ bright (435)
       ❯ light (97)
         × yellow satisfies every applicable contrast pair and light fallback 11ms
       ❯ dark (97)
         × yellow satisfies every applicable contrast pair and light fallback 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/tokens.test.js > token contract > bright > light > yellow satisfies every applicable contrast pair and light fallback
 FAIL  tests/unit/tokens.test.js > token contract > bright > dark > yellow satisfies every applicable contrast pair and light fallback
AssertionError: fallback yellow: primary on surface-active: expected 2.7808321828079694 to be greater than or equal to 3
 ❯ tests/unit/tokens.test.js:206:224


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 1782 passed (1784)
   Start at  16:33:39
   Duration  657ms (tests 71%, import 18%, transform 10%, worker 2%)

```


## Review Rework Final Check
Command: `$env:BRIGHT_PROOF="{{task-companion}}"; python scripts/devops.py check > review-check.log 2>&1`; exit code: 0.

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
============================== 3 passed in 2.15s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
[... 4 lines omitted ...]
 Test Files  14 passed (14)
      Tests  1915 passed (1915)
[... 4 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
[... 350 lines omitted ...]
  240 passed (1.7m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
[... 4 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 2 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
[... 85 lines omitted ...]
npm notice total files: 69
[... 2 lines omitted ...]
```

The forced fallback screenshots show actual rendered controls in the documented light fallback palette.
Both explicit theme settings and every accent passed the browser contrast matrix at both widths.
Modern before/after captures remain alongside the new fallback captures.

- [Desktop fallback](fallback-desktop-light.png)
- [Mobile fallback](fallback-mobile-light.png)
