## Walkthrough & Validation

The original live speech check was blocked. The orchestrator authorized Chromium accessibility evidence instead.
Manual Narrator or NVDA speech verification remains assigned to T0037.

### Failing-first unit tests
Command: `npx vitest run tests/unit/tooltip.test.js`

Exit code: 1

```text
RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0024-add-the-tooltip-component-after-a-screen-reader

 ❯ tests/unit/tooltip.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/tooltip.test.js [ tests/unit/tooltip.test.js ]
Error: Failed to resolve import "../../src/js/tooltip.js" from "tests/unit/tooltip.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0024-add-the-tooltip-component-after-a-screen-reader/tests/unit/tooltip.test.js:3:46
  1  |  // @vitest-environment happy-dom
  2  |  import { afterEach, expect, it, vi } from 'vitest';
  3  |  import { attachTooltip, createTooltip } from '../../src/js/tooltip.js';
     |                                                ^
  4  |  
  5  |  let controller;
 ❯ TransformPluginContext._formatLog node_modules/vite/dist/node/chunks/node.js:8865:39
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/node.js:8862:14
 ❯ resolveId node_modules/vite/dist/node/chunks/node.js:26552:18
 ❯ node_modules/vite/dist/node/chunks/node.js:26651:23
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/node.js:26624:4
 ❯ EnvironmentPluginContainer.transform node_modules/vite/dist/node/chunks/node.js:8636:14
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/node.js:20112:26

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  no tests
   Start at  01:49:52
   Duration  2.25s (environment 99%, worker 1%)
```

### Source accessibility check
Meteo commit: `8937c32fca32a82acc6a15b08901f354284cd14b`.
The script extracts the Settings button and stylesheet, then reproduces translation assignments using actual catalogs.
This isolated fixture does not execute meteo's full application or establish spoken announcements.

Command: `node C:/Dev-Projects/support.webapp/.plan/tasks/T0024-add-the-tooltip-component-after-a-screen-reader/meteo-check.mjs C:/Dev-Projects/meteo C:/Dev-Projects/support.webapp/.plan/tasks/T0024-add-the-tooltip-component-after-a-screen-reader/meteo-check.json`

Exit code: 0

```text
Chromium 158.0.8127.18; extracted Settings control; translation attribute assignments reproduced.
{"locale":"authored","mode":"focus","name":"Open settings","description":null,"generated":"\"Settings\""}
{"locale":"authored","mode":"hover","name":"Open settings","description":null,"generated":"\"Settings\""}
{"locale":"en","mode":"focus","name":"Open settings","description":"Settings","generated":"\"Settings\""}
{"locale":"en","mode":"hover","name":"Open settings","description":"Settings","generated":"\"Settings\""}
{"locale":"nl","mode":"focus","name":"Open instellingen","description":"Instellingen","generated":"\"Instellingen\""}
{"locale":"nl","mode":"hover","name":"Open instellingen","description":"Instellingen","generated":"\"Instellingen\""}
```

Before screenshots: [desktop light](before-desktop-light.png), [desktop dark](before-desktop-dark.png), [mobile light](before-mobile-light.png), [mobile dark](before-mobile-dark.png).

Before screenshots show the existing popover section before tooltip implementation.

### Interrupted verification
The first full check and affected browser run were terminated after script-free cases stalled in the script-injecting gallery helper.
Direct navigation corrected the test harness. Production tooltip behavior passed the interactive cases before interruption.

Command: `npx playwright test tests/e2e/tooltip.spec.js`

Exit code: 1

```text
[... 34 lines omitted ...]
(Use `node --trace-warnings ...` to show where the warning was created)
(node:8520) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok  8 [mobile-light] › tests\e2e\tooltip.spec.js:39:1 › description updates, reduced motion, and forced colors (1.9s)
  ok  7 [mobile-light] › tests\e2e\tooltip.spec.js:5:1 › tooltip focus, description, dismissal, hover and viewport (3.3s)
(node:88744) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:88744) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok 10 [mobile-dark] › tests\e2e\tooltip.spec.js:5:1 › tooltip focus, description, dismissal, hover and viewport (2.9s)
  ok 11 [mobile-dark] › tests\e2e\tooltip.spec.js:39:1 › description updates, reduced motion, and forced colors (943ms)
  x   2 [desktop-light] › tests\e2e\tooltip.spec.js:58:5 › without JavaScript › authored description remains readable (2.0m)
```

Graceful process termination failed; forced termination succeeded through the processes tool.
The leftover test server was also terminated through processes.

Command: `python scripts/devops.py check`

