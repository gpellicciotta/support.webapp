## Walkthrough & Validation

### Summary of Changes
- Added `src/css/components/toolbar.css` (`.toolbar`) for wrapping filter controls and trailing actions aligned to their bottom edge, sizing field containers to `min(100%, var(--width-menu))` without cross-component `.field` selectors.
- Added `src/css/components/pager.css` (`.pager`, `.pager__text`, `.pager__buttons`) for muted tabular-numeral page status text beside wrapping `First`, `Previous`, `Next`, and `Last` native buttons.
- Extended `src/css/components/table.css` with `.table__frame` (bordered card frame with contained overflow and clean bottom row edge), `tbody tr:is(:hover, .is-hover)` hover feedback, and `tbody tr[aria-selected='true']` selected state pairing `--color-surface-selected` with a primary inline-start edge (including `:dir(rtl)` and `@media (forced-colors: active)` `Highlight` border support).
- Registered `toolbar` and `pager` in `src/contract.json`, imported both partials in `src/css/style.css`, added gallery specimens in `src/demo/visual-style-gallery.html`, removed `Pagination` from `Not in the Package` in `docs/specs/components.md`, and updated `docs/specs/visual-style-guide.md` and `CHANGELOG.md`.

### Visual Verification Screenshots
- Neutral desktop light: [before table](before-table-neutral-desktop-light.png), [after table](after-table-neutral-desktop-light.png), [after toolbar](after-toolbar-neutral-desktop-light.png), [after pager](after-pager-neutral-desktop-light.png)
- Neutral desktop dark: [before table](before-table-neutral-desktop-dark.png), [after table](after-table-neutral-desktop-dark.png), [after toolbar](after-toolbar-neutral-desktop-dark.png), [after pager](after-pager-neutral-desktop-dark.png)
- Neutral mobile light: [before table](before-table-neutral-mobile-light.png), [after table](after-table-neutral-mobile-light.png), [after toolbar](after-toolbar-neutral-mobile-light.png), [after pager](after-pager-neutral-mobile-light.png)
- Warm desktop dark: [before table](before-table-warm-desktop-dark.png), [after table](after-table-warm-desktop-dark.png), [after toolbar](after-toolbar-warm-desktop-dark.png), [after pager](after-pager-warm-desktop-dark.png)
- Bright desktop light: [before table](before-table-bright-desktop-light.png), [after table](after-table-bright-desktop-light.png), [after toolbar](after-toolbar-bright-desktop-light.png), [after pager](after-pager-bright-desktop-light.png)
- Bright mobile dark: [before table](before-table-bright-mobile-dark.png), [after table](after-table-bright-mobile-dark.png), [after toolbar](after-toolbar-bright-mobile-dark.png), [after pager](after-pager-bright-mobile-dark.png)

### Red-Phase Unit Test Failure
Command: `npx.cmd vitest run tests/unit/toolbar.test.js tests/unit/pager.test.js tests/unit/table.test.js`
Exit code: `1`
```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0047-promote-the-toolbar-pager-and-data-table-row

 ❯ tests/unit/table.test.js (2 tests | 2 failed) 23ms
   ❯ table frame and row state contract (2)
     × defines the bordered frame, hover ground, and selected row edge with RTL and forced-colors support 15ms
     × documents and renders hover and selected rows in the catalog and gallery 6ms
 ❯ tests/unit/pager.test.js (3 tests | 3 failed) 239ms
   ❯ pager component contract (3)
     × registers pager in contract.json, imports its partial, and removes Pagination from Not in the Package 11ms
     × styles the status text and wrapping button group with contract tokens only 2ms
     × renders named navigation landmarks with First, Previous, Next, and Last boundary states in the gallery 223ms
 ❯ tests/unit/toolbar.test.js (3 tests | 3 failed) 237ms
   ❯ toolbar component contract (3)
     × registers toolbar in contract.json and imports its partial in style.css 9ms
     × aligns wrapping filter items to their bottom edge without cross-component class selectors 3ms
     × renders a labeled search toolbar with native controls in the gallery 223ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 8 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/pager.test.js > pager component contract > registers pager in contract.json, imports its partial, and removes Pagination from Not in the Package
AssertionError: expected [ 'button', 'icon-button', …(35) ] to include 'pager'
[... 181 lines omitted ...]
 Test Files  3 failed (3)
      Tests  8 failed (8)
   Start at  01:13:03
   Duration  1.90s (import 83%, tests 12%, transform 4%, worker 1%)
```

