# T0039 Validation

## Walkthrough & Validation

### Final full check after all corrections
Command: `python scripts/devops.py check`; exit code 0.
The final source includes generic Details labels and the load-event-based verifier readiness correction.

```text
[... 2 lines omitted ...]
All 25 markdown files passed linting.
[... 2 lines omitted ...]
All checks passed!
[... 2 lines omitted ...]
4 files already formatted
[... 18 lines omitted ...]
============================== 3 passed in 4.96s ==============================
[... 5 lines omitted ...]
 Test Files  29 passed (29)
      Tests  2108 passed (2108)
[... 899 lines omitted ...]
  2 skipped
  622 passed (7.0m)
[... 5 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 113 lines omitted ...]
npm notice 2.4kB src/looks/warm/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.1-pre
npm notice filename: gpellicciotta-support.webapp-0.1.1-pre.tgz
npm notice package size: 937.6 kB
npm notice unpacked size: 1.2 MB
npm notice shasum: 3c3612dfe61b409ab25697b1082a14de3090c5b8
npm notice integrity: sha512-4LdwYFUroHvmc[...]+5kO0MCrRI6CQ==
npm notice total files: 103
npm notice
gpellicciotta-support.webapp-0.1.1-pre.tgz
```

### Regression theme isolation
Command: `python scripts/devops.py check`; exit code 1.
All existing cases passed; the new readiness regression failed during an unrelated forced-theme transition.

```text
  1) [mobile-dark] › tests\e2e\verify-ui.spec.js:317:1 › verifier waits for delayed look imports before inspecting the page 
    Error: expect(received).toEqual(expected) // deep equality
    - Expected  - 1
    + Received  + 3
    - Array []
    + Array [
    +   "button.button.button--secondary 'Show a sample toast': contrast 2.49 < 4.5",
    + ]
      344 |     }
      345 |     await settleGalleryStyles(page);
    > 346 |     const data = await check(page);
          |                             ^
      347 |     expect(summarize(data)).toEqual([]);
      348 |     expect(errors).toEqual([]);
      349 | });
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:346:29
    Error Context: test-results\verify-ui-verifier-waits-f-bacd7--before-inspecting-the-page-mobile-dark\error-context.md
  1 failed
    [mobile-dark] › tests\e2e\verify-ui.spec.js:317:1 › verifier waits for delayed look imports before inspecting the page 
  2 skipped
  621 passed (6.8m)
**[ERROR]** Finished devops check in 434.7s with status: failed
```

The readiness regression now retains the viewport system theme; the existing verifier cases still test theme overrides.
Command: `npx playwright test tests/e2e/verify-ui.spec.js --workers 2 --grep "verifier waits for delayed"`; exit code 0.

```text
  4 passed (20.7s)
```


### Regression formatting check
Command: `python scripts/devops.py check`; exit code 1 before formatting the new regression callbacks.

```text
Process ID: 90496
> @gpellicciotta/support.webapp@0.1.1-pre lint
> eslint .
C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js
  321:41  error  Statement inside of curly braces should be on next line                                                        @stylistic/brace-style
  321:62  error  Closing curly brace should be on the same line as opening curly brace or on the line after the previous block  @stylistic/brace-style
  322:44  error  Statement inside of curly braces should be on next line                                                        @stylistic/brace-style
  322:67  error  Closing curly brace should be on the same line as opening curly brace or on the line after the previous block  @stylistic/brace-style
✖ 4 problems (4 errors, 0 warnings)
  4 errors and 0 warnings potentially fixable with the `--fix` option.
**[ERROR]** Finished devops check in 4.4s with status: failed
```

### Readiness race after review rework
Command: `python scripts/devops.py check`; exit code 1.
The failure recurred on portal pages, including a visibly unstyled warm-look capture.
The following output preserves all failure details:

