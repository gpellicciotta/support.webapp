## Walkthrough & Validation

### Red phase
`npx vitest run tests/unit/field.test.js tests/unit/form.test.js`, exit code 1:

```text
 RUN  v5.1.0 {{project-root}}/.plan/work/T0008-extract-the-field-checkbox-and-radio-components-with

 ❯ tests/unit/form.test.js (0 test)
 ❯ tests/unit/field.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/field.test.js [ tests/unit/field.test.js ]
Error: Cannot find module '../../src/js/field.js' imported from {{project-root}}/.plan/work/T0008-extract-the-field-checkbox-and-radio-components-with/tests/unit/field.test.js
 ❯ tests/unit/field.test.js:3:1
[... 6 lines omitted ...]
 FAIL  tests/unit/form.test.js [ tests/unit/form.test.js ]
Error: Cannot find module '../../src/js/form.js' imported from {{project-root}}/.plan/work/T0008-extract-the-field-checkbox-and-radio-components-with/tests/unit/form.test.js
 ❯ tests/unit/form.test.js:3:1
[... 6 lines omitted ...]
 Test Files  2 failed (2)
      Tests  no tests
   Start at  15:29:37
   Duration  1.11s (worker 97%, environment 3%)
```

`npx playwright test tests/e2e/field.spec.js tests/e2e/form.spec.js --project desktop-light --reporter=line`, exit code 1:

```text
  1) [desktop-light] › tests\e2e\field.spec.js:7:1 › the field section shows every field state with its icon, text, and color 
    Error: expect(locator).toHaveText(expected) failed
  2) [desktop-light] › tests\e2e\field.spec.js:102:1 › field groups are fieldsets with legends, and the field sections never overflow 
  3) [desktop-light] › tests\e2e\field.spec.js:41:1 › the help toggle works by keyboard and keeps the help text described 
  4) [desktop-light] › tests\e2e\field.spec.js:60:1 › a live field announces its error on blur and clears it once fixed 
  5) [desktop-light] › tests\e2e\field.spec.js:80:1 › checkboxes and radios use the primary accent, show focus, and keep 44 px rows 
  6) [desktop-light] › tests\e2e\form.spec.js:4:1 › a failed submit by Enter fills the error summary, announces it, and focuses it 
  7) [desktop-light] › tests\e2e\form.spec.js:67:1 › the error summary section shows a filled summary with links to fields 
    Error: expect(locator).toBeVisible() failed
  8) [desktop-light] › tests\e2e\form.spec.js:37:1 › an async check shows the pending state, then its error 
  9) [desktop-light] › tests\e2e\form.spec.js:23:1 › each summary link moves focus to its field ────
  10) [desktop-light] › tests\e2e\form.spec.js:53:1 › a valid submit sets the busy state, then confirms the save 
  10 failed
```

### Green phase
Completion check: `npx vitest run tests/unit/field.test.js tests/unit/form.test.js`, exit code 0:

```text
 RUN  v5.1.0 {{project-root}}/.plan/work/T0008-extract-the-field-checkbox-and-radio-components-with


 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  15:47:48
   Duration  1.31s (import 81%, tests 17%, transform 1%, worker 1%)
```

`npx playwright test tests/e2e/field.spec.js tests/e2e/form.spec.js tests/e2e/verify-ui.spec.js tests/e2e/warm.spec.js --reporter=list`, exit code 0.
The four projects cover 390 and 1440 px in light and dark; the verifier also switches the explicit theme.

```text
[neutral dark 1440px] 27 stylesheets, 652 texts, 140 targets, 140 focus records, 98 sprite references, overflow 0px, errors 0
[neutral dark 390px] 27 stylesheets, 652 texts, 140 targets, 140 focus records, 98 sprite references, overflow 0px, errors 0
[neutral light 1440px] 27 stylesheets, 652 texts, 140 targets, 140 focus records, 98 sprite references, overflow 0px, errors 0
[neutral light 390px] 27 stylesheets, 652 texts, 140 targets, 140 focus records, 98 sprite references, overflow 0px, errors 0
[warm dark 1440px] 27 stylesheets, 653 texts, 141 targets, 141 focus records, 98 sprite references, overflow 0px, errors 0
[warm dark 390px] 27 stylesheets, 653 texts, 141 targets, 141 focus records, 98 sprite references, overflow 0px, errors 0
[warm light 1440px] 27 stylesheets, 653 texts, 141 targets, 141 focus records, 98 sprite references, overflow 0px, errors 0
[warm light 390px] 27 stylesheets, 653 texts, 141 targets, 141 focus records, 98 sprite references, overflow 0px, errors 0
[... 52 lines omitted ...]
  ✓  60 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (1.8s)
[warm light 390px] 27 stylesheets, 653 texts, 141 targets, 141 focus records, 98 sprite references, overflow 0px, errors 0
  ✓  57 [mobile-dark] › tests\e2e\verify-ui.spec.js:321:9 › gallery passes every verifier check in the warm look (4.1s)

  60 passed (33.4s)
```

