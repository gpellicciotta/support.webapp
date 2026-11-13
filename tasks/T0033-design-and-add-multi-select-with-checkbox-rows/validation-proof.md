## Walkthrough & Validation

Red phase: `npx vitest run tests/unit/selection.test.js`, exit code 1.

```text
RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0033-design-and-add-multi-select-with-checkbox-rows

 ❯ tests/unit/selection.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/selection.test.js [ tests/unit/selection.test.js ]
Error: Failed to resolve import "../../src/js/selection.js" from "tests/unit/selection.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0033-design-and-add-multi-select-with-checkbox-rows/tests/unit/selection.test.js:3:33
  1  |  // @vitest-environment happy-dom
  2  |  import { afterEach, beforeEach, expect, it, vi } from 'vitest';
  3  |  import { attachSelection } from '../../src/js/selection.js';
     |                                   ^
  4  |  
  5  |  let root;
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
   Start at  02:16:45
   Duration  1.06s (environment 99%, worker 1%)
```

Baseline browser run failed in all four projects because `#selection` did not exist.
The existing list was captured before implementation at both widths and themes.

Screenshots: [before desktop](before-desktop-light.png), [before mobile](before-mobile-dark.png).


Focus regression red phase: `npx vitest run tests/unit/selection.test.js`, exit code 1.

```text
[... 84 lines omitted ...]
-     <button
-       data-selection-clear=""
-     >
-       Clear
-     </button>
-     <button
-       data-selection-action="archive"
-     >
-       Archive
-     </button>
-   </div>
-   
-         
- </fieldset>

 ❯ tests/unit/selection.test.js:102:36
    100|     expect(all.disabled).toBe(true);
    101|     expect(all.indeterminate).toBe(false);
    102|     expect(document.activeElement).toBe(root);
       |                                    ^
    103| });
    104|


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 5 passed (6)
   Start at  02:21:28
   Duration  4.20s (environment 89%, tests 6%, transform 3%, import 1%, worker 1%)
```

Final fast suite: `npx vitest run`, exit code 0.

```text
RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0033-design-and-add-multi-select-with-checkbox-rows


 Test Files  27 passed (27)
      Tests  2093 passed (2093)
   Start at  02:22:12
   Duration  12.60s (environment 61%, import 26%, tests 10%, transform 2%, worker 1%)

    Isolate  27 workers spawned · ~2.18s startup each (spawn + environment, per file)
             at least ~6.23s faster with isolate: false — reuses workers across files instead of one per file
```

`npx eslint src/js/selection.js src/demo/gallery.js tests/unit/selection.test.js tests/e2e/selection.spec.js`, exit code 0.
No output.

`git diff --check`, exit code 0. No output.

Visual inspection confirmed readable rows, visible checkmarks, and wrapping bulk actions at both widths.

Initial full check: `python scripts/devops.py check`, exit code 1.
Its first browser worker loaded the obsolete Undo selector before correction.
The final affected browser runs above passed with the corrected selector.

```text
[bright system 390px] 45 stylesheets, 17 texts, 13 targets, 13 focus records, 2 sprite references, overflow 0px, errors 0
  ok 611 [mobile-dark] › tests\e2e\verify-ui.spec.js:386:1 › reports unresolved sprite references (1.0s)
[bright light 390px] 45 stylesheets, 17 texts, 13 targets, 13 focus records, 2 sprite references, overflow 0px, errors 0
  ok 608 [mobile-dark] › tests\e2e\verify-ui.spec.js:324:9 › shell-family-portal passes every verifier check in the bright look yellow (2.1s)
  ok 610 [mobile-dark] › tests\e2e\verify-ui.spec.js:360:1 › reports injected overflow, contrast, target, and focus violations (1.5s)
[bright light 390px] 45 stylesheets, 17 texts, 13 targets, 13 focus records, 2 sprite references, overflow 0px, errors 0
  ok 609 [mobile-dark] › tests\e2e\verify-ui.spec.js:324:9 › shell-family-portal passes every verifier check in the bright look red (2.1s)
  ok 612 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (2.1s)
  1) [desktop-light] › tests\e2e\selection.spec.js:5:1 › selection supports pointer ranges, keyboard, bulk bin action and Undo 
    Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Undo', exact: true }) resolved to 2 elements:
        1) <button type="button" data-toast-action="undo" class="button button--quiet">Undo</button> aka getByRole('button', { name: 'Undo' }).first()
        2) <button type="button" data-toast-action="undo" class="button button--quiet">Undo</button> aka getByRole('region', { name: 'Notifications' }).getByRole('button', { name: 'Undo' })
    Call log:
      - waiting for getByRole('button', { name: 'Undo', exact: true })
      34 |     await section.getByRole('button', { name: 'Move to bin' }).click();
      35 |     await expect(items.nth(0)).toBeHidden();
    > 36 |     await page.getByRole('region', { name: 'Notifications' }).getByRole('button', { name: 'Undo', exact: true }).click();
         |                                                                   ^
      37 |     await expect(items.nth(0)).toBeVisible();
      38 |     await expect(section.locator('[data-selection-count]')).toHaveText('0 selected');
      39 |     expect(problems).toEqual([]);
        at C:\Dev-Projects\support.webapp\.plan\work\T0033-design-and-add-multi-select-with-checkbox-rows\tests\e2e\selection.spec.js:36:67
    Error Context: test-results\selection-selection-suppor-c7659-rd-bulk-bin-action-and-Undo-desktop-light\error-context.md
  1 failed
    [desktop-light] › tests\e2e\selection.spec.js:5:1 › selection supports pointer ranges, keyboard, bulk bin action and Undo 
  2 skipped
  609 passed (5.3m)
**[ERROR]** Finished devops check in 332.3s with status: failed
```

