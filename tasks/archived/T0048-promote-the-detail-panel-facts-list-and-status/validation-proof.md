## Walkthrough & Validation

### Red-Phase Unit Test Failure
Command: `npx.cmd vitest run tests/unit/detail-panel.test.js`
Exit code: `1`
```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0048-promote-the-detail-panel-facts-list-and-status

 ❯ tests/unit/detail-panel.test.js (4 tests | 4 failed) 294ms
   ❯ detail-panel, facts list, and status chip contracts (4)
     × registers detail-panel in contract.json and imports its partial in style.css 18ms
     × styles detail-panel header, scrolling body, sections, and danger zone with contract tokens only 7ms
     × maps bordered facts and compact facts onto list definition rows and styles status chips 3ms
     × renders gallery specimens and the admin console shell example 262ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/detail-panel.test.js > detail-panel, facts list, and status chip contracts > registers detail-panel in contract.json and imports its partial in style.css
AssertionError: expected [ 'button', 'icon-button', …(37) ] to include 'detail-panel'
[... 102 lines omitted ...]
 Test Files  1 failed (1)
      Tests  4 failed (4)
   Start at  02:06:27
   Duration  3.04s (import 85%, tests 11%, transform 3%, worker 1%)
```

### Red-Phase Playwright Browser Test Failure
Command: `npx.cmd playwright test tests/e2e/chip.spec.js tests/e2e/list.spec.js tests/e2e/detail-panel.spec.js tests/e2e/shell.spec.js --project=desktop-light --project=desktop-dark`
Exit code: `1`
```text
Running 120 tests using 4 workers

[... 1007 lines omitted ...]
  38 failed
    [desktop-light] › tests\e2e\chip.spec.js:7:1 › the chip section shows static, overdue, status, removable, and filter chips in every state 
    [desktop-light] › tests\e2e\chip.spec.js:121:5 › neutral status chips pair distinct icon shapes with words and color warning and danger icons 
    [desktop-light] › tests\e2e\chip.spec.js:121:5 › warm status chips pair distinct icon shapes with words and color warning and danger icons 
    [desktop-light] › tests\e2e\chip.spec.js:121:5 › bright status chips pair distinct icon shapes with words and color warning and danger icons 
    [desktop-light] › tests\e2e\detail-panel.spec.js:5:5 › neutral detail panel scrolls its body beneath a fixed header and separates its danger zone 
    [desktop-light] › tests\e2e\detail-panel.spec.js:58:5 › neutral admin console shell example integrates toolbar, selected row, pager, and open detail panel at 1440 px 
    [desktop-light] › tests\e2e\detail-panel.spec.js:5:5 › warm detail panel scrolls its body beneath a fixed header and separates its danger zone 
    [desktop-light] › tests\e2e\detail-panel.spec.js:58:5 › warm admin console shell example integrates toolbar, selected row, pager, and open detail panel at 1440 px 
    [desktop-light] › tests\e2e\detail-panel.spec.js:5:5 › bright detail panel scrolls its body beneath a fixed header and separates its danger zone 
    [desktop-light] › tests\e2e\detail-panel.spec.js:58:5 › bright admin console shell example integrates toolbar, selected row, pager, and open detail panel at 1440 px 
    [desktop-light] › tests\e2e\list.spec.js:48:5 › neutral facts lists render bordered term and value rows with a narrower compact column 
    [desktop-light] › tests\e2e\list.spec.js:48:5 › warm facts lists render bordered term and value rows with a narrower compact column 
    [desktop-light] › tests\e2e\list.spec.js:48:5 › bright facts lists render bordered term and value rows with a narrower compact column 
    [desktop-light] › tests\e2e\shell.spec.js:75:9 › admin-console shell demo › renders its areas and drops the absent ones 
    [desktop-light] › tests\e2e\shell.spec.js:119:9 › admin-console shell demo › scrolls the main area and keeps the bars in place 
    [desktop-light] › tests\e2e\shell.spec.js:152:9 › admin-console shell demo › puts the toast region in the overlay layer above the bottom bars 
    [desktop-light] › tests\e2e\shell.spec.js:167:9 › admin-console shell demo › leads the first Tab to a skip link that moves focus to the main area 
    [desktop-light] › tests\e2e\shell.spec.js:182:9 › admin-console shell demo › marks one current entry in each navigation 
    [desktop-light] › tests\e2e\shell.spec.js:325:1 › the gallery links to every shell demo page ───
[... 19 lines omitted ...]
  82 passed (1.5m)
```

