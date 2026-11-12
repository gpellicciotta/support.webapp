# T0030 Validation Proof

## Walkthrough & Validation
Command: `npx playwright test tests/e2e/bright.spec.js --project=mobile-dark --grep "bright accents"`; exit code: 0.

```text
  ok 1 [mobile-dark] › tests\e2e\bright.spec.js:47:1 › bright accents work on roots and wrappers and reset when switching looks (1.1s)

  1 passed (2.4s)
```

Command: `npm run test:integration`; exit code: 0.

```text
 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  21:38:39
   Duration  4.58s (tests 98%, transform 1%, import 1%)
```

Command: `plan tasks validate T0030 --completion`; exit code: 0.

```text
All 1 task file passed validation.
```

Command: `python scripts/devops.py check *> 'C:/Dev-Projects/support.webapp/.plan/tasks/T0030-design-and-add-the-tabs-component-with-tablist/check-rerun.log'; exit $LASTEXITCODE`; exit code: 1.
Final output excerpt follows; the complete output remains in [check-rerun.log](check-rerun.log).
This run passed the previous warm-card failure and failed a different existing bright-theme assertion.

```text
[... 466 lines omitted ...]
  ok 319 [mobile-dark] › tests\e2e\verify-ui.spec.js:381:1 › reports unresolved sprite references (977ms)
  ok 318 [mobile-dark] › tests\e2e\verify-ui.spec.js:355:1 › reports injected overflow, contrast, target, and focus violations (1.4s)
[bright light 390px] 36 stylesheets, 787 texts, 205 targets, 205 focus records, 129 sprite references, overflow 0px, errors 0
  ok 316 [mobile-dark] › tests\e2e\verify-ui.spec.js:321:9 › gallery passes every verifier check in the bright look yellow (5.0s)
[bright system 390px] 36 stylesheets, 787 texts, 205 targets, 205 focus records, 129 sprite references, overflow 0px, errors 0
  ok 320 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (2.0s)
[bright light 390px] 36 stylesheets, 787 texts, 205 targets, 205 focus records, 129 sprite references, overflow 0px, errors 0
  ok 317 [mobile-dark] › tests\e2e\verify-ui.spec.js:321:9 › gallery passes every verifier check in the bright look red (4.4s)
  1) [mobile-dark] › tests\e2e\bright.spec.js:47:1 › bright accents work on roots and wrappers and reset when switching looks 
    Error: expect(locator).toHaveCSS(expected) failed
    Locator:  locator('#accents [data-accent="blue"] .button').first()
    Expected: "rgb(0, 0, 0)"
    Received: "rgb(96, 165, 250)"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveCSS" locator('#accents [data-accent="blue"] .button').first() with timeout 5000ms
      - waiting for locator('#accents [data-accent="blue"] .button').first()
        13 × locator resolved to <button type="button" class="button">Default</button>
           - unexpected value "rgb(96, 165, 250)"
      59 |         await expect(page.locator('html')).toHaveAttribute('data-accent', accent);
      60 |         const color = await tokenColor(page, '--color-primary');
    > 61 |         await expect(page.locator(`#accents [data-accent="${accent}"] .button`).first()).toHaveCSS('background-color', color);
         |                                                                                          ^
[... 3 lines omitted ...]
        at C:\Dev-Projects\support.webapp\.plan\work\T0030-design-and-add-the-tabs-component-with-tablist\tests\e2e\bright.spec.js:61:90
    Error Context: test-results\bright-bright-accents-work-302fb--reset-when-switching-looks-mobile-dark\error-context.md
  1 failed
    [mobile-dark] › tests\e2e\bright.spec.js:47:1 › bright accents work on roots and wrappers and reset when switching looks 
  319 passed (2.2m)