Exit code: 1

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 77140
docs\specs\components.md:84:1: MD017 [aligned-tables] Markdown table columns and delimiter pipes are not vertically aligned
**[WARN]**  Found 1 lint issue across 25 files.
**[ERROR]** Finished lint-markdown check in 0.5s with status: failed
**[ERROR]** Finished devops check in 0.8s with status: failed
```

The Markdown formatter repaired catalog table alignment before the final full check.

### Visual evidence
Inspected after screenshots for every look, theme, and required width:

- neutral: [desktop-light](after-neutral-desktop-light.png), [desktop-dark](after-neutral-desktop-dark.png), [mobile-light](after-neutral-mobile-light.png), [mobile-dark](after-neutral-mobile-dark.png).
- warm: [desktop-light](after-warm-desktop-light.png), [desktop-dark](after-warm-desktop-dark.png), [mobile-light](after-warm-mobile-light.png), [mobile-dark](after-warm-mobile-dark.png).
- bright: [desktop-light](after-bright-desktop-light.png), [desktop-dark](after-bright-desktop-dark.png), [mobile-light](after-bright-mobile-light.png), [mobile-dark](after-bright-mobile-dark.png).

Visible tooltip text, focus outlines, and viewport containment were confirmed.
The [WAI-ARIA tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) informed interaction behavior.
The pattern remains a work in progress; no screen reader speech result is claimed.

### Passing verification
Command: `python scripts/devops.py check`

Exit code: 0

Startup lint and Python output preceded this captured session excerpt.
Captured session output is in [check-output.txt](check-output.txt).

```text
Test Files  26 passed (26)
      Tests  2069 passed (2069)
[... 823 lines omitted ...]
  2 skipped
  546 passed (3.9m)
[... 5 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 116 lines omitted ...]
```

Command: `npx vitest run tests/unit/tooltip.test.js`

Exit code: 0

```text
RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0024-add-the-tooltip-component-after-a-screen-reader


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  02:00:32
   Duration  1.89s (environment 88%, tests 5%, transform 4%, import 2%, worker 1%)
```

Command: `plan tasks validate T0024 --completion`

Exit code: 0

```text
All 1 task file passed validation.
```

## Review Round One Rework
The changelog conflict was resolved, preserving every release bullet. The rebase completed at `0d2baf1`.
The fallback repair is committed as `92024b3`; final verification runs against that commit.

### Regression failure before implementation
Command: `npx playwright test tests/e2e/tooltip.spec.js --grep 'hidden-state fallback' --project desktop-light`

Exit code: 1

```text
[WebServer] (node:79604) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 3 tests using 3 workers

(node:51364) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:79692) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:55568) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:51364) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:79692) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:55568) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  x  3 [desktop-light] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without both (6.4s)
  x  2 [desktop-light] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without hidePopover (6.5s)
  x  1 [desktop-light] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without showPopover (6.6s)


  1) [desktop-light] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without showPopover ──

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('#tooltip-demo')
    Expected: visible
    Received: hidden
    Timeout:  5000ms

    Call log:
      - Expect "toBeVisible" locator('#tooltip-demo') with timeout 5000ms
      - waiting for locator('#tooltip-demo')
        12 × locator resolved to <span role="tooltip" class="tooltip" popover="manual" id="tooltip-demo">Get the latest forecast for this location.</span>
           - unexpected value "hidden"


      66 |         const tip = page.locator('#tooltip-demo');
      67 |         await trigger.focus();
```

```text
    > 68 |         await expect(tip).toBeVisible();
         |                           ^
      69 |         await expect(tip).not.toHaveAttribute('popover');
      70 |         await expect(tip).not.toHaveCSS('display', 'none');
      71 |         await expect(trigger).toHaveAccessibleDescription('Get the latest forecast for this location.');
        at C:\Dev-Projects\support.webapp\.plan\work\T0024-add-the-tooltip-component-after-a-screen-reader\tests\e2e\tooltip.spec.js:68:27

    Error Context: test-results\tooltip-hidden-state-fallback-without-showPopover-desktop-light\error-context.md

  2) [desktop-light] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without hidePopover ──

    Error: expect(locator).not.toHaveAttribute() failed

    Locator:  locator('#tooltip-demo')
    Expected: not have attribute
    Received: have attribute
    Timeout:  5000ms

    Call log:
      - Expect "not toHaveAttribute" locator('#tooltip-demo') with timeout 5000ms
      - waiting for locator('#tooltip-demo')
        14 × locator resolved to <span role="tooltip" class="tooltip" popover="manual" id="tooltip-demo">Get the latest forecast for this location.</span>
           - unexpected value "attribute present"


      67 |         await trigger.focus();
      68 |         await expect(tip).toBeVisible();
    > 69 |         await expect(tip).not.toHaveAttribute('popover');
         |                               ^
      70 |         await expect(tip).not.toHaveCSS('display', 'none');
      71 |         await expect(trigger).toHaveAccessibleDescription('Get the latest forecast for this location.');
      72 |         if (process.env.TOOLTIP_EVIDENCE) {
        at C:\Dev-Projects\support.webapp\.plan\work\T0024-add-the-tooltip-component-after-a-screen-reader\tests\e2e\tooltip.spec.js:69:31

    Error Context: test-results\tooltip-hidden-state-fallback-without-hidePopover-desktop-light\error-context.md

  3) [desktop-light] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without both ─────────

    Error: expect(locator).toBeVisible() failed

