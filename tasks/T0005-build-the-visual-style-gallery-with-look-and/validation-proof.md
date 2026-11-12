# T0005 Validation Proof

## Walkthrough & Validation

### Red Phase
The new tests fail before the gallery exists, because `src/demo/gallery.js` is missing.

Command: `npx vitest run tests/unit/gallery.test.js`, exit code 1.

```text
 FAIL  tests/unit/gallery.test.js [ tests/unit/gallery.test.js ]
Error: Cannot find module '../../src/demo/gallery.js' imported from C:/Dev-Projects/support.webapp/.plan/work/T0005-build-the-visual-style-gallery-with-look-and/tests/unit/gallery.test.js
 ❯ tests/unit/gallery.test.js:3:1
      1| import { readFileSync } from 'node:fs';
      2| import { describe, expect, it } from 'vitest';
      3| import { applyLook, applyTheme, initGallery, lookHref, looks, showToke…
       | ^
      4| import { categories, readContract } from './contract.js';
      5|

 Test Files  1 failed (1)
      Tests  no tests
```

Command: `npx playwright test tests/e2e/verify-ui.spec.js --project mobile-light --reporter line`, exit code 1.

```text
Error: Cannot find module 'C:\Dev-Projects\support.webapp\.plan\work\T0005-build-the-visual-style-gallery-with-look-and\src\demo\gallery.js' imported from C:\Dev-Projects\support.webapp\.plan\work\T0005-build-the-visual-style-gallery-with-look-and\tests\e2e\verify-ui.spec.js

Error: No tests found.
Make sure that arguments are regular expressions matching test files.
You may need to escape symbols like "$" or "*" and quote the arguments.
```

### Green Phase
Command: `npx vitest run tests/unit/gallery.test.js`, exit code 0.

```text

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  11:43:55
```

Completion check: `npx playwright test tests/e2e/verify-ui.spec.js --reporter list`, exit code 0.

```text
Running 8 tests using 4 workers
  ✓  2 [desktop-light] › tests\e2e\verify-ui.spec.js:316:1 › reports injected overflow, contrast, target, and focus violations (1.6s)
  ✓  3 [desktop-dark] › tests\e2e\verify-ui.spec.js:316:1 › reports injected overflow, contrast, target, and focus violations (1.6s)
[neutral system 1440px] 9 stylesheets, 298 texts, 22 targets, 22 focus records, overflow 0px, errors 0
[neutral system 1440px] 9 stylesheets, 298 texts, 22 targets, 22 focus records, overflow 0px, errors 0
[neutral dark 1440px] 9 stylesheets, 298 texts, 22 targets, 22 focus records, overflow 0px, errors 0
  ✓  1 [desktop-light] › tests\e2e\verify-ui.spec.js:288:9 › gallery passes every verifier check in the neutral look (4.1s)
[neutral light 1440px] 9 stylesheets, 298 texts, 22 targets, 22 focus records, overflow 0px, errors 0
  ✓  4 [desktop-dark] › tests\e2e\verify-ui.spec.js:288:9 › gallery passes every verifier check in the neutral look (4.8s)
  ✓  5 [mobile-light] › tests\e2e\verify-ui.spec.js:316:1 › reports injected overflow, contrast, target, and focus violations (1.4s)
[neutral system 390px] 9 stylesheets, 298 texts, 22 targets, 22 focus records, overflow 0px, errors 0
[neutral dark 390px] 9 stylesheets, 298 texts, 22 targets, 22 focus records, overflow 0px, errors 0
  ✓  6 [mobile-light] › tests\e2e\verify-ui.spec.js:288:9 › gallery passes every verifier check in the neutral look (3.5s)
[neutral system 390px] 9 stylesheets, 298 texts, 22 targets, 22 focus records, overflow 0px, errors 0
  ✓  8 [mobile-dark] › tests\e2e\verify-ui.spec.js:316:1 › reports injected overflow, contrast, target, and focus violations (1.5s)
[neutral light 390px] 9 stylesheets, 298 texts, 22 targets, 22 focus records, overflow 0px, errors 0
  ✓  7 [mobile-dark] › tests\e2e\verify-ui.spec.js:288:9 › gallery passes every verifier check in the neutral look (3.4s)
  8 passed (19.7s)
```

Full suite: `python scripts/devops.py check`, exit code 0.
It runs lint-markdown, Ruff, ESLint, pytest, Vitest, Playwright, the pack check, and integration tests.
The block keeps the verbatim summary line of each step, in order.

```text
All 22 markdown files passed linting.
All checks passed!
4 files already formatted
============================== 3 passed in 3.39s ==============================
 Test Files  6 passed (6)
      Tests  489 passed (489)
  16 passed (32.8s)
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 108 lines omitted ...]
```

### Visual Evidence
Before: base commit `10f2d73` had no gallery; its only page was the unstyled landing page.

- [Before, 390 px](before-landing-page-390.png)
- [Before, 1440 px](before-landing-page-1440.png)

After: the verifier captured these full-page gallery screenshots with the system theme:

- [Light, 390 px](gallery-neutral-light-390.png)
- [Dark, 390 px](gallery-neutral-dark-390.png)
- [Light, 1440 px](gallery-neutral-light-1440.png)
- [Dark, 1440 px](gallery-neutral-dark-1440.png)

Inspected: all 18 token groups render with values; header, switchers, and cards fit 390 px without overflow.
