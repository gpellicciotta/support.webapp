## Walkthrough & Validation

Command: `THEME_PROOF_PHASE=before THEME_PROOF_DIR={{companion-directory}} npx playwright test tests/e2e/theme-switch.spec.js`
Exit code: 1

```text
[... repeated failure details omitted ...]
    Error: expect(locator).toHaveAttribute(expected) failed

    Locator:  locator('html')
    Expected: "dark"
    Received: ""
    Timeout:  5000ms
[... repeated failure details omitted ...]
  4 failed
    [desktop-light] › tests\e2e\theme-switch.spec.js:4:1 › gallery stores the theme and follows System across reloads 
    [desktop-dark] › tests\e2e\theme-switch.spec.js:4:1 › gallery stores the theme and follows System across reloads 
    [mobile-light] › tests\e2e\theme-switch.spec.js:4:1 › gallery stores the theme and follows System across reloads 
    [mobile-dark] › tests\e2e\theme-switch.spec.js:4:1 › gallery stores the theme and follows System across reloads 
```

Command: `THEME_PROOF_DIR={{companion-directory}} npx playwright test tests/e2e/theme-switch.spec.js`
Exit code: 0

```text
  ok 2 [desktop-dark] › tests\e2e\theme-switch.spec.js:4:1 › gallery stores the theme and follows System across reloads (5.7s)
  ok 1 [mobile-light] › tests\e2e\theme-switch.spec.js:4:1 › gallery stores the theme and follows System across reloads (6.2s)
  ok 4 [mobile-dark] › tests\e2e\theme-switch.spec.js:4:1 › gallery stores the theme and follows System across reloads (6.3s)
  ok 3 [desktop-light] › tests\e2e\theme-switch.spec.js:4:1 › gallery stores the theme and follows System across reloads (8.5s)

  4 passed (22.5s)
```

Visual inspection confirmed readable native radios and intact gallery layouts at 390 and 1440 pixels.
The focused browser checks rejected console errors, page exceptions, failed requests, HTTP errors, and horizontal overflow.
The server returned HTTP 200 before screenshots.
Before and after screenshots match because this change adds persistence without changing appearance.

- [Before mobile dark](before-mobile-dark.png)
- [After mobile dark](after-mobile-dark.png)
- [Before mobile light](before-mobile-light.png)
- [After mobile light](after-mobile-light.png)
- [Before desktop dark](before-desktop-dark.png)
- [After desktop dark](after-desktop-dark.png)
- [Before desktop light](before-desktop-light.png)
- [After desktop light](after-desktop-light.png)

Command: `npx vitest run tests/unit/theme-switch.test.js tests/unit/sw-update.test.js`
Exit code: 1

```text
RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0027-add-the-theme-switch-and-service-worker-update

 ❯ tests/unit/sw-update.test.js (0 test)
 ❯ tests/unit/theme-switch.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/sw-update.test.js [ tests/unit/sw-update.test.js ]
Error: Cannot find module '../../src/js/sw-update.js' imported from C:/Dev-Projects/support.webapp/.plan/work/T0027-add-the-theme-switch-and-service-worker-update/tests/unit/sw-update.test.js
 ❯ tests/unit/sw-update.test.js:2:1
      1| import { describe, expect, it, vi } from 'vitest';
      2| import { watchWorkerUpdates } from '../../src/js/sw-update.js';
       | ^
      3|
      4| function setup({ controlled = true, waiting = true } = {}) {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  tests/unit/theme-switch.test.js [ tests/unit/theme-switch.test.js ]
Error: Cannot find module '../../src/js/theme-switch.js' imported from C:/Dev-Projects/support.webapp/.plan/work/T0027-add-the-theme-switch-and-service-worker-update/tests/unit/theme-switch.test.js
 ❯ tests/unit/theme-switch.test.js:3:1
      1| import { Window } from 'happy-dom';
      2| import { describe, expect, it, vi } from 'vitest';
      3| import { applyTheme, attachThemeSwitch } from '../../src/js/theme-swit…
       | ^
      4|
      5| function setup(appName = 'example', getStorage) {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed (2)
      Tests  no tests
   Start at  02:40:49
   Duration  1.21s (worker 97%, environment 3%)
```