```

```text
    Locator:  locator('#tooltip-demo')
    Expected: visible
    Received: hidden
    Timeout:  5000ms

    Call log:
      - Expect "toBeVisible" locator('#tooltip-demo') with timeout 5000ms
      - waiting for locator('#tooltip-demo')
        12 × locator resolved to <span role="tooltip" class="tooltip" popover="manual" id="tooltip-demo">Get the latest forecast for this location.</span>
           - unexpected value "hidden"


      66 |         const tip = page.locator('#tooltip-demo');
      67 |         await trigger.focus();
    > 68 |         await expect(tip).toBeVisible();
         |                           ^
      69 |         await expect(tip).not.toHaveAttribute('popover');
      70 |         await expect(tip).not.toHaveCSS('display', 'none');
      71 |         await expect(trigger).toHaveAccessibleDescription('Get the latest forecast for this location.');
        at C:\Dev-Projects\support.webapp\.plan\work\T0024-add-the-tooltip-component-after-a-screen-reader\tests\e2e\tooltip.spec.js:68:27

    Error Context: test-results\tooltip-hidden-state-fallback-without-both-desktop-light\error-context.md

  3 failed
    [desktop-light] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without showPopover ───
    [desktop-light] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without hidePopover ───
    [desktop-light] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without both ──────────
```

### Passing affected browser checks
Command: `$env:TOOLTIP_EVIDENCE='C:/Dev-Projects/support.webapp/.plan/tasks/T0024-add-the-tooltip-component-after-a-screen-reader'; npx playwright test tests/e2e/tooltip.spec.js`

Exit code: 0

```text
[... 77 lines omitted ...]
(node:20148) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok 20 [mobile-dark] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without showPopover (1.4s)
  ok 21 [mobile-dark] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without both (1.3s)
(node:85284) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:85284) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok 19 [mobile-dark] › tests\e2e\tooltip.spec.js:5:1 › tooltip focus, description, dismissal, hover and viewport (3.5s)
  ok 22 [mobile-dark] › tests\e2e\tooltip.spec.js:106:5 › without JavaScript › authored description remains readable (696ms)
  ok 23 [mobile-dark] › tests\e2e\tooltip.spec.js:39:1 › description updates, reduced motion, and forced colors (1.4s)
(node:78788) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:78788) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok 24 [mobile-dark] › tests\e2e\tooltip.spec.js:57:5 › hidden-state fallback without hidePopover (1.2s)

  24 passed (49.4s)
```

Fallback evidence: [desktop light](fallback-both-desktop-light.png), [desktop dark](fallback-both-desktop-dark.png), [mobile light](fallback-both-mobile-light.png), [mobile dark](fallback-both-mobile-dark.png).

### Full verification on the final commit
Commit: `92024b3`.

Command: `python scripts/devops.py check *> 'C:/Dev-Projects/support.webapp/.plan/tasks/T0024-add-the-tooltip-component-after-a-screen-reader/review-check-output.txt'`

Exit code: 0

Selected output, retaining original summary lines and omission counts:

```text
[... 2 lines omitted ...]
All 25 markdown files passed linting.
[... 2 lines omitted ...]
All checks passed!
[... 21 lines omitted ...]
============================== 3 passed in 2.84s ==============================
[... 5 lines omitted ...]
 Test Files  26 passed (26)
      Tests  2084 passed (2084)
[... 879 lines omitted ...]
  2 skipped
  602 passed (5.1m)
[... 5 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 121 lines omitted ...]
```

Full output: [review-check-output.txt](review-check-output.txt).

Command: `plan tasks validate T0024 --completion`

Exit code: 0

```text
All 1 task file passed validation.
```
