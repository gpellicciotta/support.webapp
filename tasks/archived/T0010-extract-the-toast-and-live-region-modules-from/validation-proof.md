## Walkthrough & Validation
Source: todos.webapp at commit `0cf4981`, files `src/js/ui/toast.js`, `src/js/ui/live-region.js`, `src/css/controls.css`, `tests/unit/toast.test.js`, and `tests/unit/live-region.test.js`.

### Failing tests before implementation
Command: `npx vitest run tests/unit/toast.test.js tests/unit/live-region.test.js`, exit code 1.
```text
 RUN  v5.1.0 {{project-root}}
⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  tests/unit/live-region.test.js [ tests/unit/live-region.test.js ]
Error: Failed to resolve import "../../src/js/live-region.js" from "tests/unit/live-region.test.js". Does the file exist?
  Plugin: vite:import-analysis
[... 8 lines omitted ...]
 FAIL  tests/unit/toast.test.js [ tests/unit/toast.test.js ]
Error: Failed to resolve import "../../src/js/toast.js" from "tests/unit/toast.test.js". Does the file exist?
  Plugin: vite:import-analysis
[... 8 lines omitted ...]
 Test Files  2 failed (2)
      Tests  no tests
```

Command: `npx playwright test tests/e2e/toast.spec.js --reporter=line --timeout=20000`, exit code 1.
```text
Running 4 tests using 4 workers
[... 100 lines omitted ...]
    Error: element(s) not found

    Call log:
      - Expect "toHaveAttribute" locator('#toast-demo-region') with timeout 5000ms
      - waiting for locator('#toast-demo-region')

    > 30 |     await expect(region).toHaveAttribute('role', 'region');
[... 6 lines omitted ...]
  4 failed
    [desktop-light] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding
    [desktop-dark] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding
    [mobile-light] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding
    [mobile-dark] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding
```

### Passing tests after implementation
Command: `npx vitest run tests/unit/toast.test.js tests/unit/live-region.test.js`, exit code 0.
```text
 RUN  v5.1.0 {{project-root}}

 Test Files  2 passed (2)
      Tests  31 passed (31)
```

Command: `npx playwright test tests/e2e/toast.spec.js --reporter=line` (the completion check), exit code 0.
```text
Running 4 tests using 4 workers
[1/4] [desktop-light] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding
[2/4] [desktop-dark] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding
[3/4] [mobile-light] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding
[4/4] [mobile-dark] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding
  4 passed (3.7s)
```

### Full check with the verifier
The first run failed: `tokens.test.js` rejected `.toast-region` and the `.button` and `.icon-button` blocks in `toast.css`.
The partial now uses `:has(> button)`, and the test lists `toast-region` as the toast companion block, as for `avatar-stack`.
The second run failed: `field.spec.js` matched two polite regions, so it now targets `.field__live`.

Command: `python scripts/devops.py check`, exit code 0 (lines filtered to commands and results).
```text
Command: lint-markdown check --offline
All 25 markdown files passed linting.
Command: python -m ruff check scripts tests
All checks passed!
Command: python -m ruff format --check scripts tests
Command: npm run lint
Command: python -m pytest
============================== 3 passed in 1.58s ==============================
Command: npm test
 Test Files  20 passed (20)
      Tests  2009 passed (2009)
Command: npm run test:slow
  ok  56 [desktop-light] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding (1.6s)
  ok 120 [desktop-dark] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding (1.5s)
  ok 184 [mobile-light] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding (1.5s)
  ok 248 [mobile-dark] › tests\e2e\toast.spec.js:21:1 › toast Undo, Ctrl+Z, expiry, and modal holding (1.6s)
  256 passed (1.7m)
Command: npm run test:integration
 Test Files  2 passed (2)
      Tests  4 passed (4)
Command: npm pack --dry-run
```

### Screenshots
`TOAST_EVIDENCE` set to this directory made `toast.spec.js` capture the toast section with two raised toasts.
The gallery had no toast section before, so the before shots show popover followed directly by avatar.
A scratchpad Playwright script captured them from the unchanged main checkout over `file://`, so sprite icons are absent.
Each look has one per theme and width, named after the look and the Playwright project.
- [Before, 1440 px, light](before-desktop-light.png) and [before, 390 px, dark](before-mobile-dark.png), from the unchanged gallery.
- [Neutral, 390 px, light](after-toast-neutral-mobile-light.png) and [dark](after-toast-neutral-mobile-dark.png).
- [Neutral, 1440 px, light](after-toast-neutral-desktop-light.png) and [dark](after-toast-neutral-desktop-dark.png).
- [Warm, 390 px, light](after-toast-warm-mobile-light.png) and [dark](after-toast-warm-mobile-dark.png).
- [Warm, 1440 px, light](after-toast-warm-desktop-light.png) and [dark](after-toast-warm-desktop-dark.png).
- [Bright, 390 px, light](after-toast-bright-mobile-light.png) and [dark](after-toast-bright-mobile-dark.png).
- [Bright, 1440 px, light](after-toast-bright-desktop-light.png) and [dark](after-toast-bright-desktop-dark.png).