Full suite: `python scripts/devops.py check`, exit code 0:

```text
All 24 markdown files passed linting.
All checks passed!
============================== 3 passed in 4.31s ==============================
 Test Files  13 passed (13)
      Tests  1497 passed (1497)
[... 236 lines omitted ...]
  212 passed (1.2m)
[... 5 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
```

The first full check failed on two causes, both fixed before the run above:
- The verifier focused radios in a disabled fieldset; it now skips `:disabled` controls.
- The mobile-light warm season check read the accent before the warm stylesheet applied; it now polls.

### Visual verification
Before and after captures of the gallery region where the sections are inserted, per theme and width:
- Before: [light 1440](before-light-1440.png), [dark 1440](before-dark-1440.png), [light 390](before-light-390.png), [dark 390](before-dark-390.png).
- After: [light 1440](after-light-1440.png), [dark 1440](after-dark-1440.png), [light 390](after-light-390.png), [dark 390](after-dark-390.png).
- The capture failed on console errors, page errors, and HTTP 400 or higher; none occurred.
- The first after capture showed the hidden form confirmation banner; `banner.css` now honors `hidden`, and `form.spec.js` checks it.

### Review round 1 rework: red phase
`npx vitest run tests/unit/field.test.js tests/unit/form.test.js`, exit code 1, before any production change:

```text
     × D2: a created field shows the pending and valid states in its status line 15ms
     × D3: an edit during a pending check discards the old result and checks the current value 9ms
     × D3: an edit after a passing check drops the stale valid status 4ms
     × D1: a second submit during async validation never sends twice 25ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  tests/unit/field.test.js > review round 1 regressions > D2: a created field shows the pending and valid states in its status line
AssertionError: expected null not to be null // Object.is equality
 FAIL  tests/unit/field.test.js > review round 1 regressions > D3: an edit during a pending check discards the old result and checks the current value
AssertionError: expected true to be false // Object.is equality
 FAIL  tests/unit/field.test.js > review round 1 regressions > D3: an edit after a passing check drops the stale valid status
AssertionError: expected false to be true // Object.is equality
 FAIL  tests/unit/form.test.js > review round 1 regressions > D1: a second submit during async validation never sends twice
AssertionError: expected true to be false // Object.is equality
 Test Files  2 failed (2)
      Tests  4 failed | 22 passed (26)
   Start at  16:03:57
```

The D1 throw-path test passes before the fix; it guards the release of the new submit guard.

### Review round 1 rework: green phase
`npx vitest run tests/unit/field.test.js tests/unit/form.test.js`, exit code 0:

```text
 RUN  v5.1.0 {{project-root}}/.plan/work/T0008-extract-the-field-checkbox-and-radio-components-with


 Test Files  2 passed (2)
      Tests  26 passed (26)
   Start at  16:07:46
   Duration  1.34s (import 74%, tests 24%, transform 1%, worker 1%)
```

`npx playwright test tests/e2e/form.spec.js tests/e2e/field.spec.js --reporter=line`, exit code 0:

```text
[43/44] [mobile-dark] › tests\e2e\form.spec.js:68:1 › the error summary section shows a filled summary with links to fields
[44/44] [mobile-dark] › tests\e2e\form.spec.js:79:1 › an edit during a pending check discards the old result and checks the new value
  44 passed (22.9s)
```

Full suite with Ruff available: `{{plan-venv}}/Scripts/python.exe scripts/devops.py check`, exit code 0.
The default `python` on this machine now lacks Ruff, as the reviewer saw; the plan venv interpreter has it.

```text
Command: {{plan-venv}}\Scripts\lint-markdown.EXE check --offline
All 24 markdown files passed linting.
Command: {{plan-venv}}\Scripts\python.exe -m ruff check scripts tests
All checks passed!
============================== 3 passed in 2.67s ==============================
 Test Files  13 passed (13)
      Tests  1502 passed (1502)
[... 307 lines omitted ...]
  216 passed (1.3m)
[... 5 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
```
