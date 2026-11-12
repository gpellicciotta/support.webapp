# T0028 Validation Proof

## Walkthrough & Validation

Command: `$env:FAB_EVIDENCE_DIR='{{companion-directory}}'; npx playwright test tests/e2e/fab.spec.js --workers 2`

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


