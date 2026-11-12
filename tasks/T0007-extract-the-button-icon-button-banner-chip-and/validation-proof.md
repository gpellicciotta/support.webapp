# T0007 Validation Proof

## Walkthrough & Validation

### Red phase

Command: `npx vitest run tests/unit/tokens.test.js tests/unit/gallery.test.js`, exit code 1.

```text
 FAIL  tests/unit/gallery.test.js > banner specimens > shows the info, success, warning, and danger banners
AssertionError: expected [] to deeply equal [ 'danger', 'info', 'success', …(1) ]
 FAIL  tests/unit/tokens.test.js > component partials > ships a partial for every delivered component key
AssertionError: expected [ 'icon' ] to deeply equal ArrayContaining{…}
[... 34 lines omitted ...]
      Tests  2 failed | 465 passed (467)
   Start at  12:36:00
```

Command: `npx playwright test tests/e2e/button.spec.js tests/e2e/icon-button.spec.js tests/e2e/chip.spec.js tests/e2e/segmented.spec.js --project desktop-light --timeout 15000 --reporter=list`, exit code 1.
A first run over all four projects with the default 120 s timeout reported 103 failed and 5 passed.
The 5 passed only because their loops found no elements; count guards now make them fail.

```text
  ✘   4 [desktop-light] › tests\e2e\button.spec.js:38:1 › disabled buttons use the disabled text color and ignore hover (1.9s)
  ✘   1 [desktop-light] › tests\e2e\button.spec.js:14:1 › the button section shows every variant in every state (6.7s)
  ✘   6 [desktop-light] › tests\e2e\button.spec.js:73:1 › every button, including the small variant, is at least 44 by 44 px (934ms)
  ✘   3 [desktop-light] › tests\e2e\button.spec.js:53:1 › danger buttons fill or outline in the danger color (15.1s)
  ✘   2 [desktop-light] › tests\e2e\button.spec.js:27:1 › hover and active change the ground of every button variant (15.1s)
  ✘   5 [desktop-light] › tests\e2e\button.spec.js:65:1 › buttons take the button radius role (15.1s)
  ✘  10 [desktop-light] › tests\e2e\chip.spec.js:23:1 › static chips are not focusable, and interactive chip parts are 44 px targets (814ms)
  ✘   8 [desktop-light] › tests\e2e\chip.spec.js:7:1 › the chip section shows static, overdue, removable, and filter chips in every state (5.9s)
  ✘   7 [desktop-light] › tests\e2e\button.spec.js:80:1 › focus draws the focus ring, and danger buttons draw it in the danger color (15.1s)
  ✘   9 [desktop-light] › tests\e2e\button.spec.js:93:1 › the focus ring stays an outline in forced colors mode (15.1s)
  ✘  11 [desktop-light] › tests\e2e\chip.spec.js:40:1 › chips take the chip radius role (15.1s)
  ✘  15 [desktop-light] › tests\e2e\chip.spec.js:76:1 › disabled filter chips use the disabled text color (831ms)
  ✘  12 [desktop-light] › tests\e2e\chip.spec.js:48:1 › overdue chips carry the danger color and an icon, never color alone (15.1s)
  ✘  13 [desktop-light] › tests\e2e\chip.spec.js:56:1 › pressed filter chips differ from plain ones and keep distinct hover and active grounds (15.1s)
  ✘  18 [desktop-light] › tests\e2e\icon-button.spec.js:23:1 › every icon button has a label, one decorative icon, and a 44 px square target (817ms)
  ✘  17 [desktop-light] › tests\e2e\icon-button.spec.js:8:1 › the icon button section shows the plain, pressed, and danger buttons in every state (5.8s)
  ✘  20 [desktop-light] › tests\e2e\icon-button.spec.js:49:1 › disabled icon buttons use the disabled text color (820ms)
  ✘  14 [desktop-light] › tests\e2e\chip.spec.js:69:1 › pressed filter chips stay distinct in forced colors mode (15.1s)
  ✘  16 [desktop-light] › tests\e2e\chip.spec.js:86:1 › filter chips and remove buttons draw the focus ring (15.1s)
  ✘  22 [desktop-light] › tests\e2e\segmented.spec.js:4:1 › the segmented section shows fieldsets of native radios with legends and every state (5.8s)
  ✘  23 [desktop-light] › tests\e2e\segmented.spec.js:25:1 › every segmented option is at least 44 by 44 px (905ms)
  ✘  19 [desktop-light] › tests\e2e\icon-button.spec.js:36:1 › pressed toggles differ from plain ones and keep distinct hover and active grounds (15.1s)
  ✘  24 [desktop-light] › tests\e2e\segmented.spec.js:32:1 › arrow keys move the selection, and the focused option draws the focus ring (5.9s)
  ✘  21 [desktop-light] › tests\e2e\icon-button.spec.js:59:1 › danger icon buttons use the danger color and the danger focus ring (15.1s)
  ✘  25 [desktop-light] › tests\e2e\segmented.spec.js:61:1 › the checked option stands out by ground, outline, and weight, also in forced colors mode (15.1s)
  ✘  26 [desktop-light] › tests\e2e\segmented.spec.js:76:1 › the forced state specimens and the disabled group render their states (15.1s)
  ✘  27 [desktop-light] › tests\e2e\segmented.spec.js:89:1 › options wrap inside the section without horizontal overflow (15.1s)
[... failure details omitted; full log in red-e2e.log ...]
    Error: expect(locator).toHaveText(expected) failed

    Locator: locator('#button h2')
    Expected: "Button"
    Timeout: 5000ms
    Error: element(s) not found
  27 failed
```

