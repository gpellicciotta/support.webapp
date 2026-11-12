# Loading Validation

Command: `plan tasks validate T0020 --completion` (exit 0).

```text
All 1 task file passed validation.
```

After captures, visually inspected at 390 and 1440 pixels:
- Neutral: [desktop light](after-neutral-desktop-light.png), [desktop dark](after-neutral-desktop-dark.png), [mobile light](after-neutral-mobile-light.png), [mobile dark](after-neutral-mobile-dark.png).
- Warm: [desktop light](after-warm-desktop-light.png), [desktop dark](after-warm-desktop-dark.png), [mobile light](after-warm-mobile-light.png), [mobile dark](after-warm-mobile-dark.png).
- Bright: [desktop light](after-bright-desktop-light.png), [desktop dark](after-bright-desktop-dark.png), [mobile light](after-bright-mobile-light.png), [mobile dark](after-bright-mobile-dark.png).

All captures show actual gallery content. No clipping or overflow appeared in the loading specimens.
The browser helper checks HTTP 200, console errors, page exceptions, HTTP failures, and rejected requests.
The loading test exercises both motion preferences; the full verifier covers text contrast and stylesheets.
The targeted browser run used managed server PID 37176, which exited with its runner.

Command: `npx playwright test tests/e2e/loading.spec.js --workers 4` (exit 0, corrected stylesheet readiness wait).
Environment: `LOADING_PROOF` points to this companion directory.

```text
  ok 3 [desktop-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (3.0s)
  ok 1 [mobile-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (3.1s)
  ok 2 [desktop-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (3.6s)
  ok 4 [mobile-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (3.0s)

  4 passed (6.6s)
```

## Walkthrough & Validation
Command: `npx vitest run tests/unit/loading.test.js` (exit 1, before implementation).

```text
RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0020-design-and-add-the-loading-pattern-aria-busy

 ❯ tests/unit/loading.test.js (1 test | 1 failed) 111ms
   × keeps polite status outside busy content and skeletons decorative only for slow lists 110ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/loading.test.js > keeps polite status outside busy content and skeletons decorative only for slow lists
AssertionError: expected  to have a length of 3 but got +0

- Expected
+ Received

- 3
+ 0

 ❯ tests/unit/loading.test.js:9:23
      7|     document.body.innerHTML = readFileSync('src/demo/visual-style-gall…
      8|     const specimens = document.querySelectorAll('#loading .loading');
      9|     expect(specimens).toHaveLength(3);
       |                       ^
     10|     for (const specimen of specimens) {
     11|         const status = specimen.querySelector('[role="status"]');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  19:44:02
   Duration  1.07s (import 83%, tests 13%, transform 3%, worker 1%)
```

Before screenshots: [desktop light](before-desktop-light.png), [desktop dark](before-desktop-dark.png),
[mobile light](before-mobile-light.png), and [mobile dark](before-mobile-dark.png).
Playwright managed server PID 27600 for command `npx playwright test tests/e2e/loading.spec.js --workers 4`.

Command: `npx playwright test tests/e2e/loading.spec.js --workers 4` (exit 1, before implementation).
Environment: `LOADING_BEFORE=1`; `LOADING_PROOF` points to this companion directory.

```text
x  3 [desktop-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (6.5s)
  x  2 [desktop-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (6.3s)


  1) [desktop-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#loading')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" locator('#loading') with timeout 5000ms
      - waiting for locator('#loading')


      10 |     }
      11 |     const section = page.locator('#loading');
    > 12 |     await expect(section).toBeVisible();
         |                           ^
      13 |     for (const look of looks) {
      14 |         await page.locator('#look-stylesheet').evaluate((element, href) => { element.href = href; }, lookHref(look));
      15 |         for (const reducedMotion of ['no-preference', 'reduce']) {
        at C:\Dev-Projects\support.webapp\.plan\work\T0020-design-and-add-the-loading-pattern-aria-busy\tests\e2e\loading.spec.js:12:27

    Error Context: test-results\loading-loading-status-and-7e509-ooks-and-motion-preferences-desktop-light\error-context.md

  2) [desktop-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#loading')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" locator('#loading') with timeout 5000ms
```

