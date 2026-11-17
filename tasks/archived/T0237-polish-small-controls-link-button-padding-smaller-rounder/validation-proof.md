## Walkthrough & Validation

### Red phase
New and updated tests failed before the CSS change.
The segmented gap assertion and the tabs forced-colors assertion were added after this run.

`npx playwright test tests/e2e/link-button.spec.js tests/e2e/badge.spec.js tests/e2e/switch.spec.js tests/e2e/segmented.spec.js tests/e2e/tabs.spec.js --project desktop-light --reporter line` (exit 1)

```text
  1) [desktop-light] › tests\e2e\link-button.spec.js:67:1 › link buttons pad their label on both sides, so the focus glow never touches the text 
  2) [desktop-light] › tests\e2e\badge.spec.js:60:1 › badges use small text, a low box, and corners at least as round as controls in every look 
  3) [desktop-light] › tests\e2e\segmented.spec.js:76:1 › the forced state specimens and the disabled group render their states 
  4) [desktop-light] › tests\e2e\segmented.spec.js:111:1 › option outlines and focus glows stay inside each option, so neighbors and the track edge never touch 
  5) [desktop-light] › tests\e2e\segmented.spec.js:32:1 › arrow keys move the selection, and the focused option draws the focus ring 
  6) [desktop-light] › tests\e2e\tabs.spec.js:48:1 › tabs round only their top corners and mark the selection with a straight primary bar on the divider 
  7) [desktop-light] › tests\e2e\switch.spec.js:95:1 › switch uses a low track, one border width rounder than controls, with a concentric thumb in every look 
  7 failed
  14 passed (30.4s)
```

`npx vitest run tests/unit/switch.test.js` (exit 1)

```text
     42|         expect(track).toMatch(/--_switch-height:\s*calc\(var\(--space-…
       |                       ^
 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
```

### Green phase: full check after the final change
`python scripts/devops.py check` (exit 1; the one failure is unrelated, see below)

```text
All 26 markdown files passed linting.
All checks passed!
======================== 41 passed, 1 skipped in 2.39s ========================
 Test Files  33 passed (33)
      Tests  2163 passed (2163)
[... affected e2e lines from desktop-light; the other three projects passed too ...]
  ✓    5 [desktop-light] › tests\e2e\badge.spec.js:60:1 › badges use small text, a low box, and corners at least as round as controls in every look (6.1s)
  ✓   65 [desktop-light] › tests\e2e\link-button.spec.js:67:1 › link buttons pad their label on both sides, so the focus glow never touches the text (1.4s)
  ✓   90 [desktop-light] › tests\e2e\segmented.spec.js:32:1 › arrow keys move the selection, and the focused option draws the focus ring (1.7s)
  ✓   92 [desktop-light] › tests\e2e\segmented.spec.js:76:1 › the forced state specimens and the disabled group render their states (1.7s)
  ✓   95 [desktop-light] › tests\e2e\segmented.spec.js:111:1 › option outlines and focus glows stay inside each option, so neighbors and the track edge never touch (1.7s)
  ✓  139 [desktop-light] › tests\e2e\switch.spec.js:95:1 › switch uses a low track, one border width rounder than controls, with a concentric thumb in every look (2.8s)
  ✓  149 [desktop-light] › tests\e2e\tabs.spec.js:48:1 › tabs round only their top corners and mark the selection with a straight primary bar on the divider (2.7s)
  1 failed
    [mobile-dark] › tests\e2e\form.spec.js:83:1 › an edit during a pending check discards the old result and checks the new value 
  32 skipped
  743 passed (9.2m)
**[ERROR]** Finished devops check in 574.8s with status: failed
```

The form failure is a timing test this task does not touch.
It passed every run in isolation; follow-up T0242 tracks it.

`npx playwright test tests/e2e/form.spec.js --repeat-each 3 --reporter line` (exit 0)

```text
[84/84] [mobile-dark] › tests\e2e\form.spec.js:39:1 › an async check shows the pending state, then its error
  84 passed (2.5m)
```

### Integration suite
The check stops before `test:integration` after a Playwright failure, so it ran separately.
The worktree has no `node_modules`, so the generated app's junction found no ESLint plugins.
A temporary junction to the main checkout's `node_modules` was removed after the run.

`npx vitest run --config vitest.integration.config.js` (exit 0)

```text
 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  12:42:31
   Duration  196.34s (tests 100%)
```

### Visual verification
Gallery sections at 1440 px light and 390 px dark, in the neutral, warm, and bright looks.
The gallery loaded with HTTP 200 and no console, page, or HTTP errors (`openGallery` problem list empty).

| Section     | Before                                                       | After                                                       |
| :---------- | :----------------------------------------------------------- | :---------------------------------------------------------- |
| Link button | [neutral](before-link-button-neutral-desktop-light.png)      | [neutral](after-link-button-neutral-desktop-light.png)      |
| Badge       | [neutral](before-badge-neutral-desktop-light.png)            | [neutral](after-badge-neutral-desktop-light.png)            |
| Switch      | [neutral](before-switch-neutral-desktop-light.png)           | [neutral](after-switch-neutral-desktop-light.png)           |
| Segmented   | [neutral](before-segmented-neutral-desktop-light.png)        | [neutral](after-segmented-neutral-desktop-light.png)        |
| Tabs        | [neutral](before-tabs-neutral-desktop-light.png)             | [neutral](after-tabs-neutral-desktop-light.png)             |
| Tabs, dark  | [warm](before-tabs-warm-mobile-dark.png)                     | [warm](after-tabs-warm-mobile-dark.png)                     |

Every section also has warm and bright captures at both widths in this directory.
