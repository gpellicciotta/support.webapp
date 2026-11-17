## Walkthrough & Validation

### Red: the old test fails when the edit comes late
A temporary `await page.waitForTimeout(700)` between `press('End')` and `press('s')` simulated full-suite load.

Command: `npx playwright test tests/e2e/form.spec.js -g "an edit during a pending check" --project desktop-light --reporter=line`
Exit code: 1

```text
  1) [desktop-light] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value

    Error: expect(locator).toBeHidden() failed

    Locator:  locator('#form form[data-form]').locator('.field:has(#form-name)').locator('.field__status')
    Expected: hidden
    Received: visible
    Timeout:  5000ms

    Call log:
      - Expect "toBeHidden" locator('#form form[data-form]').locator('.field:has(#form-name)').locator('.field__status') with timeout 5000ms
      - waiting for locator('#form form[data-form]').locator('.field:has(#form-name)').locator('.field__status')
        14 × locator resolved to <p class="field__status" id="form-name-status">…</p>
           - unexpected value "visible"

      93 |     await name.press('s');
      94 |     await expect(field).not.toHaveAttribute('aria-busy', 'true');
    > 95 |     await expect(field.locator('.field__status')).toBeHidden();
         |                                                   ^

  1 failed
    [desktop-light] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value
```

### Green: the paused-clock test passes with the same injected delay
Command: `npx playwright test tests/e2e/form.spec.js -g "an edit during a pending check" --reporter=line`
Exit code: 0

```text
Running 4 tests using 4 workers

[1/4] [mobile-light] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value
[2/4] [desktop-dark] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value
[3/4] [desktop-light] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value
[4/4] [mobile-dark] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value
  4 passed (15.6s)
```

### Stress: 200 runs at 12 workers after removing the injected delay
Command: `npx playwright test tests/e2e/form.spec.js -g "an edit during a pending check" --repeat-each 50 --workers 12 --reporter=dot`
Exit code: 0

```text
Running 200 tests using 12 workers
················································································
················································································
········································
  200 passed (5.7m)
```

### Full check
Command: `python scripts/devops.py check`
Exit code: 1, only from the integration suite, which could not find `@stylistic/eslint-plugin`.
The worktree had no `node_modules`, so the generated apps' junction pointed at a cache-only directory.

```text
All 27 markdown files passed linting.
All checks passed!
8 files already formatted
======================== 56 passed, 1 skipped in 5.43s ========================
 Test Files  33 passed (33)
      Tests  2163 passed (2163)
  ✓   62 [desktop-light] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value (1.4s)
  ✓  264 [desktop-dark] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value (3.5s)
  ✓  466 [mobile-light] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value (1.0s)
  ✓  668 [mobile-dark] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value (1.1s)
  32 skipped
  776 passed (6.7m)
 ❯ tests/integration/generate-app.test.js (3 tests | 3 failed) 9008ms
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@stylistic/eslint-plugin' imported from C:\Users\giova\AppData\Local\Temp\design-generate-ZPtobM\sample-neutral\eslint.config.js
 Test Files  1 failed | 2 passed (3)
      Tests  3 failed | 4 passed (7)
**[ERROR]** Finished devops check in 472.1s with status: failed
```

### Integration rerun with the main checkout's `node_modules`
A temporary junction pointed the worktree's `node_modules` at the main checkout's; it was removed afterwards.

Command: `npm run test:integration`
Exit code: 0

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0242-fix-the-form-spec-s-pending-check-edit

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  16:08:28
   Duration  52.69s (tests 100%)
```

### Lint of the changed spec
Command: `npx eslint tests/e2e/form.spec.js`
Exit code: 0 (no output)
