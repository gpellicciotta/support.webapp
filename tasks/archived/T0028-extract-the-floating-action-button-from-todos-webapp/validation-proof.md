# T0028 Validation Proof

Command: `plan tasks validate T0028 --completion --verbose`

Exit code: 0.

```text
Resolved worktree root: C:\Dev-Projects\support.webapp\.plan
Task files being validated:
- **    OK** [T0028-extract-the-floating-action-button-from-todos-webapp.md]

All 1 task file passed validation.
```

## Final Verification
Command: `python scripts/devops.py check`

Exit code: 0.
The environment set `FAB_EVIDENCE_DIR` to the companion directory for screenshots.
Output excerpt follows, preserving terminal summaries and fab test results.

```text
[... 2 lines omitted ...]
All 25 markdown files passed linting.
[... 2 lines omitted ...]
All checks passed!
[... 2 lines omitted ...]
4 files already formatted
[... 18 lines omitted ...]
============================== 3 passed in 1.87s ==============================
[... 5 lines omitted ...]
 Test Files  25 passed (25)
      Tests  2062 passed (2062)
[... 1 lines omitted ...]
   Duration  4.94s (environment 54%, import 30%, tests 13%, worker 1%, transform 1%)
[... 53 lines omitted ...]
  ok  31 [desktop-light] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring (1.4s)
  ok  30 [desktop-light] › tests\e2e\fab.spec.js:30:1 › the shell keeps the overlay fab visible above navigation while content scrolls (1.9s)
[... 197 lines omitted ...]
  ok 163 [desktop-dark] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring (1.5s)
  ok 164 [desktop-dark] › tests\e2e\fab.spec.js:30:1 › the shell keeps the overlay fab visible above navigation while content scrolls (1.9s)
[... 197 lines omitted ...]
  ok 296 [mobile-light] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring (1.4s)
  ok 297 [mobile-light] › tests\e2e\fab.spec.js:30:1 › the shell keeps the overlay fab visible above navigation while content scrolls (1.9s)
[... 197 lines omitted ...]
  ok 429 [mobile-dark] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring (1.3s)
[... 1 lines omitted ...]
  ok 430 [mobile-dark] › tests\e2e\fab.spec.js:30:1 › the shell keeps the overlay fab visible above navigation while content scrolls (1.6s)
[... 152 lines omitted ...]
  2 skipped
  530 passed (3.9m)
[... 5 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 1 lines omitted ...]
   Duration  7.48s (tests 98%, import 1%, transform 1%)
[... 102 lines omitted ...]
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 931.0 kB
npm notice unpacked size: 1.2 MB
npm notice shasum: 6e858b26482789de187cf3de5d54b4fde02e642b
npm notice integrity: sha512-4hf9869lnKMud[...]9VFJzIevvhOBw==
npm notice total files: 92
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```


## Walkthrough & Validation

Command: `npx playwright test tests/e2e/fab.spec.js --workers 2`

Exit code: 1. Before screenshots show the adjacent icon-button section before the fab existed.

```text
[WebServer] (node:23656) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 8 tests using 2 workers

(node:39860) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:16956) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:39860) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:16956) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  x  1 [desktop-light] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring (6.2s)
  x  2 [desktop-light] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls (6.6s)
(node:77808) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:77808) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:81428) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:81428) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  x  3 [desktop-dark] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring (6.2s)
(node:5780) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:5780) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  x  4 [desktop-dark] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls (6.5s)
(node:88432) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:88432) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  x  5 [mobile-light] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring (6.1s)
(node:76084) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:76084) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  x  6 [mobile-light] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls (6.5s)
(node:67196) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
```

