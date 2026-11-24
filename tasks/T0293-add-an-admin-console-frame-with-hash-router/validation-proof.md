## Walkthrough & Validation

### Red-Phase TDD Proof

Command: `npx.cmd vitest run tests/unit/admin-console.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0293-add-an-admin-console-frame-with-hash-router

 ❯ tests/unit/admin-console.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/admin-console.test.js [ tests/unit/admin-console.test.js ]
Error: Failed to resolve import "../../src/js/admin-console.js" from "tests/unit/admin-console.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0293-add-an-admin-console-frame-with-hash-router/tests/unit/admin-console.test.js:12:8
  10 |      displayName,
  11 |      parseRoute
  12 |  } from '../../src/js/admin-console.js';
     |          ^
  13 |  import { setSpriteUrl } from '../../src/js/icon.js';
  14 |  import { installPopoverShim } from './popover-shim.js';
[... 10 lines omitted ...]

 Test Files  1 failed (1)
      Tests  no tests
   Start at  02:48:47
   Duration  1.03s (environment 99%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/admin-console.spec.js --project=desktop-light --reporter=line`
Exit code: `1`

```text
Running 5 tests using 4 workers

  1) [desktop-light] › tests\e2e\admin-console.spec.js:47:1 › admin console demo moves between screens by hash and back button, updates marks and titles, and preserves route on skip link 

    Error: expect(locator).toHaveText(expected) failed

    Locator: locator('[data-admin-console-title]')
    Expected: "Accounts"
    Timeout: 5000ms
    Error: element(s) not found
[... 88 lines omitted ...]
  5 failed
    [desktop-light] › tests\e2e\admin-console.spec.js:47:1 › admin console demo moves between screens by hash and back button, updates marks and titles, and preserves route on skip link 
    [desktop-light] › tests\e2e\admin-console.spec.js:107:1 › admin console demo shows the forbidden gate, transitions to signed-out shell, and returns cleanly 
    [desktop-light] › tests\e2e\admin-console.spec.js:148:5 › neutral admin console frame and forbidden gate pass layout and target checks 
    [desktop-light] › tests\e2e\admin-console.spec.js:148:5 › warm admin console frame and forbidden gate pass layout and target checks 
    [desktop-light] › tests\e2e\admin-console.spec.js:148:5 › bright admin console frame and forbidden gate pass layout and target checks 
```
