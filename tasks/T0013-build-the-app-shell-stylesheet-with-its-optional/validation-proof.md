## Walkthrough & Validation

### Failing tests before the implementation
Command: `npx playwright test tests/e2e/shell.spec.js --reporter=line`, exit code 1.
All 100 tests failed: the demo pages, `shell.css`, and the gallery links did not exist yet.

```text
  1) [desktop-light] › tests\e2e\shell.spec.js:72:9 › todos shell demo › renders its areas and drops the absent ones

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 404

  22) [desktop-light] › tests\e2e\shell.spec.js:234:1 › only shell.css sets fixed or sticky positions and pads bars with safe-area insets

    Error: expect(received).toEqual(expected) // deep equality

    - Array []
    + Array [
    +   "{{worktree}}\\src\\css\\components\\toast.css",
    + ]

  25) [desktop-light] › tests\e2e\shell.spec.js:224:1 › the gallery links to every shell demo page

    Error: todos
    Expected: 1
    Received: 0
[... 97 failure reports omitted ...]
  100 failed
```

### Shell tests after the implementation
Command: `npx playwright test tests/e2e/shell.spec.js --reporter=line`, exit code 0.

```text
[... 99 progress lines omitted ...]
[100/100] [mobile-dark] › tests\e2e\shell.spec.js:234:1 › only shell.css sets fixed or sticky positions and pads bars with safe-area insets
  100 passed (26.0s)
```

### Verifier on the gallery and the four shell demo pages
The first verifier run failed 7 of 108 tests on bright yellow, such as:

```text
    + Array [
    +   "button.button 'Add a counter': contrast 4.34 < 4.5",
    + ]
```

Root cause: short pages reached the contrast checks while button color transitions still ran.
The verifier now waits for every CSS transition to finish before collecting.

### Full check
Command: `python scripts/devops.py check`, exit code 0.

```text
Command: {{python-scripts}}/lint-markdown.EXE check --offline
All 25 markdown files passed linting.
Command: {{python}} -m ruff check scripts tests
All checks passed!
[... 3 lines omitted ...]
============================== 3 passed in 1.98s ==============================
Command: "{{nodejs}}/npm.CMD" test
[... 3 lines omitted ...]
 Test Files  20 passed (20)
      Tests  2013 passed (2013)
[... 718 lines omitted ...]
[bright light 390px] 32 stylesheets, 17 texts, 13 targets, 13 focus records, 2 sprite references, overflow 0px, errors 0
  ok 449 [mobile-dark] › tests\e2e\verify-ui.spec.js:323:9 › shell-family-portal passes every verifier check in the bright look red (2.2s)
  ok 452 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (2.6s)
  452 passed (3.0m)
Command: "{{nodejs}}/npm.CMD" run test:integration
[... 3 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 30 npm pack lines omitted ...]
```

### Visual check
The verifier captured each demo page per theme at 390 and 1440 px, in the neutral look with the system theme.
Before the change these pages did not exist (HTTP 404 in the failing run), so no before captures apply.
Inspected captures show the expected areas, the sticky bars, the bottom bar at 390 px, and the narrow meteo column.

| Page          | Light 390                                                            | Dark 390                                                            | Light 1440                                                             | Dark 1440                                                             |
| :------------ | :------------------------------------------------------------------- | :------------------------------------------------------------------ | :--------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| todos         | [png](screenshots/shell-todos-neutral-light-390-system.png)          | [png](screenshots/shell-todos-neutral-dark-390-system.png)          | [png](screenshots/shell-todos-neutral-light-1440-system.png)           | [png](screenshots/shell-todos-neutral-dark-1440-system.png)           |
| counters      | [png](screenshots/shell-counters-neutral-light-390-system.png)       | [png](screenshots/shell-counters-neutral-dark-390-system.png)       | [png](screenshots/shell-counters-neutral-light-1440-system.png)        | [png](screenshots/shell-counters-neutral-dark-1440-system.png)        |
| meteo         | [png](screenshots/shell-meteo-neutral-light-390-system.png)          | [png](screenshots/shell-meteo-neutral-dark-390-system.png)          | [png](screenshots/shell-meteo-neutral-light-1440-system.png)           | [png](screenshots/shell-meteo-neutral-dark-1440-system.png)           |
| family-portal | [png](screenshots/shell-family-portal-neutral-light-390-system.png)  | [png](screenshots/shell-family-portal-neutral-dark-390-system.png)  | [png](screenshots/shell-family-portal-neutral-light-1440-system.png)   | [png](screenshots/shell-family-portal-neutral-dark-1440-system.png)   |

Gallery bottom at 1440 px, light theme: [before](screenshots/gallery-before.png) and [after](screenshots/gallery-after.png) the App shell section.

## Review Round 1 Rework

### Failing tests before the fixes
Command: `npx playwright test tests/e2e/shell.spec.js -g "full viewport height|sample menu|both sides" --reporter=line`, exit code 1.

```text
  1) [desktop-light] › tests\e2e\shell.spec.js:257:1 › the action bar pads both sides with their own safe-area insets
    Error: expect(received).toContain(expected) // indexOf
    Received has value: undefined
  2) [desktop-light] › tests\e2e\shell.spec.js:224:1 › the page scroll mode keeps the sidebar and side panel at the full viewport height on wide screens
    Error: sidebar
    Expected: 900
    Received: 140
    Expected precision:    0
    Expected difference: < 0.5
    Received difference:   760
[... 3 similar failure reports omitted ...]
  6) [desktop-light] › tests\e2e\shell.spec.js:242:1 › the counters menu button opens its sample menu
    Error: expect(locator).toHaveAttribute(expected) failed
    Expected: "true"
    Received: "false"
[... 4 similar failure reports omitted ...]
  10 failed
  2 skipped
```

The 2 skipped runs are the viewport-height check at 390 px, where the wide layout does not apply.

### Shell tests after the fixes
Command: `npx playwright test tests/e2e/shell.spec.js --reporter=line`, exit code 0.

```text
[... 110 progress lines omitted ...]
[111/112] [mobile-dark] › tests\e2e\shell.spec.js:268:1 › the gallery links to every shell demo page
[112/112] [mobile-dark] › tests\e2e\shell.spec.js:278:1 › only shell.css sets fixed or sticky positions and pads bars with safe-area insets
  2 skipped
  110 passed (55.9s)
```

### Full check after the fixes
Command: `python scripts/devops.py check`, exit code 0.

```text
All 25 markdown files passed linting.
All checks passed!
[... 21 lines omitted ...]
============================== 3 passed in 4.25s ==============================
[... 5 lines omitted ...]
 Test Files  20 passed (20)
      Tests  2013 passed (2013)
[... 737 lines omitted ...]
  ok 461 [mobile-dark] › tests\e2e\verify-ui.spec.js:323:9 › shell-family-portal passes every verifier check in the bright look red (2.4s)
  ok 464 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (2.1s)
  2 skipped
  462 passed (3.4m)
[... 5 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 30 npm pack lines omitted ...]
```
