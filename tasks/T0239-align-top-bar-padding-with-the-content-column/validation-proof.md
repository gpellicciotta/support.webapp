## Walkthrough & Validation

### Key changes
- `src/css/shell.css`: the top bar pads like the main area; its edge icon buttons pull outward by their glyph inset.
- Every look's `icon-more` draws vertical dots; the toolbar demo's overflow button sits at the bar end.

### Red phase: before the implementation
Command: `npx vitest run tests/unit/icon.test.js`; exit code 1.

```text
 ❯ tests/unit/icon.test.js (44 tests | 4 failed) 52ms
       × draws icon-more as three vertical dots on the center line 17ms
       × draws icon-more as three vertical dots on the center line 2ms
       × draws icon-more as three vertical dots on the center line 1ms
       × draws icon-more as three vertical dots on the center line 1ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  tests/unit/icon.test.js > core icon ids > bright sprite > draws icon-more as three vertical dots on the center line
 FAIL  tests/unit/icon.test.js > core icon ids > neutral sprite > draws icon-more as three vertical dots on the center line
 FAIL  tests/unit/icon.test.js > core icon ids > warm sprite > draws icon-more as three vertical dots on the center line
 FAIL  tests/unit/icon.test.js > core icon ids > _template sprite > draws icon-more as three vertical dots on the center line
 Test Files  1 failed (1)
      Tests  4 failed | 40 passed (44)
```

Command: `npx playwright test tests/e2e/shell.spec.js -g "top bar|overflow|pads both" --reporter=line`; exit code 1.

```text
[... 7 lines omitted ...]
  1) [desktop-light] › tests\e2e\shell.spec.js:217:9 › portal shell demo › aligns the top bar edge text and glyphs with the content column

    Error: start offset of app__brand

    expect(received).toBeLessThan(expected)

    Expected: < 0.5
    Received:   16
[... 526 lines omitted ...]
  25) [mobile-light] › tests\e2e\shell.spec.js:332:1 › the toolbar overflow button sits at the bar end and opens its sample menu

    Error: expect(locator).toHaveAttribute(expected) failed

    Locator: locator('.app__top-bar > .app__top-actions > .icon-button')
    Expected: "menu"
    Timeout: 5000ms
    Error: element(s) not found
[... 44 lines omitted ...]
  26 failed
[... 25 lines omitted ...]
    [mobile-dark] › tests\e2e\shell.spec.js:353:5 › the top bar pads both sides with the main column formula and their own safe-area insets
  2 skipped
  4 passed (23.3s)
```

### Green phase: after the implementation
Command: `npx vitest run tests/unit/icon.test.js`; exit code 0.

```text
 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  16:23:33
   Duration  379ms (import 43%, tests 30%, transform 17%, worker 9%)
```

Command: `npx playwright test tests/e2e/shell.spec.js --reporter=line`; exit code 0.
The alignment test measures the portal demo, and the other four demos, at 390 and 1440 px in light and dark.

```text
[164/164] [mobile-dark] › tests\e2e\shell.spec.js:385:1 › only shell.css sets fixed or sticky positions and pads bars with safe-area insets
  14 skipped
  150 passed (48.9s)
```

### Full check
The first `python scripts/devops.py check` run failed only in `tests/integration/generate-app.test.js`.
The worktree's `node_modules` held only Vite caches, so generated apps found no `@stylistic/eslint-plugin`.
Running `npm ci` in the worktree fixed the environment; no source change was involved.

Command: `npm run test:integration`; exit code 0.

```text
 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  16:34:12
   Duration  58.97s (tests 99%)
```

Command: `python scripts/devops.py check`; exit code 0.

```text
[... 2 lines omitted ...]
All 27 markdown files passed linting.
[... 2 lines omitted ...]
All checks passed!
[... 5 lines omitted ...]
> @gpellicciotta/support.webapp@0.1.1-pre lint
> eslint .
[... 14 lines omitted ...]
======================== 56 passed, 1 skipped in 2.87s ========================
[... 5 lines omitted ...]
 Test Files  33 passed (33)
      Tests  2167 passed (2167)
[... 1061 lines omitted ...]
  34 skipped
  798 passed (7.2m)
[... 5 lines omitted ...]
 Test Files  3 passed (3)
      Tests  7 passed (7)
[... 125 lines omitted ...]
npm notice total files: 106
npm notice
gpellicciotta-support.webapp-0.1.1-pre.tgz
exit 0
```

### Screenshots
Top 220 px of each demo, light mode, at 1440 px (desktop) and 390 px (mobile):

| Demo          | Before                                                               | After                                                              |
| :------------ | :------------------------------------------------------------------- | :----------------------------------------------------------------- |
| Toolbar       | [desktop](before-toolbar-desktop.png), [mobile](before-toolbar-mobile.png)             | [desktop](after-toolbar-desktop.png), [mobile](after-toolbar-mobile.png)             |
| Portal        | [desktop](before-portal-desktop.png), [mobile](before-portal-mobile.png)               | [desktop](after-portal-desktop.png), [mobile](after-portal-mobile.png)               |
| List editor   | [desktop](before-list-editor-desktop.png), [mobile](before-list-editor-mobile.png)     | [desktop](after-list-editor-desktop.png), [mobile](after-list-editor-mobile.png)     |
| Single screen | [desktop](before-single-screen-desktop.png), [mobile](before-single-screen-mobile.png) | [desktop](after-single-screen-desktop.png), [mobile](after-single-screen-mobile.png) |
| Admin console | [desktop](before-admin-console-desktop.png)                          | [desktop](after-admin-console-desktop.png)                         |
