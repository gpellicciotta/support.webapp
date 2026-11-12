# T0031 Validation Proof

## Completion Gate Result
Command: `plan tasks validate T0031 --completion` (exit code 1).

```text
Task files with issues:
- **NOT OK** T0031

Found 1 lint issue across 1 task file.
```

The remaining issue is the intentionally unchecked complete-repository verification step.
Implementation and the named completion check passed; the full repository check remains blocked by Warm card failures.


## Final Fast Suite and Completion Check
Command: `$env:LIST_TABLE_PROOF = 'C:/Dev-Projects/support.webapp/.plan/tasks/T0031-design-and-add-the-list-and-data-table'; python scripts/devops.py check` (exit code 1).
Fast-suite and lint output from that run:

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 22408
All 25 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 56224
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 43548
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 59004
> @gpellicciotta/support.webapp@0.1.0-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 84884
============================= test session starts =============================
platform win32 -- Python 3.15.2, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0031-design-and-add-the-list-and-data-table
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [3 items]
...                                                                      [100%]
============================== 3 passed in 2.42s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 19372
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0031-design-and-add-the-list-and-data-table
 Test Files  24 passed (24)
      Tests  2055 passed (2055)
   Start at  22:10:17
   Duration  5.93s (environment 52%, import 33%, tests 13%, worker 2%, transform 1%)
    Isolate  24 workers spawned · ~1.05s startup each (spawn + environment, per file)
             at least ~2.55s faster with isolate: false — reuses workers across files instead of one per file
[... 512 lines omitted ...]
```

Command: `npx playwright test tests/e2e/list.spec.js tests/e2e/table.spec.js --reporter=line` (exit code 0).

```text
[... 132 lines omitted ...]
[31/32] [mobile-dark] › tests\e2e\table.spec.js:5:5 › bright tables preserve headers and captions with keyboard scroll containment
[32/32] [mobile-dark] › tests\e2e\table.spec.js:45:1 › dense tables reduce cell padding while preserving native headers
  32 passed (17.5s)
```

Command: `plan tasks validate T0031` (exit code 0).

```text
All 1 task file passed validation.
```



## Final Validation Gate
The complete repository check remains unsuccessful; no completion or review approval is claimed.
All list/table cases and gallery-verifier cases passed in the final full run.
The Warm card failure also reproduced with one worker; its underlying cause remains unconfirmed.

Command: `$env:LIST_TABLE_PROOF = 'C:/Dev-Projects/support.webapp/.plan/tasks/T0031-design-and-add-the-list-and-data-table'; python scripts/devops.py check` (exit code 1).
Full output: [final-check.txt](final-check.txt).

[... 506 lines omitted ...]

```text
  1) [desktop-light] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ─────────────────
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
        at C:\Dev-Projects\support.webapp\.plan\work\T0031-design-and-add-the-list-and-data-table\tests\e2e\card.spec.js:18:32
    Error Context: test-results\card-warm-cards-tiles-and-avatars-desktop-light\error-context.md
  2) [mobile-light] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ──────────────────
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
        at C:\Dev-Projects\support.webapp\.plan\work\T0031-design-and-add-the-list-and-data-table\tests\e2e\card.spec.js:18:32
    Error Context: test-results\card-warm-cards-tiles-and-avatars-mobile-light\error-context.md
  3) [mobile-dark] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ───────────────────
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
        at C:\Dev-Projects\support.webapp\.plan\work\T0031-design-and-add-the-list-and-data-table\tests\e2e\card.spec.js:18:32
    Error Context: test-results\card-warm-cards-tiles-and-avatars-mobile-dark\error-context.md
  3 failed
```

```text
    [desktop-light] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ──────────────────
    [mobile-light] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ───────────────────
    [mobile-dark] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ────────────────────
  341 passed (2.4m)
**[ERROR]** Finished devops check in 161.0s with status: failed
```

Command: `npx playwright test tests/e2e/card.spec.js tests/e2e/bright.spec.js --workers=1 --reporter=line` (exit code 1).
Full output: [style-readiness-check.txt](style-readiness-check.txt).

```text

