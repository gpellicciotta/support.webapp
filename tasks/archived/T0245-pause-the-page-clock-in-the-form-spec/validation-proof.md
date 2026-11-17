## Walkthrough & Validation

### Changes
- `openPausedGallery` installs the page clock, opens the gallery, and pauses 60 s ahead.
- The async check and valid submit tests assert each busy state, then advance the clock with `page.clock.runFor`.
- The edit and submit-time check tests use the same helper instead of their own pause code.

### Red: a 1.5 s stall before the transient assertions fails the old tests
A temporary `await page.waitForTimeout(1_500)` went after the blur and after the Save click.

```text
$ npx playwright test tests/e2e/form.spec.js --project desktop-light -g "async check shows|valid submit"
exit 1
  1) [desktop-light] › tests\e2e\form.spec.js:39:1 › an async check shows the pending state, then its error
    Error: expect(locator).toHaveAttribute(expected) failed
    Locator:  locator('#form form[data-form]').locator('.field:has(#form-name)')
    Expected: "true"
    Received: ""
    Timeout:  5000ms
      45 |     await page.waitForTimeout(1_500); // TEMP stall
    > 46 |     await expect(field).toHaveAttribute('aria-busy', 'true');
  2) [desktop-light] › tests\e2e\form.spec.js:56:1 › a valid submit sets the busy state, then confirms the save
    Error: expect(locator).toHaveAttribute(expected) failed
    Locator:  locator('#form form[data-form]')
    Expected: "true"
    Received: ""
    Timeout:  5000ms
      63 |     await page.waitForTimeout(1_500); // TEMP stall
    > 64 |     await expect(form).toHaveAttribute('aria-busy', 'true');
  2 failed
```

### Green: the paused tests pass with the same stalls, in all four projects
Stalls went after both blurs, after the Save click, and after the busy message.

```text
$ npx playwright test tests/e2e/form.spec.js --reporter=line
exit 0
Running 28 tests using 4 workers
[... 28 progress lines omitted ...]
  28 passed (34.0s)
```

### Green without stalls: ten repeats in all four projects
The stalls were removed before this run.

```text
$ npx playwright test tests/e2e/form.spec.js --repeat-each 10 --reporter=dot
exit 0
················································································
················································································
················································································
········································
  280 passed (3.0m)
```

### Full project check
Tool paths are shortened to command names; process IDs and per-file lines are omitted.

```text
$ python scripts/devops.py check
exit 0
Command: lint-markdown check --offline
All 27 markdown files passed linting.
Command: python -m ruff check scripts tests
All checks passed!
Command: python -m ruff format --check scripts tests
8 files already formatted
Command: npm run lint
> eslint .
Command: python -m pytest
======================= 56 passed, 1 skipped in 30.91s ========================
Command: npm test
 Test Files  34 passed (34)
      Tests  2184 passed (2184)
Command: npm run test:slow
Running 872 tests using 4 workers
[... 1093 progress lines omitted ...]
  42 skipped
  830 passed (11.4m)
Command: npm run test:integration
 Test Files  3 passed (3)
      Tests  7 passed (7)
Command: npm pack --dry-run
[... 125 pack listing lines omitted ...]
gpellicciotta-support.webapp-0.2.2-pre.tgz
```
