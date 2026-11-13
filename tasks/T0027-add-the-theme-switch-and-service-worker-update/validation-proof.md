## Walkthrough & Validation

Review rework command: `python scripts/devops.py check *> C:/Dev-Projects/support.webapp/.plan/tasks/T0027-add-the-theme-switch-and-service-worker-update/rework-check-output.txt`
Exit code: 0
Full output: [rework-check-output.txt](rework-check-output.txt).

```text
[... intervening output omitted ...]
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 87932
All 25 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 86376
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 64576
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 89060
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 85960
============================== 3 passed in 2.54s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 83144
 Test Files  29 passed (29)
      Tests  2104 passed (2104)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 66844
  2 skipped
  614 passed (4.0m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 71436
 Test Files  2 passed (2)
      Tests  4 passed (4)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 53512
npm notice Tarball Details
npm notice total files: 103
```

Review rework command: `npx vitest run tests/unit/sw-update.test.js tests/unit/theme-switch.test.js tests/unit/gallery.test.js`
Exit code: 0

```text

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0027-add-the-theme-switch-and-service-worker-update


 Test Files  3 passed (3)
      Tests  36 passed (36)
   Start at  05:49:32
   Duration  1.03s (import 82%, transform 9%, tests 7%, worker 2%)
```

Review rework command: `npx vitest run tests/unit/sw-update.test.js`
Exit code: 1

```text

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0027-add-the-theme-switch-and-service-worker-update

 ❯ tests/unit/sw-update.test.js (5 tests | 1 failed) 15ms
   ❯ service worker update (5)
     × replaces stale Update with an explicit once-only Reload after activation elsewhere 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/sw-update.test.js > service worker update > replaces stale Update with an explicit once-only Reload after activation elsewhere
AssertionError: expected "vi.fn()" to be called 1 times, but got 0 times
 ❯ tests/unit/sw-update.test.js:43:27
     41|         s.worker.state = 'activated';
     42|         s.serviceWorker.dispatchEvent(new Event('controllerchange'));
     43|         expect(s.dismiss).toHaveBeenCalledTimes(1);
       |                           ^
     44|         expect(s.reload).not.toHaveBeenCalled();
     45|         staleAction();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 4 passed (5)
   Start at  05:49:14
   Duration  236ms (transform 40%, import 28%, tests 22%, worker 10%)
```

Final change removed trailing whitespace only; behavior and previous full-check results remain applicable.

Command: `npx eslint tests/unit/theme-switch.test.js`
Exit code: 0

```text
```

Command: `git diff --check`
Exit code: 0

```text
warning: in the working copy of 'tests/unit/theme-switch.test.js', LF will be replaced by CRLF the next time Git touches it
```

Command: `python scripts/devops.py check *> C:/Dev-Projects/support.webapp/.plan/tasks/T0027-add-the-theme-switch-and-service-worker-update/check-output.txt`
Exit code: 0
Full output: [check-output.txt](check-output.txt).

```text
[... intervening output omitted ...]
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 42684
All 25 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 80128
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 89304
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 67156
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 60736
============================== 3 passed in 1.83s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 72232
 Test Files  29 passed (29)
      Tests  2103 passed (2103)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 87896
  614 passed (4.1m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 77312
 Test Files  2 passed (2)
      Tests  4 passed (4)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 74244
npm notice Tarball Details
npm notice total files: 103
```

Command: `plan tasks validate T0027 --completion`
Exit code: 0

```text
All 1 task file passed validation.
```

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