[WebServer] (node:82220) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 16 tests using 1 worker


(node:60632) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)

(node:60632) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1/16] [desktop-light] › tests\e2e\bright.spec.js:5:1 › forced fallback preserves root accents and every contrast pair
[2/16] [desktop-light] › tests\e2e\bright.spec.js:47:1 › bright accents work on roots and wrappers and reset when switching looks
[3/16] [desktop-light] › tests\e2e\card.spec.js:5:5 › neutral cards, tiles, and avatars
[4/16] [desktop-light] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars
(node:87972) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)


(node:87972) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[5/16] [desktop-dark] › tests\e2e\bright.spec.js:5:1 › forced fallback preserves root accents and every contrast pair
[6/16] [desktop-dark] › tests\e2e\bright.spec.js:47:1 › bright accents work on roots and wrappers and reset when switching looks
[7/16] [desktop-dark] › tests\e2e\card.spec.js:5:5 › neutral cards, tiles, and avatars
[8/16] [desktop-dark] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars
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
```

```text
        at C:\Dev-Projects\support.webapp\.plan\work\T0031-design-and-add-the-list-and-data-table\tests\e2e\card.spec.js:18:32

    Error Context: test-results\card-warm-cards-tiles-and-avatars-desktop-dark\error-context.md



(node:56400) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)

(node:56400) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[9/16] [mobile-light] › tests\e2e\bright.spec.js:5:1 › forced fallback preserves root accents and every contrast pair
[10/16] [mobile-light] › tests\e2e\bright.spec.js:47:1 › bright accents work on roots and wrappers and reset when switching looks
[11/16] [mobile-light] › tests\e2e\card.spec.js:5:5 › neutral cards, tiles, and avatars
[12/16] [mobile-light] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars

(node:19108) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)

(node:19108) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[13/16] [mobile-dark] › tests\e2e\bright.spec.js:5:1 › forced fallback preserves root accents and every contrast pair
[14/16] [mobile-dark] › tests\e2e\bright.spec.js:47:1 › bright accents work on roots and wrappers and reset when switching looks
[15/16] [mobile-dark] › tests\e2e\card.spec.js:5:5 › neutral cards, tiles, and avatars
[16/16] [mobile-dark] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars
  1 failed
    [desktop-dark] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ───────────────────
  15 passed (1.2m)
```

Command: `npm run test:integration` (exit code 0).
Full output: [integration-check.txt](integration-check.txt).

```text

> @gpellicciotta/support.webapp@0.1.0-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0031-design-and-add-the-list-and-data-table


 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  22:15:11
   Duration  4.61s (tests 98%, transform 1%, import 1%)
```

Command: `npm pack --dry-run` (exit code 0).
Full output: [pack-check.txt](pack-check.txt).

[... 98 lines omitted ...]

```text
npm notice 184B src/looks/warm/index.css
npm notice 7.2kB src/looks/warm/look.css
npm notice 2.4kB src/looks/warm/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 927.6 kB
npm notice unpacked size: 1.1 MB
npm notice shasum: b43aada4251f8fc21e560fdf7d40a923a37b56b9
npm notice integrity: sha512-EBFL1yXX8M9rT[...]91kiDFk/KgNmg==
npm notice total files: 90
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```



## Variant Red Phase
Command: `npx playwright test tests/e2e/list.spec.js tests/e2e/table.spec.js --grep "ordered|dense" --project=desktop-light --workers=2 --reporter=line` (exit code 1).

Full output: [variants-red.txt](variants-red.txt).

```text

[WebServer] (node:74396) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 2 tests using 2 workers


(node:78588) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)

(node:72160) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)

(node:78588) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:72160) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)