### Summary of Changes
- Added `src/css/components/detail-panel.css` (`.detail-panel`, `__header`, `__title`, `__body`, `__section`, `__danger`, and `__actions`) using contract tokens only.
- Extended `src/css/components/list.css` with `.list--facts` and `.list--compact` on definition rows (`.list__term` and `.list__value`).
- Extended `src/css/components/chip.css` with `.chip--status`, coloring `.chip--warning` and `.chip--danger` icons in `--color-danger` alongside distinct icon shapes and words.
- Added gallery specimens in `src/demo/visual-style-gallery.html` and the admin console shell demo at `src/demo/shell-admin-console.html` (`src/demo/shell-admin-console.js`), plus verifier and shell checks at 1440 px.
- Updated `docs/specs/components.md`, `docs/adrs/ADR-0004-app-shell.md`, `docs/specs/visual-style-guide.md`, and `CHANGELOG.md`.

### Visual Verification Screenshots
- Chip: [before light](before-chip-desktop-light.png), [before dark](before-chip-desktop-dark.png), [after neutral light](after-chip-neutral-desktop-light.png), [after warm dark](after-chip-warm-desktop-dark.png), [after bright light](after-chip-bright-desktop-light.png)
- List: [before light](before-list-desktop-light.png), [before dark](before-list-desktop-dark.png), [after neutral light](after-list-neutral-desktop-light.png), [after warm dark](after-list-warm-desktop-dark.png)
- Detail panel: [neutral light](after-detail-panel-neutral-desktop-light.png), [warm dark](after-detail-panel-warm-desktop-dark.png), [bright mobile](after-detail-panel-bright-mobile-light.png)
- Shell and Admin console: [before shell](before-shell-desktop-light.png), [after shell](after-shell-desktop-light.png), [admin neutral light](after-admin-console-neutral-desktop-light.png), [admin neutral dark](after-admin-console-neutral-desktop-dark.png), [admin warm dark](after-admin-console-warm-desktop-dark.png), [admin bright light](after-admin-console-bright-desktop-light.png)

### Green-Phase Affected Browser Suite
Command: `npx.cmd playwright test tests/e2e/chip.spec.js tests/e2e/list.spec.js tests/e2e/detail-panel.spec.js tests/e2e/shell.spec.js`
Exit code: `0`
```text
Running 240 tests using 4 workers

  ✓    3 [desktop-light] › tests\e2e\chip.spec.js:52:1 › overdue chips carry the danger color and an icon, never color alone (2.5s)
  ✓    4 [desktop-light] › tests\e2e\chip.spec.js:44:1 › chips take the chip radius role (2.5s)
  ✓    2 [desktop-light] › tests\e2e\chip.spec.js:7:1 › the chip section shows static, overdue, status, removable, and filter chips in every state (2.7s)
[... 234 lines omitted ...]
  ✓  235 [mobile-dark] › tests\e2e\shell.spec.js:255:1 › a shell without a scroll modifier scrolls the main area, as the default app--scroll-main does (1.1s)
  ✓  237 [mobile-dark] › tests\e2e\shell.spec.js:299:1 › the toolbar menu button opens its sample menu (1.1s)
  ✓  239 [mobile-dark] › tests\e2e\shell.spec.js:325:1 › the gallery links to every shell demo page (1.4s)

  18 skipped
  222 passed (1.4m)
```

## python scripts/devops.py check (final)