```text
  1) [desktop-light] › tests\e2e\verify-ui.spec.js:324:9 › shell-portal passes every verifier check in the warm look › system theme at 1440 px 
    Error: expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
      345 |                         + `overflow ${data.overflow}px, errors ${errors.length}`);
      346 |                     expect(data.stylesheets.some((href) => href.endsWith(lookHref(look).replace(/^(\.\.\/)+/, '/')))).toBe(true);
    > 347 |                     expect(data.stylesheets.some((href) => href.endsWith('/css/style.css'))).toBe(true);
          |                                                                                              ^
      348 |                     expect(data.texts.length).toBeGreaterThan(0);
      349 |                     expect(data.targets.length).toBeGreaterThan(0);
      350 |                     expect(sprites.references).toBeGreaterThan(0);
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:347:94
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:329:17
    Error Context: test-results\verify-ui-shell-portal-pas-795da-fier-check-in-the-warm-look-desktop-light\error-context.md
  2) [mobile-dark] › tests\e2e\verify-ui.spec.js:324:9 › shell-portal passes every verifier check in the bright look yellow › system theme at 390 px 
    Error: expect(received).toEqual(expected) // deep equality
    - Expected  -  1
    + Received  + 59
    - Array []
    + Array [
    +   "stylesheet not loaded: components/fab.css",
    +   "stylesheet not loaded: components/link-button.css",
    +   "stylesheet not loaded: components/chip.css",
    +   "stylesheet not loaded: components/badge.css",
    +   "stylesheet not loaded: components/segmented.css",
    +   "stylesheet not loaded: components/field.css",
    +   "stylesheet not loaded: components/checkbox.css",
    +   "stylesheet not loaded: components/switch.css",
    +   "stylesheet not loaded: components/radio.css",
    +   "stylesheet not loaded: components/field-group.css",
    +   "stylesheet not loaded: components/form.css",
    +   "stylesheet not loaded: components/error-summary.css",
    +   "stylesheet not loaded: components/banner.css",
    +   "stylesheet not loaded: components/empty-state.css",
    +   "stylesheet not loaded: components/loading.css",
    +   "stylesheet not loaded: components/progress.css",
    +   "stylesheet not loaded: components/spinner.css",
    +   "stylesheet not loaded: components/row.css",
    +   "stylesheet not loaded: components/list.css",
    +   "stylesheet not loaded: components/selection.css",
```

```text
    +   "stylesheet not loaded: components/table.css",
    +   "stylesheet not loaded: components/card.css",
    +   "stylesheet not loaded: components/icon-tile.css",
    +   "stylesheet not loaded: components/collapsible.css",
    +   "stylesheet not loaded: components/tabs.css",
    +   "stylesheet not loaded: components/avatar.css",
    +   "stylesheet not loaded: components/dialog.css",
    +   "stylesheet not loaded: components/inline-confirm.css",
    +   "stylesheet not loaded: components/menu.css",
    +   "stylesheet not loaded: components/popover.css",
    +   "stylesheet not loaded: components/tooltip.css",
    +   "stylesheet not loaded: components/account-menu.css",
    +   "stylesheet not loaded: components/toast.css",
    +   "stylesheet not loaded: shell.css",
    +   "a.app__brand: target 38x17px < 44px",
    +   "a: target 39x17px < 44px",
    +   "a: target 58x17px < 44px",
    +   "a.icon-button: target 300x17px < 44px",
    +   "select#look-select: target 68x19px < 44px",
    +   "select#accent-select: target 68x19px < 44px",
    +   "input: target 60x18px < 44px",
    +   "input: target 48x18px < 44px",
    +   "input: target 45x18px < 44px",
    +   "button.button.button--secondary: target 140x21px < 44px",
    +   "a.skip-link: no visible focus indicator",
    +   "a.app__brand: no visible focus indicator",
    +   "a: no visible focus indicator",
    +   "a: no visible focus indicator",
    +   "a.icon-button: no visible focus indicator",
    +   "button.icon-button: no visible focus indicator",
    +   "a: no visible focus indicator",
    +   "select#look-select: no visible focus indicator",
    +   "select#accent-select: no visible focus indicator",
    +   "input: no visible focus indicator",
    +   "input: no visible focus indicator",
    +   "input: no visible focus indicator",
    +   "button.button.button--secondary: no visible focus indicator",
    + ]
      350 |                     expect(sprites.references).toBeGreaterThan(0);
      351 |                     expect(luminance(parseColor(data.background).slice(0, 3)) < 0.2, `${effective} background ${data.background}`).toBe(effective === 'dark');
```

```text
    > 352 |                     expect([...errors, ...summarize(data), ...sprites.problems]).toEqual([]);
          |                                                                                  ^
      353 |                     await page.close();
      354 |                 });
      355 |             }
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:352:82
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:329:17
    Error Context: test-results\verify-ui-shell-portal-pas-6a9df-k-in-the-bright-look-yellow-mobile-dark\error-context.md
  2 failed
    [desktop-light] › tests\e2e\verify-ui.spec.js:324:9 › shell-portal passes every verifier check in the warm look 
    [mobile-dark] › tests\e2e\verify-ui.spec.js:324:9 › shell-portal passes every verifier check in the bright look yellow 
  2 skipped
  616 passed (7.4m)
**[ERROR]** Finished devops check in 465.6s with status: failed
```