[1/2] [desktop-light] › tests\e2e\table.spec.js:45:1 › dense tables reduce cell padding while preserving native headers
[2/2] [desktop-light] › tests\e2e\list.spec.js:47:1 › ordered lists preserve visible sequence markers
  1) [desktop-light] › tests\e2e\table.spec.js:45:1 › dense tables reduce cell padding while preserving native headers 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#table').getByRole('table', { name: 'Summary totals' })
    Expected: visible
    Timeout: 1000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" locator('#table').getByRole('table', { name: 'Summary totals' }) with timeout 1000ms
      - waiting for locator('#table').getByRole('table', { name: 'Summary totals' })


      46 |     const problems = await openGallery(page);
      47 |     const dense = page.locator('#table').getByRole('table', { name: 'Summary totals' });
    > 48 |     await expect(dense).toBeVisible({ timeout: 1000 });
         |                         ^
      49 |     await expect(dense.getByRole('columnheader')).toHaveCount(2);
      50 |     await expect(dense.getByRole('rowheader')).toHaveCount(2);
```

```text
      51 |     const padding = await dense.locator('td').first().evaluate(element => parseFloat(getComputedStyle(element).paddingTop));
        at C:\Dev-Projects\support.webapp\.plan\work\T0031-design-and-add-the-list-and-data-table\tests\e2e\table.spec.js:48:25

    Error Context: test-results\table-dense-tables-reduce--d270d-e-preserving-native-headers-desktop-light\error-context.md


  2) [desktop-light] › tests\e2e\list.spec.js:47:1 › ordered lists preserve visible sequence markers 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#list').getByRole('list', { name: 'Preparation steps' })
    Expected: visible
    Timeout: 1000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" locator('#list').getByRole('list', { name: 'Preparation steps' }) with timeout 1000ms
      - waiting for locator('#list').getByRole('list', { name: 'Preparation steps' })


      48 |     const problems = await openGallery(page);
      49 |     const ordered = page.locator('#list').getByRole('list', { name: 'Preparation steps' });
    > 50 |     await expect(ordered).toBeVisible({ timeout: 1000 });
         |                           ^
      51 |     await expect(ordered).toHaveCSS('list-style-type', 'decimal');
      52 |     await expect(ordered.getByRole('listitem')).toHaveCount(2);
      53 |     expect(await ordered.evaluate(element => element.tagName)).toBe('OL');
        at C:\Dev-Projects\support.webapp\.plan\work\T0031-design-and-add-the-list-and-data-table\tests\e2e\list.spec.js:50:27

    Error Context: test-results\list-ordered-lists-preserve-visible-sequence-markers-desktop-light\error-context.md


  2 failed
    [desktop-light] › tests\e2e\list.spec.js:47:1 › ordered lists preserve visible sequence markers 
    [desktop-light] › tests\e2e\table.spec.js:45:1 › dense tables reduce cell padding while preserving native headers
```


## Initial Full Check
Command: `python scripts/devops.py check` (exit code 1).

Full output: [full-check.txt](full-check.txt).

[... 487 lines omitted ...]

```text
  ok 336 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (2.2s)
[bright light 390px] 37 stylesheets, 813 texts, 203 targets, 203 focus records, 129 sprite references, overflow 0px, errors 0
  ok 333 [mobile-dark] › tests\e2e\verify-ui.spec.js:321:9 › gallery passes every verifier check in the bright look red (4.9s)
  1) [mobile-light] › tests\e2e\bright.spec.js:47:1 › bright accents work on roots and wrappers and reset when switching looks 
    Error: expect(locator).toHaveCSS(expected) failed
    Locator:  locator('#accents [data-accent="blue"] .button').first()
    Expected: "rgb(0, 0, 0)"
    Received: "rgb(26, 86, 219)"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveCSS" locator('#accents [data-accent="blue"] .button').first() with timeout 5000ms
      - waiting for locator('#accents [data-accent="blue"] .button').first()
        13 × locator resolved to <button type="button" class="button">Default</button>
           - unexpected value "rgb(26, 86, 219)"
      59 |         await expect(page.locator('html')).toHaveAttribute('data-accent', accent);
      60 |         const color = await tokenColor(page, '--color-primary');
    > 61 |         await expect(page.locator(`#accents [data-accent="${accent}"] .button`).first()).toHaveCSS('background-color', color);
         |                                                                                          ^
      62 |         if (process.env.BRIGHT_PROOF) {
[... 1 lines omitted ...]
      64 |         }
        at C:\Dev-Projects\support.webapp\.plan\work\T0031-design-and-add-the-list-and-data-table\tests\e2e\bright.spec.js:61:90
    Error Context: test-results\bright-bright-accents-work-302fb--reset-when-switching-looks-mobile-light\error-context.md
  1 failed
    [mobile-light] › tests\e2e\bright.spec.js:47:1 › bright accents work on roots and wrappers and reset when switching looks 
  335 passed (2.5m)