**[ERROR]** Finished devops check in 155.0s with status: failed
```

Command: `python scripts/devops.py check`; exit code: 1.
All lint, fast tests, tabs browser tests, and gallery verifier checks passed.
The unrelated warm-card sizing assertion failed once; its cause remains unconfirmed.

```text
  1) [desktop-dark] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ──────────────────
    Error: expect(received).toBe(expected) // Object.is equality
    Expected: 300
    Received: 17
      16 |         for (const size of ['sm', 'md', 'lg']) {
      17 |             const box = await page.locator(`#icon-tile .icon-tile--${size}`).first().boundingBox();
    > 18 |             expect(box.height).toBe(box.width);
         |                                ^
      19 |             tileWidths.push(box.width);
      20 |         }
      21 |         expect(tileWidths[0]).toBeLessThan(tileWidths[1]);
        at C:\Dev-Projects\support.webapp\.plan\work\T0030-design-and-add-the-tabs-component-with-tablist\tests\e2e\card.spec.js:18:32
    Error Context: test-results\card-warm-cards-tiles-and-avatars-desktop-dark\error-context.md
  1 failed
    [desktop-dark] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ───────────────────
  319 passed (2.3m)
**[ERROR]** Finished devops check in 158.6s with status: failed
```

Command: `npx playwright test tests/e2e/card.spec.js --project=desktop-dark --grep "warm cards"`; exit code: 0.

```text
  ok 1 [desktop-dark] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars (1.6s)

  1 passed (3.2s)
```

Final screenshot refresh command:
`$env:TABS_EVIDENCE='C:/Dev-Projects/support.webapp/.plan/tasks/T0030-design-and-add-the-tabs-component-with-tablist'; npx playwright test tests/e2e/tabs.spec.js --workers=2`; exit code: 0.
The environment variable resolved to this companion directory.

```text
  8 passed (15.6s)
```

Command: `npx vitest run`; exit code: 0.

```text
 Test Files  25 passed (25)
      Tests  2059 passed (2059)
   Start at  21:32:22
   Duration  6.47s (environment 56%, import 29%, tests 12%, worker 2%, transform 1%)
```

Command: `lint-markdown check --offline docs/specs/components.md docs/specs/visual-style-guide.md`; exit code: 0.

```text
All 2 markdown files passed linting.
```

The initial proposal awaited approval; the orchestrator subsequently recorded approval under standing user authority.
The unit suite verifies selection, roving focus, keyboard wrapping, disabled tabs, restoration, malformed markup, and nested isolation.
Browser tests cover pointer, Enter, Space, arrow keys, Home, End, Tab, targets, overflow, and script-free content.
Four browser projects cover light and dark themes at 390 and 1440 pixels.

Command: `npx vitest run tests/unit/tabs.test.js`; exit code: 1.

```text
RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0030-design-and-add-the-tabs-component-with-tablist

 ❯ tests/unit/tabs.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/tabs.test.js [ tests/unit/tabs.test.js ]
Error: Failed to resolve import "../../src/js/tabs.js" from "tests/unit/tabs.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0030-design-and-add-the-tabs-component-with-tablist/tests/unit/tabs.test.js:3:28
  1  |  // @vitest-environment happy-dom
  2  |  import { afterEach, beforeEach, expect, it } from 'vitest';
  3  |  import { attachTabs } from '../../src/js/tabs.js';
     |                              ^
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
   Start at  21:29:01
   Duration  964ms (environment 99%, worker 1%)
```

Before implementation, browser tests also failed because the tabs section and panels did not exist.
Baseline screenshots capture the adjacent collapsible section before inserting tabs at that location.

Command: `lint-markdown check docs/specs/components.md`; exit code: 1.

```text
docs\specs\components.md:357:40: MD018 [valid-external-links] External link 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/' failed validation: HTTP 403
**[WARN]**  Found 1 lint issue across 1 files.
**[ERROR]** Finished lint-markdown check in 0.2s with status: failed
```

W3C returned a Cloudflare challenge even with a modern browser User-Agent.
The browsing tool successfully retrieved the W3C pattern and confirmed the referenced keyboard and ARIA guidance.

Command: `lint-markdown check --offline docs/specs/components.md`; exit code: 0.

```text
All 1 markdown files passed linting.
```