### Delayed-import regression
Command: `npx playwright test tests/e2e/verify-ui.spec.js --project desktop-light --workers 1 --grep "verifier waits for delayed"`.
Before the correction, exit code 1; excerpt:

```text
    Expected: "loading"
    Received: "ready"
```

After reusing the existing load-event helper, exit code 0; excerpt:

```text
  ok 1 [desktop-light] › tests\e2e\verify-ui.spec.js:317:1 › verifier waits for delayed look imports before inspecting the page (4.7s)

  1 passed (11.9s)
```


### Review rework
The reviewer required generic Details labels and matching screen identifiers.
Command: `npx playwright test tests/e2e/shell.spec.js --project desktop-light --grep "single-screen switches between generic"`.
Exit code: 1 before the markup correction.

```text
  x  1 [desktop-light] › tests\e2e\shell.spec.js:201:1 › single-screen switches between generic start, details, and settings views (7.0s)


  1) [desktop-light] › tests\e2e\shell.spec.js:201:1 › single-screen switches between generic start, details, and settings views 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  getByRole('button', { name: 'Details', exact: true })
    Expected: 1
    Received: 0
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" getByRole('button', { name: 'Details', exact: true }) with timeout 5000ms
      - waiting for getByRole('button', { name: 'Details', exact: true })
        13 × locator resolved to 0 elements
           - unexpected value "0"


      202 |     const problems = await openDemo(page, demos[2].path);
      203 |     const details = page.getByRole('button', { name: 'Details', exact: true });
    > 204 |     await expect(details).toHaveCount(1);
          |                           ^
      205 |     for (const name of ['Details', 'Settings', 'Start']) {
      206 |         await page.getByRole('button', { name, exact: true }).click();
      207 |         await expect(page.locator('.app__main > section:visible')).toHaveCount(1);
        at C:\Dev-Projects\support.webapp\tests\e2e\shell.spec.js:204:27

    Error Context: test-results\shell-single-screen-switch-c99bc--details-and-settings-views-desktop-light\error-context.md

  1 failed
    [desktop-light] › tests\e2e\shell.spec.js:201:1 › single-screen switches between generic start, details, and settings views
```

### Rename verification
Unit tests are unnecessary because no module behavior changed; browser tests exercise the URLs, labels, and existing interactions.
The full check includes shell, verifier, and floating action button specs across all configured viewports and themes.

### Red phase
Command: `npx playwright test tests/e2e/shell.spec.js --project desktop-light --grep "the gallery links to every shell demo page"`.
Exit code: 1, expected because the new gallery links did not exist.
The temporary Playwright server required `processes kill --yes --force 54560` before its runner finished.

```text
x  1 [desktop-light] › tests\e2e\shell.spec.js:295:1 › the gallery links to every shell demo page (7.0s)


  1) [desktop-light] › tests\e2e\shell.spec.js:295:1 › the gallery links to every shell demo page ──

    Error: list-editor

    expect(locator).toHaveCount(expected) failed

    Locator:  locator('#shell a[href="shell-list-editor.html"]')
    Expected: 1
    Received: 0
    Timeout:  5000ms

    Call log:
      - list-editor locator('#shell a[href="shell-list-editor.html"]') with timeout 5000ms
      - waiting for locator('#shell a[href="shell-list-editor.html"]')
        13 × locator resolved to 0 elements
           - unexpected value "0"


      297 |     for (const demo of demos) {
      298 |         const link = page.locator(`#shell a[href="${demo.path.replace('/demo/', '')}"]`);
    > 299 |         await expect(link, demo.name).toHaveCount(1);
          |                                       ^
      300 |         await expect(link.locator('.card__title')).toHaveText(`${demo.title} layout`);
      301 |         const response = await page.request.get(demo.path);
      302 |         expect(response.status(), demo.name).toBe(200);
        at C:\Dev-Projects\support.webapp\tests\e2e\shell.spec.js:299:39

    Error Context: test-results\shell-the-gallery-links-to-every-shell-demo-page-desktop-light\error-context.md

  1 failed
    [desktop-light] › tests\e2e\shell.spec.js:295:1 › the gallery links to every shell demo page ───
