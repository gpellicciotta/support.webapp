# Validation proof

## Walkthrough & Validation

Command: `python scripts/devops.py check 2>&1 | Tee-Object -FilePath C:/Dev-Projects/support.webapp/.plan/tasks/T0034-add-the-link-button-component-from-family-portal/check-output.txt; exit $LASTEXITCODE` (exit 0).

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 84084
All 22 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 9668
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 15828
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 84856
[... 2 lines omitted ...]
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m pytest
Process ID: 70476
[... 12 lines omitted ...]
============================== 3 passed in 2.64s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 78560
[... 3 lines omitted ...]
 Test Files  7 passed (7)
      Tests  546 passed (546)
[... 2 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 2956
[... 61 lines omitted ...]
[neutral system 1440px] 16 stylesheets, 521 texts, 89 targets, 89 focus records, 64 sprite references, overflow 0px, errors 0
[... 10 lines omitted ...]
[neutral dark 1440px] 16 stylesheets, 521 texts, 89 targets, 89 focus records, 64 sprite references, overflow 0px, errors 0
[... 39 lines omitted ...]
[neutral system 1440px] 16 stylesheets, 521 texts, 89 targets, 89 focus records, 64 sprite references, overflow 0px, errors 0
[... 12 lines omitted ...]
[neutral light 1440px] 16 stylesheets, 521 texts, 89 targets, 89 focus records, 64 sprite references, overflow 0px, errors 0
[... 43 lines omitted ...]
[neutral system 390px] 16 stylesheets, 521 texts, 89 targets, 89 focus records, 64 sprite references, overflow 0px, errors 0
[... 11 lines omitted ...]
[neutral dark 390px] 16 stylesheets, 521 texts, 89 targets, 89 focus records, 64 sprite references, overflow 0px, errors 0
[... 40 lines omitted ...]
[neutral system 390px] 16 stylesheets, 521 texts, 89 targets, 89 focus records, 64 sprite references, overflow 0px, errors 0
[neutral light 390px] 16 stylesheets, 521 texts, 89 targets, 89 focus records, 64 sprite references, overflow 0px, errors 0
[... 1 lines omitted ...]
  148 passed (1.2m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 68368
[... 3 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 2 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 9384
[... 23 lines omitted ...]
npm notice 812B src/css/components/link-button.css
[... 24 lines omitted ...]
```

Complete output and process records: [check-output.txt](check-output.txt).

### Visual verification
Confirmed HTTP 200 and inspected all eight screenshots. Light and dark layouts wrap cleanly at 390 and 1440 pixels.
The browser verifier passed contrast, focus, target, overflow, console, exception, stylesheet, and network checks.
Playwright managed and stopped its local servers after each run.
- desktop-light: [before](before-desktop-light.png), [after](after-desktop-light.png).
- desktop-dark: [before](before-desktop-dark.png), [after](after-desktop-dark.png).
- mobile-light: [before](before-mobile-light.png), [after](after-mobile-light.png).
- mobile-dark: [before](before-mobile-dark.png), [after](after-mobile-dark.png).


### Failing-first checks
Command: `$env:TASK_VISUAL_PHASE='before'; $env:TASK_VISUAL_DIR='C:/Dev-Projects/support.webapp/.plan/tasks/T0034-add-the-link-button-component-from-family-portal'; npx playwright test tests/e2e/task-visual.spec.js` (exit 0).

```text
[WebServer] (node:15308) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 4 tests using 4 workers

(node:87960) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:82376) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:9960) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:70796) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:87960) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:82376) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:9960) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:70796) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓  4 [mobile-dark] › tests\e2e\task-visual.spec.js:4:1 › capture task visual evidence (1.8s)
  ✓  1 [mobile-light] › tests\e2e\task-visual.spec.js:4:1 › capture task visual evidence (1.8s)
  ✓  3 [desktop-dark] › tests\e2e\task-visual.spec.js:4:1 › capture task visual evidence (1.8s)
  ✓  2 [desktop-light] › tests\e2e\task-visual.spec.js:4:1 › capture task visual evidence (1.9s)

  4 passed (3.6s)
```

Command: `npx playwright test tests/e2e/link-button.spec.js --project desktop-light -g 'show every state'` (exit 1).

```text
[WebServer] (node:78944) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 1 test using 1 worker

(node:81308) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:81308) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✘  1 [desktop-light] › tests\e2e\link-button.spec.js:4:1 › link buttons show every state with native button semantics (5.8s)


  1) [desktop-light] › tests\e2e\link-button.spec.js:4:1 › link buttons show every state with native button semantics 

    Error: expect(locator).toHaveText(expected) failed

    Locator: locator('#link-button h2')
    Expected: "Link button"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveText" locator('#link-button h2') with timeout 5000ms
      - waiting for locator('#link-button h2')


      4 | test('link buttons show every state with native button semantics', async ({ page }) => {
      5 |     const problems = await openGallery(page);
    > 6 |     await expect(page.locator('#link-button h2')).toHaveText('Link button');
        |                                                   ^
      7 |     for (const state of STATES) {
      8 |         await expect(page.locator(`#link-button button.link-button${state}`)).toHaveCount(1);
      9 |     }
        at C:\Dev-Projects\support.webapp\.plan\work\T0034-add-the-link-button-component-from-family-portal\tests\e2e\link-button.spec.js:6:51

    Error Context: test-results\link-button-link-buttons-s-49ee6-ith-native-button-semantics-desktop-light\error-context.md

  1 failed
    [desktop-light] › tests\e2e\link-button.spec.js:4:1 › link buttons show every state with native button semantics
```

Command: `npx vitest run tests/unit/tokens.test.js` (exit 1).

```text
[... 4 lines omitted ...]
   ❯ component partials (19)
     × ships a partial for every delivered component key 12ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/tokens.test.js > component partials > ships a partial for every delivered component key
AssertionError: expected [ 'banner', 'button', 'chip', …(3) ] to deeply equal ArrayContaining{…}

- Expected
+ Received

- ArrayContaining [
-   "icon",
+ [
+   "banner",
    "button",
-   "icon-button",
-   "link-button",
    "chip",
+   "icon-button",
+   "icon",
    "segmented",
-   "banner",
  ]

 ❯ tests/unit/tokens.test.js:267:26
    265|
    266|     it('ships a partial for every delivered component key', () => {
    267|         expect(partials).toEqual(expect.arrayContaining(['icon', 'butt…
       |                          ^
    268|     });
    269|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 460 passed (461)
   Start at  14:14:50
   Duration  511ms (tests 50%, transform 24%, import 20%, worker 6%)
```

