## Walkthrough & Validation
### Changes
- Added `src/js/pull-refresh.js` with `attachPullRefresh`, ported from Auth's `pull-to-refresh.mjs` at commit `c7129b8`.
- Moved the indicator styles into `shell.css` as the `app__pull-indicator` overlay part and `html[data-pull-refresh]`.
- Wired the portal shell demo, which shows a sample refresh toast when installed.
- Documented the part in ADR-0004, components.md, and the style guide; recorded the sharing exception in ADR-0003.
- Deviations from Auth: state on `data-pull-refresh`, not a class; scrolled ancestors also block a pull;
  the indicator draws the sprite's `icon-sync-syncing` glyph; the refresh is announced through the live region.

### Red Phase
Command: `npx vitest run tests/unit/pull-refresh.test.js` (exit code 1).

```text
 ❯ tests/unit/pull-refresh.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/pull-refresh.test.js [ tests/unit/pull-refresh.test.js ]
Error: Failed to resolve import "../../src/js/pull-refresh.js" from "tests/unit/pull-refresh.test.js". Does the file exist?
  Plugin: vite:import-analysis
```

Command: `npx playwright test tests/e2e/pull-refresh.spec.js --project=mobile-light --reporter=line` (exit code 1).

```text
  1) [mobile-light] › tests\e2e\pull-refresh.spec.js:115:1 › the installed page keeps the browser from its native 
overscroll reload 
    Error: expect(locator).toHaveCSS(expected) failed
  2) [mobile-light] › tests\e2e\pull-refresh.spec.js:64:1 › the indicator follows a pull, arms past the threshold, and 
a release refreshes once 
    Error: expect(locator).toHaveAttribute(expected) failed
  2 failed
  2 passed (8.0s)
```

The two passing browser tests check the inactive cases, which hold before the feature exists.

### Green Phase
Command: `npx vitest run tests/unit/pull-refresh.test.js` (exit code 0).

```text
      Tests  16 passed (16)
   Duration  2.29s (tests 63%, environment 34%, transform 2%, import 1%)
```

Command: `npx playwright test tests/e2e/pull-refresh.spec.js tests/e2e/shell.spec.js tests/e2e/verify-ui.spec.js --reporter=line` (exit code 0).

```text
  296 passed (2.8m)
```

Command: `python scripts/devops.py check` (exit code 0).

```text
[... 2 lines omitted ...]
All 27 markdown files passed linting.
[... 2 lines omitted ...]
All checks passed!
[... 21 lines omitted ...]
======================== 61 passed, 1 skipped in 2.05s ========================
[... 5 lines omitted ...]
 Test Files  36 passed (36)
      Tests  2209 passed (2209)
[... 1196 lines omitted ...]
  858 passed (5.8m)
[... 6 lines omitted ...]
      Tests  7 passed (7)
[... 134 lines omitted ...]
gpellicciotta-support.webapp-0.4.0-pre.tgz
```

### Review Round 1 Rework
The fixes keep a pull through a zero move, drop it on a second finger or `touchcancel`, and accept text node targets.

Command: `npx vitest run tests/unit/pull-refresh.test.js`, before the fixes (exit code 1).

```text
 ❯ tests/unit/pull-refresh.test.js (20 tests | 4 failed) 1436ms
     × keeps a pull through a move that returns to the start height 34ms
     × lets the indicator go when a second finger lands mid-pull 9ms
     × starts a pull on a text node, as WebKit reports touches on text 6ms
     × cancels an armed pull when the system takes the touch 18ms
      Tests  4 failed | 16 passed (20)
```

Command: `npx vitest run tests/unit/pull-refresh.test.js`, after the fixes (exit code 0).

```text
      Tests  20 passed (20)
   Duration  3.55s (environment 52%, tests 44%, transform 2%, import 1%, worker 1%)
```

Command: `python scripts/devops.py check`, after the fixes (exit code 0).

```text
[... 2 lines omitted ...]
All 27 markdown files passed linting.
[... 2 lines omitted ...]
All checks passed!
[... 21 lines omitted ...]
======================== 61 passed, 1 skipped in 4.60s ========================
[... 5 lines omitted ...]
 Test Files  36 passed (36)
      Tests  2213 passed (2213)
[... 1196 lines omitted ...]
  858 passed (8.2m)
[... 6 lines omitted ...]
      Tests  7 passed (7)
[... 134 lines omitted ...]
gpellicciotta-support.webapp-0.4.0-pre.tgz
```

### Visual Verification
A scratch Playwright script loaded `/demo/shell-portal.html` at 390 px with a standalone `matchMedia` and a 140 px synthetic pull.
The server returned HTTP 200; the script reported no console, page, or HTTP problems before or after.

| Look    | Theme | Before                                                     | After                                                    |
| :------ | :---- | :--------------------------------------------------------- | :------------------------------------------------------- |
| neutral | light | [before](before-pull-neutral-mobile-light.png)             | [after](after-pull-neutral-mobile-light.png)             |
| neutral | dark  | [before](before-pull-neutral-mobile-dark.png)              | [after](after-pull-neutral-mobile-dark.png)              |
| warm    | light | [before](before-pull-warm-mobile-light.png)                | [after](after-pull-warm-mobile-light.png)                |
| warm    | dark  | [before](before-pull-warm-mobile-dark.png)                 | [after](after-pull-warm-mobile-dark.png)                 |
| bright  | light | [before](before-pull-bright-mobile-light.png)              | [after](after-pull-bright-mobile-light.png)              |
| bright  | dark  | [before](before-pull-bright-mobile-dark.png)               | [after](after-pull-bright-mobile-dark.png)               |

Before, the pull does nothing; after, the armed indicator sits centered under the top bar, turned by its progress.