The gallery verifier checks contrast and focus across every look, theme, and viewport.

- [Neutral desktop light](after-neutral-desktop-light.png)
- [Neutral desktop dark](after-neutral-desktop-dark.png)
- [Neutral mobile light](after-neutral-mobile-light.png)
- [Neutral mobile dark](after-neutral-mobile-dark.png)
- [Warm desktop light](after-warm-desktop-light.png)
- [Warm desktop dark](after-warm-desktop-dark.png)
- [Warm mobile light](after-warm-mobile-light.png)
- [Warm mobile dark](after-warm-mobile-dark.png)
- [Bright desktop light](after-bright-desktop-light.png)
- [Bright desktop dark](after-bright-desktop-dark.png)
- [Bright mobile light](after-bright-mobile-light.png)
- [Bright mobile dark](after-bright-mobile-dark.png)

Final affected browsers: `$env:SELECTION_EVIDENCE='C:\Dev-Projects\support.webapp\.plan\tasks\T0033-design-and-add-multi-select-with-checkbox-rows'; npx playwright test tests/e2e/selection.spec.js --workers 4`, exit code 0.
Playwright managed server PID 73548 and stopped it when the run completed.

Final full check: `python scripts/devops.py check *> node_modules/.cache/t0033-check.log`, exit code 0.
Browser runner PID 55240 completed; Playwright stopped its local server.
The redirected run in test-results was stopped before browser startup because cleanup stalled on its open log.
The final run used the separate cache log and completed normally.

```text
[... 2 lines omitted ...]
All 25 markdown files passed linting.
[... 2 lines omitted ...]
All checks passed!
[... 2 lines omitted ...]
4 files already formatted
[... 18 lines omitted ...]
============================== 3 passed in 1.83s ==============================
[... 5 lines omitted ...]
 Test Files  27 passed (27)
      Tests  2093 passed (2093)
[... 887 lines omitted ...]
  2 skipped
  610 passed (5.2m)
[... 5 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 112 lines omitted ...]
npm notice Tarball Details
[... 7 lines omitted ...]
npm notice total files: 101
[... 2 lines omitted ...]
```

Final affected browser output, exit code 0:

```text
(node:78596) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:31968) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:6500) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:59356) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:78596) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok 1 [desktop-light] › tests\e2e\selection.spec.js:46:5 › without JavaScript › native labeled rows remain selectable (1.0s)
  ok 3 [desktop-dark] › tests\e2e\selection.spec.js:46:5 › without JavaScript › native labeled rows remain selectable (1.5s)
  ok 4 [desktop-light] › tests\e2e\selection.spec.js:5:1 › selection supports pointer ranges, keyboard, bulk bin action and Undo (3.8s)
  ok 2 [desktop-dark] › tests\e2e\selection.spec.js:5:1 › selection supports pointer ranges, keyboard, bulk bin action and Undo (3.3s)
(node:82276) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:82276) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:43232) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:74896) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:43232) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:60264) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:74896) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:60264) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok 6 [mobile-light] › tests\e2e\selection.spec.js:46:5 › without JavaScript › native labeled rows remain selectable (1.0s)
  ok 8 [mobile-dark] › tests\e2e\selection.spec.js:46:5 › without JavaScript › native labeled rows remain selectable (1.3s)
  ok 5 [mobile-light] › tests\e2e\selection.spec.js:5:1 › selection supports pointer ranges, keyboard, bulk bin action and Undo (4.1s)
  ok 7 [mobile-dark] › tests\e2e\selection.spec.js:5:1 › selection supports pointer ranges, keyboard, bulk bin action and Undo (3.5s)

  8 passed (15.4s)
```