```

### Visual checks
Commands: `node .plan/tasks/T0039-rename-the-per-app-shell-demos-and-source/capture.mjs before` and the same command with `after`.
Both exited 0.

```text
before: 20 screenshots; HTTP 200; no console, page, or network errors.
after: 20 screenshots; HTTP 200; no console, page, or network errors.
```

Inspected [before-overview.png](before-overview.png) and [after-overview.png](after-overview.png).
Both contain every page and the gallery shell cards at 390 and 1440 px, in light and dark themes.
Every capture shows actual UI; the layouts remain intact after changing visible names and links.
Individual images are stored in [before](before/) and [after](after/).
The interactive preview remains at `http://127.0.0.1:4173`, PID 66992.
Launch command: `node scripts/serve.mjs --port 4173`.

### Initial full check
Command: `python scripts/devops.py check`; exit code 1.
The run reported two screenshot capture timeouts and one unloaded-import failure.
The following is the verbatim failure summary, split into blocks of at most 40 lines:

```text
  1) [desktop-light] › tests\e2e\verify-ui.spec.js:324:9 › gallery passes every verifier check in the bright look blue › dark theme at 1440 px 
    Test timeout of 120000ms exceeded.
    Error: page.screenshot: Protocol error (Page.captureScreenshot): Unable to capture screenshot
    Call log:
      - taking page screenshot
      - waiting for fonts to load...
      - fonts loaded
      337 |                     await settleGalleryStyles(page);
      338 |                     expect(response.status()).toBe(200);
[... 1 source-frame line omitted ...]
          |                                ^
      340 |                     const data = await check(page);
      341 |                     const sprites = await page.evaluate(collectSprites);
      342 |                     // One summary line per run, as family-portal's verifier printed.
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:339:32
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:329:17
    Error Context: test-results\verify-ui-gallery-passes-e-216ea-eck-in-the-bright-look-blue-desktop-light\error-context.md
  2) [desktop-light] › tests\e2e\verify-ui.spec.js:324:9 › gallery passes every verifier check in the bright look yellow › dark theme at 1440 px 
    Test timeout of 120000ms exceeded.
    Error: page.screenshot: Protocol error (Page.captureScreenshot): Unable to capture screenshot
    Call log:
      - taking page screenshot
      - waiting for fonts to load...
      - fonts loaded
      337 |                     await settleGalleryStyles(page);
      338 |                     expect(response.status()).toBe(200);
[... 1 source-frame line omitted ...]
          |                                ^
      340 |                     const data = await check(page);
      341 |                     const sprites = await page.evaluate(collectSprites);
      342 |                     // One summary line per run, as family-portal's verifier printed.
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:339:32
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:329:17
    Error Context: test-results\verify-ui-gallery-passes-e-4f494-k-in-the-bright-look-yellow-desktop-light\error-context.md
  3) [desktop-dark] › tests\e2e\verify-ui.spec.js:324:9 › shell-single-screen passes every verifier check in the bright look yellow › system theme at 1440 px 
    Error: expect(received).toEqual(expected) // deep equality
    - Expected  -  1
    + Received  + 59
    - Array []
    + Array [
```

```text
    +   "stylesheet not loaded: components/icon.css",
    +   "stylesheet not loaded: components/button.css",
    +   "stylesheet not loaded: components/icon-button.css",
    +   "stylesheet not loaded: components/fab.css",
    +   "stylesheet not loaded: components/link-button.css",
    +   "stylesheet not loaded: components/chip.css",
    +   "stylesheet not loaded: components/badge.css",
    +   "stylesheet not loaded: components/segmented.css",
    +   "stylesheet not loaded: components/field.css",
    +   "stylesheet not loaded: components/checkbox.css",
    +   "stylesheet not loaded: components/switch.css",
    +   "stylesheet not loaded: components/radio.css",
    +   "stylesheet not loaded: components/field-group.css",
    +   "stylesheet not loaded: components/form.css",
    +   "stylesheet not loaded: components/error-summary.css",
    +   "stylesheet not loaded: components/banner.css",
    +   "stylesheet not loaded: components/empty-state.css",
    +   "stylesheet not loaded: components/loading.css",
    +   "stylesheet not loaded: components/progress.css",
    +   "stylesheet not loaded: components/spinner.css",
    +   "stylesheet not loaded: components/row.css",
    +   "stylesheet not loaded: components/list.css",
    +   "stylesheet not loaded: components/selection.css",
    +   "stylesheet not loaded: components/table.css",
    +   "stylesheet not loaded: components/card.css",
    +   "stylesheet not loaded: components/icon-tile.css",
    +   "stylesheet not loaded: components/collapsible.css",
    +   "stylesheet not loaded: components/tabs.css",
    +   "stylesheet not loaded: components/avatar.css",
    +   "stylesheet not loaded: components/dialog.css",
    +   "stylesheet not loaded: components/inline-confirm.css",
    +   "stylesheet not loaded: components/menu.css",
    +   "stylesheet not loaded: components/popover.css",
    +   "stylesheet not loaded: components/tooltip.css",
    +   "stylesheet not loaded: components/account-menu.css",
    +   "stylesheet not loaded: components/toast.css",
    +   "stylesheet not loaded: shell.css",
    +   "button.button.button--secondary: target 140x21px < 44px",
    +   "select#look-select: target 68x19px < 44px",
    +   "select#accent-select: target 68x19px < 44px",
```