```text
      - waiting for locator('#loading')


      10 |     }
      11 |     const section = page.locator('#loading');
    > 12 |     await expect(section).toBeVisible();
         |                           ^
      13 |     for (const look of looks) {
      14 |         await page.locator('#look-stylesheet').evaluate((element, href) => { element.href = href; }, lookHref(look));
      15 |         for (const reducedMotion of ['no-preference', 'reduce']) {
        at C:\Dev-Projects\support.webapp\.plan\work\T0020-design-and-add-the-loading-pattern-aria-busy\tests\e2e\loading.spec.js:12:27

    Error Context: test-results\loading-loading-status-and-7e509-ooks-and-motion-preferences-desktop-dark\error-context.md

  3) [mobile-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#loading')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" locator('#loading') with timeout 5000ms
      - waiting for locator('#loading')


      10 |     }
      11 |     const section = page.locator('#loading');
    > 12 |     await expect(section).toBeVisible();
         |                           ^
      13 |     for (const look of looks) {
      14 |         await page.locator('#look-stylesheet').evaluate((element, href) => { element.href = href; }, lookHref(look));
      15 |         for (const reducedMotion of ['no-preference', 'reduce']) {
        at C:\Dev-Projects\support.webapp\.plan\work\T0020-design-and-add-the-loading-pattern-aria-busy\tests\e2e\loading.spec.js:12:27

    Error Context: test-results\loading-loading-status-and-7e509-ooks-and-motion-preferences-mobile-light\error-context.md

  4) [mobile-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 
```

```text

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#loading')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" locator('#loading') with timeout 5000ms
      - waiting for locator('#loading')


      10 |     }
      11 |     const section = page.locator('#loading');
    > 12 |     await expect(section).toBeVisible();
         |                           ^
      13 |     for (const look of looks) {
      14 |         await page.locator('#look-stylesheet').evaluate((element, href) => { element.href = href; }, lookHref(look));
      15 |         for (const reducedMotion of ['no-preference', 'reduce']) {
        at C:\Dev-Projects\support.webapp\.plan\work\T0020-design-and-add-the-loading-pattern-aria-busy\tests\e2e\loading.spec.js:12:27

    Error Context: test-results\loading-loading-status-and-7e509-ooks-and-motion-preferences-mobile-dark\error-context.md

  4 failed
    [desktop-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 
    [desktop-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 
    [mobile-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 
    [mobile-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences
```



Command: `python scripts/devops.py check` (exit 1, initial full run).
Three loading checks retained the old stylesheet wait. Two existing async form checks also failed.
Full output: [check-first-output.txt](check-first-output.txt).

```text
  1) [desktop-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 
    Test timeout of 120000ms exceeded.
    Error: locator.evaluate: Test timeout of 120000ms exceeded.
       9 |     await expect(section).toBeVisible();
      10 |     for (const look of looks) {
    > 11 |         await page.locator('#look-select').selectOption(look);
         |                                                ^
      12 |         await page.waitForFunction((selectedLook) => {
      13 |             const sheet = document.getElementById('look-stylesheet').sheet;
      14 |             return sheet?.href.endsWith(`/looks/${selectedLook}/index.css`) && sheet.cssRules.length > 0;
        at C:\Dev-Projects\support.webapp\.plan\work\T0020-design-and-add-the-loading-pattern-aria-busy\tests\e2e\loading.spec.js:11:48
    Error Context: test-results\loading-loading-status-and-7e509-ooks-and-motion-preferences-desktop-light\error-context.md
  2) [desktop-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 
    Test timeout of 120000ms exceeded.
    Error: locator.evaluate: Test timeout of 120000ms exceeded.
       9 |     await expect(section).toBeVisible();
      10 |     for (const look of looks) {
    > 11 |         await page.locator('#look-select').selectOption(look);
         |                                                ^
      12 |         await page.waitForFunction((selectedLook) => {
      13 |             const sheet = document.getElementById('look-stylesheet').sheet;
      14 |             return sheet?.href.endsWith(`/looks/${selectedLook}/index.css`) && sheet.cssRules.length > 0;
        at C:\Dev-Projects\support.webapp\.plan\work\T0020-design-and-add-the-loading-pattern-aria-busy\tests\e2e\loading.spec.js:11:48
    Error Context: test-results\loading-loading-status-and-7e509-ooks-and-motion-preferences-desktop-dark\error-context.md
  3) [mobile-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 
    Test timeout of 120000ms exceeded.
    Error: locator.evaluate: Test timeout of 120000ms exceeded.
       9 |     await expect(section).toBeVisible();
      10 |     for (const look of looks) {
    > 11 |         await page.locator('#look-select').selectOption(look);
         |                                                ^
      12 |         await page.waitForFunction((selectedLook) => {
      13 |             const sheet = document.getElementById('look-stylesheet').sheet;
      14 |             return sheet?.href.endsWith(`/looks/${selectedLook}/index.css`) && sheet.cssRules.length > 0;
        at C:\Dev-Projects\support.webapp\.plan\work\T0020-design-and-add-the-loading-pattern-aria-busy\tests\e2e\loading.spec.js:11:48
    Error Context: test-results\loading-loading-status-and-7e509-ooks-and-motion-preferences-mobile-light\error-context.md
  4) [mobile-dark] › tests\e2e\form.spec.js:79:1 › an edit during a pending check discards the old result and checks the new value 
    Error: expect(locator).toBeHidden() failed
    Locator:  locator('#form form[data-form]').locator('.field:has(#form-name)').locator('.field__status')
    Expected: hidden
```