### Red-Phase Playwright Browser Test Failure
Command: `npx.cmd playwright test tests/e2e/toolbar.spec.js tests/e2e/pager.spec.js tests/e2e/table.spec.js --project=desktop-light`
Exit code: `1`
```text
Running 13 tests using 4 workers

  ✓   4 [desktop-light] › tests\e2e\table.spec.js:5:5 › neutral tables preserve headers and captions with keyboard scroll containment (5.0s)
  ✘   2 [desktop-light] › tests\e2e\pager.spec.js:5:5 › bright pager exposes boundary button states and wraps without overflow (4.9s)
  ✘   1 [desktop-light] › tests\e2e\pager.spec.js:5:5 › neutral pager exposes boundary button states and wraps without overflow (3.9s)
  ✘   3 [desktop-light] › tests\e2e\pager.spec.js:5:5 › warm pager exposes boundary button states and wraps without overflow (5.3s)
  ✘   5 [desktop-light] › tests\e2e\table.spec.js:42:5 › neutral framed table shows hover feedback and a selected row edge and ground (2.3s)
  ✓   6 [desktop-light] › tests\e2e\table.spec.js:5:5 › warm tables preserve headers and captions with keyboard scroll containment (2.1s)
  ✓   8 [desktop-light] › tests\e2e\table.spec.js:5:5 › bright tables preserve headers and captions with keyboard scroll containment (1.8s)
  ✘   7 [desktop-light] › tests\e2e\table.spec.js:42:5 › warm framed table shows hover feedback and a selected row edge and ground (2.6s)
  ✓  10 [desktop-light] › tests\e2e\table.spec.js:81:1 › dense tables reduce cell padding while preserving native headers (1.2s)
  ✘   9 [desktop-light] › tests\e2e\table.spec.js:42:5 › bright framed table shows hover feedback and a selected row edge and ground (2.5s)
  ✘  11 [desktop-light] › tests\e2e\toolbar.spec.js:5:5 › neutral toolbar aligns controls to the bottom edge and wraps on narrow screens (2.2s)
  ✘  12 [desktop-light] › tests\e2e\toolbar.spec.js:5:5 › bright toolbar aligns controls to the bottom edge and wraps on narrow screens (2.4s)
  ✘  13 [desktop-light] › tests\e2e\toolbar.spec.js:5:5 › warm toolbar aligns controls to the bottom edge and wraps on narrow screens (2.6s)
[... 227 lines omitted ...]
  9 failed
    [desktop-light] › tests\e2e\pager.spec.js:5:5 › neutral pager exposes boundary button states and wraps without overflow 
    [desktop-light] › tests\e2e\pager.spec.js:5:5 › warm pager exposes boundary button states and wraps without overflow 
    [desktop-light] › tests\e2e\pager.spec.js:5:5 › bright pager exposes boundary button states and wraps without overflow 
    [desktop-light] › tests\e2e\table.spec.js:42:5 › neutral framed table shows hover feedback and a selected row edge and ground 
    [desktop-light] › tests\e2e\table.spec.js:42:5 › warm framed table shows hover feedback and a selected row edge and ground 
    [desktop-light] › tests\e2e\table.spec.js:42:5 › bright framed table shows hover feedback and a selected row edge and ground 
    [desktop-light] › tests\e2e\toolbar.spec.js:5:5 › neutral toolbar aligns controls to the bottom edge and wraps on narrow screens 
    [desktop-light] › tests\e2e\toolbar.spec.js:5:5 › warm toolbar aligns controls to the bottom edge and wraps on narrow screens 
    [desktop-light] › tests\e2e\toolbar.spec.js:5:5 › bright toolbar aligns controls to the bottom edge and wraps on narrow screens 
  4 passed (18.4s)
```

