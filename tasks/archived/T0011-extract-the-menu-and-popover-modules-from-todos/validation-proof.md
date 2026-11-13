## Walkthrough & Validation
Source: todos.webapp at commit `0cf4981`, files `src/js/ui/menu.js`, `src/js/ui/popover.js`, `src/css/controls.css`, and `tests/unit/menu.test.js`.

### Failing tests before implementation
Command: `npx vitest run tests/unit/menu.test.js tests/unit/popover.test.js`, exit code 1.
```text
 RUN  v5.1.0 {{project-root}}
 ❯ tests/unit/popover.test.js (0 test)
 ❯ tests/unit/menu.test.js (0 test)
⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  tests/unit/menu.test.js [ tests/unit/menu.test.js ]
Error: Failed to resolve import "../../src/js/menu.js" from "tests/unit/menu.test.js". Does the file exist?
  Plugin: vite:import-analysis
[... 14 lines omitted ...]
 FAIL  tests/unit/popover.test.js [ tests/unit/popover.test.js ]
Error: Failed to resolve import "../../src/js/anchor.js" from "tests/unit/popover.test.js". Does the file exist?
[... 14 lines omitted ...]
 Test Files  2 failed (2)
      Tests  no tests
```

Command: `npx playwright test tests/e2e/menu.spec.js tests/e2e/popover.spec.js --reporter=line`, exit code 1.
```text
  1) [desktop-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
    Error: locator.scrollIntoViewIfNeeded: Test timeout of 120000ms exceeded.
[... 66 lines omitted ...]
  8 failed
    [desktop-light] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
    [desktop-light] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring
    [desktop-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
    [desktop-dark] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring
    [mobile-light] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
    [mobile-light] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring
    [mobile-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
    [mobile-dark] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring
```

### Passing tests after implementation
Command: `npx vitest run tests/unit/menu.test.js tests/unit/popover.test.js`, exit code 0.
```text
 RUN  v5.1.0 {{project-root}}
 Test Files  2 passed (2)
      Tests  32 passed (32)
```

Completion check: `MENU_EVIDENCE={{companion-dir}} npx playwright test tests/e2e/menu.spec.js tests/e2e/popover.spec.js`, exit code 0.
```text
Running 8 tests using 4 workers
  ok 1 [desktop-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring (2.7s)
  ok 4 [desktop-light] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring (2.7s)
  ok 2 [desktop-dark] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring (2.9s)
  ok 3 [desktop-light] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring (2.8s)
  ok 5 [mobile-light] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring (2.4s)
  ok 6 [mobile-light] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring (2.6s)
  ok 7 [mobile-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring (2.5s)
  ok 8 [mobile-dark] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring (2.5s)
  8 passed (8.7s)
```

Full suite with the verifier: `python scripts/devops.py check`, exit code 0 (summary lines).
```text
Command: lint-markdown check --offline
All 25 markdown files passed linting.
Command: python -m ruff check scripts tests
All checks passed!
Command: python -m ruff format --check scripts tests
4 files already formatted
Command: npm run lint
Command: python -m pytest
============================== 3 passed in 1.80s ==============================
Command: npm test
 Test Files  18 passed (18)
      Tests  1975 passed (1975)
Command: npm run test:slow
  252 passed (1.8m)
Command: npm run test:integration
 Test Files  2 passed (2)
      Tests  4 passed (4)
Command: npm pack --dry-run
npm notice total files: 79
```

### Screenshots
Each look at 390 and 1440 px, light and dark, with the menu or popover open:
- Menu: [neutral mobile light](after-menu-neutral-mobile-light.png), [neutral desktop dark](after-menu-neutral-desktop-dark.png), [warm mobile dark](after-menu-warm-mobile-dark.png), [bright desktop light](after-menu-bright-desktop-light.png).
- Popover: [warm desktop dark](after-popover-warm-desktop-dark.png), [bright mobile dark](after-popover-bright-mobile-dark.png), [neutral desktop light](after-popover-neutral-desktop-light.png).
- The other files name the component, look, and browser project, for all 24 combinations.

### Key changes
- `anchorPanel` moved from `popover.js` to `anchor.js`; `popover.js` imports `tabbableIn` from `focus.js`.
- todos tokens mapped to contract tokens: hover and active grounds to `--color-surface-hover` and `--color-surface-active`.
- `--color-signal` became `--color-primary`, `--icon-size` became `--icon-md`, and `--width-editor` became `--width-side-panel`.
- `--radius-lg` and `--radius-md` became the `--radius-card` and `--radius-control` roles.

## Review Round 1 Rework
### Failing topmost assertion before the gallery fix
`expectOnTop` checks `document.elementFromPoint` at the center of the menu's Delete item and the popover's Clear button.
Command: `npx playwright test tests/e2e/menu.spec.js tests/e2e/popover.spec.js --reporter=line`, exit code 1.
```text
Running 8 tests using 4 workers
  1) [desktop-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
    Error: covered by another element
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
       at gallery-helpers.js:164
    > 164 |     expect(hit, 'covered by another element').toBe(true);
[... 22 lines omitted ...]
  2 failed
    [desktop-light] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
    [desktop-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
  6 passed (8.1s)
```

### Passing after the gallery fix
Completion check: `MENU_EVIDENCE={{companion-dir}} npx playwright test tests/e2e/menu.spec.js tests/e2e/popover.spec.js`, exit code 0.
```text
Running 8 tests using 4 workers
  ok 1 [desktop-light] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring (2.5s)
  ok 2 [desktop-light] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring (2.6s)
  ok 3 [desktop-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring (2.6s)
  ok 4 [desktop-dark] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring (2.6s)
  ok 5 [mobile-light] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring (2.2s)
  ok 6 [mobile-light] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring (2.4s)
  ok 7 [mobile-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring (2.2s)
  ok 8 [mobile-dark] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring (2.3s)
  8 passed (8.0s)
```

Full suite with the verifier: `python scripts/devops.py check`, exit code 0 (summary lines).
```text
All 25 markdown files passed linting.
All checks passed!
4 files already formatted
============================== 3 passed in 1.90s ==============================
 Test Files  18 passed (18)
      Tests  1975 passed (1975)
  252 passed (1.7m)
 Test Files  2 passed (2)
      Tests  4 passed (4)
npm notice total files: 79
```

### Screenshot inspection
All 24 after screenshots were recaptured and inspected one by one.
- Every open menu and popover paints above the static specimens and the avatars below.
- Static menu specimens keep their natural item height at 1440 px.
- Near the viewport bottom, the working menu and popover flip above their trigger, as designed.
- Fixed example: [bright desktop light](after-menu-bright-desktop-light.png) now shows Move down and Delete above the popover specimen.