```text
(Use `node --trace-warnings ...` to show where the warning was created)
(node:67196) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  x  7 [mobile-dark] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring (6.1s)
  x  8 [mobile-dark] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls (6.5s)


  1) [desktop-light] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('#fab')
    Expected: 1
    Received: 0
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" locator('#fab') with timeout 5000ms
      - waiting for locator('#fab')
        14 × locator resolved to 0 elements
           - unexpected value "0"


      12 |         });
      13 |     }
    > 14 |     await expect(section).toHaveCount(1);
         |                           ^
      15 |     for (const state of ['', '.is-hover', '.is-active', '.is-focus', ':disabled', '[hidden]']) {
      16 |         await expect(section.locator(`.fab${state}`).first()).toHaveAttribute('aria-label', 'Add task');
      17 |     }
        at C:\Dev-Projects\support.webapp\.plan\work\T0028-extract-the-floating-action-button-from-todos-webapp\tests\e2e\fab.spec.js:14:27

    Error Context: test-results\fab-fab-specimens-expose-e-8b796-s-and-a-keyboard-focus-ring-desktop-light\error-context.md

  2) [desktop-light] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls 

    Error: expect(locator).toHaveAccessibleName(expected) failed

    Locator: locator('.app__overlays > .fab')
    Expected: "Add task"
```

```text
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveAccessibleName" locator('.app__overlays > .fab') with timeout 5000ms
      - waiting for locator('.app__overlays > .fab')


      31 |     await page.goto('/demo/shell-todos.html', { waitUntil: 'networkidle' });
      32 |     const button = page.locator('.app__overlays > .fab');
    > 33 |     await expect(button).toHaveAccessibleName('Add task');
         |                          ^
      34 |     const before = await button.boundingBox();
      35 |     expect(before.width).toBeGreaterThanOrEqual(44);
      36 |     expect(before.height).toBeGreaterThanOrEqual(44);
        at C:\Dev-Projects\support.webapp\.plan\work\T0028-extract-the-floating-action-button-from-todos-webapp\tests\e2e\fab.spec.js:33:26

    Error Context: test-results\fab-the-shell-keeps-the-ov-673b6-ation-while-content-scrolls-desktop-light\error-context.md

  3) [desktop-dark] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('#fab')
    Expected: 1
    Received: 0
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" locator('#fab') with timeout 5000ms
      - waiting for locator('#fab')
        14 × locator resolved to 0 elements
           - unexpected value "0"


      12 |         });
      13 |     }
    > 14 |     await expect(section).toHaveCount(1);
         |                           ^
      15 |     for (const state of ['', '.is-hover', '.is-active', '.is-focus', ':disabled', '[hidden]']) {
```

```text
      16 |         await expect(section.locator(`.fab${state}`).first()).toHaveAttribute('aria-label', 'Add task');
      17 |     }
        at C:\Dev-Projects\support.webapp\.plan\work\T0028-extract-the-floating-action-button-from-todos-webapp\tests\e2e\fab.spec.js:14:27

    Error Context: test-results\fab-fab-specimens-expose-e-8b796-s-and-a-keyboard-focus-ring-desktop-dark\error-context.md

  4) [desktop-dark] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls 

    Error: expect(locator).toHaveAccessibleName(expected) failed

    Locator: locator('.app__overlays > .fab')
    Expected: "Add task"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveAccessibleName" locator('.app__overlays > .fab') with timeout 5000ms
      - waiting for locator('.app__overlays > .fab')


      31 |     await page.goto('/demo/shell-todos.html', { waitUntil: 'networkidle' });
      32 |     const button = page.locator('.app__overlays > .fab');
    > 33 |     await expect(button).toHaveAccessibleName('Add task');
         |                          ^
      34 |     const before = await button.boundingBox();
      35 |     expect(before.width).toBeGreaterThanOrEqual(44);
      36 |     expect(before.height).toBeGreaterThanOrEqual(44);
        at C:\Dev-Projects\support.webapp\.plan\work\T0028-extract-the-floating-action-button-from-todos-webapp\tests\e2e\fab.spec.js:33:26

    Error Context: test-results\fab-the-shell-keeps-the-ov-673b6-ation-while-content-scrolls-desktop-dark\error-context.md

  5) [mobile-light] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('#fab')
    Expected: 1
    Received: 0
    Timeout:  5000ms

```