```text
    +   "input: target 60x18px < 44px",
    +   "input: target 48x18px < 44px",
    +   "input: target 45x18px < 44px",
    +   "button.button.button--secondary: target 44x21px < 44px",
    +   "button.button.button--secondary: target 68x21px < 44px",
    +   "button.button.button--secondary: target 64x21px < 44px",
    +   "a.skip-link: no visible focus indicator",
    +   "button.button.button--secondary: no visible focus indicator",
    +   "a: no visible focus indicator",
    +   "select#look-select: no visible focus indicator",
    +   "select#accent-select: no visible focus indicator",
    +   "input: no visible focus indicator",
    +   "input: no visible focus indicator",
    +   "input: no visible focus indicator",
    +   "button.button.button--secondary: no visible focus indicator",
    +   "button.button.button--secondary: no visible focus indicator",
    +   "button.button.button--secondary: no visible focus indicator",
    + ]
      350 |                     expect(sprites.references).toBeGreaterThan(0);
      351 |                     expect(luminance(parseColor(data.background).slice(0, 3)) < 0.2, `${effective} background ${data.background}`).toBe(effective === 'dark');
    > 352 |                     expect([...errors, ...summarize(data), ...sprites.problems]).toEqual([]);
          |                                                                                  ^
      353 |                     await page.close();
      354 |                 });
      355 |             }
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:352:82
        at C:\Dev-Projects\support.webapp\tests\e2e\verify-ui.spec.js:329:17
    Error Context: test-results\verify-ui-shell-single-scr-5a426-k-in-the-bright-look-yellow-desktop-dark\error-context.md
  3 failed
    [desktop-light] › tests\e2e\verify-ui.spec.js:324:9 › gallery passes every verifier check in the bright look blue 
    [desktop-light] › tests\e2e\verify-ui.spec.js:324:9 › gallery passes every verifier check in the bright look yellow 
    [desktop-dark] › tests\e2e\verify-ui.spec.js:324:9 › shell-single-screen passes every verifier check in the bright look yellow 
  2 skipped
  611 passed (8.4m)
**[ERROR]** Finished devops check in 542.1s with status: failed
```

### Serial diagnostic
Command: `npx playwright test tests/e2e/verify-ui.spec.js --project desktop-light --project desktop-dark --workers 1 --grep "gallery passes every verifier check in the bright look (blue|yellow)|shell-single-screen passes every verifier check in the bright look yellow"`.
Exit code: 0. No source changes occurred between runs.

```text
  6 passed (43.8s)
```

The intermittent failures are tracked by backlog T0044; their root cause remains unconfirmed.
The repeated full check uses unchanged source, default worker settings, and the original verifier assertions.

### Full check before review rework
Command: `python scripts/devops.py check`; exit code 0.
All configured suites passed, including the affected shell, verifier, and floating action button specs.
The output below preserves suite summaries and final packaging details:

```text
[... 2 lines omitted ...]
All 25 markdown files passed linting.
[... 2 lines omitted ...]
All checks passed!
[... 2 lines omitted ...]
4 files already formatted
[... 18 lines omitted ...]
============================== 3 passed in 5.15s ==============================
[... 5 lines omitted ...]
 Test Files  29 passed (29)
      Tests  2108 passed (2108)
[... 891 lines omitted ...]
  2 skipped
  614 passed (8.0m)
[... 5 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 113 lines omitted ...]
npm notice 2.4kB src/looks/warm/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.1-pre
npm notice filename: gpellicciotta-support.webapp-0.1.1-pre.tgz
npm notice package size: 937.6 kB
npm notice unpacked size: 1.2 MB
npm notice shasum: d4465d4010112f2a820e8145247c553ce1f057e9
npm notice integrity: sha512-VG1ew5zzP/8oc[...]PrO7WshL3zAjg==
npm notice total files: 103
npm notice
gpellicciotta-support.webapp-0.1.1-pre.tgz
```