### Green phase

Command: `npx playwright test tests/e2e/button.spec.js tests/e2e/icon-button.spec.js tests/e2e/chip.spec.js tests/e2e/segmented.spec.js --timeout 30000 --reporter=list`, exit code 0 (completion check, all four projects).

```text
  ✓    4 [desktop-light] › tests\e2e\button.spec.js:53:1 › danger buttons fill or outline in the danger color (1.0s)
  ✓    1 [desktop-light] › tests\e2e\button.spec.js:14:1 › the button section shows every variant in every state (1.4s)
  ✓    2 [desktop-light] › tests\e2e\button.spec.js:38:1 › disabled buttons use the disabled text color and ignore hover (1.4s)
  ✓    3 [desktop-light] › tests\e2e\button.spec.js:27:1 › hover and active change the ground of every button variant (1.4s)
  ✓    5 [desktop-light] › tests\e2e\button.spec.js:65:1 › buttons take the button radius role (936ms)
  ✓    6 [desktop-light] › tests\e2e\button.spec.js:73:1 › every button, including the small variant, is at least 44 by 44 px (821ms)
[... 102 passing lines omitted ...]
  108 passed (32.5s)
```

A light-theme review of the screenshots found invisible hover grounds on sunken tracks.
Two regression tests failed first (3 failed, 1 passed), then passed after the fix:

Command: `npx playwright test tests/e2e/chip.spec.js tests/e2e/segmented.spec.js --project desktop-light --project mobile-dark -g "remove button shows|forced state specimens" --reporter=line`, exit code 0.

```text
  4 passed (2.8s)
```

Command: `python scripts/devops.py check`, exit code 0, after the final code change.

```text
All 22 markdown files passed linting.
All checks passed!
============================== 3 passed in 1.95s ==============================
 Test Files  7 passed (7)
      Tests  543 passed (543)
[neutral system 1440px] 15 stylesheets, 506 texts, 84 targets, 84 focus records, 64 sprite references, overflow 0px, errors 0
[neutral dark 1440px] 15 stylesheets, 506 texts, 84 targets, 84 focus records, 64 sprite references, overflow 0px, errors 0
[neutral system 1440px] 15 stylesheets, 506 texts, 84 targets, 84 focus records, 64 sprite references, overflow 0px, errors 0
[neutral light 1440px] 15 stylesheets, 506 texts, 84 targets, 84 focus records, 64 sprite references, overflow 0px, errors 0
[neutral system 390px] 15 stylesheets, 506 texts, 84 targets, 84 focus records, 64 sprite references, overflow 0px, errors 0
[neutral dark 390px] 15 stylesheets, 506 texts, 84 targets, 84 focus records, 64 sprite references, overflow 0px, errors 0
[neutral system 390px] 15 stylesheets, 506 texts, 84 targets, 84 focus records, 64 sprite references, overflow 0px, errors 0
[neutral light 390px] 15 stylesheets, 506 texts, 84 targets, 84 focus records, 64 sprite references, overflow 0px, errors 0
  132 passed (46.9s)
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... npm pack listing omitted ...]
```

### Visual verification

Command: `node capture.mjs {{worktree}} before|after`, exit code 0; every page returned HTTP 200 with no console, page, or HTTP errors.

| Theme | Width   | Before                                              | After                                             |
| :---- | :------ | :-------------------------------------------------- | :------------------------------------------------ |
| light | 390 px  | [before](before-controls-light-390.png)             | [after](after-controls-light-390.png)             |
| dark  | 390 px  | [before](before-controls-dark-390.png)              | [after](after-controls-dark-390.png)              |
| light | 1440 px | [before](before-controls-light-1440.png)            | [after](after-controls-light-1440.png)            |
| dark  | 1440 px | [before](before-controls-dark-1440.png)             | [after](after-controls-dark-1440.png)             |