### Green-Phase Affected Browser Suite
Command: `npx.cmd playwright test tests/e2e/toolbar.spec.js tests/e2e/pager.spec.js tests/e2e/table.spec.js`
Exit code: `0`
```text
Running 52 tests using 4 workers

  ✓   3 [desktop-light] › tests\e2e\pager.spec.js:5:5 › neutral pager exposes boundary button states and wraps without overflow (1.9s)
  ✓   2 [desktop-light] › tests\e2e\table.spec.js:5:5 › neutral tables preserve headers and captions with keyboard scroll containment (2.0s)
  ✓   1 [desktop-light] › tests\e2e\pager.spec.js:5:5 › bright pager exposes boundary button states and wraps without overflow (2.5s)
  ✓   4 [desktop-light] › tests\e2e\pager.spec.js:5:5 › warm pager exposes boundary button states and wraps without overflow (2.4s)
  ✓   5 [desktop-light] › tests\e2e\table.spec.js:42:5 › neutral framed table shows hover feedback and a selected row edge and ground (1.8s)
  ✓   6 [desktop-light] › tests\e2e\table.spec.js:5:5 › warm tables preserve headers and captions with keyboard scroll containment (2.3s)
  ✓   8 [desktop-light] › tests\e2e\table.spec.js:5:5 › bright tables preserve headers and captions with keyboard scroll containment (1.9s)
  ✓   7 [desktop-light] › tests\e2e\table.spec.js:42:5 › warm framed table shows hover feedback and a selected row edge and ground (2.1s)
  ✓  10 [desktop-light] › tests\e2e\table.spec.js:83:1 › dense tables reduce cell padding while preserving native headers (1.2s)
  ✓   9 [desktop-light] › tests\e2e\table.spec.js:42:5 › bright framed table shows hover feedback and a selected row edge and ground (1.9s)
  ✓  11 [desktop-light] › tests\e2e\toolbar.spec.js:5:5 › neutral toolbar aligns controls to the bottom edge and wraps on narrow screens (1.6s)
  ✓  12 [desktop-light] › tests\e2e\toolbar.spec.js:5:5 › warm toolbar aligns controls to the bottom edge and wraps on narrow screens (1.9s)
  ✓  13 [desktop-light] › tests\e2e\toolbar.spec.js:5:5 › bright toolbar aligns controls to the bottom edge and wraps on narrow screens (1.8s)
[... 33 lines omitted ...]
  ✓  47 [mobile-dark] › tests\e2e\table.spec.js:5:5 › bright tables preserve headers and captions with keyboard scroll containment (2.3s)
  ✓  48 [mobile-dark] › tests\e2e\table.spec.js:42:5 › bright framed table shows hover feedback and a selected row edge and ground (2.2s)
  ✓  49 [mobile-dark] › tests\e2e\table.spec.js:83:1 › dense tables reduce cell padding while preserving native headers (1.4s)
  ✓  50 [mobile-dark] › tests\e2e\toolbar.spec.js:5:5 › neutral toolbar aligns controls to the bottom edge and wraps on narrow screens (1.6s)
  ✓  52 [mobile-dark] › tests\e2e\toolbar.spec.js:5:5 › bright toolbar aligns controls to the bottom edge and wraps on narrow screens (1.7s)
  ✓  51 [mobile-dark] › tests\e2e\toolbar.spec.js:5:5 › warm toolbar aligns controls to the bottom edge and wraps on narrow screens (1.8s)

  52 passed (35.3s)
```

### Full Repository Check
Command: `python scripts/devops.py check`
Exit code: `0`
```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 13108
All 26 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 47100
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 33652
6 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 23464
> @gpellicciotta/support.webapp@0.1.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 17944
[... 12 lines omitted ...]
======================== 41 passed, 1 skipped in 3.24s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
[... 42 lines omitted ...]
 Test Files  32 passed (32)
      Tests  2123 passed (2123)
[... 4 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 40660
> @gpellicciotta/support.webapp@0.1.1-pre test:slow
> playwright test
Running 664 tests using 4 workers
[... 864 lines omitted ...]
  2 skipped
  662 passed (5.5m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 38696
[... 11 lines omitted ...]
 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  01:37:12
   Duration  62.56s (tests 100%)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 14088
[... 120 lines omitted ...]
npm notice total files: 105
npm notice
gpellicciotta-support.webapp-0.1.1-pre.tgz
```