**[ERROR]** Finished devops check in 165.2s with status: failed
```



## Initial Green Phase
Command: `$env:LIST_TABLE_PROOF = 'C:/Dev-Projects/support.webapp/.plan/tasks/T0031-design-and-add-the-list-and-data-table'; npx playwright test tests/e2e/list.spec.js tests/e2e/table.spec.js tests/e2e/row.spec.js tests/e2e/verify-ui.spec.js --workers=4 --reporter=line` (exit code 0).

```text
[... 267 lines omitted ...]
[bright light 390px] 37 stylesheets, 813 texts, 203 targets, 203 focus records, 129 sprite references, overflow 0px, errors 0

[mobile-dark] › tests\e2e\verify-ui.spec.js:321:9 › gallery passes every verifier check in the bright look red
[bright system 390px] 37 stylesheets, 813 texts, 203 targets, 203 focus records, 129 sprite references, overflow 0px, errors 0

[bright light 390px] 37 stylesheets, 813 texts, 203 targets, 203 focus records, 129 sprite references, overflow 0px, errors 0

  56 passed (52.0s)
```

Full output: [affected-tests.txt](affected-tests.txt).

Command: `lint-markdown check --offline docs/specs/components.md docs/specs/visual-style-guide.md` (exit code 0).

```text
All 2 markdown files passed linting.
```


## Original Design Approval Checkpoint
The list and table proposals are recorded in components.md on the task branch.
Task step 2 requires user approval before implementation; approval has not been recorded.
At that checkpoint, no runtime files changed; automated feature tests and visual captures did not apply to the proposal.

## Planned Test Cases
- Existing static token tests cover CSS token usage; no dedicated unit test applies to these CSS-only components.
- List browser tests verify native list items, description pairs, wrapping, nested action focus, and retained list semantics.
- Table browser tests verify caption naming, scoped headers, numeric alignment, and native table semantics.
- At 390 px, browser tests verify contained horizontal scrolling and keyboard access to the scroll region.
- Gallery verification covers light/dark themes at 390/1440 px, console errors, network failures, contrast, and page overflow.
- Capture and inspect before/after screenshots before requesting integration.

## Walkthrough & Validation
Command: `lint-markdown check docs/specs/components.md` (exit code 1).

```text
docs\specs\components.md:345:38: MD018 [valid-external-links] External link 'https://www.w3.org/WAI/tutorials/page-structure/content/' failed validation: HTTP 403
**[WARN]**  Found 2 lint issues across 1 files.
docs\specs\components.md:371:30: MD018 [valid-external-links] External link 'https://www.w3.org/WAI/ARIA/apg/patterns/table/' failed validation: HTTP 403
**[ERROR]** Finished lint-markdown check in 0.4s with status: failed
```

The web reader retrieved both W3C pages; direct requests with a modern browser User-Agent received Cloudflare challenges.
Offline lint checks document formatting while external validation remains limited by those HTTP 403 responses.

Command: `lint-markdown check --offline docs/specs/components.md` (exit code 0).

```text
All 1 markdown files passed linting.
```

Command: `plan tasks validate T0031 --completion` (exit code 1).

```text
Task files with issues:
- **NOT OK** T0031