```text
    Call log:
      - Expect "toHaveCount" locator('#fab') with timeout 5000ms
      - waiting for locator('#fab')
        14 × locator resolved to 0 elements
           - unexpected value "0"


      12 |         });
      13 |     }
    > 14 |     await expect(section).toHaveCount(1);
         |                           ^
      15 |     for (const state of ['', '.is-hover', '.is-active', '.is-focus', ':disabled', '[hidden]']) {
      16 |         await expect(section.locator(`.fab${state}`).first()).toHaveAttribute('aria-label', 'Add task');
      17 |     }
        at C:\Dev-Projects\support.webapp\.plan\work\T0028-extract-the-floating-action-button-from-todos-webapp\tests\e2e\fab.spec.js:14:27

    Error Context: test-results\fab-fab-specimens-expose-e-8b796-s-and-a-keyboard-focus-ring-mobile-light\error-context.md

  6) [mobile-light] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls 

    Error: expect(locator).toHaveAccessibleName(expected) failed

    Locator: locator('.app__overlays > .fab')
    Expected: "Add task"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveAccessibleName" locator('.app__overlays > .fab') with timeout 5000ms
      - waiting for locator('.app__overlays > .fab')


      31 |     await page.goto('/demo/shell-todos.html', { waitUntil: 'networkidle' });
      32 |     const button = page.locator('.app__overlays > .fab');
    > 33 |     await expect(button).toHaveAccessibleName('Add task');
         |                          ^
      34 |     const before = await button.boundingBox();
      35 |     expect(before.width).toBeGreaterThanOrEqual(44);
      36 |     expect(before.height).toBeGreaterThanOrEqual(44);
        at C:\Dev-Projects\support.webapp\.plan\work\T0028-extract-the-floating-action-button-from-todos-webapp\tests\e2e\fab.spec.js:33:26
```

```text

    Error Context: test-results\fab-the-shell-keeps-the-ov-673b6-ation-while-content-scrolls-mobile-light\error-context.md

  7) [mobile-dark] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('#fab')
    Expected: 1
    Received: 0
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" locator('#fab') with timeout 5000ms
      - waiting for locator('#fab')
        14 × locator resolved to 0 elements
           - unexpected value "0"


      12 |         });
      13 |     }
    > 14 |     await expect(section).toHaveCount(1);
         |                           ^
      15 |     for (const state of ['', '.is-hover', '.is-active', '.is-focus', ':disabled', '[hidden]']) {
      16 |         await expect(section.locator(`.fab${state}`).first()).toHaveAttribute('aria-label', 'Add task');
      17 |     }
        at C:\Dev-Projects\support.webapp\.plan\work\T0028-extract-the-floating-action-button-from-todos-webapp\tests\e2e\fab.spec.js:14:27

    Error Context: test-results\fab-fab-specimens-expose-e-8b796-s-and-a-keyboard-focus-ring-mobile-dark\error-context.md

  8) [mobile-dark] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls 

    Error: expect(locator).toHaveAccessibleName(expected) failed

    Locator: locator('.app__overlays > .fab')
    Expected: "Add task"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
```

```text
      - Expect "toHaveAccessibleName" locator('.app__overlays > .fab') with timeout 5000ms
      - waiting for locator('.app__overlays > .fab')


      31 |     await page.goto('/demo/shell-todos.html', { waitUntil: 'networkidle' });
      32 |     const button = page.locator('.app__overlays > .fab');
    > 33 |     await expect(button).toHaveAccessibleName('Add task');
         |                          ^
      34 |     const before = await button.boundingBox();
      35 |     expect(before.width).toBeGreaterThanOrEqual(44);
      36 |     expect(before.height).toBeGreaterThanOrEqual(44);
        at C:\Dev-Projects\support.webapp\.plan\work\T0028-extract-the-floating-action-button-from-todos-webapp\tests\e2e\fab.spec.js:33:26

    Error Context: test-results\fab-the-shell-keeps-the-ov-673b6-ation-while-content-scrolls-mobile-dark\error-context.md

  8 failed
    [desktop-light] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring 
    [desktop-light] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls 
    [desktop-dark] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring 
    [desktop-dark] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls 
    [mobile-light] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring 
    [mobile-light] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls 
    [mobile-dark] › tests\e2e\fab.spec.js:5:1 › fab specimens expose every state, labels, targets, and a keyboard focus ring 
    [mobile-dark] › tests\e2e\fab.spec.js:29:1 › the shell keeps the overlay fab visible above navigation while content scrolls
```