```text
    Received: visible
    Timeout:  5000ms
    Call log:
      - Expect "toBeHidden" locator('#form form[data-form]').locator('.field:has(#form-name)').locator('.field__status') with timeout 5000ms
      - waiting for locator('#form form[data-form]').locator('.field:has(#form-name)').locator('.field__status')
        11 × locator resolved to <p class="field__status" id="form-name-status">…</p>
           - unexpected value "visible"
      88 |     await name.press('s');
      89 |     await expect(field).not.toHaveAttribute('aria-busy', 'true');
    > 90 |     await expect(field.locator('.field__status')).toBeHidden();
         |                                                   ^
      91 |     // The overtaken check of "taken" settles by checking "takens" instead, which passes.
      92 |     await expect(field.locator('.field__status')).toHaveText('Name is free.');
      93 |     await expect(field.locator('.field__error')).toBeHidden();
        at C:\Dev-Projects\support.webapp\.plan\work\T0020-design-and-add-the-loading-pattern-aria-busy\tests\e2e\form.spec.js:90:51
    Error Context: test-results\form-an-edit-during-a-pend-b2e58-lt-and-checks-the-new-value-mobile-dark\error-context.md
  5) [mobile-dark] › tests\e2e\form.spec.js:98:1 › clearing the address while the name check runs during submit blocks the send 
    Error: expect(locator).toBeFocused() failed
    Locator:  locator('#form form[data-form]').locator('.error-summary')
    Expected: focused
    Received: inactive
    Timeout:  5000ms
    Call log:
      - Expect "toBeFocused" locator('#form form[data-form]').locator('.error-summary') with timeout 5000ms
      - waiting for locator('#form form[data-form]').locator('.error-summary')
        6 × locator resolved to <div hidden="" tabindex="-1" class="error-summary"></div>
          - unexpected value "inactive"
      105 |     await form.locator('#form-url').fill('');
      106 |     const summary = form.locator('.error-summary');
    > 107 |     await expect(summary).toBeFocused();
          |                           ^
      108 |     await expect(summary.locator('.error-summary__link')).toHaveText(['Enter an address.']);
      109 |     await expect(form.locator('#form-url')).toHaveAttribute('aria-invalid', 'true');
      110 |     await expect(page.locator('#form .banner--success')).toBeHidden();
        at C:\Dev-Projects\support.webapp\.plan\work\T0020-design-and-add-the-loading-pattern-aria-busy\tests\e2e\form.spec.js:107:27
    Error Context: test-results\form-clearing-the-address--f038a-ring-submit-blocks-the-send-mobile-dark\error-context.md
  5 failed
    [desktop-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 
    [desktop-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 
    [mobile-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences 
```

```text
    [mobile-dark] › tests\e2e\form.spec.js:79:1 › an edit during a pending check discards the old result and checks the new value 
    [mobile-dark] › tests\e2e\form.spec.js:98:1 › clearing the address while the name check runs during submit blocks the send 
  295 passed (4.5m)
**[ERROR]** Finished devops check in 289.3s with status: failed
```

Command: `python scripts/devops.py check` (exit 0, final run).
Environment: `LOADING_PROOF` points to this companion directory.
Full verbatim output: [check-output.txt](check-output.txt).

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 72092
All 25 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 72672
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 72316
[... 1 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 78324
[... 2 lines omitted ...]
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 42908
[... 12 lines omitted ...]
============================== 3 passed in 1.59s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 7360
[... 3 lines omitted ...]
 Test Files  23 passed (23)
      Tests  2044 passed (2044)
[... 4 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 19708
[... 73 lines omitted ...]
  ok  51 [desktop-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (2.1s)
[... 101 lines omitted ...]
  ok 126 [desktop-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (2.1s)
[... 98 lines omitted ...]
  ok 201 [mobile-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (2.0s)
[... 100 lines omitted ...]
  ok 276 [mobile-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (2.0s)
[... 33 lines omitted ...]
  300 passed (2.3m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
```

```text
Process ID: 63464
[... 3 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 2 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 7360
[... 104 lines omitted ...]
gpellicciotta-support.webapp-0.1.0-pre.tgz
```