Found 11 lint issues across 1 task file.
```

At that checkpoint, design approval, implementation, tests, visual evidence, and final review remained pending.

## Implementation Red Phase
The orchestrator recorded contract approval before this phase.
Installed locked dependencies using `npm ci`; the first test invocation lacked local Playwright dependencies.
Every new browser case failed on the absent gallery section before production changes.

Command: `$env:LIST_TABLE_BEFORE = 'C:/Dev-Projects/support.webapp/.plan/tasks/T0031-design-and-add-the-list-and-data-table'; npx playwright test tests/e2e/list.spec.js tests/e2e/table.spec.js --workers=4 --reporter=line` (exit code 1).

Final summary, verbatim:

```text
  24 failed
    [desktop-light] › tests\e2e\list.spec.js:5:5 › neutral lists retain semantics, wrap content, and preserve action focus 
    [desktop-light] › tests\e2e\list.spec.js:5:5 › warm lists retain semantics, wrap content, and preserve action focus 
    [desktop-light] › tests\e2e\list.spec.js:5:5 › bright lists retain semantics, wrap content, and preserve action focus 
    [desktop-light] › tests\e2e\table.spec.js:5:5 › neutral tables preserve headers and captions with keyboard scroll containment 
    [desktop-light] › tests\e2e\table.spec.js:5:5 › warm tables preserve headers and captions with keyboard scroll containment 
    [desktop-light] › tests\e2e\table.spec.js:5:5 › bright tables preserve headers and captions with keyboard scroll containment 
    [desktop-dark] › tests\e2e\list.spec.js:5:5 › neutral lists retain semantics, wrap content, and preserve action focus 
    [desktop-dark] › tests\e2e\list.spec.js:5:5 › warm lists retain semantics, wrap content, and preserve action focus 
    [desktop-dark] › tests\e2e\list.spec.js:5:5 › bright lists retain semantics, wrap content, and preserve action focus 
    [desktop-dark] › tests\e2e\table.spec.js:5:5 › neutral tables preserve headers and captions with keyboard scroll containment 
    [desktop-dark] › tests\e2e\table.spec.js:5:5 › warm tables preserve headers and captions with keyboard scroll containment 
    [desktop-dark] › tests\e2e\table.spec.js:5:5 › bright tables preserve headers and captions with keyboard scroll containment 
    [mobile-light] › tests\e2e\list.spec.js:5:5 › neutral lists retain semantics, wrap content, and preserve action focus 
    [mobile-light] › tests\e2e\list.spec.js:5:5 › warm lists retain semantics, wrap content, and preserve action focus 
    [mobile-light] › tests\e2e\list.spec.js:5:5 › bright lists retain semantics, wrap content, and preserve action focus 
    [mobile-light] › tests\e2e\table.spec.js:5:5 › neutral tables preserve headers and captions with keyboard scroll containment 
    [mobile-light] › tests\e2e\table.spec.js:5:5 › warm tables preserve headers and captions with keyboard scroll containment 
    [mobile-light] › tests\e2e\table.spec.js:5:5 › bright tables preserve headers and captions with keyboard scroll containment 
    [mobile-dark] › tests\e2e\list.spec.js:5:5 › neutral lists retain semantics, wrap content, and preserve action focus 
    [mobile-dark] › tests\e2e\list.spec.js:5:5 › warm lists retain semantics, wrap content, and preserve action focus 
    [mobile-dark] › tests\e2e\list.spec.js:5:5 › bright lists retain semantics, wrap content, and preserve action focus 
    [mobile-dark] › tests\e2e\table.spec.js:5:5 › neutral tables preserve headers and captions with keyboard scroll containment 
    [mobile-dark] › tests\e2e\table.spec.js:5:5 › warm tables preserve headers and captions with keyboard scroll containment 
    [mobile-dark] › tests\e2e\table.spec.js:5:5 › bright tables preserve headers and captions with keyboard scroll containment
```

Representative assertion details from the same run:

```text
    Error: expect(locator).toBeVisible() failed

    Locator: locator('#list')
    Expected: visible
    Timeout: 1000ms
    Error: element(s) not found
```

```text
    Error: expect(locator).toBeVisible() failed

    Locator: locator('#table')
    Expected: visible
    Timeout: 1000ms
    Error: element(s) not found
```