```text
All 26 markdown files passed linting.
All checks passed!
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0048-promote-the-detail-panel-facts-list-and-status
======================== 41 passed, 1 skipped in 2.02s ========================
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0048-promote-the-detail-panel-facts-list-and-status
 Test Files  33 passed (33)
      Tests  2130 passed (2130)
  ✓   18 [desktop-light] › tests\e2e\chip.spec.js:7:1 › the chip section shows static, overdue, status, removable, and filter chips in every state (1.1s)
  ✓   27 [desktop-light] › tests\e2e\chip.spec.js:121:5 › neutral status chips pair distinct icon shapes with words and color warning and danger icons (1.1s)
  ✓   28 [desktop-light] › tests\e2e\chip.spec.js:121:5 › warm status chips pair distinct icon shapes with words and color warning and danger icons (1.4s)
  ✓   29 [desktop-light] › tests\e2e\chip.spec.js:121:5 › bright status chips pair distinct icon shapes with words and color warning and danger icons (1.5s)
  ✓   48 [desktop-light] › tests\e2e\form.spec.js:4:1 › a failed submit by Enter fills the error summary, announces it, and focuses it (1.0s)
  ✓   71 [desktop-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (2.0s)
  ✓  130 [desktop-light] › tests\e2e\spinner.spec.js:4:1 › decorative spinner sizes accompany status and stop under reduced motion (2.4s)
  ✓  206 [desktop-dark] › tests\e2e\chip.spec.js:7:1 › the chip section shows static, overdue, status, removable, and filter chips in every state (991ms)
  ✓  215 [desktop-dark] › tests\e2e\chip.spec.js:121:5 › neutral status chips pair distinct icon shapes with words and color warning and danger icons (1.2s)
  ✓  216 [desktop-dark] › tests\e2e\chip.spec.js:121:5 › warm status chips pair distinct icon shapes with words and color warning and danger icons (1.4s)
  ✓  217 [desktop-dark] › tests\e2e\chip.spec.js:121:5 › bright status chips pair distinct icon shapes with words and color warning and danger icons (1.3s)
  ✓  236 [desktop-dark] › tests\e2e\form.spec.js:4:1 › a failed submit by Enter fills the error summary, announces it, and focuses it (1.0s)
  ✓  259 [desktop-dark] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (2.1s)
  ✓  318 [desktop-dark] › tests\e2e\spinner.spec.js:4:1 › decorative spinner sizes accompany status and stop under reduced motion (2.7s)
  ✓  394 [mobile-light] › tests\e2e\chip.spec.js:7:1 › the chip section shows static, overdue, status, removable, and filter chips in every state (1.0s)
  ✓  403 [mobile-light] › tests\e2e\chip.spec.js:121:5 › neutral status chips pair distinct icon shapes with words and color warning and danger icons (1.3s)
  ✓  404 [mobile-light] › tests\e2e\chip.spec.js:121:5 › warm status chips pair distinct icon shapes with words and color warning and danger icons (1.6s)
  ✓  405 [mobile-light] › tests\e2e\chip.spec.js:121:5 › bright status chips pair distinct icon shapes with words and color warning and danger icons (1.4s)
  ✓  424 [mobile-light] › tests\e2e\form.spec.js:4:1 › a failed submit by Enter fills the error summary, announces it, and focuses it (1.1s)
  ✓  447 [mobile-light] › tests\e2e\loading.spec.js:5:1 › loading status and slow-list placeholders render across looks and motion preferences (2.2s)
  ✓  506 [mobile-light] › tests\e2e\spinner.spec.js:4:1 › decorative spinner sizes accompany status and stop under reduced motion (2.5s)
  ✓  582 [mobile-dark] › tests\e2e\chip.spec.js:7:1 › the chip section shows static, overdue, status, removable, and filter chips in every state (1.1s)
  ✓  591 [mobile-dark] › tests\e2e\chip.spec.js:121:5 › neutral status chips pair distinct icon shapes with words and color warning and danger icons (1.1s)
exit=0
```

Note: first run failed in tests/integration/generate-app.test.js because the worktree node_modules was empty; npm ci fixed it.

## Round 1 rework: python scripts/devops.py check (exit=0)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 50192
All 26 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 16408
All checks passed!
======================== 41 passed, 1 skipped in 2.14s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 45568
> @gpellicciotta/support.webapp@0.1.1-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0048-promote-the-detail-panel-facts-list-and-status
 Test Files  33 passed (33)
      Tests  2130 passed (2130)
[... per-test Playwright lines omitted ...]
  724 passed (5.1m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 46756
> @gpellicciotta/support.webapp@0.1.1-pre test:integration
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0048-promote-the-detail-panel-facts-list-and-status
 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  02:53:05
   Duration  48.40s (tests 100%)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 6592
> @gpellicciotta/support.webapp@0.1.1-pre prepack
exit=0
```
